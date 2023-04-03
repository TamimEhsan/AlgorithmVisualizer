import React, {Component, Fragment} from 'react';
import Grid from "./grid";
import Navbar from "./navbar";
import Menu from "./menu";
import {dijkstra,getNodesInShortestPathOrder} from "../algorithms/dijkstra";
import {getMaze} from "../algorithms/recursiveMaze";
import {bfsdfs} from "../algorithms/bfs";
import {randomMaze} from "../algorithms/randomMaze";
import {aStar} from "../algorithms/Astar";

class Pathfinder extends Component {
    constructor() {
        super();
        this.state = {
            grid:[],
            mouseIsPressed:false,
            algorithms:[
                "Dijsktra","A star","BFS","DFS"
            ],
            algo:0,
            mazes:[
                "Recursive division","Random","Recursive Horizontal bias(NA)","Recursive Vertical bias(NA)"
            ],
            maze:0
        }
    }
    componentDidMount() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const row = Math.max(Math.floor(height/25)-7,10);
        const col = Math.floor(width/25);
        const startNode = {
            row:4,
            col:4
        };
        const endNode = {
            row: row-5,
            col: col-5
        }
        // console.log( endNode.row );
        const grid = getInitialGrid(row,col);
        grid[startNode.row][startNode.col].isStartNode = true;
        grid[row-5][col-5].isEndNode = true;
        this.setState({grid,row,col,startNode,endNode});
    }

    render() {
        return (
            <Fragment>
                <Navbar/>

                <Menu
                    onAlgoChanged = {this.handleAlgoChanged}
                    onVisualize = {this.handleClick}
                    algorithms={this.state.algorithms}
                    mazes={this.state.mazes}
                    onMazeChanged={this.handleMazeChanged}
                    onCreateMaze={this.handleCreateMaze}
                    onClearBoard={this.handleClearBoard}
                    onClearPath={this.handleClearPath}
                />
                <span style={{margin: 2}}/>
                <div style={{textAlign:"center"}} >
                    <Grid
                        grid={this.state.grid}
                        onMouseDown={this.handleMouseDown}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseUp={this.handleMouseUp}
                    />
                </div>
            </Fragment>
        );
    }

    handleMouseDown = (row, col) => {
        if((this.state.startNode.row!==row || this.state.startNode.col!==col) && (this.state.endNode.row!==row || this.state.endNode.col!==col) ){
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid:newGrid});
        }
        this.setState({mouseIsPressed: true});
    }

    handleMouseEnter = (row, col) => {
        if (this.state.mouseIsPressed === false) return;
        if((this.state.startNode.row!==row || this.state.startNode.col!==col) && (this.state.endNode.row!==row || this.state.endNode.col!==col) ){
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid:newGrid});
        }
    }

    handleMouseUp = (row,col) => {
        this.setState({mouseIsPressed: false});
    }

    handleAlgoChanged = (val) =>{
        this.setState({algo:val});
    }

    handleMazeChanged = (val)=>{
        this.setState({maze:val});
    }

    handleCreateMaze = () =>{
        let pairs;
        switch (this.state.maze){
            case 1:
                pairs= randomMaze(this.state.grid,this.state.row,this.state.col);
                break;
            default:
                pairs= getMaze(this.state.grid,this.state.row,this.state.col);
        }
        const {startNode,endNode} = this.state;
        for( let i = 0;i<pairs.length;i++ ){
            setTimeout(()=>{
                if( i === pairs.length-1 ){
                   // this.setState({grid:this.state.grid});
                    const grid = this.state.grid;
                    grid[ startNode.row ][startNode.col]={...grid[ startNode.row ][startNode.col],isWall: false};
                    grid[endNode.row][endNode.col]={...grid[endNode.row][endNode.col],isWall: false};
                    this.setState({grid});
                }
                if((pairs[i].xx!==startNode.row || pairs[i].yy!==startNode.col) && (pairs[i].xx!==endNode.row || pairs[i].yy!==endNode.col) ){
                    document.getElementById(`node-${pairs[i].xx}-${pairs[i].yy}`).className = "node node-wall";
                }
            },i*20);
        }
    }
    handleClearBoard = ()=>{
        const {grid,row,col} = this.state;
        this.setState({grid:clearBoard(grid,row,col)});
    }
    handleClearPath = () =>{
        const {grid,row,col} = this.state;
        this.setState({grid:clearPath(grid,row,col)});
    }
    handleClick = () =>{
      /*  for(let i = 0;i<20;i++){
            for(let j = 0; j<50;j++){
                document.getElementById(`node-${i}-${j}`).className = "node";
            }
        }*/
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
        const {grid} = this.state;
        const startNode = grid[this.state.startNode.row][this.state.startNode.col];
        const finishNode = grid[this.state.endNode.row][this.state.endNode.col];
        let visitedNodesInOrder;
        switch (this.state.algo){
            case 0:
                visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
                break;
            case 1:
                visitedNodesInOrder = aStar(grid, startNode, finishNode);
                break;
            case 2:
                visitedNodesInOrder = bfsdfs(grid, startNode, finishNode,"bfs");
                break;
            default:
                visitedNodesInOrder = bfsdfs(grid, startNode, finishNode,"dfs");
        }
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
    async animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {

            if (i === visitedNodesInOrder.length) {
              //  setTimeout(() => {
                    await sleep(100);
                    await this.animateShortestPath(nodesInShortestPathOrder);

              //  }, 10 * (i+10));
                return;
            }
           // setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const newGrid = toggleVisit(this.state.grid,node.row,node.col);
                //this.setState({grid:newGrid});
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
                await sleep(10);
           // }, 10 * i);
        }
    }

    async animateShortestPath(nodesInShortestPathOrder) {
        const grid = this.state.grid;
        const newGrid = grid.slice();
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
         //   setTimeout(() => {

                const node = nodesInShortestPathOrder[i];
                const newNode = {...newGrid[node.row][node.col],ispathNode:true};
                newGrid[node.row][node.col] = newNode;
                if( i === nodesInShortestPathOrder.length-1 ){
                    this.setState({grid:newGrid});
                }
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
                await sleep(50);
            //}, 50 * i);
        }
    }

}

const clearPath = (grid,row,col)=>{
    const newGrid = grid.slice();
    for(let i = 0;i < row ; i++){
        for( let j = 0;j < col; j++){
            const node = newGrid[i][j];
            const newNode = {
                ...node,
                distance:Infinity,
                visitedNode: false,
                isVisited:false,
                ispathNode:false,
                previousNode:null

            };
            newGrid[i][j] = newNode;
        }
    }
    return newGrid;
}
const clearBoard = (grid,row,col)=>{
    const newGrid = grid.slice();
    for(let i = 0;i < row ; i++){
        for( let j = 0;j < col; j++){
            const node = newGrid[i][j];
            const newNode = {
                ...node,
                isWall: false,
                distance:Infinity,
                visitedNode: false,
                isVisited:false,
                ispathNode:false,
                previousNode:null

            };
            newGrid[i][j] = newNode;
        }
    }
    return newGrid;
}

const toggleVisit = (grid,row,col) =>{
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        visitedNode: !node.visitedNode
    };
    newGrid[row][col] = newNode;
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
const getInitialGrid = (totRow,totCol) => {
    const grid = [];
    for (let row = 0; row < totRow; row++) {
        const currentRow = [];
        for (let col = 0; col < totCol; col++) {
            currentRow.push(createNode(row,col));
        }
        grid.push(currentRow);
    }
    return grid;
}

const createNode = (row,col)=>{
    return {
        row,
        col,
        isWall: false,
        isStartNode:false,
        isEndNode:false,
        distance:Infinity,
        visitedNode: false,
        isVisited:false,
        ispathNode:false,
        previousNode:null
    };
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Pathfinder;