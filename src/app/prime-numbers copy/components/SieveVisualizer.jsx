import React, { useEffect } from 'react';
import { useSieve } from '../hooks/useSieve';
import { getCells } from '../utils/cellHelpers';
import { ALGORITHMS } from '../constants';
import Cells from './Cells';
import Spiral from './Spiral';

const SieveVisualizer = () => {
    const { state, setAlgo, changeSpeed, handleValueIncrease, handleRefresh, startAlgo, setState } = useSieve();

    useEffect(() => {
        const cells = getCells(state.number);
        setState(prev => ({ ...prev, cells }));
    }, []);

    return (
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
    );
};

export default SieveVisualizer;
