"use client";
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import heapSort from "@/lib/algorithms/heapSort";
import mergeSort from '@/lib/algorithms/mergeSort';
import { quickSortRecursive } from "@/lib/algorithms/quickSortRecursive";
import Menu from "./menu";
import Rects from "./rects";

export default function RecursiveSort() {
    const [count, setCount] = useState(20);
    const [rects, setRects] = useState([]);
    const [speed, setSpeed] = useState(50);
    const [isRunning, setIsRunning] = useState(false);
    const [algo, setAlgo] = useState(0);

    const speedRef = useRef(speed);
    const countRef = useRef(count);

    useEffect(() => { speedRef.current = speed; }, [speed]);
    useEffect(() => { countRef.current = count; }, [count]);

    useEffect(() => {
        setRects(getInitialRects(20));
    }, []);

    const handleRandomize = () => {
        setRects(getInitialRects(count));
    };

    const handleRefresh = () => {
        setRects(rects.map(r => ({ ...r, isSorted: false, isSorting: false })));
    };

    const handleCountChange = (val) => {
        setCount(val);
        setRects(getInitialRects(val));
    };

    const handleSpeedChanged = (val) => {
        setSpeed(110 - val);
    };

    const handleSort = () => {
        setIsRunning(true);
        let steps;
        let rects2;
        switch (algo) {
            case 0:
                steps = mergeSort(rects);
                handleMerge(steps);
                break;
            case 1:
                rects2 = rects.slice();
                steps = heapSort(rects2);
                handleHeap(steps);
                break;
            case 2:
                rects2 = rects.slice();
                steps = quickSortRecursive(rects2);
                handleQuick(steps);
                break;
            default:
        }
    };

    const handleQuick = async (steps) => {
        let prevRect = rects;
        for (let j = 0; j < countRef.current; j++) {
            prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isRange: false, isSorted: false };
        }
        setRects([...prevRect]);
        let hasChanged = -1;
        let changed;
        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];
            if (hasChanged !== -1) {
                let { left, right } = changed;
                prevRect[left] = { ...prevRect[left], isLeft: false, isSorting: false, isRight: false, isRange: false };
                prevRect[right] = { ...prevRect[right], isLeft: false, isSorting: false, isRight: false, isRange: false };
            }
            if (step.changedRange) {
                await sleep(speedRef.current * 4);
                let { left, right } = step;
                for (let j = 0; j < countRef.current; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isRange: false };
                }
                for (let j = left; j <= right; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: true, isRange: true };
                }
                setRects([...prevRect]);
                await sleep(speedRef.current * 4);
                for (let j = 0; j < countRef.current; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false };
                }
            } else if (step.swap) {
                let { left, right } = step;
                prevRect[left] = { ...prevRect[left], isLeft: false, isSorting: true, isRight: false, isRange: false };
                prevRect[right] = { ...prevRect[right], isLeft: true, isSorting: false, isRight: false, isRange: false };
                let temp = prevRect[left];
                prevRect[left] = prevRect[right];
                prevRect[right] = temp;
                hasChanged = 1;
                changed = step;
            }
            setRects([...prevRect]);
            await sleep(speedRef.current);
            if (i === steps.length - 1) {
                for (let j = 0; j < countRef.current; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isSorted: false, isRange: false };
                }
                setRects([...prevRect]);
                for (let j = 0; j < countRef.current; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isSorted: true, isRange: false };
                    setRects([...prevRect]);
                    await sleep(10);
                }
                setIsRunning(false);
            }
        }
    };

    const handleHeap = async (steps) => {
        let prevRect = rects;
        for (let j = 0; j < countRef.current; j++) {
            prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isRange: false, isSorted: false };
        }
        setRects([...prevRect]);

        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];
            for (let j = 0; j < countRef.current; j++) {
                prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false };
            }
            let { left, right, sorted } = step;
            prevRect[left] = { ...prevRect[left], isLeft: true };
            prevRect[right] = { ...prevRect[right], isRight: true };
            setRects([...prevRect]);
            await sleep(speedRef.current);
            let temp = prevRect[left];
            prevRect[left] = prevRect[right];
            prevRect[right] = temp;
            setRects([...prevRect]);
            if (sorted) prevRect[left] = { ...prevRect[left], isSorted: true };
            await sleep(speedRef.current * 3);
            if (i === steps.length - 1) {
                for (let j = 0; j < countRef.current; j++) {
                    prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isSorted: true };
                    setRects([...prevRect]);
                    await sleep(speedRef.current);
                }
                setIsRunning(false);
            }
        }
    };

    const handleMerge = async (steps) => {
        let prevRect = rects;
        for (let j = 0; j < countRef.current; j++) {
            prevRect[j] = { ...prevRect[j], isLeft: false, isSorting: false, isRight: false, isRange: false, isSorted: false };
        }
        setRects([...prevRect]);
        await sleep(speedRef.current);

        for (let ii = 0; ii < steps.length; ii++) {
            let step = steps[ii];
            for (let i = 0; i < countRef.current; i++) {
                prevRect[i] = { ...prevRect[i], isLeft: false, isSorting: false, isRight: false };
            }
            for (let i = step.left; i <= step.mid; i++) {
                prevRect[i] = { ...prevRect[i], isLeft: true, isSorting: false };
            }
            for (let i = step.mid + 1; i <= step.right; i++) {
                prevRect[i] = { ...prevRect[i], isRight: true, isLeft: false, isSorting: false };
            }
            setRects([...prevRect]);
            await sleep(speedRef.current * 3);

            for (let i = step.left; i <= step.right; i++) {
                prevRect[i] = { ...prevRect[i], width: step.val[i - step.left].width, isSorting: true };
                setRects([...prevRect]);
                await sleep(speedRef.current);
            }

            if (ii === steps.length - 1) {
                for (let i = 0; i < countRef.current; i++) {
                    prevRect[i] = { ...prevRect[i], isLeft: false, isSorting: false, isRight: false, isSorted: true };
                    setRects([...prevRect]);
                    await sleep(speedRef.current);
                }
                setIsRunning(false);
            }

            setRects([...prevRect]);
            await sleep(speedRef.current);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    disabled={isRunning}
                    onViusalize={handleSort}
                    onRandomize={handleRandomize}
                    onCountChange={handleCountChange}
                    onAlgoChanged={setAlgo}
                    onSpeedChange={handleSpeedChanged}
                />
                <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                    <Rects rects={rects} />
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
            isLeft: false,
            isRight: false,
        });
    }
    return rects;
};
