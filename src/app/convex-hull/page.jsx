"use client";
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import Canvas from "./canvas";
import Menu from "./menu";

export default function ConvexHull() {
    const [dots, setDots] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [speed, setSpeed] = useState(100);
    const [number, setNumber] = useState(50);

    const containerRef = useRef(null);
    const numberRef = useRef(number);

    useEffect(() => { numberRef.current = number; }, [number]);

    useEffect(() => {
        setWidth(containerRef.current.offsetWidth);
        setHeight(containerRef.current.offsetHeight);
    }, []);

    const handleValueIncrease = (value) => {
        setNumber(value);
        setIsRunning(false);
        setDots(getNewDots(value, width, height));
    };

    const changeSpeed = (speed) => {
        setSpeed(600 - speed * 10);
    };

    const handleVisualize = () => {
        setIsRunning(true);
    };

    const handleTurnOff = () => {
        setIsRunning(false);
    };

    const handleRefreshDots = () => {
        setIsRunning(false);
        setDots(getNewDots(numberRef.current, width, height));
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    onRefresh={handleRefreshDots}
                    onVisualize={handleVisualize}
                    onChangeSpeed={changeSpeed}
                    onChangeValues={handleValueIncrease}
                    disabled={isRunning}
                />
                <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                    <div className="w-full h-full flex items-center justify-center" ref={containerRef}>
                        <Canvas
                            width={width}
                            height={height}
                            dots={dots}
                            onTurnOff={handleTurnOff}
                            onGoing={isRunning}
                            speed={speed}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function getNewDots(number, width, height) {
    const dots = [];
    for (let i = 0; i < number; i++) {
        dots.push(getDot(width, height));
    }
    dots.sort((a, b) => {
        if (a.xx !== b.xx) return a.xx - b.xx;
        return a.yy - b.yy;
    });
    return dots;
}

function getDot(width, height) {
    width = width - 50;
    height = height - 50;
    const rowpos = Math.floor(Math.random() * height) + 25;
    const colpos = Math.floor(Math.random() * width) + 25;
    return { xx: colpos, yy: rowpos };
}
