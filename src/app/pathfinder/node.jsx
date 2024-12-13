import React, {Component} from 'react';
import './node.css'
class Node extends Component {
    static = {
        row: this.props.row,
        col: this.props.col
    }
    render() {
        const { row,col,isVisited, onMouseDown, onMouseEnter,onMouseUp } = this.props;
        return (
            <div
                id = {`node-${this.props.row}-${this.props.col}`}
                className={this.getClassName()}
                onMouseDown={() => onMouseDown(row,col)}
                onMouseEnter={() => onMouseEnter(row,col)}
                onMouseUp={() => onMouseUp(row,col)}
            />
        );
    }
    getClassName(){
        if(this.props.node.isWall === true){
            return "node node-wall";
        } else if( this.props.node.isStartNode === true ){
            return "node  node-start";
        } else if( this.props.node.isEndNode === true ){
            return "node  node-end";
        } else if(this.props.node.ispathNode){
            return 'node node-shortest-path';
        }else if( this.props.node.isVisited === true ){
            return "node  node-visited";
        } else{
            return "node";
        }
    }
}

export default Node;