"use client";

import Navbar from '@/components/navbar';
import { useSieve } from './hooks/useSieve';
import { getCells } from './utils/cellHelpers';
import { ALGORITHMS } from './constants';
import Menu from './components/Menu';
import Cells from './components/Cells';
import Spiral from './components/Spiral';
import { useEffect } from 'react';

const Seive = () => {
    const { 
        state, 
        setAlgo, 
        changeSpeed, 
        handleValueIncrease, 
        handleRefresh, 
        startAlgo,
        setState 
    } = useSieve();

    useEffect(() => {
        const cells = getCells(state.number);
        setState(prev => ({ ...prev, cells }));
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <Navbar title="Sieve" />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    onChangeSpeed={changeSpeed}
                    onChangeValues={handleValueIncrease}
                    onVisualize={startAlgo}
                    onRefresh={handleRefresh}
                    isDisabled={state.isRunning}
                    setAlgo={setAlgo}
                />
                <div className="flex flex-1 flex-col overflow-auto">
                    {state.algo === ALGORITHMS.SIEVE && (
                        <Cells
                            num={state.number}
                            cells={state.cells}
                        />
                    )}
                    {state.algo === ALGORITHMS.SPIRAL && (
                        <div className="h-full w-full justify-center bg-gray-700">
                            <Spiral
                                num={state.number}
                                primes={state.primes}
                                maxPrime={state.maxPrime}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Seive;