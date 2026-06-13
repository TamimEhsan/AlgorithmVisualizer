// graph-helpers.js — Shared utilities for graph-based algorithm visualizations
//
// Extracted from duplicated code across graph.js and shortestPath.js.
// Both files had identical pathActions() implementations.
// Dijkstra.js and Astar.js shared getAllNodes, sortNodesByDistance,
// updateUnvisitedNeighbors, getUnvisitedNeighbors.

/**
 * Reconstruct a start→end path from parent maps and emit markNode/markEdge actions.
 * Shared by BFS, DFS, Dijkstra, and Bellman-Ford action planners.
 *
 * @param {Object} parent - Map of nodeId → parent nodeId
 * @param {Object} parentEdge - Map of nodeId → edge id used to reach this node
 * @param {string} startId - Source node ID
 * @param {string} endId - Destination node ID
 * @returns {Array} Array of markNode/markEdge action objects
 */
export function buildPathActions(parent, parentEdge, startId, endId) {
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
