import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

// Clean circular node. Fill encodes traversal state; an outer ring marks the
// start/finish role. Hidden handles satisfy React Flow's edge anchoring
// (edges are floating and created via keyboard, not handle dragging).

const FILL = {
    normal: ['#0d9488', '#0f766e'],
    current: ['#f59e0b', '#d97706'],
    frontier: ['#4f46e5', '#4338ca'],
    visited: ['#334155', '#475569'],
    path: ['#10b981', '#059669'],
    negcycle: ['#f43f5e', '#be123c'],
};

function GraphNode({ data, selected }) {
    // An explicit data.color (e.g. a connected-component / SCC color) overrides
    // the traversal-state fill.
    const [bg, border] = data.color ? [data.color, data.color] : (FILL[data.state] || FILL.normal);
    const ring = data.role === 'start' ? '#10b981' : data.role === 'finish' ? '#f43f5e' : null;

    // stack rings: role ring (inner) + selection ring (outer)
    const layers = [];
    if (ring) layers.push(`0 0 0 3px ${ring}`);
    if (selected) layers.push(`0 0 0 ${ring ? 5 : 3}px #0ea5e9`);
    const boxShadow = layers.length ? layers.join(', ') : '0 1px 3px rgba(0,0,0,0.3)';

    return (
        <div
            style={{
                position: 'relative',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: bg,
                border: `2px solid ${border}`,
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 15,
                boxShadow,
            }}
        >
            <Handle type="target" position={Position.Top} style={{ opacity: 0 }} isConnectable={false} />
            {data.label}
            <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} isConnectable={false} />
            {ring && (
                <span style={{ position: 'absolute', top: -15, fontSize: 9, fontWeight: 700, color: ring }}>
                    {data.role}
                </span>
            )}
            {data.dist !== undefined && (
                <span
                    style={{
                        position: 'absolute',
                        bottom: -16,
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#0f172a',
                        background: '#fff',
                        borderRadius: 4,
                        padding: '0 4px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
                    }}
                >
                    {data.dist === Infinity || data.dist == null ? '∞' : data.dist}
                </span>
            )}
        </div>
    );
}

export default memo(GraphNode);
