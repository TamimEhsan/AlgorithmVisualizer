import { createContext, useContext, useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getStraightPath, useInternalNode } from '@xyflow/react';

// Edge that connects node centers (no handles), trimmed to each node's border.
// Stroke color encodes the edge state; during traversal a big arrow is drawn at
// the edge midpoint pointing in the direction of travel. When data.weight is set
// an editable weight label is shown (used by the shortest-path visualizer).

// Provided only by pages that allow weight editing; null elsewhere.
export const EdgeWeightContext = createContext(null);

const R = 22; // node radius (node is 44px)

const STROKE = {
    relax: '#fbbf24',
    tree: '#f59e0b',
    path: '#10b981',
    negcycle: '#f43f5e',
    normal: '#64748b',
};

function center(node) {
    const { x, y } = node.internals.positionAbsolute;
    const w = node.measured?.width ?? 44;
    const h = node.measured?.height ?? 44;
    return { x: x + w / 2, y: y + h / 2 };
}

export default function FloatingEdge({ id, source, target, markerEnd, data }) {
    const setWeight = useContext(EdgeWeightContext);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');

    const sourceNode = useInternalNode(source);
    const targetNode = useInternalNode(target);
    if (!sourceNode || !targetNode) return null;

    const sc = center(sourceNode);
    const tc = center(targetNode);

    const state = data?.state || 'normal';
    const travelTo = data?.travelTo;

    // Orient along the travel direction so the midpoint arrow points the way we
    // move (handles edges stored opposite to the traversal direction).
    let from = sc;
    let to = tc;
    if (travelTo === source) { from = tc; to = sc; }

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;

    const sx = from.x + ux * R;
    const sy = from.y + uy * R;
    const ex = to.x - ux * R;
    const ey = to.y - uy * R;
    const [path, labelX, labelY] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: ex, targetY: ey });

    const stroke = STROKE[state] || STROKE.normal;
    // Constant width so the directed arrowhead (sized in stroke-width units)
    // doesn't grow during traversal; state is conveyed by color + the mid arrow.
    const strokeWidth = 2;

    const showTravelArrow = state === 'tree' || state === 'path';
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    const deg = (Math.atan2(uy, ux) * 180) / Math.PI;

    // weight label offset perpendicular to the edge so it clears the line/arrow.
    // Use the stable source->target orientation (not the travel-flipped one) so
    // the label stays on the same side during traversal.
    const hasWeight = data?.weight != null;
    const sdx = tc.x - sc.x;
    const sdy = tc.y - sc.y;
    const slen = Math.hypot(sdx, sdy) || 1;
    const lx = labelX + (-sdy / slen) * 9;
    const ly = labelY + (sdx / slen) * 9;

    const commit = () => {
        setEditing(false);
        const v = Number(draft);
        if (setWeight && draft.trim() !== '' && Number.isFinite(v)) setWeight(id, v);
    };

    return (
        <>
            <BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ stroke, strokeWidth }} />
            {showTravelArrow && (
                <path
                    d="M -7 -6 L 7 0 L -7 6 z"
                    fill={stroke}
                    transform={`translate(${mx}, ${my}) rotate(${deg})`}
                />
            )}
            {hasWeight && (
                <EdgeLabelRenderer>
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${lx}px, ${ly}px)`,
                            pointerEvents: 'all',
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#0f172a',
                            background: '#fff',
                            border: '1px solid #cbd5e1',
                            borderRadius: 4,
                            padding: '0 4px',
                            lineHeight: '16px',
                            cursor: setWeight ? 'text' : 'default',
                        }}
                        className="nodrag nopan"
                        onClick={(e) => {
                            if (!setWeight) return;
                            e.stopPropagation();
                            setDraft(String(data.weight));
                            setEditing(true);
                        }}
                    >
                        {editing ? (
                            <input
                                autoFocus
                                type="number"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onBlur={commit}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') commit();
                                    else if (e.key === 'Escape') setEditing(false);
                                }}
                                style={{ width: 36, border: 'none', outline: 'none', font: 'inherit', textAlign: 'center' }}
                            />
                        ) : (
                            data.weight
                        )}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}
