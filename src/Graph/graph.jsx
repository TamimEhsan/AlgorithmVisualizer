import React, {Component} from 'react';
import CanvasSvg from "./canvasSVG";
import {getFibTree, getTree} from "./fib";
import Menu from "./menu";
import Navbar from "./navbar";

class Graph extends Component {
    constructor() {
        super();
        this.state = {
            root:undefined,
            vertices:[],
            edges:[],
            current:-1,
            n:0,
            algo:0
        }
    }
    // setNumber = (event)=>{
    //     let value = event.target.valueAsNumber;
    //     if(value!== NaN && value<99)
    //         this.setState({inputNumber:value});
    //
    //     // document
    // }
    setAlgo = (pos, val) => {
        if (pos === 0) {
            // console.log("sup 0");
            this.setState({algo: val});
        }
    }
    setN = (pos, val) => {
        if (pos === 0) {
            // console.log("sup 0");
            this.setState({n: val});
        }
    }
    addNumber = ()=>{
        // console.log(getFibTree(3));
        let tree = getTree(this.state.n,this.state.algo);
        this.setState({edges:[],vertices:[]});
        this.state.vertices = [];
        // this.setState({});
        this.recur(tree,undefined);

    }
    recur = async (node,parent)=>{

        let vertices = this.state.vertices;
        let current = this.state.vertices.length;

        if( node.children.length )
            vertices.push({val:0,x:node.x,y:node.y});
        else
            vertices.push({val:node.tree.node,x:node.x,y:node.y});
        this.setState({vertices,current});
        if( parent!==undefined ){
            let edges = this.state.edges;
            edges.push({
                x1:parent.x,
                y1:parent.y,
                x2:node.x,
                y2:node.y
            });
            this.setState({edges});
        }
        await sleep(500);


        for(let i=0;i<node.children.length;i++){
            await this.recur( node.children[i],node );
            let verticess = [...this.state.vertices];
            verticess[current].val+=node.children[i].tree.node;
            this.setState({current,vertices:verticess});
            await sleep(500);
        }
    }
    render() {
        return (
            <div>
                <Navbar/>
                <Menu
                    setN={this.setN}
                    setAlgo={this.setAlgo}
                    onStart={this.addNumber}
                />
                <CanvasSvg
                    vertices={this.state.vertices}
                    edges={this.state.edges}
                    current={this.state.current}
                />
            </div>
        );
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default Graph;