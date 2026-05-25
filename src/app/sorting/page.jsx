"use client";
import { useState, useEffect, useRef } from 'react';
import { quickSort } from "@/lib/algorithms/quickSort";
import { bubbleSort, insertionSort, selectionSort } from "@/lib/algorithms/sortingAlgorithms";
import Rects from "./rects";
import Navbar from '@/components/navbar';
import Menu from "./menu";

export default function Sort() {
    const [count, setCount] = useState(20);
    const [rects, setRects] = useState(() => getInitialRects(20));
    const [rects2, setRects2] = useState(() => getInitialRects(20));
    const [doubles, setDoubles] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [isRunning, setIsRunning] = useState(false);
    const [algo1, setAlgo1] = useState(0);
    const [algo2, setAlgo2] = useState(0);

    const speedRef = useRef(speed);
    const isRunning1Ref = useRef(false);
    const isRunning2Ref = useRef(false);

    useEffect(() => { speedRef.current = speed; }, [speed]);

    const handleRandomize = () => {
        const rect = getInitialRects(count);
        setRects(rect);
        setRects2(rect.slice());
    };

    const handleDouble = (val) => {
        setDoubles(val);
    };

    const handleCountChange = (val) => {
        const rect = getInitialRects(val);
        setCount(val);
        setRects(rect);
        setRects2(rect.slice());
    };

    const handleSpeedChanged = (val) => {
        setSpeed(760 - val * 7.5);
    };

    const handleSort = () => {
        setIsRunning(true);
        let steps1;
        switch (algo1) {
            case 0: steps1 = bubbleSort(rects); break;
            case 1: steps1 = selectionSort(rects); break;
            case 2: steps1 = insertionSort(rects); break;
            case 3: steps1 = quickSort(rects2); break;
            default: steps1 = bubbleSort(rects); break;
        }
        let steps2;
        if (doubles) {
            switch (algo2) {
                case 0: steps2 = bubbleSort(rects2); break;
                case 1: steps2 = selectionSort(rects2); break;
                case 2: steps2 = insertionSort(rects2); break;
                case 3: steps2 = quickSort(rects2); break;
                default: steps2 = bubbleSort(rects2); break;
            }
        }
        handleFirst(steps1);
        if (doubles) handleSecond(steps2);
    };

    const handleFirst = async (steps) => {
        isRunning1Ref.current = true;
        const prevRect = [...rects];
        for (let i = 0; i < steps.length; i++) {
            if (i !== 0) {
                prevRect[steps[i - 1].xx] = { ...prevRect[steps[i - 1].xx], isSorting: false };
                prevRect[steps[i - 1].yy] = { ...prevRect[steps[i - 1].yy], isSorting: false };
            }
            if (steps[i].xx === steps[i].yy) {
                prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorted: true, isSorting: false };
            } else if (steps[i].changed) {
                const recti = { ...prevRect[steps[i].xx], isSorting: true };
                const rectj = { ...prevRect[steps[i].yy], isSorting: true };
                prevRect[steps[i].yy] = recti;
                prevRect[steps[i].xx] = rectj;
            } else {
                prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorting: true };
                prevRect[steps[i].yy] = { ...prevRect[steps[i].yy], isSorting: true };
            }
            if (i === steps.length - 1) {
                isRunning1Ref.current = false;
                if (!isRunning2Ref.current) {
                    setIsRunning(false);
                }
            }
            setRects([...prevRect]);
            await sleep(speedRef.current);
        }
    };

    const handleSecond = async (steps) => {
        isRunning2Ref.current = true;
        const prevRect = [...rects2];
        for (let i = 0; i < steps.length; i++) {
            if (i !== 0) {
                prevRect[steps[i - 1].xx] = { ...prevRect[steps[i - 1].xx], isSorting: false };
                prevRect[steps[i - 1].yy] = { ...prevRect[steps[i - 1].yy], isSorting: false };
            }
            if (steps[i].xx === steps[i].yy) {
                prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorted: true, isSorting: false };
            } else if (steps[i].changed) {
                const recti = { ...prevRect[steps[i].xx], isSorting: true };
                const rectj = { ...prevRect[steps[i].yy], isSorting: true };
                prevRect[steps[i].yy] = recti;
                prevRect[steps[i].xx] = rectj;
            } else {
                prevRect[steps[i].xx] = { ...prevRect[steps[i].xx], isSorting: true };
                prevRect[steps[i].yy] = { ...prevRect[steps[i].yy], isSorting: true };
            }
            if (i === steps.length - 1) {
                isRunning2Ref.current = false;
                if (!isRunning1Ref.current) {
                    setIsRunning(false);
                }
            }
            setRects2([...prevRect]);
            await sleep(speedRef.current);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    disabled={isRunning}
                    onDoubleChange={handleDouble}
                    onViusalize={handleSort}
                    onRandomize={handleRandomize}
                    onCountChange={handleCountChange}
                    onAlgoChanged1={setAlgo1}
                    onAlgoChanged2={setAlgo2}
                    onSpeedChange={handleSpeedChanged}
                />
                <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                    <Rects speed={speed} rects={rects} />
                    {doubles && <hr style={{ width: "90%" }} />}
                    {doubles && <Rects rects={rects2} />}
                </div>
            </div>
        </div>
    );
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getInitialRects = (tot) => {
    const rects = [];
    for (let i = 0; i < tot; i++) {
        rects.push({
            width: Math.floor(Math.random() * 200) + 50,
            isSorted: false,
            isSorting: false,
            kk: i,
        });
    }
    return rects;
};
