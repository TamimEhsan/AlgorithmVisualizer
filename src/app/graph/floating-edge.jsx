import { BaseEdge, getStraightPath, useInternalNode } from '@xyflow/react';

// Edge that connects node centers (no handles), trimmed to each node's border.
// Stroke color encodes the edge state; during traversal a big arrow is drawn at
// the edge midpoint pointing in the direction of travel.

const R = 22; // node radius (node is 44px)

const STROKE = { tree: '#f59e0b', path: '#10b981', normal: '#64748b' };

function center(node) {
    const { x, y } = node.internals.positionAbsolute;
    const w = node.measured?.width ?? 44;
    const h = node.measured?.height ?? 44;
    return { x: x + w / 2, y: y + h / 2 };
}

export default function FloatingEdge({ id, source, target, markerEnd, data }) {
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
    const [path] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: ex, targetY: ey });

    const stroke = STROKE[state] || STROKE.normal;
    // Constant width so the directed arrowhead (sized in stroke-width units)
    // doesn't grow during traversal; state is conveyed by color + the mid arrow.
    const strokeWidth = 2;

    const showTravelArrow = state === 'tree' || state === 'path';
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    const deg = (Math.atan2(uy, ux) * 180) / Math.PI;

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
        </>
    );
}
