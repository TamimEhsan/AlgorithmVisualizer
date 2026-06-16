// Binary Heap (min-heap) — action-log planners for insert / extract-min /
// build-heap / heapsort, rendered on the reusable tree component.
//
// A heap is a complete binary tree stored as an array: node i's children are
// 2i+1 and 2i+2. We keep the heap as an array of { id, value } and rebuild a
// logical tree from it for each `setTree`. A sift swaps two array entries
// *including their ids*, so the two nodes' target positions swap and the canvas
// tween slides them past each other.

let counter = 0;
const mkNode = (value) => ({ id: 'h' + ++counter, value });

// array of { id, value } -> logical tree { id, value, left, right }
export function buildTree(arr) {
    const make = (i) => {
        if (i >= arr.length) return null;
        return { id: arr[i].id, value: arr[i].value, left: make(2 * i + 1), right: make(2 * i + 2) };
    };
    return make(0);
}

// logical complete tree -> level-order array of { id, value }
export function toArray(tree) {
    const out = [];
    const q = tree ? [tree] : [];
    while (q.length) {
        const n = q.shift();
        out.push({ id: n.id, value: n.value });
        if (n.left) q.push(n.left);
        if (n.right) q.push(n.right);
    }
    return out;
}

export function fromValues(values) {
    const a = values.map(mkNode);
    heapify(a);
    return buildTree(a);
}

// in-place Floyd build-heap (no animation) — used for seeding
function heapify(a) {
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) siftDown(a, i, a.length);
}

function siftDown(a, i, size) {
    for (;;) {
        let small = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < size && a[l].value < a[small].value) small = l;
        if (r < size && a[r].value < a[small].value) small = r;
        if (small === i) break;
        [a[i], a[small]] = [a[small], a[i]];
        i = small;
    }
}

const snap = (actions, a) => actions.push({ type: 'setTree', tree: buildTree(a) });
const mark = (actions, a, idxs, state) => {
    for (const i of idxs) if (a[i]) actions.push({ type: 'markNode', id: a[i].id, state });
};

export function insertActions(tree, value) {
    const actions = [];
    const a = toArray(tree);
    a.push(mkNode(value));
    snap(actions, a); // appears at the end
    let i = a.length - 1;
    while (i > 0) {
        const p = Math.floor((i - 1) / 2);
        mark(actions, a, [i, p], 'current');
        if (a[i].value >= a[p].value) break;
        [a[i], a[p]] = [a[p], a[i]]; // ids travel with values
        snap(actions, a);
        i = p;
    }
    actions.push({ type: 'status', text: `Inserted ${value}` });
    return actions;
}

export function extractActions(tree) {
    const actions = [];
    const a = toArray(tree);
    if (!a.length) {
        actions.push({ type: 'status', text: 'Heap is empty' });
        actions.push({ type: 'clear' });
        return actions;
    }
    const min = a[0].value;
    mark(actions, a, [0], 'current');
    const last = a.length - 1;
    if (last > 0) {
        [a[0], a[last]] = [a[last], a[0]];
        snap(actions, a); // min swapped to the end
    }
    a.pop(); // remove the min
    snap(actions, a);
    siftDownActions(actions, a, 0, a.length);
    actions.push({ type: 'status', text: `Extracted min ${min}` });
    return actions;
}

// animated sift-down: emit a snapshot per swap within a[0..size)
function siftDownActions(actions, a, i, size) {
    for (;;) {
        let small = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < size && a[l].value < a[small].value) small = l;
        if (r < size && a[r].value < a[small].value) small = r;
        mark(actions, a, [i, l, r].filter((k) => k < size), 'current');
        if (small === i) break;
        [a[i], a[small]] = [a[small], a[i]];
        snap(actions, a); // render the full array; `size` only bounds the sift
        i = small;
    }
}

export function buildActions(values) {
    const actions = [];
    const a = values.map(mkNode);
    snap(actions, a); // raw, unheapified
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
        siftDownActions(actions, a, i, a.length);
    }
    actions.push({ type: 'status', text: 'Built min-heap' });
    return actions;
}

export function heapsortActions(tree) {
    const actions = [];
    const a = toArray(tree);
    let size = a.length;
    while (size > 1) {
        const last = size - 1;
        [a[0], a[last]] = [a[last], a[0]];
        snap(actions, a); // current min parked at the end of the active region
        actions.push({ type: 'markNode', id: a[last].id, state: 'found' }); // sorted
        size--;
        siftDownActions(actions, a, 0, size);
    }
    if (a.length) actions.push({ type: 'markNode', id: a[0].id, state: 'found' });
    actions.push({ type: 'status', text: 'Heapsort complete (descending)' });
    return actions;
}
