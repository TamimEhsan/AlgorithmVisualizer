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

const R = 16;

export default function TreeNode({ x, y, value, secondary, state }) {
    if (state === 'hidden') return null;
    const [bg, border] = FILL[state] || FILL.normal;

    return (
        <g style={{ transform: `translate(${x}px, ${y}px)` }}>
            <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="0s" />
            <circle r={R} fill={bg} stroke={border} strokeWidth="1.5" filter="url(#treeShadow)" />
            <text
                textAnchor="middle"
                dominantBaseline="central"
                y={secondary != null ? -2 : 0}
                fill="#f8fafc"
                style={{ font: '600 13px sans-serif' }}
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
