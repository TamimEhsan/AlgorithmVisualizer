"use client";
import Navbar from '@/components/navbar';
import { aStar } from '@/lib/algorithms/Astar';
import { bfsdfs } from "@/lib/algorithms/bfs";
import { dijkstra, getNodesInShortestPathOrder } from "@/lib/algorithms/dijkstra";
import { randomMaze } from "@/lib/algorithms/randomMaze";
import { getMaze } from "@/lib/algorithms/recursiveMaze";
import { Component, createRef } from 'react';
import Grid from "./grid";
import Menu from "./menu";

class Pathfinder extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            algorithms: [
                "Dijsktra", "A star", "BFS", "DFS"
            ],
            algo: 0,
            mazes: [
                "Recursive division", "Random", "Recursive Horizontal bias(NA)", "Recursive Vertical bias(NA)"
            ],
            maze: 0,
            isRunning: false
        }
        this.gridRef = createRef();
    }
    componentDidMount() {
        const width = this.gridRef.current.offsetWidth;
        const height = this.gridRef.current.offsetHeight;
        const row = Math.max(Math.floor(height / 25) - 2, 10);
        const col = Math.floor(width / 25);
        const startNode = {
            row: 4,
            col: 4
        };
        const endNode = {
            row: row - 5,
            col: col - 5
        }
        // console.log( endNode.row );
        const grid = getInitialGrid(row, col);
        grid[startNode.row][startNode.col].isStartNode = true;
        grid[row - 5][col - 5].isEndNode = true;
        this.setState({ grid, row, col, startNode, endNode });
    }

    render() {
        return (
            <div className="flex flex-col h-screen">

                <Navbar title="Pathfinder" />

                <div className="flex flex-1 overflow-hidden">
                    <Menu
                        onAlgoChanged={this.handleAlgoChanged}
                        onVisualize={this.handleClick}
                        algorithms={this.state.algorithms}
                        mazes={this.state.mazes}
                        onMazeChanged={this.handleMazeChanged}
                        onCreateMaze={this.handleCreateMaze}
                        onClearBoard={this.handleClearBoard}
                        onClearPath={this.handleClearPath}
                        disable={this.state.isRunning}
                    />
                    <span style={{ margin: 2 }} />
                    <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                        <div className="w-full h-full flex items-center justify-center" ref={this.gridRef}>
                            <Grid
                                grid={this.state.grid}
                                onMouseDown={this.handleMouseDown}
                                onMouseEnter={this.handleMouseEnter}
                                onMouseUp={this.handleMouseUp}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleMouseDown = (row, col) => {
        if ((this.state.startNode.row !== row || this.state.startNode.col !== col) && (this.state.endNode.row !== row || this.state.endNode.col !== col)) {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid });
        }
        this.setState({ mouseIsPressed: true });
    }

    handleMouseEnter = (row, col) => {
        if (this.state.mouseIsPressed === false) return;
        if ((this.state.startNode.row !== row || this.state.startNode.col !== col) && (this.state.endNode.row !== row || this.state.endNode.col !== col)) {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid });
        }
    }

    handleMouseUp = (row, col) => {
        this.setState({ mouseIsPressed: false });
    }

    handleAlgoChanged = (val) => {
        this.setState({ algo: val });
    }

    handleMazeChanged = (val) => {
        this.setState({ maze: val });
    }

    handleCreateMaze = async () => {
        if (this.state.isRunning) return;
        this.setState({ isRunning: true });
        const { row, col, startNode, endNode } = this.state;
        const gridCopy = getInitialGrid(row, col);
        let pairs;
        switch (this.state.maze) {
            case 1:
                pairs = randomMaze(gridCopy, row, col);
                break;
            default:
                pairs = getMaze(gridCopy, row, col);
        }
        const grid = this.state.grid;
        for (let i = 0; i < pairs.length; i++) {
            const { xx, yy } = pairs[i];
            if ((xx !== startNode.row || yy !== startNode.col) && (xx !== endNode.row || yy !== endNode.col)) {
                grid[xx][yy] = { ...grid[xx][yy], isWall: true };
                this.setState({ grid: [...grid] });
            }
            await sleep(20);
        }
        grid[startNode.row][startNode.col] = { ...grid[startNode.row][startNode.col], isWall: false };
        grid[endNode.row][endNode.col] = { ...grid[endNode.row][endNode.col], isWall: false };
        this.setState({ grid: [...grid], isRunning: false });
    }
    handleClearBoard = () => {
        const { grid, row, col } = this.state;
        this.setState({ grid: clearBoard(grid, row, col) });
    }
    handleClearPath = () => {
        const { grid, row, col } = this.state;
        this.setState({ grid: clearPath(grid, row, col) });
    }
    handleClick = () => {
        if (this.state.isRunning) return;
        this.setState({ isRunning: true });
        this.visualizeDijkstra();
        /*for(let i = 0;i<this.state.row;i++){
            for(let j = 0; j<this.state.col;j++){
                setTimeout(()=>{
                    const newGrid = toggleVisit(this.state.grid,i,j);
                    this.setState({grid:newGrid});
                    //document.getElementById(`node-${i}-${j}`).className = "node node-visited";
                },100*(i+j)+j);
            }
        }*/
    }

    visualizeDijkstra() {
        const { grid } = this.state;
        const gridCopy = grid.map(row => row.map(node => ({ ...node })));
        const startNode = gridCopy[this.state.startNode.row][this.state.startNode.col];
        const finishNode = gridCopy[this.state.endNode.row][this.state.endNode.col];
        let visitedNodesInOrder;
        switch (this.state.algo) {
            case 0:
                visitedNodesInOrder = dijkstra(gridCopy, startNode, finishNode);
                break;
            case 1:
                visitedNodesInOrder = aStar(gridCopy, startNode, finishNode);
                break;
            case 2:
                visitedNodesInOrder = bfsdfs(gridCopy, startNode, finishNode, "bfs");
                break;
            default:
                visitedNodesInOrder = bfsdfs(gridCopy, startNode, finishNode, "dfs");
        }
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
    async animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            const node = visitedNodesInOrder[i];
            const grid = this.state.grid;
            const newNode = { ...grid[node.row][node.col], isVisited: true };
            grid[node.row][node.col] = newNode;
            this.setState({ grid: [...grid] });
            await sleep(10);
        }
        await sleep(100);
        await this.animateShortestPath(nodesInShortestPathOrder);
    }

    async animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            const node = nodesInShortestPathOrder[i];
            const grid = this.state.grid;
            const newNode = { ...grid[node.row][node.col], ispathNode: true };
            grid[node.row][node.col] = newNode;
            this.setState({ grid: [...grid] });
            await sleep(50);
        }
        this.setState({ isRunning: false });
    }

}

const clearPath = (grid, row, col) => {
    const newGrid = grid.slice();
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const node = newGrid[i][j];
            const newNode = {
                ...node,
                distance: Infinity,
                visitedNode: false,
                isVisited: false,
                ispathNode: false,
                previousNode: null

            };
            newGrid[i][j] = newNode;
        }
    }
    return newGrid;
}
const clearBoard = (grid, row, col) => {
    const newGrid = grid.slice();
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const node = newGrid[i][j];
            const newNode = {
                ...node,
                isWall: false,
                distance: Infinity,
                visitedNode: false,
                isVisited: false,
                ispathNode: false,
                previousNode: null

            };
            newGrid[i][j] = newNode;
        }
    }
    return newGrid;
}

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: true//!node.isWall,
    };
    newGrid[row][col] = newNode;
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
}

const createNode = (row, col) => {
    return {
        row,
        col,
        isWall: false,
        isStartNode: false,
        isEndNode: false,
        distance: Infinity,
        visitedNode: false,
        isVisited: false,
        ispathNode: false,
        previousNode: null
    };
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Pathfinder;