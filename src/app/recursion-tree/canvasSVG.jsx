import Edge from "./edge";
import Vertex from "./vertex";

export default function CanvasSvg({ vertices, edges, current, offset }) {
    let off = offset;
    return (
        <div>
            <svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0.3" dy="0.3" stdDeviation="0.5" floodOpacity="0.25" />
                    </filter>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                        markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                    </marker>
                </defs>
                {edges.map((edge, cellidx) => (
                    <Edge
                        key={cellidx}
                        id={cellidx}
                        pos={{
                            x1: (edge.x1 - off) * 15 + 120, y1: edge.y1 * 15 + 10,
                            x2: (edge.x2 - off) * 15 + 120, y2: edge.y2 * 15 + 10
                        }}
                    />
                ))}
                {vertices.map((vertex, cellidx) => (
                    <Vertex
                        key={cellidx}
                        id={cellidx}
                        current={current === cellidx}
                        completed={vertex.completed}
                        label={vertex.label}
                        ret={vertex.val}
                        pos={{
                            x: (vertex.x - off) * 15 + 120, y: vertex.y * 15 + 10,
                            px: (vertex.px - off) * 15 + 120, py: vertex.py * 15 + 10
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}
