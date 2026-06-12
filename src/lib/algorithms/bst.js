// Binary Search Tree — immutable tree ops (preserving node ids so the renderer
// can animate) and action-log planners for insert / delete / search.
//
// Node: { id, value, left, right }. Actions use setTree (re-layout) + markNode.

let counter = 0;
const makeNode = (value) => ({ id: `b${++counter}`, value, left: null, right: null });

export function fromValues(values) {
    let root = null;
    for (const v of values) root = insert(root, v).root;
    return root;
}

// insert returning { root, id, inserted } — clones the path, keeps other ids
function insert(root, value) {
    if (!root) {
        const n = makeNode(value);
        return { root: n, id: n.id, inserted: true };
    }
    if (value === root.value) return { root, id: root.id, inserted: false };
    if (value < root.value) {
        const r = insert(root.left, value);
        return { root: { ...root, left: r.root }, id: r.id, inserted: r.inserted };
    }
    const r = insert(root.right, value);
    return { root: { ...root, right: r.root }, id: r.id, inserted: r.inserted };
}

// immutable delete; two-child case copies the in-order successor's value into
// the node (id preserved) and removes the successor
function removeValue(root, value) {
    if (!root) return null;
    if (value < root.value) return { ...root, left: removeValue(root.left, value) };
    if (value > root.value) return { ...root, right: removeValue(root.right, value) };
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let s = root.right;
    while (s.left) s = s.left;
    return { ...root, value: s.value, right: removeValue(root.right, s.value) };
}

function pathTo(root, value) {
    const path = [];
    let cur = root;
    while (cur) {
        path.push(cur);
        if (value === cur.value) break;
        cur = value < cur.value ? cur.left : cur.right;
    }
    return path;
}

export function insertActions(tree, value) {
    const actions = [];
    for (const n of pathTo(tree, value)) actions.push({ type: 'markNode', id: n.id, state: 'current' });
    const { root, id, inserted } = insert(tree, value);
    if (!inserted) {
        actions.push({ type: 'status', text: `${value} is already in the tree` });
        actions.push({ type: 'clear' });
        return actions;
    }
    for (const n of pathTo(tree, value)) actions.push({ type: 'markNode', id: n.id, state: 'normal' });
    actions.push({ type: 'setTree', tree: root });
    actions.push({ type: 'markNode', id, state: 'found' });
    actions.push({ type: 'status', text: `Inserted ${value}` });
    return actions;
}

export function searchActions(tree, value) {
    const actions = [];
    let cur = tree;
    while (cur) {
        actions.push({ type: 'markNode', id: cur.id, state: 'current' });
        if (value === cur.value) {
            actions.push({ type: 'markNode', id: cur.id, state: 'found' });
            actions.push({ type: 'status', text: `Found ${value}` });
            return actions;
        }
        actions.push({ type: 'markNode', id: cur.id, state: 'visited' });
        cur = value < cur.value ? cur.left : cur.right;
    }
    actions.push({ type: 'status', text: `${value} not found` });
    return actions;
}

export function deleteActions(tree, value) {
    const actions = [];
    const path = pathTo(tree, value);
    for (const n of path) actions.push({ type: 'markNode', id: n.id, state: 'current' });
    const target = path[path.length - 1];
    if (!target || target.value !== value) {
        actions.push({ type: 'status', text: `${value} not found` });
        actions.push({ type: 'clear' });
        return actions;
    }
    actions.push({ type: 'markNode', id: target.id, state: 'remove' });
    actions.push({ type: 'setTree', tree: removeValue(tree, value) });
    actions.push({ type: 'status', text: `Deleted ${value}` });
    return actions;
}
