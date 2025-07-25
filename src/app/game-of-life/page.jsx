"use client";
import Navbar from '@/components/navbar';
import { createRef, useRef, useState, useEffect } from 'react';
import Menu from "./menu";
import Grid from "./grid";


export default function GameOfLifePage() {

    let gridRef = createRef();

    const [grid, setGrid] = useState([]);
    const [running, setRunning] = useState(false);
    const runningRef = useRef(false); // Add this ref


    useEffect(() => {
        const width = gridRef.current.offsetWidth;
        const height = gridRef.current.offsetHeight;
        const row = Math.max(Math.floor(height / 25) - 2, 10);
        const col = Math.floor(width / 25);
        setGrid(getInitialGrid(row, col));
    }, []);

    const handleMouseDown = (row, col) => {
        
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
        
        // this.setState({ mouseIsPressed: true });
    }

    const handleMouseEnter = (row, col) => {
        // if (this.state.mouseIsPressed === false) return;
        // if ((this.state.startNode.row !== row || this.state.startNode.col !== col) && (this.state.endNode.row !== row || this.state.endNode.col !== col)) {
        //     const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        //     this.setState({ grid: newGrid });
        // }
    }

    const handleMouseUp = (row, col) => {
        // this.setState({ mouseIsPressed: false });
    }

    const handleStart = () => {
        setRunning(true);
        runningRef.current = true; // Update ref

        gameOfLife();
    }

    const handleStop = () => {
        setRunning(false);
        runningRef.current = false;
        console.log("Simulation stopped");
    }

    const handleClearBoard = () => {
        setRunning(false);
        runningRef.current = false;
        const width = gridRef.current.offsetWidth;
        const height = gridRef.current.offsetHeight;
        const row = Math.max(Math.floor(height / 25) - 2, 10);
        const col = Math.floor(width / 25);
        setGrid(getInitialGrid(row, col));
    }

    const gameOfLife = async () => {
        let newGrid = getNextGeneration(grid);
        while (runningRef.current) {
            setGrid(newGrid);
            newGrid = getNextGeneration(newGrid);
            await sleep(200);
        }
    }

    return (
        <div className="flex flex-col h-screen">

            <Navbar title="Game of Life" />

            <div className="flex flex-1 overflow-hidden">
                <Menu
                    onStart={handleStart}
                    onStop={handleStop}
                    onClear={handleClearBoard}
                />

                <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                    <div className="w-full h-full flex items-center justify-center" ref={gridRef}>
                        <Grid
                            grid={grid}
                            onMouseDown={handleMouseDown}
                            onMouseEnter={handleMouseEnter}
                            onMouseUp={handleMouseUp}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const getInitialGrid = (row, col) => {
    let grid = [];
    for (let i = 0; i < row; i++) {
        let row = [];
        for (let j = 0; j < col; j++) {
            row.push(createNode(i, j));
        }
        grid.push(row);
    }
    return grid;
}

const createNode = (row, col) => {
    return {
        row,
        col,
        isAlive: false
    }
}

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    
    const newNode = {
        ...node,
        isAlive: !node.isAlive,
    };
    
    newGrid[row][col] = newNode;
    return newGrid;
};

const getNextGeneration = (grid) => {
    const newGrid = grid.slice();
    for (let i = 0; i < grid.length; i++) {
        newGrid[i] = grid[i].slice();
        for (let j = 0; j < grid[i].length; j++) {
            const node = grid[i][j];
            const aliveNeighbors = getAliveNeighbors(grid, node);
            
            if (node.isAlive && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
                newGrid[i][j] = {
                    ...node,
                    isAlive: false
                }
            }
            if (!node.isAlive && aliveNeighbors === 3) {
                newGrid[i][j] = {
                    ...node,
                    isAlive: true
                }
            }
        }
    }
    return newGrid;
}

const getAliveNeighbors = (grid, node) => {
    
    const { row, col } = node;
    const dirx = [-1, 1, 0, 0, -1, -1, 1, 1];
    const diry = [0, 0, -1, 1, -1, 1, -1, 1];
    let count = 0;
    for (let i = 0; i < 8; i++) {
        const newRow = row + dirx[i];
        const newCol = col + diry[i];
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && grid[newRow][newCol].isAlive) {
            count++;
        }
    }

    return count;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}