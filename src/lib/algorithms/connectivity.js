// Connectivity — presets, a color palette, and planners for Connected
// Components (undirected / weakly connected) and Strongly Connected Components
// (Tarjan, directed). Both emit the shared action log and use `colorNode` to
// tint each component a distinct color.

export const COMPONENT_PALETTE = [
    '#0ea5e9', '#f97316', '#a855f7', '#22c55e',
    '#ec4899', '#eab308', '#14b8a6', '#ef4444',
];

export const CONNECTIVITY_PRESETS = [
    {
        name: 'Islands',
        nodes: [
            { id: 'n1', x: 90, y: 80, label: 'A' },
            { id: 'n2', x: 210, y: 70, label: 'B' },
            { id: 'n3', x: 150, y: 170, label: 'C' },
            { id: 'n4', x: 350, y: 80, label: 'D' },
            { id: 'n5', x: 470, y: 90, label: 'E' },
            { id: 'n6', x: 410, y: 190, label: 'F' },
            { id: 'n7', x: 170, y: 300, label: 'G' },
            { id: 'n8', x: 310, y: 300, label: 'H' },
        ],
        edges: [
            ['n1', 'n2'], ['n2', 'n3'], ['n1', 'n3'],
            ['n4', 'n5'], ['n5', 'n6'], ['n4', 'n6'],
            ['n7', 'n8'],
        ],
    },
    {
        name: 'Connected',
        nodes: [
            { id: 'n1', x: 110, y: 90, label: 'A' },
            { id: 'n2', x: 250, y: 70, label: 'B' },
            { id: 'n3', x: 390, y: 110, label: 'C' },
            { id: 'n4', x: 180, y: 230, label: 'D' },
            { id: 'n5', x: 340, y: 240, label: 'E' },
        ],
        edges: [['n1', 'n2'], ['n2', 'n3'], ['n1', 'n4'], ['n4', 'n5'], ['n3', 'n5']],
    },
    {
        name: 'SCC demo (use Directed)',
        nodes: [
            { id: 'n1', x: 90, y: 70, label: 'A' },
            { id: 'n2', x: 210, y: 60, label: 'B' },
            { id: 'n3', x: 150, y: 170, label: 'C' },
            { id: 'n4', x: 330, y: 80, label: 'D' },
            { id: 'n5', x: 450, y: 70, label: 'E' },
            { id: 'n6', x: 400, y: 180, label: 'F' },
            { id: 'n7', x: 250, y: 290, label: 'G' },
            { id: 'n8', x: 400, y: 300, label: 'H' },
        ],
        edges: [
            ['n1', 'n2'], ['n2', 'n3'], ['n3', 'n1'], // SCC: A B C
            ['n3', 'n4'],                               // connector
            ['n4', 'n5'], ['n5', 'n6'], ['n6', 'n4'], // SCC: D E F
            ['n6', 'n7'],                               // connector
            ['n7', 'n8'], ['n8', 'n7'],                 // SCC: G H
        ],
    },
];

// BFS flood-fill; one palette color per component.
export function connectedComponentsActions(adj, nodeIds) {
    const ids = [...nodeIds].sort();
    const visited = new Set();
    const actions = [];
    let comp = 0;

    for (const start of ids) {
        if (visited.has(start)) continue;
        const color = COMPONENT_PALETTE[comp % COMPONENT_PALETTE.length];
        comp++;
        const queue = [start];
        visited.add(start);
        while (queue.length) {
            const u = queue.shift();
            actions.push({ type: 'markNode', id: u, state: 'current' });
            for (const { node: v } of adj[u] || []) {
                if (!visited.has(v)) { visited.add(v); queue.push(v); }
            }
            actions.push({ type: 'colorNode', id: u, color });
        }
    }
    actions.push({ type: 'status', text: `${comp} component${comp === 1 ? '' : 's'}` });
    return actions;
}

// Tarjan's algorithm. Shows the low-link value on each node and colors each SCC
// when its root is finalized.
export function sccActions(adj, nodeIds) {
    const ids = [...nodeIds].sort();
    const actions = [];
    const index = {};
    const low = {};
    const onStack = new Set();
    const stack = [];
    let idx = 0;
    let comp = 0;

    const strongconnect = (u) => {
        index[u] = idx;
        low[u] = idx;
        idx++;
        stack.push(u);
        onStack.add(u);
        actions.push({ type: 'markNode', id: u, state: 'current' });
        actions.push({ type: 'setDist', id: u, dist: low[u] });

        for (const { node: v } of adj[u] || []) {
            if (index[v] === undefined) {
                strongconnect(v);
                if (low[v] < low[u]) { low[u] = low[v]; actions.push({ type: 'setDist', id: u, dist: low[u] }); }
            } else if (onStack.has(v)) {
                if (index[v] < low[u]) { low[u] = index[v]; actions.push({ type: 'setDist', id: u, dist: low[u] }); }
            }
        }

        if (low[u] === index[u]) {
            const color = COMPONENT_PALETTE[comp % COMPONENT_PALETTE.length];
            comp++;
            let w;
            do {
                w = stack.pop();
                onStack.delete(w);
                actions.push({ type: 'colorNode', id: w, color });
            } while (w !== u);
        }
    };

    for (const u of ids) {
        if (index[u] === undefined) strongconnect(u);
    }
    actions.push({ type: 'status', text: `${comp} strongly-connected component${comp === 1 ? '' : 's'}` });
    return actions;
}
