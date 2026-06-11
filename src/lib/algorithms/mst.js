// Minimum Spanning Tree — presets and Kruskal/Prim planners.
//
// Reuses the action-log pattern and the weighted graph workspace. MST is
// undirected; planners treat the graph as undirected. Edge/node states reused:
//   relax  -> edge being considered
//   path   -> edge/node in the spanning tree
//   reject -> edge skipped (would form a cycle)
// plus { type: 'status', text } for the running/total weight.

export const MST_PRESETS = [
    {
        name: 'Mesh',
        nodes: [
            { id: 'n1', x: 120, y: 70, label: 'A' },
            { id: 'n2', x: 290, y: 50, label: 'B' },
            { id: 'n3', x: 450, y: 100, label: 'C' },
            { id: 'n4', x: 160, y: 240, label: 'D' },
            { id: 'n5', x: 320, y: 250, label: 'E' },
            { id: 'n6', x: 470, y: 240, label: 'F' },
        ],
        edges: [
            ['n1', 'n2', 4], ['n2', 'n3', 3], ['n1', 'n4', 2], ['n2', 'n4', 5],
            ['n2', 'n5', 10], ['n3', 'n5', 6], ['n3', 'n6', 1], ['n4', 'n5', 4], ['n5', 'n6', 2],
        ],
    },
    {
        name: 'Ring',
        nodes: [
            { id: 'n1', x: 250, y: 40, label: 'A' },
            { id: 'n2', x: 360, y: 110, label: 'B' },
            { id: 'n3', x: 360, y: 240, label: 'C' },
            { id: 'n4', x: 250, y: 300, label: 'D' },
            { id: 'n5', x: 140, y: 240, label: 'E' },
            { id: 'n6', x: 140, y: 110, label: 'F' },
        ],
        edges: [
            ['n1', 'n2', 3], ['n2', 'n3', 5], ['n3', 'n4', 2], ['n4', 'n5', 6],
            ['n5', 'n6', 4], ['n6', 'n1', 1], ['n1', 'n4', 7], ['n2', 'n5', 8],
        ],
    },
];

// each undirected edge once
function weightedEdges(edges) {
    return edges.map((e) => ({ u: e.source, v: e.target, w: e.data?.weight ?? 1, id: e.id }));
}

export function kruskalActions(nodes, edges) {
    const actions = [];
    const V = nodes.length;
    if (V === 0) return actions;

    const sorted = weightedEdges(edges).sort((a, b) => (a.w - b.w) || (a.id < b.id ? -1 : 1));

    const parent = {};
    for (const n of nodes) parent[n.id] = n.id;
    const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };

    let total = 0;
    let accepted = 0;
    for (const { u, v, w, id } of sorted) {
        actions.push({ type: 'markEdge', id, state: 'relax' });
        const ru = find(u);
        const rv = find(v);
        if (ru !== rv) {
            parent[ru] = rv;
            total += w;
            accepted += 1;
            actions.push({ type: 'markEdge', id, state: 'path' });
            actions.push({ type: 'markNode', id: u, state: 'path' });
            actions.push({ type: 'markNode', id: v, state: 'path' });
            actions.push({ type: 'status', text: `MST weight: ${total}` });
        } else {
            actions.push({ type: 'markEdge', id, state: 'reject' });
        }
    }
    actions.push({
        type: 'status',
        text: accepted === V - 1 ? `MST complete · weight ${total}` : `Not connected · forest weight ${total}`,
    });
    return actions;
}

export function primActions(adj, startId, nodes) {
    const actions = [];
    const ids = nodes.map((n) => n.id);
    const V = ids.length;
    const start = startId ?? ids[0];
    if (start == null) return actions;

    const visited = new Set([start]);
    actions.push({ type: 'markNode', id: start, state: 'path' });
    let total = 0;

    while (visited.size < V) {
        // best crossing edge from the visited set to an unvisited node
        let best = null;
        for (const u of visited) {
            for (const { node: v, edge, weight } of adj[u] || []) {
                if (visited.has(v)) continue;
                if (best == null || weight < best.weight) best = { u, v, edge, weight };
            }
        }
        if (best == null) break; // disconnected

        actions.push({ type: 'markEdge', id: best.edge, state: 'relax' });
        actions.push({ type: 'markEdge', id: best.edge, state: 'path' });
        actions.push({ type: 'markNode', id: best.v, state: 'path' });
        visited.add(best.v);
        total += best.weight;
        actions.push({ type: 'status', text: `MST weight: ${total}` });
    }

    actions.push({
        type: 'status',
        text: visited.size === V ? `MST complete · weight ${total}` : `Not connected · weight ${total}`,
    });
    return actions;
}
