import { useState, useCallback } from 'react';
import { seive } from "../algorithms/prime";
import { getCells, getNewCellPrimeToggled, getNewCellVisitingToggled, getNewCellCheckToggled } from '../utils/cellHelpers';
import { sleep } from '../utils/common';

export const useSieve = () => {
    const [state, setState] = useState({
        number: 100,
        cells: [],
        isRunning: false,
        speed: 500,
        primes: [],
        maxPrime: 0,
        algo: 0
    });

    const setAlgo = useCallback((val) => {
        setState(prev => ({ ...prev, algo: val }));
    }, []);

    const changeSpeed = useCallback((speed) => {
        setState(prev => ({ ...prev, speed: 600 - speed * 10 }));
    }, []);

    const handleValueIncrease = useCallback((value) => {
        setState(prev => ({
            ...prev,
            number: value,
            cells: getCells(value), // Always initialize cells regardless of algo
            isRunning: false
        }));
    }, []);

    const handleRefresh = useCallback(() => {
        setState(prev => ({ ...prev, cells: getCells(prev.number), isRunning: false }));
    }, []);

    const startSpiral = useCallback(async () => {
        const pprimes = seive(state.number * 100);
        let primes = [];
        setState(prev => ({ ...prev, primes: [], maxPrime: pprimes[pprimes.length - 1] }));
        const mod = Math.ceil(state.number / 10);
        
        for (let i = 0; i < pprimes.length; i++) {
            primes.push(pprimes[i]);
            if (i % mod === 0) {
                setState(prev => ({ ...prev, primes: [...primes] }));
                await sleep(10);
            }
        }
    }, [state.number]);

    const startSieveVisualization = useCallback(async () => {
        console.log("Starting Sieve Visualization");
        setState(prev => ({ ...prev, isRunning: true }));
        const prime = new Array(state.number + 1).fill(1);
        prime[0] = prime[1] = 0;
        let changedCells = getCells(state.number); // Reset cells at start
        let prevCheck = -1;

        for (let i = 2; i <= state.number; i++) {
            if (prime[i] === 1) {
                changedCells = getNewCellPrimeToggled(changedCells, i - 1);
                setState(prev => ({ ...prev, cells: [...changedCells] }));
                await sleep(state.speed);

                for (let j = i * i; j <= state.number; j += i) {
                    if (prevCheck !== -1) {
                        changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
                    }
                    prevCheck = j - 1;
                    changedCells = getNewCellCheckToggled(changedCells, j - 1);
                    changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
                    setState(prev => ({ ...prev, cells: [...changedCells] }));
                    await sleep(state.speed);
                    prime[j] = 0;
                }
            }
        }

        if (prevCheck !== -1) {
            changedCells = getNewCellVisitingToggled(changedCells, prevCheck);
        }
        setState(prev => ({ ...prev, cells: [...changedCells], isRunning: false }));
    }, [state.number, state.speed]); // Remove state.cells dependency

    const startAlgo = useCallback(() => {
        if (state.algo === 0) {
            startSieveVisualization();
        } else if (state.algo === 1) {
            startSpiral();
        }
    }, [state.algo, startSieveVisualization, startSpiral]);

    return {
        state,
        setAlgo,
        changeSpeed,
        handleValueIncrease,
        handleRefresh,
        startAlgo,
        setState
    };
};
