"use client";

import { useState, useEffect, useRef } from 'react';
import Cells from "./cells";
import Navbar from '@/components/navbar';
import Menu from "./menu";

export default function Queen() {
    const [board, setBoard] = useState(() => getBoard(4));
    const [number, setNumber] = useState(4);
    const [speed, setSpeed] = useState(490);
    const [isRunning, setIsRunning] = useState(false);

    const numberRef = useRef(number);
    const speedRef = useRef(speed);

    useEffect(() => { numberRef.current = number; }, [number]);
    useEffect(() => { speedRef.current = speed; }, [speed]);

    const handleSpeedChange = (val) => {
        setSpeed((100 - val) * 10);
    };

    const handleQueenChange = (num) => {
        setNumber(num);
        setBoard(getBoard(num));
    };

    const handleClear = () => {
        setBoard(getBoard(numberRef.current));
    };

    const startAlgo = async () => {
        setIsRunning(true);
        const newBoard = board.slice();
        await queensAlgo(newBoard, 0);
        const newBoard2 = turnOffAttack(newBoard, numberRef.current);
        setBoard(newBoard2);
        setIsRunning(false);
    };

    const queensAlgo = async (board, col) => {
        if (col >= numberRef.current) {
            return true;
        }

        let newBoard = board.slice();
        for (let i = 0; i < numberRef.current; i++) {
            newBoard = turnOffAttack(newBoard, numberRef.current);
            const result = getChecked(newBoard, i, col, numberRef.current);
            newBoard = result[0];

            setBoard([...newBoard]);
            await sleep(speedRef.current);
            if (result[1]) {
                const res = await queensAlgo(newBoard, col + 1);
                if (res === true) {
                    return true;
                }
                newBoard[i][col] = { ...newBoard[i][col], isPresent: true, isCurrent: true };
                setBoard([...newBoard]);
                await sleep(speedRef.current);
                newBoard[i][col] = { ...newBoard[i][col], isPresent: false, isCurrent: false };
                setBoard([...newBoard]);
            }
            newBoard[i][col] = { ...newBoard[i][col], isPresent: false, isCurrent: false };
            newBoard = turnOffAttack(newBoard, numberRef.current);
            setBoard([...newBoard]);
            await sleep(speedRef.current);
        }
        return false;
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    onSpeedChange={handleSpeedChange}
                    onCountChange={handleQueenChange}
                    onViusalize={startAlgo}
                    disabled={isRunning}
                    onClear={handleClear}
                />
                <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                    <Cells board={board} />
                </div>
            </div>
        </div>
    );
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const turnOffAttack = (board, N) => {
    const newBoard = board.slice();
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            newBoard[i][j] = { ...newBoard[i][j], isChecked: false, isAttacked: false, isCurrent: false };
        }
    }
    return newBoard;
};

const getChecked = (board, row, col, N) => {
    const newBoard = board.slice();
    let pos = true;
    for (let i = 0; i < N; i++) {
        if (newBoard[row][i].isPresent) {
            newBoard[row][i] = { ...newBoard[row][i], isAttacked: true };
            pos = false;
        } else {
            newBoard[row][i] = { ...newBoard[row][i], isChecked: true };
        }
    }
    for (let i = 0; i < N; i++) {
        if (newBoard[i][col].isPresent) {
            newBoard[i][col] = { ...newBoard[i][col], isAttacked: true };
            pos = false;
        } else {
            newBoard[i][col] = { ...newBoard[i][col], isChecked: true };
        }
    }
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (newBoard[i][j].isPresent) {
            newBoard[i][j] = { ...newBoard[i][j], isAttacked: true };
            pos = false;
        } else {
            newBoard[i][j] = { ...newBoard[i][j], isChecked: true };
        }
    }
    for (let i = row, j = col; i < N && j >= 0; i++, j--) {
        if (newBoard[i][j].isPresent) {
            newBoard[i][j] = { ...newBoard[i][j], isAttacked: true };
            pos = false;
        } else {
            newBoard[i][j] = { ...newBoard[i][j], isChecked: true };
        }
    }
    for (let i = row, j = col; i < N && j < N; i++, j++) {
        if (newBoard[i][j].isPresent) {
            newBoard[i][j] = { ...newBoard[i][j], isAttacked: true };
            pos = false;
        } else {
            newBoard[i][j] = { ...newBoard[i][j], isChecked: true };
        }
    }
    for (let i = row, j = col; i >= 0 && j < N; i--, j++) {
        if (newBoard[i][j].isPresent) {
            newBoard[i][j] = { ...newBoard[i][j], isAttacked: true };
            pos = false;
        } else {
            newBoard[i][j] = { ...newBoard[i][j], isChecked: true };
        }
    }
    newBoard[row][col] = { ...newBoard[row][col], isPresent: true, isCurrent: true };
    return [newBoard, pos];
};

const getBoard = (N) => {
    const rows = [];
    for (let i = 0; i < N; i++) {
        const cols = [];
        for (let j = 0; j < N; j++) {
            cols.push(getCell(i, j));
        }
        rows.push(cols);
    }
    return rows;
};

const getCell = (row, col) => ({
    row,
    col,
    isPresent: false,
    isChecked: false,
    isAttacked: false,
    isCurrent: false,
});
