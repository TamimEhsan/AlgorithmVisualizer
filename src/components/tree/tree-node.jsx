// SVG tree node: a circle with a primary value and an optional secondary label.
// Position is a CSS transform transition so nodes slide when the tree re-lays
// out; a one-shot SMIL fade-in plays when a node first appears.

const FILL = {
    normal: ['#0d9488', '#0f766e'],
    current: ['#f59e0b', '#d97706'],
    visited: ['#334155', '#475569'],
    found: ['#10b981', '#059669'],
    path: ['#10b981', '#059669'],
    remove: ['#f43f5e', '#be123c'],
};

// red/black node fills (used when a `color` is given, e.g. Red-Black trees)
const RB_FILL = {
    red: ['#dc2626', '#b91c1c'],
    black: ['#1f2937', '#0f172a'],
};
// when a node has a fixed red/black fill, the operation highlight is drawn as
// an outer ring instead of recoloring the fill
const RING = { current: '#f59e0b', found: '#10b981', visited: '#94a3b8', remove: '#f43f5e' };

const R = 16;

export default function TreeNode({ x, y, value, secondary, state, color }) {
    if (state === 'hidden') return null;
    const [bg, border] = color ? RB_FILL[color] || RB_FILL.black : FILL[state] || FILL.normal;
    const ring = color ? RING[state] : null; // operation highlight for colored nodes
    // shrink the primary label so longer values (e.g. recursion call labels
    // like "(4,3)") still fit inside the circle
    const len = String(value ?? '').length;
    const fontSize = len <= 2 ? 13 : len <= 4 ? 10 : 8;

    return (
        <g style={{ transform: `translate(${x}px, ${y}px)` }}>
            <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0s" />
            {ring && <circle r={R + 3} fill="none" stroke={ring} strokeWidth="2" />}
            <circle r={R} fill={bg} stroke={border} strokeWidth="1.5" filter="url(#treeShadow)" style={{ transition: 'fill 0.3s' }} />
            <text
                textAnchor="middle"
                dominantBaseline="central"
                y={secondary != null ? -2 : 0}
                fill="#f8fafc"
                style={{ font: `600 ${fontSize}px sans-serif` }}
            >
                {value}
            </text>
            {secondary != null && (
                <text textAnchor="middle" y={9} fill="#cbd5e1" style={{ font: '8px sans-serif' }}>
                    {secondary}
                </text>
            )}
        </g>
    );
}

export const TREE_NODE_R = R;
