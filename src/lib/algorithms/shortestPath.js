// Single-Source Shortest Path — weighted presets, adjacency, and planners.
//
// Reuses the action-log pattern: planners return a flat list of actions that the
// page applies with a delay. Extends the graph action set with:
//   { type: 'setDist', id, dist }  -> node distance label (Infinity => ∞)
//   { type: 'status', text }       -> overlay status text
// plus edge states 'relax' | 'tree' | 'path' | 'negcycle'.

import { toFlow, weightedAdjacency, edgeList } from './graph.js';
import { buildPathActions } from './helpers/graph-helpers.js';

// re-exported for back-compat with existing imports from this module
export { toFlow, weightedAdjacency, edgeList };

export const SP_PRESETS = [
    {
        name: 'Basic',
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
        name: 'Tree',
        nodes: [
            { id: 'n1', x: 250, y: 30, label: 'A' },
            { id: 'n2', x: 140, y: 140, label: 'B' },
            { id: 'n3', x: 360, y: 140, label: 'C' },
            { id: 'n4', x: 80, y: 250, label: 'D' },
            { id: 'n5', x: 210, y: 250, label: 'E' },
            { id: 'n6', x: 410, y: 250, label: 'F' },
        ],
        edges: [['n1', 'n2', 3], ['n1', 'n3', 6], ['n2', 'n4', 1], ['n2', 'n5', 4], ['n3', 'n6', 2]],
    },
    {
        name: 'Negative (use Directed)',
        nodes: [
            { id: 'n1', x: 120, y: 80, label: 'A' },
            { id: 'n2', x: 300, y: 60, label: 'B' },
            { id: 'n3', x: 300, y: 230, label: 'C' },
            { id: 'n4', x: 480, y: 150, label: 'D' },
        ],
        edges: [['n1', 'n2', 4], ['n1', 'n3', 5], ['n2', 'n3', -3], ['n3', 'n4', 2], ['n2', 'n4', 6]],
    },
];

// pathActions is now imported as buildPathActions from helpers/graph-helpers.js
export { buildPathActions as pathActions };

export function dijkstraActions(adj, startId, finishId, nodeIds) {
    const actions = [];
    if (startId == null) return actions;

    const hasNeg = Object.values(adj).some((list) => list.some((e) => e.weight < 0));
    if (hasNeg) actions.push({ type: 'status', text: 'Dijkstra assumes non-negative weights' });

    const dist = {};
    const parent = {};
    const parentEdge = {};
    const visited = new Set();
    for (const id of nodeIds) dist[id] = Infinity;
    dist[startId] = 0;
    actions.push({ type: 'setDist', id: startId, dist: 0 });
    actions.push({ type: 'markNode', id: startId, state: 'frontier' });

    while (true) {
        let u = null;
        let best = Infinity;
        for (const id of nodeIds) {
            if (!visited.has(id) && dist[id] < best) { best = dist[id]; u = id; }
        }
        if (u == null) break; // remaining nodes unreachable

        actions.push({ type: 'markNode', id: u, state: 'current' });
        if (u === finishId) {
            visited.add(u);
            actions.push({ type: 'markNode', id: u, state: 'visited' });
            break;
        }
        for (const { node: v, edge, weight } of adj[u] || []) {
            if (visited.has(v)) continue;
            actions.push({ type: 'markEdge', id: edge, state: 'relax', from: u, to: v });
            if (dist[u] + weight < dist[v]) {
                if (parentEdge[v] != null) actions.push({ type: 'markEdge', id: parentEdge[v], state: 'normal' });
                dist[v] = dist[u] + weight;
                parent[v] = u;
                parentEdge[v] = edge;
                actions.push({ type: 'setDist', id: v, dist: dist[v] });
                actions.push({ type: 'markEdge', id: edge, state: 'tree', from: u, to: v });
                actions.push({ type: 'markNode', id: v, state: 'frontier' });
            } else {
                actions.push({ type: 'markEdge', id: edge, state: 'normal' });
            }
        }
        visited.add(u);
        actions.push({ type: 'markNode', id: u, state: 'visited' });
    }

    if (finishId != null && dist[finishId] < Infinity) {
        actions.push(...buildPathActions(parent, parentEdge, startId, finishId));
    }
    return actions;
}

function negCycleActions(parent, parentEdge, startNode, V) {
    let y = startNode;
    for (let i = 0; i < V; i++) {
        if (parent[y] == null) break;
        y = parent[y];
    }
    const nodes = [];
    const edges = [];
    let cur = y;
    do {
        nodes.push(cur);
        if (parentEdge[cur] != null) edges.push(parentEdge[cur]);
        cur = parent[cur];
    } while (cur != null && cur !== y && nodes.length <= V + 1);
    return [
        ...nodes.map((id) => ({ type: 'markNode', id, state: 'negcycle' })),
        ...edges.map((id) => ({ type: 'markEdge', id, state: 'negcycle' })),
    ];
}

export function bellmanFordActions(edges, startId, finishId, nodeIds) {
    const actions = [];
    if (startId == null) return actions;

    const dist = {};
    const parent = {};
    const parentEdge = {};
    for (const id of nodeIds) dist[id] = Infinity;
    dist[startId] = 0;
    actions.push({ type: 'setDist', id: startId, dist: 0 });
    actions.push({ type: 'markNode', id: startId, state: 'frontier' });

    const V = nodeIds.length;
    for (let p = 1; p <= V - 1; p++) {
        actions.push({ type: 'status', text: `Pass ${p} / ${V - 1}` });
        let changed = false;
        for (const { u, v, w, id } of edges) {
            if (dist[u] === Infinity) continue;
            actions.push({ type: 'markEdge', id, state: 'relax', from: u, to: v });
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                parentEdge[v] = id;
                changed = true;
                actions.push({ type: 'setDist', id: v, dist: dist[v] });
                actions.push({ type: 'markNode', id: v, state: 'frontier' });
                actions.push({ type: 'markEdge', id, state: 'tree', from: u, to: v });
            } else {
                actions.push({ type: 'markEdge', id, state: 'normal' });
            }
        }
        if (!changed) break; // converged early
    }

    // re-assert the final shortest-path tree so it stays highlighted
    for (const id of nodeIds) {
        if (parentEdge[id] != null) {
            actions.push({ type: 'markEdge', id: parentEdge[id], state: 'tree', from: parent[id], to: id });
        }
    }

    // detection pass
    actions.push({ type: 'status', text: 'Checking for a negative cycle…' });
    let relaxable = null;
    for (const { u, v, w } of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v]) { relaxable = v; break; }
    }
    if (relaxable != null) {
        actions.push({ type: 'status', text: 'Negative cycle detected' });
        actions.push(...negCycleActions(parent, parentEdge, relaxable, V));
    } else {
        actions.push({ type: 'status', text: 'Done' });
        if (finishId != null && dist[finishId] < Infinity) {
            actions.push(...buildPathActions(parent, parentEdge, startId, finishId));
        }
    }
    return actions;
}
