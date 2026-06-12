// Network Flow — presets and max-flow planners (Edmonds-Karp / Ford-Fulkerson).
//
// Directed graph; edge weight = capacity. Emits the shared action log, using
// `setFlow` to show flow/capacity and `markEdge`/`markNode` to animate the
// augmenting path. Finishes with a min-cut highlight. Phase 1: flow values are
// faithful; backward (cancel) steps show as a forward edge's flow decreasing.

export const FLOW_PRESETS = [
    {
        // classic CLRS max-flow network (max flow = 23)
        name: 'Classic (s→t)',
        source: 'n1',
        sink: 'n6',
        nodes: [
            { id: 'n1', x: 60, y: 160, label: 's' },
            { id: 'n2', x: 210, y: 70, label: 'a' },
            { id: 'n3', x: 210, y: 250, label: 'b' },
            { id: 'n4', x: 370, y: 70, label: 'c' },
            { id: 'n5', x: 370, y: 250, label: 'd' },
            { id: 'n6', x: 520, y: 160, label: 't' },
        ],
        edges: [
            ['n1', 'n2', 16], ['n1', 'n3', 13], ['n2', 'n3', 10], ['n3', 'n2', 4],
            ['n2', 'n4', 12], ['n4', 'n3', 9], ['n3', 'n5', 14], ['n5', 'n4', 7],
            ['n4', 'n6', 20], ['n5', 'n6', 4],
        ],
    },
    {
        name: 'Diamond',
        source: 'n1',
        sink: 'n4',
        nodes: [
            { id: 'n1', x: 90, y: 160, label: 's' },
            { id: 'n2', x: 260, y: 70, label: 'a' },
            { id: 'n3', x: 260, y: 250, label: 'b' },
            { id: 'n4', x: 430, y: 160, label: 't' },
        ],
        edges: [
            ['n1', 'n2', 10], ['n1', 'n3', 5], ['n2', 'n3', 4],
            ['n2', 'n4', 6], ['n3', 'n4', 10],
        ],
    },
];

const key = (a, b) => `${a}|${b}`;

export function maxFlowActions(edges, sourceId, sinkId, variant = 'ek') {
    const actions = [];
    if (sourceId == null || sinkId == null || sourceId === sinkId) {
        actions.push({ type: 'status', text: 'Set a source (S) and a sink (F)' });
        return actions;
    }

    const cap = {};
    const edgeIdOf = {};
    const nbr = {};
    for (const e of edges) {
        const c = e.data?.weight ?? 1;
        cap[key(e.source, e.target)] = (cap[key(e.source, e.target)] || 0) + c;
        edgeIdOf[key(e.source, e.target)] = e.id;
        (nbr[e.source] = nbr[e.source] || new Set()).add(e.target);
        (nbr[e.target] = nbr[e.target] || new Set()).add(e.source);
    }
    const residual = { ...cap };
    const getRes = (a, b) => residual[key(a, b)] ?? 0;
    const neighbors = (u) => [...(nbr[u] || [])].sort();
    const realEdge = (a, b) => edgeIdOf[key(a, b)] ?? edgeIdOf[key(b, a)];

    // reconstruct path of [a,b] steps from a prev map
    const rebuild = (prev) => {
        const path = [];
        let cur = sinkId;
        while (cur !== sourceId) {
            path.push([prev[cur], cur]);
            cur = prev[cur];
        }
        return path.reverse();
    };

    const findBFS = () => {
        const prev = {};
        const visited = new Set([sourceId]);
        const q = [sourceId];
        while (q.length) {
            const u = q.shift();
            if (u === sinkId) break;
            for (const w of neighbors(u)) {
                if (!visited.has(w) && getRes(u, w) > 0) { visited.add(w); prev[w] = u; q.push(w); }
            }
        }
        return visited.has(sinkId) ? rebuild(prev) : null;
    };

    const findDFS = () => {
        const prev = {};
        const visited = new Set([sourceId]);
        const stack = [sourceId];
        while (stack.length) {
            const u = stack.pop();
            if (u === sinkId) break;
            for (const w of neighbors(u)) {
                if (!visited.has(w) && getRes(u, w) > 0) { visited.add(w); prev[w] = u; stack.push(w); }
            }
        }
        return visited.has(sinkId) ? rebuild(prev) : null;
    };

    const find = variant === 'ff' ? findDFS : findBFS;

    // start every edge at flow 0
    for (const e of edges) actions.push({ type: 'setFlow', id: e.id, flow: 0 });

    let total = 0;
    let pathNo = 0;
    while (true) {
        const path = find();
        if (!path) break;
        pathNo += 1;

        let bottleneck = Infinity;
        for (const [a, b] of path) bottleneck = Math.min(bottleneck, getRes(a, b));

        // highlight the augmenting path
        for (const [a, b] of path) {
            const eid = realEdge(a, b);
            if (eid) actions.push({ type: 'markEdge', id: eid, state: 'path' });
            actions.push({ type: 'markNode', id: a, state: 'current' });
            actions.push({ type: 'markNode', id: b, state: 'current' });
        }
        actions.push({ type: 'status', text: `Augmenting path ${pathNo}: bottleneck ${bottleneck}` });

        // push flow along the path
        for (const [a, b] of path) {
            residual[key(a, b)] = getRes(a, b) - bottleneck;
            residual[key(b, a)] = getRes(b, a) + bottleneck;
        }
        total += bottleneck;

        // refresh flow labels on real edges
        for (const e of edges) {
            const flow = Math.max(0, (cap[key(e.source, e.target)] || 0) - getRes(e.source, e.target));
            actions.push({ type: 'setFlow', id: e.id, flow });
        }
        actions.push({ type: 'status', text: `Total flow: ${total}` });

        // clear the path highlight before the next iteration
        for (const [a, b] of path) {
            const eid = realEdge(a, b);
            if (eid) actions.push({ type: 'markEdge', id: eid, state: 'normal' });
            actions.push({ type: 'markNode', id: a, state: 'normal' });
            actions.push({ type: 'markNode', id: b, state: 'normal' });
        }
    }

    // min cut: nodes reachable from source in the final residual graph
    const reach = new Set([sourceId]);
    const q = [sourceId];
    while (q.length) {
        const u = q.shift();
        for (const w of neighbors(u)) {
            if (!reach.has(w) && getRes(u, w) > 0) { reach.add(w); q.push(w); }
        }
    }
    for (const u of reach) actions.push({ type: 'colorNode', id: u, color: '#0ea5e9' });
    for (const e of edges) {
        if (reach.has(e.source) && !reach.has(e.target)) {
            actions.push({ type: 'markEdge', id: e.id, state: 'negcycle' });
        }
    }
    actions.push({ type: 'status', text: `Max flow = ${total} · min cut` });
    return actions;
}
