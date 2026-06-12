// Tree layout helpers. A layout takes a logical tree and returns
//   { pos: { [id]: { x, y } }, cols, depth }
// where x is a column index (0..cols-1) and y is the depth. The canvas scales
// these into pixels. Binary layout preserves strict left/right (x by in-order
// index) which a tidy n-ary layout would not. (Buchheim is added in phase 2.)

// children of a node, handling both binary (left/right) and n-ary (children[])
export function childrenOf(node) {
    if (node.children) return node.children.filter(Boolean);
    return [node.left, node.right].filter(Boolean);
}

export function flattenTree(root) {
    const nodes = [];
    const edges = [];
    const walk = (node, parent) => {
        if (!node) return;
        nodes.push(node);
        if (parent) edges.push({ parent: parent.id, child: node.id });
        for (const c of childrenOf(node)) walk(c, node);
    };
    walk(root, null);
    return { nodes, edges };
}

// In-order x, depth y — keeps a single child on its correct side.
export function binaryLayout(root) {
    const pos = {};
    let idx = 0;
    let depth = 0;
    const walk = (node, d) => {
        if (!node) return;
        walk(node.left, d + 1);
        pos[node.id] = { x: idx++, y: d };
        if (d > depth) depth = d;
        walk(node.right, d + 1);
    };
    walk(root, 0);
    return { pos, cols: idx, depth };
}
