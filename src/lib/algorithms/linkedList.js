// Linked List visualizer — data model, action planners, and a reducer.
//
// Data model:
//   nodes  : ordered array of { id, value } — physical left-to-right placement
//   nextOf : map id -> id | null            — next pointers
//   prevOf : map id -> id | null            — prev pointers (doubly mode)
//
// Operations don't mutate state directly. Each planner returns a flat list of
// ACTIONS; the visualizer iterates them, applying each (via reduceStructure for
// structural ones, or its own visual state for marks/pointers) with a delay
// between steps.
//
// Action shapes:
//   { type: 'mark', id, state }              -> set a node's highlight
//   { type: 'pointers', items: [{label,nodeId}] } -> set floating pointer labels
//   { type: 'clear' }                        -> clear all marks, pointers, lift
//   { type: 'stageNode', id, value, index }  -> insert node unlinked + lift it
//   { type: 'lift', id }                     -> raise a node out of the row
//   { type: 'drop' }                         -> lower the lifted node into the row
//   { type: 'relink' }                       -> rebuild forward links from order
//   { type: 'removeNode', id }               -> remove node, relink
//   { type: 'setNext', from, to }            -> set a single next pointer
//   { type: 'setPrev', from, to }            -> set a single prev pointer
//   { type: 'reorder', order: [id, ...] }    -> reorder array, relink forward

let idCounter = 0;

export function makeNode(value) {
    return { id: ++idCounter, value };
}

// Rebuild forward next/prev maps from the array order.
export function linkify(nodes) {
    const nextOf = {};
    const prevOf = {};
    nodes.forEach((node, i) => {
        nextOf[node.id] = i + 1 < nodes.length ? nodes[i + 1].id : null;
        prevOf[node.id] = i - 1 >= 0 ? nodes[i - 1].id : null;
    });
    return { nextOf, prevOf };
}

export function buildList(values) {
    const nodes = values.map(makeNode);
    return { nodes, ...linkify(nodes) };
}

export function randomValues(count = 5, min = 1, max = 99) {
    return Array.from(
        { length: count },
        () => Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// Apply a structural action, returning a fresh { nodes, nextOf, prevOf }.
export function reduceStructure(state, action) {
    const { nodes, nextOf, prevOf } = state;
    switch (action.type) {
        case 'stageNode': {
            // Insert the node into the array (reserving its slot) but leave it
            // unlinked; existing links are untouched so the surrounding list
            // stays connected (the old neighbours bridge over the staged slot).
            const arr = [...nodes];
            arr.splice(action.index, 0, { id: action.id, value: action.value });
            return {
                nodes: arr,
                nextOf: { ...nextOf, [action.id]: null },
                prevOf: { ...prevOf, [action.id]: null },
            };
        }
        case 'relink':
            return { nodes, ...linkify(nodes) };
        case 'removeNode': {
            const arr = nodes.filter((n) => n.id !== action.id);
            return { nodes: arr, ...linkify(arr) };
        }
        case 'reorder': {
            const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
            const arr = action.order.map((id) => byId[id]);
            return { nodes: arr, ...linkify(arr) };
        }
        case 'setNext':
            return { nodes, nextOf: { ...nextOf, [action.from]: action.to }, prevOf };
        case 'setPrev':
            return { nodes, nextOf, prevOf: { ...prevOf, [action.from]: action.to } };
        default:
            return state;
    }
}

const clamp = (n, lo, hi) => Math.max(lo, Math.min(n, hi));

// --- planners: each returns a flat list of actions ---

export function insertActions(list, position, value) {
    const { nodes, listType } = list;
    const doubly = listType === 1;
    const idx = position === 'head' ? 0
        : position === 'tail' ? nodes.length
            : clamp(Number(position) || 0, 0, nodes.length);

    const predId = idx - 1 >= 0 ? nodes[idx - 1].id : null;
    const succId = idx < nodes.length ? nodes[idx].id : null;

    const actions = [];
    // walk to the insertion point
    for (let i = 0; i < idx; i++) {
        actions.push({ type: 'mark', id: nodes[i].id, state: 'active' });
        actions.push({ type: 'mark', id: nodes[i].id, state: 'done' });
    }

    // 1) create the node, floating above its slot
    const node = makeNode(Number.isFinite(value) ? value : 0);
    actions.push({ type: 'stageNode', id: node.id, value: node.value, index: idx });
    actions.push({ type: 'mark', id: node.id, state: 'active' });

    // 2) point the new node at its successor
    actions.push({ type: 'setNext', from: node.id, to: succId });
    if (doubly && succId != null) actions.push({ type: 'setPrev', from: succId, to: node.id });

    // 3) redirect the predecessor at the new node
    if (predId != null) {
        actions.push({ type: 'setNext', from: predId, to: node.id });
        if (doubly) actions.push({ type: 'setPrev', from: node.id, to: predId });
    }

    // 4) drop it into place and normalise links
    actions.push({ type: 'drop' });
    actions.push({ type: 'relink' });
    actions.push({ type: 'mark', id: node.id, state: 'found' });
    actions.push({ type: 'clear' });
    return actions;
}

// Steps to detach and remove nodes[idx]: flag it, lift it out of the row,
// bypass it with the predecessor's pointer, then drop it from the list.
function removeStepsAt(nodes, idx, doubly) {
    const target = nodes[idx];
    const predId = idx - 1 >= 0 ? nodes[idx - 1].id : null;
    const succId = idx + 1 < nodes.length ? nodes[idx + 1].id : null;

    const actions = [
        { type: 'mark', id: target.id, state: 'remove' },
        { type: 'lift', id: target.id },
    ];
    if (predId != null) {
        actions.push({ type: 'setNext', from: predId, to: succId });
        if (doubly && succId != null) actions.push({ type: 'setPrev', from: succId, to: predId });
    } else if (doubly && succId != null) {
        actions.push({ type: 'setPrev', from: succId, to: null });
    }
    actions.push({ type: 'removeNode', id: target.id });
    return actions;
}

export function deleteByValueActions(list, value) {
    const { nodes, listType } = list;
    const actions = [];
    let idx = -1;
    for (let i = 0; i < nodes.length; i++) {
        actions.push({ type: 'mark', id: nodes[i].id, state: 'active' });
        if (nodes[i].value === value) { idx = i; break; }
        actions.push({ type: 'mark', id: nodes[i].id, state: 'done' });
    }
    if (idx >= 0) actions.push(...removeStepsAt(nodes, idx, listType === 1));
    actions.push({ type: 'clear' });
    return actions;
}

export function deleteByIndexActions(list, index) {
    const { nodes, listType } = list;
    const idx = Number(index);
    if (!(idx >= 0 && idx < nodes.length)) return [{ type: 'clear' }];

    const actions = [];
    for (let i = 0; i < idx; i++) {
        actions.push({ type: 'mark', id: nodes[i].id, state: 'active' });
        actions.push({ type: 'mark', id: nodes[i].id, state: 'done' });
    }
    actions.push(...removeStepsAt(nodes, idx, listType === 1));
    actions.push({ type: 'clear' });
    return actions;
}

export function searchActions(list, value) {
    const { nodes } = list;
    const actions = [];
    for (let i = 0; i < nodes.length; i++) {
        actions.push({ type: 'mark', id: nodes[i].id, state: 'active' });
        if (nodes[i].value === value) {
            actions.push({ type: 'mark', id: nodes[i].id, state: 'found' });
            actions.push({ type: 'clear' });
            return actions;
        }
        actions.push({ type: 'mark', id: nodes[i].id, state: 'done' });
    }
    actions.push({ type: 'clear' });
    return actions;
}

export function reverseActions(list) {
    const { nodes, listType } = list;
    if (nodes.length < 2) return [];

    const ids = nodes.map((n) => n.id);
    const actions = [];
    let prev = null;
    for (let i = 0; i < ids.length; i++) {
        const curr = ids[i];
        const next = i + 1 < ids.length ? ids[i + 1] : null;
        const items = [];
        if (prev != null) items.push({ label: 'prev', nodeId: prev });
        items.push({ label: 'curr', nodeId: curr });
        if (next != null) items.push({ label: 'next', nodeId: next });
        actions.push({ type: 'pointers', items });
        actions.push({ type: 'mark', id: curr, state: 'active' });
        actions.push({ type: 'setNext', from: curr, to: prev });
        if (listType === 1) actions.push({ type: 'setPrev', from: curr, to: next });
        actions.push({ type: 'mark', id: curr, state: 'done' });
        prev = curr;
    }
    actions.push({ type: 'reorder', order: [...ids].reverse() });
    actions.push({ type: 'clear' });
    return actions;
}
