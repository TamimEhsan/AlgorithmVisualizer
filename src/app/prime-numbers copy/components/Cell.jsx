import React from 'react';
import '../styles/cell.css';

const Cell = ({ cell }) => {
    const getClass = () => {
        const { val, isVisiting, isChecking, isPrime } = cell;
        if (isPrime) {
            return "cell cell-prime bg-success text-light m-2";
        } else if (isVisiting) {
            return "cell cell-visiting m-2";
        } else if (isChecking) {
            return "cell cell-check m-2";
        } else {
            return "cell m-2";
        }
    };

    return (
        <div className={getClass()}>
            <span>
                {cell.val}
            </span>
        </div>
    );
};

export default Cell;
