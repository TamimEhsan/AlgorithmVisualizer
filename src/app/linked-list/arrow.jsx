// Pointer arrow between two points. Uses the shared <marker id="arrow">
// defined in the canvas <defs>.

export default function Arrow({ x1, y1, x2, y2, color = '#64748b' }) {
    return (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.6"
            markerEnd="url(#arrow)" />
    );
}
