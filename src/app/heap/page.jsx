"use client";

import Navbar from '@/components/navbar';
import { Component } from 'react';
import CanvasSvg from "./canvasSVG";
import { Heap } from "@/lib/heap/Heap";
import Menu from "./menu";

class HeapVisualization extends Component {
    constructor() {
        super();
        this.state = {
            heap: new Heap(true), // true for max heap
            vertices: [],
            edges: [],
            current: -1,
            isMaxHeap: true,
            inputValue: 0,
            offset: 0,
            animating: false
        }
    }

    setHeapType = (isMaxHeap) => {
        this.setState({ 
            heap: new Heap(isMaxHeap),
            isMaxHeap,
            vertices: [],
            edges: [],
            offset: 0
        });
    }

    setInputValue = (value) => {
        this.setState({ inputValue: value });
    }

    pushValue = async () => {
        if (this.state.animating) return;
        
        this.setState({ animating: true });
        const heap = this.state.heap;
        heap.push(this.state.inputValue);
        
        await this.updateVisualization();
        this.setState({ animating: false });
    }

    popValue = async () => {
        if (this.state.animating || this.state.heap.heap.length === 0) return;
        
        this.setState({ animating: true });
        const heap = this.state.heap;
        heap.pop();
        
        await this.updateVisualization();
        this.setState({ animating: false });
    }

    reset = () => {
        this.setState({
            heap: new Heap(this.state.isMaxHeap),
            vertices: [],
            edges: [],
            offset: 0,
            current: -1
        });
    }

    updateVisualization = async () => {
        const tree = this.state.heap.getVisualizationTree();
        
        if (!tree) {
            this.setState({ vertices: [], edges: [], offset: 0 });
            return;
        }

        this.setState({ 
            edges: [], 
            vertices: [], 
            offset: tree.x 
        });
        
        await this.buildVisualization(tree, undefined);
    }

    buildVisualization = async (node, parent) => {
        let vertices = this.state.vertices;
        let current = vertices.length;

        const vertexData = {
            label: node.tree.label,
            val: node.tree.node,
            x: node.x,
            y: node.y,
            px: parent ? parent.x : node.x,
            py: parent ? parent.y : node.y
        };

        vertices.push(vertexData);
        this.setState({ vertices: [...vertices], current });

        if (parent) {
            let edges = this.state.edges;
            edges.push({
                x1: parent.x,
                y1: parent.y,
                x2: node.x,
                y2: node.y
            });
            this.setState({ edges: [...edges] });
        }

        await sleep(300);

        for (let i = 0; i < node.children.length; i++) {
            await this.buildVisualization(node.children[i], node);
        }
    }

    render() {
        return (
            <div className="flex flex-col h-screen">
                <Navbar title="Heap Visualization" />
                <div className="flex flex-1 overflow-hidden">
                    <Menu
                        isMaxHeap={this.state.isMaxHeap}
                        inputValue={this.state.inputValue}
                        heapSize={this.state.heap.heap.length}
                        setHeapType={this.setHeapType}
                        setInputValue={this.setInputValue}
                        onPush={this.pushValue}
                        onPop={this.popValue}
                        onReset={this.reset}
                        disable={this.state.animating}
                    />

                    <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                        <div className="w-full h-full">
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

export default HeapVisualization;
