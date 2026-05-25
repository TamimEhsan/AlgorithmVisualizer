import { useEffect } from 'react';

export default function Vertex({ id, pos, current, completed, label, ret }) {
    useEffect(() => {
        if (id === 0) return;
        document.getElementById('cxanim' + id)?.beginElement();
        document.getElementById('cyanim' + id)?.beginElement();
        document.getElementById('tanim' + id)?.beginElement();
    }, []);

    const fillColor = current ? '#f59e0b' : completed ? '#334155' : '#0d9488';
    const strokeColor = current ? '#d97706' : completed ? '#475569' : '#0f766e';
    const textColor = '#f8fafc';

    return (
        <g>
            <circle
                cx={pos.x}
                cy={pos.y}
                r={6}
                stroke={strokeColor}
                strokeWidth="0.4"
                fill={fillColor}
                filter="url(#nodeShadow)"
            >
                <animate
                    id={'cxanim' + id}
                    attributeName="cx"
                    values={pos.px + ";" + pos.x}
                    dur="0.5s"
                    repeatCount="1"
                />
                <animate
                    id={'cyanim' + id}
                    attributeName="cy"
                    values={pos.py + ";" + pos.y}
                    dur="0.5s"
                    repeatCount="1"
                />
            </circle>
            <text
                style={{ font: '2.8px sans-serif', fontWeight: 500 }}
                x={pos.x}
                y={pos.y - 3.5}
                textAnchor="middle"
                fill={textColor}
            >
                <animate
                    id={'tanim' + id}
                    attributeName="opacity"
                    values="0;0;1"
                    dur="1s"
                    repeatCount="1"
                />
                <tspan x={pos.x} dy="1.2em">N:{label}</tspan>
                <tspan x={pos.x} dy="1.2em">R:{ret}</tspan>
            </text>
        </g>
    );
}
