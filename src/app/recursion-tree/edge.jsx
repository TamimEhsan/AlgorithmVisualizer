import { useEffect, useRef } from 'react';

export default function Edge({ id, pos }) {
    const prevX1 = useRef(pos.x1);

    useEffect(() => {
        document.getElementById('vbanim1' + id)?.beginElement();
        document.getElementById('vbanim2' + id)?.beginElement();
    }, []);

    useEffect(() => {
        if (prevX1.current !== pos.x1) {
            prevX1.current = pos.x1;
            document.getElementById('vbanim1' + id)?.beginElement();
            document.getElementById('vbanim2' + id)?.beginElement();
        }
    }, [pos.x1]);

    const getEndX = () => {
        let { x1, y1, x2, y2 } = pos;
        let l = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        let r = 6.5;
        return (x2 * (l - r) + x1 * r) / l;
    };

    const getEndY = () => {
        let { x1, y1, x2, y2 } = pos;
        let l = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        let r = 6.5;
        return (y2 * (l - r) + y1 * r) / l;
    };

    return (
        <g>
            <line
                x2={getEndX()} y2={getEndY()} x1={pos.x1} y1={pos.y1}
                style={{ stroke: '#64748b', strokeWidth: '0.4' }}
                markerEnd="url(#arrow)"
            >
                <animate
                    id={'vbanim1' + id}
                    attributeName="x2"
                    values={pos.x1 + ';' + getEndX()}
                    dur="0.5s"
                    repeatCount="1"
                />
                <animate
                    id={'vbanim2' + id}
                    attributeName="y2"
                    values={pos.y1 + ';' + getEndY()}
                    dur="0.5s"
                    repeatCount="1"
                />
            </line>
        </g>
    );
}
