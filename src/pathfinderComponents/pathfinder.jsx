import React, {Component, Fragment} from 'react';
import Grid from "./grid";
import Navbar from "./navbar";
import Menu from "./menu";
import {dijkstra,getNodesInShortestPathOrder} from "../algorithms/dijkstra";

class Pathfinder extends Component {
    constructor() {
        super();
        this.state = {
            grid:[],
            mouseIsPressed:false,
            algo:1
        }
    }
    componentDidMount() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const row = Math.max(Math.floor(height/25)-7,10);
        const col = Math.floor(width/25);
        const startNode = {
            row:5,
            col:5
        };
        const endNode = {
            row: row-5,
            col: col-5
        }
        console.log( endNode.row );
        const grid = getInitialGrid(row,col);
        grid[5][5].isStartNode = true;
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
                />
                <span style={{margin: 2}}/>
                <Grid

                    grid={this.state.grid}
                    onMouseDown={this.handleMouseDown}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseUp={this.handleMouseUp}
                />
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
        console.log("up mouse on",row,col);
        this.setState({mouseIsPressed: false});
    }

    handleAlgoChanged = (val) =>{
        console.log("Algo Selected ",val);
        this.setState({algo:val});
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
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {

            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                const newGrid = toggleVisit(this.state.grid,node.row,node.col);
                //this.setState({grid:newGrid});
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

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

export default Pathfinder;