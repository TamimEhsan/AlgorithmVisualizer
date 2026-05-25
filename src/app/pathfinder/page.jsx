"use client";
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import { aStar } from '@/lib/algorithms/Astar';
import { bfsdfs } from "@/lib/algorithms/bfs";
import { dijkstra, getNodesInShortestPathOrder } from "@/lib/algorithms/dijkstra";
import { randomMaze } from "@/lib/algorithms/randomMaze";
import { getMaze } from "@/lib/algorithms/recursiveMaze";
import Grid from "./grid";
import Menu from "./menu";

const algorithms = ["Dijsktra", "A star", "BFS", "DFS"];
const mazes = ["Recursive division", "Random", "Recursive Horizontal bias(NA)", "Recursive Vertical bias(NA)"];

export default function Pathfinder() {
    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [algo, setAlgo] = useState(0);
    const [maze, setMaze] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [dimensions, setDimensions] = useState({ row: 0, col: 0 });
    const [startNode, setStartNode] = useState({ row: 4, col: 4 });
    const [endNode, setEndNode] = useState({ row: 0, col: 0 });

    const gridRef = useRef(null);
    const isRunningRef = useRef(false);

    useEffect(() => { isRunningRef.current = isRunning; }, [isRunning]);

    useEffect(() => {
        const width = gridRef.current.offsetWidth;
        const height = gridRef.current.offsetHeight;
        const row = Math.max(Math.floor(height / 25) - 2, 10);
        const col = Math.floor(width / 25);
        const start = { row: 4, col: 4 };
        const end = { row: row - 5, col: col - 5 };
        const initialGrid = getInitialGrid(row, col);
        initialGrid[start.row][start.col].isStartNode = true;
        initialGrid[end.row][end.col].isEndNode = true;
        setGrid(initialGrid);
        setDimensions({ row, col });
        setStartNode(start);
        setEndNode(end);
    }, []);

    const handleMouseDown = (row, col) => {
        if ((startNode.row !== row || startNode.col !== col) && (endNode.row !== row || endNode.col !== col)) {
            setGrid(getNewGridWithWallToggled(grid, row, col));
        }
        setMouseIsPressed(true);
    };

    const handleMouseEnter = (row, col) => {
        if (!mouseIsPressed) return;
        if ((startNode.row !== row || startNode.col !== col) && (endNode.row !== row || endNode.col !== col)) {
            setGrid(getNewGridWithWallToggled(grid, row, col));
        }
    };

    const handleMouseUp = () => {
        setMouseIsPressed(false);
    };

    const handleCreateMaze = async () => {
        if (isRunningRef.current) return;
        setIsRunning(true);
        const { row, col } = dimensions;
        const gridCopy = getInitialGrid(row, col);
        let pairs;
        switch (maze) {
            case 1:
                pairs = randomMaze(gridCopy, row, col);
                break;
            default:
                pairs = getMaze(gridCopy, row, col);
        }
        const currentGrid = grid;
        for (let i = 0; i < pairs.length; i++) {
            const { xx, yy } = pairs[i];
            if ((xx !== startNode.row || yy !== startNode.col) && (xx !== endNode.row || yy !== endNode.col)) {
                currentGrid[xx][yy] = { ...currentGrid[xx][yy], isWall: true };
                setGrid([...currentGrid]);
            }
            await sleep(20);
        }
        currentGrid[startNode.row][startNode.col] = { ...currentGrid[startNode.row][startNode.col], isWall: false };
        currentGrid[endNode.row][endNode.col] = { ...currentGrid[endNode.row][endNode.col], isWall: false };
        setGrid([...currentGrid]);
        setIsRunning(false);
    };

    const handleClearBoard = () => {
        setGrid(clearBoard(grid, dimensions.row, dimensions.col));
    };

    const handleClearPath = () => {
        setGrid(clearPath(grid, dimensions.row, dimensions.col));
    };

    const handleClick = () => {
        if (isRunningRef.current) return;
        setIsRunning(true);
        visualizeDijkstra();
    };

    const visualizeDijkstra = () => {
        const gridCopy = grid.map(row => row.map(node => ({ ...node })));
        const start = gridCopy[startNode.row][startNode.col];
        const finish = gridCopy[endNode.row][endNode.col];
        let visitedNodesInOrder;
        switch (algo) {
            case 0:
                visitedNodesInOrder = dijkstra(gridCopy, start, finish);
                break;
            case 1:
                visitedNodesInOrder = aStar(gridCopy, start, finish);
                break;
            case 2:
                visitedNodesInOrder = bfsdfs(gridCopy, start, finish, "bfs");
                break;
            default:
                visitedNodesInOrder = bfsdfs(gridCopy, start, finish, "dfs");
        }
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
        animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    };

    const animateDijkstra = async (visitedNodesInOrder, nodesInShortestPathOrder) => {
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            const node = visitedNodesInOrder[i];
            const currentGrid = grid;
            currentGrid[node.row][node.col] = { ...currentGrid[node.row][node.col], isVisited: true };
            setGrid([...currentGrid]);
            await sleep(10);
        }
        await sleep(100);
        await animateShortestPath(nodesInShortestPathOrder);
    };

    const animateShortestPath = async (nodesInShortestPathOrder) => {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            const node = nodesInShortestPathOrder[i];
            const currentGrid = grid;
            currentGrid[node.row][node.col] = { ...currentGrid[node.row][node.col], ispathNode: true };
            setGrid([...currentGrid]);
            await sleep(50);
        }
        setIsRunning(false);
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    onAlgoChanged={setAlgo}
                    onVisualize={handleClick}
                    algorithms={algorithms}
                    mazes={mazes}
                    onMazeChanged={setMaze}
                    onCreateMaze={handleCreateMaze}
                    onClearBoard={handleClearBoard}
                    onClearPath={handleClearPath}
                    disabled={isRunning}
                />
                <span style={{ margin: 2 }} />
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

const clearPath = (grid, row, col) => {
    const newGrid = grid.slice();
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            newGrid[i][j] = {
                ...newGrid[i][j],
                distance: Infinity,
                visitedNode: false,
                isVisited: false,
                ispathNode: false,
                previousNode: null,
            };
        }
    }
    return newGrid;
};

const clearBoard = (grid, row, col) => {
    const newGrid = grid.slice();
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            newGrid[i][j] = {
                ...newGrid[i][j],
                isWall: false,
                distance: Infinity,
                visitedNode: false,
                isVisited: false,
                ispathNode: false,
                previousNode: null,
            };
        }
    }
    return newGrid;
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    newGrid[row][col] = { ...newGrid[row][col], isWall: true };
    return newGrid;
};

const getInitialGrid = (totRow, totCol) => {
    const grid = [];
    for (let row = 0; row < totRow; row++) {
        const currentRow = [];
        for (let col = 0; col < totCol; col++) {
            currentRow.push(createNode(row, col));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (row, col) => ({
    row,
    col,
    isWall: false,
    isStartNode: false,
    isEndNode: false,
    distance: Infinity,
    visitedNode: false,
    isVisited: false,
    ispathNode: false,
    previousNode: null,
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
