import { useEffect } from 'react';

export default function Vertex({ id, pos, current, label, ret }) {
    useEffect(() => {
        if (id === 0) return;
        document.getElementById('cxanim' + id)?.beginElement();
        document.getElementById('cyanim' + id)?.beginElement();
        document.getElementById('tanim' + id)?.beginElement();
    }, []);

    return (
        <g>
            <circle
                cx={pos.x}
                cy={pos.y}
                r={6}
                stroke="black"
                strokeWidth="0.5"
                fill={current ? 'cyan' : 'white'}
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
                style={{ font: '3px sans-serif' }}
                x={pos.x}
                y={pos.y - 4}
                textAnchor="middle"
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
