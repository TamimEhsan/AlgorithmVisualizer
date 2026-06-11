// Graph visualizer — presets, adjacency, and BFS/DFS action planners.
//
// The page is a generic executor: planners return a flat list of visual ACTIONS
// and the page applies each with a delay (same pattern as the linked list).
//
// Action shapes:
//   { type: 'markNode', id, state }  -> 'current' | 'frontier' | 'visited' | 'path' | 'normal'
//   { type: 'markEdge', id, state }  -> 'tree' | 'path' | 'normal'
//   { type: 'clear' }                -> reset traversal marks (start/finish rings kept)

let userCounter = 0;
export const newNodeId = () => `u${++userCounter}`;
export const edgeId = (source, target) => `e_${source}_${target}`;

// --- presets (hand-positioned, pixel coordinates) ---

export const PRESETS = [
    {
        name: 'Tree',
        nodes: [
            { id: 'n1', x: 250, y: 30, label: 'A' },
            { id: 'n2', x: 140, y: 140, label: 'B' },
            { id: 'n3', x: 360, y: 140, label: 'C' },
            { id: 'n4', x: 80, y: 250, label: 'D' },
            { id: 'n5', x: 210, y: 250, label: 'E' },
            { id: 'n6', x: 410, y: 250, label: 'F' },
        ],
        edges: [['n1', 'n2'], ['n1', 'n3'], ['n2', 'n4'], ['n2', 'n5'], ['n3', 'n6']],
    },
    {
        name: 'Cycle',
        nodes: [
            { id: 'n1', x: 250, y: 40, label: 'A' },
            { id: 'n2', x: 360, y: 110, label: 'B' },
            { id: 'n3', x: 360, y: 240, label: 'C' },
            { id: 'n4', x: 250, y: 300, label: 'D' },
            { id: 'n5', x: 140, y: 240, label: 'E' },
            { id: 'n6', x: 140, y: 110, label: 'F' },
        ],
        edges: [['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4'], ['n4', 'n5'], ['n5', 'n6'], ['n6', 'n1']],
    },
    {
        name: 'Dense',
        nodes: [
            { id: 'n1', x: 120, y: 70, label: 'A' },
            { id: 'n2', x: 290, y: 50, label: 'B' },
            { id: 'n3', x: 440, y: 100, label: 'C' },
            { id: 'n4', x: 160, y: 240, label: 'D' },
            { id: 'n5', x: 320, y: 250, label: 'E' },
            { id: 'n6', x: 460, y: 240, label: 'F' },
        ],
        edges: [
            ['n1', 'n2'], ['n2', 'n3'], ['n1', 'n4'], ['n2', 'n4'],
            ['n2', 'n5'], ['n3', 'n5'], ['n3', 'n6'], ['n4', 'n5'], ['n5', 'n6'],
        ],
    },
];

// Convert a preset to React Flow nodes/edges. Edge entries are [source, target]
// or [source, target, weight]; the weight (when present) is carried in data so
// the same helper serves both unweighted and weighted visualizers.
export function toFlow(preset) {
    const nodes = preset.nodes.map((n) => ({
        id: n.id,
        type: 'graphNode',
        position: { x: n.x, y: n.y },
        data: { label: n.label, state: 'normal' },
    }));
    const edges = preset.edges.map(([source, target, weight]) => {
        const data = { state: 'normal' };
        if (weight !== undefined) data.weight = weight;
        return { id: edgeId(source, target), source, target, type: 'floating', data };
    });
    return { nodes, edges };
}

// adjacency: id -> [{ node, edge }], sorted by neighbor id for determinism.
export function adjacency(edges, directed) {
    const adj = {};
    const add = (a, b, id) => {
        (adj[a] = adj[a] || []).push({ node: b, edge: id });
    };
    for (const e of edges) {
        add(e.source, e.target, e.id);
        if (!directed) add(e.target, e.source, e.id);
    }
    for (const k of Object.keys(adj)) {
        adj[k].sort((x, y) => (x.node < y.node ? -1 : x.node > y.node ? 1 : 0));
    }
    return adj;
}

// Weighted adjacency: id -> [{ node, edge, weight }] (used by shortest-path / MST).
export function weightedAdjacency(edges, directed) {
    const adj = {};
    const add = (a, b, id, w) => { (adj[a] = adj[a] || []).push({ node: b, edge: id, weight: w }); };
    for (const e of edges) {
        const w = e.data?.weight ?? 1;
        add(e.source, e.target, e.id, w);
        if (!directed) add(e.target, e.source, e.id, w);
    }
    for (const k of Object.keys(adj)) {
        adj[k].sort((x, y) => (x.node < y.node ? -1 : x.node > y.node ? 1 : 0));
    }
    return adj;
}

// Flat weighted edge list: [{ u, v, w, id }] — both directions when undirected.
export function edgeList(edges, directed) {
    const list = [];
    for (const e of edges) {
        const w = e.data?.weight ?? 1;
        list.push({ u: e.source, v: e.target, w, id: e.id });
        if (!directed) list.push({ u: e.target, v: e.source, w, id: e.id });
    }
    return list;
}

// Reconstruct start->finish path actions from parent maps.
function pathActions(parent, parentEdge, startId, endId) {
    const nodes = [];
    const edgeSteps = [];
    let cur = endId;
    while (cur !== undefined && cur !== null) {
        nodes.push(cur);
        if (parentEdge[cur] != null) edgeSteps.push({ id: parentEdge[cur], from: parent[cur], to: cur });
        if (cur === startId) break;
        cur = parent[cur];
    }
    nodes.reverse();
    edgeSteps.reverse();
    return [
        ...nodes.map((id) => ({ type: 'markNode', id, state: 'path' })),
        ...edgeSteps.map((e) => ({ type: 'markEdge', id: e.id, state: 'path', from: e.from, to: e.to })),
    ];
}

export function bfsActions(adj, startId, finishId) {
    const actions = [];
    if (startId == null) return actions;

    const visited = new Set();
    const seen = new Set([startId]);
    const parent = {};
    const parentEdge = {};
    const queue = [startId];
    actions.push({ type: 'markNode', id: startId, state: 'frontier' });

    while (queue.length) {
        const u = queue.shift();
        // highlight the tree edge as we process the node (consistent with DFS),
        // not when it was first discovered
        if (parentEdge[u] != null) {
            actions.push({ type: 'markEdge', id: parentEdge[u], state: 'tree', from: parent[u], to: u });
        }
        actions.push({ type: 'markNode', id: u, state: 'current' });
        if (u === finishId) {
            actions.push(...pathActions(parent, parentEdge, startId, u));
            return actions;
        }
        visited.add(u);
        for (const { node: v, edge } of adj[u] || []) {
            if (!seen.has(v)) {
                seen.add(v);
                parent[v] = u;
                parentEdge[v] = edge;
                actions.push({ type: 'markNode', id: v, state: 'frontier' });
                queue.push(v);
            }
        }
        actions.push({ type: 'markNode', id: u, state: 'visited' });
    }
    return actions;
}

export function dfsActions(adj, startId, finishId) {
    const actions = [];
    if (startId == null) return actions;

    const visited = new Set();
    const parent = {};
    const parentEdge = {};
    // stack holds {node, from, viaEdge} so the tree edge is the one actually
    // descended through when the node is popped (not its first discovery).
    const stack = [{ node: startId, from: null, viaEdge: null }];
    actions.push({ type: 'markNode', id: startId, state: 'frontier' });

    while (stack.length) {
        const { node: u, from, viaEdge } = stack.pop();
        if (visited.has(u)) continue;
        if (from !== null) {
            parent[u] = from;
            parentEdge[u] = viaEdge;
            actions.push({ type: 'markEdge', id: viaEdge, state: 'tree', from, to: u });
        }
        actions.push({ type: 'markNode', id: u, state: 'current' });
        if (u === finishId) {
            actions.push(...pathActions(parent, parentEdge, startId, u));
            return actions;
        }
        visited.add(u);
        for (const { node: v, edge } of adj[u] || []) {
            if (visited.has(v)) continue;
            actions.push({ type: 'markNode', id: v, state: 'frontier' });
            stack.push({ node: v, from: u, viaEdge: edge });
        }
        actions.push({ type: 'markNode', id: u, state: 'visited' });
    }
    return actions;
}
