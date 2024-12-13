"use client";

import Navbar from '@/components/navbar';
import { Component } from 'react';
import CanvasSvg from "./canvasSVG";
import { getTree } from "./fib";
import Menu from "./menu";

class Graph extends Component {
    constructor() {
        super();
        this.state = {
            root: undefined,
            vertices: [],
            edges: [],
            current: -1,
            n: 0,
            r: 2,
            algo: 0,
            offset: 0
        }
    }
    // setNumber = (event)=>{
    //     let value = event.target.valueAsNumber;
    //     if(value!== NaN && value<99)
    //         this.setState({inputNumber:value});
    //
    //     // document
    // }
    setAlgo = (val) => {
        this.setState({ algo: val });
    }
    setN = (val) => {
        this.setState({ n: val });
    }
    setR = (val) => {
        this.setState({ r: val });
    }
    addNumber = () => {

        let tree = getTree(this.state.n, this.state.algo, this.state.r);
        this.setState({ edges: [], vertices: [], offset: tree.x });
        this.state.vertices = [];
        // this.setState({});
        this.recur(tree, undefined);

    }
    recur = async (node, parent) => {

        let vertices = this.state.vertices;
        let current = this.state.vertices.length;


        if (parent !== undefined) {
            if (node.children.length)
                vertices.push({ label: node.tree.label, val: 0, x: node.x, y: node.y, px: parent.x, py: parent.y });
            else
                vertices.push({ label: node.tree.label, val: node.tree.node, x: node.x, y: node.y, px: parent.x, py: parent.y });
            this.setState({ vertices, current });



            let edges = this.state.edges;
            edges.push({
                x1: parent.x,
                y1: parent.y,
                x2: node.x,
                y2: node.y
            });
            this.setState({ edges });
        } else {
            if (node.children.length)
                vertices.push({ label: node.tree.label, val: 0, x: node.x, y: node.y, px: node.x, py: node.y });
            else
                vertices.push({ label: node.tree.label, val: node.tree.node, x: node.x, y: node.y, px: node.x, py: node.y });
            this.setState({ vertices, current });
        }
        await sleep(500);


        for (let i = 0; i < node.children.length; i++) {
            await this.recur(node.children[i], node);
            // let verticess = [...this.state.vertices];
            // verticess[current].val+=node.children[i].tree.node;
            this.setState({ current });
            await sleep(500);
        }
        let verticess = [...this.state.vertices];
        verticess[current].val = node.tree.node;
        this.setState({ vertices: verticess });
    }
    render() {
        return (
            <div className="flex flex-col h-screen">

                <Navbar title="Recursion Tree" />
                <div className="flex flex-1 overflow-hidden">

                    <Menu
                        setN={this.setN}
                        setR={this.setR}
                        setAlgo={this.setAlgo}
                        onStart={this.addNumber}
                    />

                    <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                        <div className="w-full h-full ">
                            <CanvasSvg
                                vertices={this.state.vertices}
                                edges={this.state.edges}
                                current={this.state.current}
                                offset={this.state.offset}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default Graph;