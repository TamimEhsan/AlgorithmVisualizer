"use client";

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import { seive } from "@/lib/algorithms/prime";
import Cells from "./cells";
import Menu from "./menu";
import Spiral from "./spiral";

export default function Seive() {
    const [number, setNumber] = useState(100);
    const [cells, setCells] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [primes, setPrimes] = useState([]);
    const [maxPrime, setMaxPrime] = useState(0);
    const [algo, setAlgo] = useState(0);

    const speedRef = useRef(speed);
    const numberRef = useRef(number);

    useEffect(() => { speedRef.current = speed; }, [speed]);
    useEffect(() => { numberRef.current = number; }, [number]);

    useEffect(() => {
        setCells(getCells(100));
    }, []);

    const changeSpeed = (val) => {
        setSpeed(600 - val * 10);
    };

    const handleValueIncrease = (value) => {
        setNumber(value);
        if (algo === 0) {
            setCells(getCells(value));
            setIsRunning(false);
        }
    };

    const handleRefresh = () => {
        setCells(getCells(numberRef.current));
        setIsRunning(false);
    };

    const startAlgo = () => {
        if (algo === 0) startSeive();
        else if (algo === 1) startSpiral();
    };

    const startSpiral = async () => {
        let pprimes = seive(numberRef.current * 100);
        let newPrimes = [];
        setPrimes([]);
        setMaxPrime(pprimes[pprimes.length - 1]);
        let mod = Math.ceil(numberRef.current / 10);
        for (let i = 0; i < pprimes.length; i++) {
            newPrimes.push(pprimes[i]);
            if (i % mod === 0) {
                setPrimes([...newPrimes]);
                await sleep(10);
            }
        }
    };

    const startSeive = async () => {
        setIsRunning(true);
        const prime = [];
        for (let i = 0; i <= numberRef.current; i++) prime.push(1);
        prime[0] = prime[1] = 0;
        let changedCells = cells;
        let prevCheck = -1;
        for (let i = 2; i <= numberRef.current; i++) {
            if (prime[i] === 1) {
                changedCells = getNewCellPrimeToggled(changedCells, i - 1);
                setCells([...changedCells]);
                await sleep(speedRef.current);
                for (let j = i * i; j <= numberRef.current; j += i) {
                    if (prevCheck !== -1) {
                        changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
                    }
                    prevCheck = j - 1;
                    changedCells = getNewCellCheckToggled(changedCells, j - 1);
                    changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
                    setCells([...changedCells]);
                    await sleep(speedRef.current);
                    prime[j] = 0;
                }
            }
        }
        changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
        setCells([...changedCells]);
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    onChangeSpeed={changeSpeed}
                    onChangeValues={handleValueIncrease}
                    onVisualize={startAlgo}
                    onRefresh={handleRefresh}
                    disabled={isRunning}
                    setAlgo={setAlgo}
                />
                <div className="flex flex-1 flex-col overflow-auto">
                    {algo === 0 && <Cells cells={cells} />}
                    {algo === 1 && (
                        <div className="h-full w-full justify-center bg-gray-700">
                            <Spiral num={number} primes={primes} maxPrime={maxPrime} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const getNewCellPrimeToggled = (cells, pos) => {
    const newCells = cells.slice();
    newCells[pos] = { ...newCells[pos], isPrime: true };
    return newCells;
};

const getNewCellVisitingToggled = (cells, pos) => {
    const newCells = cells.slice();
    newCells[pos] = { ...newCells[pos], isVisiting: !newCells[pos].isVisiting };
    return newCells;
};

const getNewCellCheckToggled = (cells, pos) => {
    const newCells = cells.slice();
    newCells[pos] = { ...newCells[pos], isChecking: true };
    return newCells;
};

const getCells = (rows) => {
    const cells = [];
    for (let cell = 1; cell <= rows; cell++) {
        cells.push({ val: cell, isChecking: false, isVisiting: false, isPrime: false });
    }
    return cells;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
