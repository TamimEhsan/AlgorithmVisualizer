"use client";

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { getNextStep, getTable } from '@/lib/algorithms/turing';
import Menu from "./menu";
import Ribbon from "./ribbon";
import Table from "./table";

export default function TuringMachine() {
    const [strip, setStrip] = useState([]);
    const [inputString1, setInputString1] = useState("");
    const [algo, setAlgo] = useState(0);
    const [currentState, setCurrentState] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const [cellStart, setCellStart] = useState(0);
    const [cellEnd, setCellEnd] = useState(0);
    const [midCell, setMidCell] = useState(0);

    const stripRef = useRef(strip);
    const midCellRef = useRef(midCell);
    const algoRef = useRef(algo);

    useEffect(() => { stripRef.current = strip; }, [strip]);
    useEffect(() => { midCellRef.current = midCell; }, [midCell]);
    useEffect(() => { algoRef.current = algo; }, [algo]);

    useEffect(() => {
        getNextStep('100');
        handleReset();
    }, []);

    const handleLeftShift = () => {
        setCellStart(s => s + 1);
        setCellEnd(e => e + 1);
        setMidCell(m => m + 1);
    };

    const handleRightShift = () => {
        setCellStart(s => s - 1);
        setCellEnd(e => e - 1);
        setMidCell(m => m - 1);
    };

    const handleSet = () => {
        handleReset();
        const string = inputString1;
        const newStrip = [...stripRef.current];
        for (let i = 0; i < string.length; i++) {
            newStrip[50 + i] = { ...newStrip[50 + i], val: string[i] };
        }
        setStrip(newStrip);
        stripRef.current = newStrip;
    };

    const handleReset = () => {
        const width = window.innerWidth;
        let cellCount = Math.floor(width / 50);
        if (cellCount % 2 === 0) cellCount--;
        let newStrip = [...stripRef.current];
        if (newStrip.length === 0) newStrip = getInitialGrid();
        for (let i = 0; i < newStrip.length; i++) newStrip[i] = { ...newStrip[i], val: 'B' };

        setStrip(newStrip);
        stripRef.current = newStrip;
        setMidCell(50);
        midCellRef.current = 50;
        const start = 50 + (1 - cellCount) / 2;
        const end = 50 + (cellCount - 1) / 2;
        setCellStart(start);
        setCellEnd(end);
        setCurrentState(-1);
    };

    const handleStart = () => {
        if (isRunning) return;
        setIsRunning(true);
        handleSet();
        handleAlgo();
    };

    const handleAlgo = async () => {
        await sleep(500);
        let state = 'q0';

        while (state !== 'qe') {
            let read = stripRef.current[midCellRef.current].val;
            read = read.toString();
            let [nextState, write, dir, rowIdx] = getNextStep(state, read, algoRef.current);
            setCurrentState(rowIdx);
            const newStrip = [...stripRef.current];
            newStrip[midCellRef.current] = { ...newStrip[midCellRef.current], val: write };
            document.getElementById('stepsText').innerText = 'Reads ' + read + ' on strip';

            await sleep(1000);

            document.getElementById('stepsText').innerText = 'writes ' + write + ' on strip';

            setStrip(newStrip);
            stripRef.current = newStrip;
            await sleep(500);
            if (dir === 'R') handleLeftShift();
            else handleRightShift();

            state = nextState;
        }
        setIsRunning(false);
    };

    const handleSetInput1 = (event) => {
        const filtered = [...event.target.value].filter(c => c === "0" || c === "1").slice(0, 8).join("");
        setInputString1(filtered);
    };

    const handleSetInput2 = (event) => {
        // placeholder for second input
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    visualize={handleStart}
                    onAlgoChanged={setAlgo}
                    onReset={handleReset}
                    setInput1={handleSetInput1}
                    setInput2={handleSetInput2}
                    disabled={isRunning}
                />
                <center>
                    <br />
                    <div className="bg-info">
                        <Ribbon
                            strip={strip}
                            midCell={midCell}
                            cellStart={cellStart}
                            cellEnd={cellEnd}
                        />
                        <Button onClick={handleLeftShift}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm10.5 10V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4A.5.5 0 0 0 10.5 12z" />
                            </svg>
                        </Button>
                        <Button className="btn btn-warning m-3" onClick={handleRightShift}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4v8z" />
                            </svg>
                        </Button>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-4">
                            <Table data={getTable(algo)} state={currentState} />
                        </div>
                        <div className="col-4">
                            <span className="bg-light p-2 font-weight-bold text-lg-center rounded-3" id="stepsText">
                                Details goes here
                            </span>
                        </div>
                        <div className="col-4" />
                    </div>
                </center>
            </div>
        </div>
    );
}

const getInitialGrid = () => {
    const strip = [];
    for (let cell = 0; cell <= 100; cell++) {
        strip.push({ id: cell, val: 'B' });
    }
    return strip;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
