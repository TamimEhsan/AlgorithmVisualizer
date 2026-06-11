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
};

function GraphNode({ data }) {
    const [bg, border] = FILL[data.state] || FILL.normal;
    const ring = data.role === 'start' ? '#10b981' : data.role === 'finish' ? '#f43f5e' : null;

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
                boxShadow: ring ? `0 0 0 3px ${ring}` : '0 1px 3px rgba(0,0,0,0.3)',
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
        </div>
    );
}

export default memo(GraphNode);
