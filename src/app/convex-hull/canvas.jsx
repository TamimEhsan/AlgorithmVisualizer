import { convex_hull } from "@/lib/algorithms/grahamScan";
import { useState, useEffect, useRef } from 'react';

export default function Canvas({ width, height, dots, onTurnOff, onGoing, speed }) {
    const [lines, setLines] = useState([]);
    const dotsCanvasRef = useRef(null);
    const linesCanvasRef = useRef(null);
    const onGoingRef = useRef(onGoing);
    const speedRef = useRef(speed);

    useEffect(() => { onGoingRef.current = onGoing; }, [onGoing]);
    useEffect(() => { speedRef.current = speed; }, [speed]);

    useEffect(() => {
        redrawDots();
    }, [dots]);

    useEffect(() => {
        if (onGoing) {
            animateLine();
        }
    }, [onGoing]);

    const redrawDots = () => {
        const canvas = dotsCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'lightgrey';
        ctx.strokeStyle = 'black';
        for (let i = 0; i < dots.length; i++) {
            ctx.beginPath();
            ctx.arc(dots[i].xx, dots[i].yy, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
        ctx.closePath();

        const res = convex_hull(dots);
        const canvas2 = linesCanvasRef.current;
        if (!canvas2) return;
        const ctx2 = canvas2.getContext('2d');
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        setLines(res[1]);
    };

    const animateLine = async () => {
        const currentLines = lines;
        const canvas2 = linesCanvasRef.current;
        if (!canvas2) return;
        const ctx2 = canvas2.getContext('2d');
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.fillStyle = '#ffffff';
        ctx2.strokeStyle = '#ffffff';

        for (let i = 0; i < currentLines.length; i++) {
            if (!onGoingRef.current) {
                ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                return;
            }
            ctx2.beginPath();
            if (currentLines[i].add) {
                ctx2.beginPath();
                ctx2.lineWidth = 2;
                ctx2.fillStyle = 'black';
                ctx2.moveTo(currentLines[i].from.xx, currentLines[i].from.yy);
                ctx2.arc(currentLines[i].from.xx, currentLines[i].from.yy, 14, 0, 2 * Math.PI);
                ctx2.fill();
                ctx2.closePath();

                ctx2.beginPath();
                ctx2.fillStyle = 'red';
                ctx2.moveTo(currentLines[i].to.xx, currentLines[i].to.yy);
                ctx2.arc(currentLines[i].to.xx, currentLines[i].to.yy, 14, 0, 2 * Math.PI);
                ctx2.fill();
                ctx2.closePath();

                ctx2.beginPath();
                ctx2.lineWidth = 2;
                ctx2.strokeStyle = '#000000';
            } else {
                ctx2.beginPath();
                ctx2.fillStyle = 'whitesmoke';
                ctx2.moveTo(currentLines[i].from.xx, currentLines[i].from.yy);
                ctx2.arc(currentLines[i].from.xx, currentLines[i].from.yy, 15, 0, 2 * Math.PI);
                ctx2.fill();
                ctx2.closePath();

                ctx2.beginPath();
                ctx2.fillStyle = 'whitesmoke';
                ctx2.moveTo(currentLines[i].to.xx, currentLines[i].to.yy);
                ctx2.arc(currentLines[i].to.xx, currentLines[i].to.yy, 15, 0, 2 * Math.PI);
                ctx2.fill();
                ctx2.closePath();

                ctx2.lineWidth = 4;
                ctx2.strokeStyle = 'whitesmoke';
            }

            ctx2.moveTo(currentLines[i].from.xx, currentLines[i].from.yy);
            ctx2.lineTo(currentLines[i].to.xx, currentLines[i].to.yy);
            ctx2.stroke();
            ctx2.closePath();
            if (i === currentLines.length - 1) {
                onTurnOff();
            }
            await sleep(speedRef.current);
        }
    };

    return (
        <>
            <canvas
                className="absolute"
                ref={linesCanvasRef}
                width={width}
                height={height}
            />
            <canvas
                className="absolute"
                ref={dotsCanvasRef}
                width={width}
                height={height}
            />
        </>
    );
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
