import Node, { NODE_W, NODE_H } from './node';
import Arrow from './arrow';

const VB_W = 240;
const VB_H = 90;
const PAD = 16;
const Y = 48;

export default function Canvas({ nodes, nextOf, prevOf, listType, nodeState = {}, pointers = [] }) {
    const count = nodes.length;
    const spacing = count > 1
        ? Math.min(46, (VB_W - 2 * PAD - NODE_W) / (count - 1))
        : 0;
    const totalW = (count - 1) * spacing + NODE_W;
    const startX = Math.max(PAD, (VB_W - totalW) / 2);

    const posById = {};
    nodes.forEach((n, i) => { posById[n.id] = { x: startX + i * spacing, i }; });

    const doubly = listType === 1;
    const nextY = doubly ? Y - 3 : Y;
    const prevY = Y + 3;

    const tail = nodes[count - 1];

    return (
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} xmlns="http://www.w3.org/2000/svg" className="w-full">
            <defs>
                <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0.3" dy="0.4" stdDeviation="0.5" floodOpacity="0.25" />
                </filter>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
                    markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
            </defs>

            {/* next pointers */}
            {nodes.map((n) => {
                const target = nextOf[n.id];
                if (target == null) return null;
                const src = posById[n.id];
                const dst = posById[target];
                if (!dst) return null;
                // forward (head->tail) points from the next-cell to the node's left;
                // a flipped (leftward) link during reverse points the other way.
                if (dst.i > src.i) {
                    return <Arrow key={'nx' + n.id} x1={src.x + NODE_W} y1={nextY} x2={dst.x} y2={nextY} />;
                }
                return <Arrow key={'nx' + n.id} x1={src.x} y1={nextY} x2={dst.x + NODE_W} y2={nextY} />;
            })}

            {/* prev pointers (doubly only) */}
            {doubly && nodes.map((n) => {
                const target = prevOf[n.id];
                if (target == null) return null;
                const src = posById[n.id];
                const dst = posById[target];
                if (!dst || Math.abs(dst.i - src.i) !== 1) return null;
                return <Arrow key={'pv' + n.id} x1={src.x} y1={prevY} x2={dst.x + NODE_W} y2={prevY} color="#94a3b8" />;
            })}

            {/* null terminator after the tail */}
            {tail && nextOf[tail.id] == null && (
                <text x={posById[tail.id].x + NODE_W + 9} y={Y} textAnchor="middle" dominantBaseline="central"
                    style={{ font: '4px sans-serif' }} fill="#94a3b8">null</text>
            )}

            {/* null terminator before the head (doubly: head.prev = null) */}
            {doubly && nodes[0] && prevOf[nodes[0].id] == null && (
                <text x={posById[nodes[0].id].x - 9} y={Y} textAnchor="middle" dominantBaseline="central"
                    style={{ font: '4px sans-serif' }} fill="#94a3b8">null</text>
            )}

            {/* nodes */}
            {nodes.map((n) => (
                <Node key={n.id} x={posById[n.id].x} y={Y} value={n.value}
                    listType={listType} state={nodeState[n.id]}
                    isHead={prevOf[n.id] == null} isTail={nextOf[n.id] == null} />
            ))}

            {/* head / tail labels */}
            {nodes[0] && (
                <text x={posById[nodes[0].id].x + NODE_W / 2} y={Y - NODE_H / 2 - 4}
                    textAnchor="middle" style={{ font: '3.5px sans-serif', fontWeight: 600 }} fill="#475569">head</text>
            )}
            {tail && count > 1 && (
                <text x={posById[tail.id].x + NODE_W / 2} y={Y - NODE_H / 2 - 4}
                    textAnchor="middle" style={{ font: '3.5px sans-serif', fontWeight: 600 }} fill="#475569">tail</text>
            )}

            {/* operation pointer captions (curr / prev / next / slow / fast) */}
            {pointers.map((p, idx) => {
                if (p.nodeId == null || !posById[p.nodeId]) return null;
                const px = posById[p.nodeId].x + NODE_W / 2;
                return (
                    <text key={idx} x={px} y={Y + NODE_H / 2 + 7} textAnchor="middle"
                        style={{ font: '4px sans-serif', fontWeight: 700 }} fill="#0f172a">
                        ▲ {p.label}
                    </text>
                );
            })}
        </svg>
    );
}
