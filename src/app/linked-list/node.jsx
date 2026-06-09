// Two-cell box node. Movement is a CSS transform transition (animates whenever
// x changes); the mount fade-in is a one-shot SMIL <animate begin="0s"> that
// fires only when a freshly-inserted node is added to the DOM.

const COLORS = {
    normal: { fill: '#0d9488', stroke: '#0f766e' },
    active: { fill: '#f59e0b', stroke: '#d97706' },
    found: { fill: '#16a34a', stroke: '#15803d' },
    remove: { fill: '#e11d48', stroke: '#be123c' },
    done: { fill: '#334155', stroke: '#475569' },
};

const W = 24;
const H = 14;

export default function Node({ x, y, value, listType, state = 'normal', isHead, isTail }) {
    const c = COLORS[state] || COLORS.normal;
    const doubly = listType === 1;
    const dataMid = doubly ? 12 : 9;

    return (
        <g style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform 0.4s ease' }}>
            <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0s" />

            <rect x="0" y={-H / 2} width={W} height={H} rx="1.5"
                fill={c.fill} stroke={c.stroke} strokeWidth="0.5" filter="url(#nodeShadow)" />

            {/* prev cell (doubly): slash when head (prev = null), else a pointer dot */}
            {doubly && <line x1="6" y1={-H / 2} x2="6" y2={H / 2} stroke={c.stroke} strokeWidth="0.4" />}
            {doubly && (isHead
                ? <line x1="1" y1={H / 2 - 1.5} x2="5" y2={-H / 2 + 1.5} stroke="#f8fafc" strokeWidth="0.5" />
                : <circle cx="3" cy="0" r="1.1" fill="#0f172a" />)}

            <line x1="18" y1={-H / 2} x2="18" y2={H / 2} stroke={c.stroke} strokeWidth="0.4" />

            <text x={dataMid} y="0" textAnchor="middle" dominantBaseline="central"
                style={{ font: '5px sans-serif', fontWeight: 600 }} fill="#f8fafc">{value}</text>

            {/* next cell: slash when tail (next = null), else a pointer dot */}
            {isTail
                ? <line x1="19" y1={H / 2 - 1.5} x2="23" y2={-H / 2 + 1.5} stroke="#f8fafc" strokeWidth="0.5" />
                : <circle cx="21" cy="0" r="1.1" fill="#0f172a" />}
        </g>
    );
}

export const NODE_W = W;
export const NODE_H = H;
