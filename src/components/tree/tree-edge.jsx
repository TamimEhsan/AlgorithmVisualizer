import { TREE_NODE_R } from './tree-node';

// Parent→child line, trimmed to the node radius. Transitions so it follows
// nodes as they slide on re-layout.

const STROKE = { tree: '#f59e0b', path: '#10b981', normal: '#64748b' };

export default function TreeEdge({ x1, y1, x2, y2, state }) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    return (
        <line
            x1={x1 + ux * TREE_NODE_R}
            y1={y1 + uy * TREE_NODE_R}
            x2={x2 - ux * TREE_NODE_R}
            y2={y2 - uy * TREE_NODE_R}
            stroke={STROKE[state] || STROKE.normal}
            strokeWidth="1.5"
        />
    );
}
