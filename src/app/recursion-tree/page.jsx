"use client";

import { useState, useRef } from 'react';
import Navbar from '@/components/navbar';
import CanvasSvg from "./canvasSVG";
import { getTree } from "./fib";
import Menu from "./menu";

export default function Graph() {
    const [vertices, setVertices] = useState([]);
    const [edges, setEdges] = useState([]);
    const [current, setCurrent] = useState(-1);
    const [n, setN] = useState(0);
    const [r, setR] = useState(2);
    const [algo, setAlgo] = useState(0);
    const [offset, setOffset] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const verticesRef = useRef([]);
    const edgesRef = useRef([]);
    const isRunningRef = useRef(false);

    const addNumber = async () => {
        if (isRunningRef.current) return;
        setIsRunning(true);
        isRunningRef.current = true;

        let tree = getTree(n, algo, r);
        setEdges([]);
        setVertices([]);
        setOffset(tree.x);
        verticesRef.current = [];
        edgesRef.current = [];
        await recur(tree, undefined);
        setIsRunning(false);
        isRunningRef.current = false;
    };

    const recur = async (node, parent) => {
        let verts = verticesRef.current;
        let currentIdx = verts.length;

        let newVertex;
        if (parent !== undefined) {
            newVertex = node.children.length
                ? { label: node.tree.label, val: 0, x: node.x, y: node.y, px: parent.x, py: parent.y, completed: false }
                : { label: node.tree.label, val: node.tree.node, x: node.x, y: node.y, px: parent.x, py: parent.y, completed: false };

            verts = [...verts, newVertex];
            verticesRef.current = verts;
            setVertices([...verts]);
            setCurrent(currentIdx);

            let newEdge = { x1: parent.x, y1: parent.y, x2: node.x, y2: node.y };
            edgesRef.current = [...edgesRef.current, newEdge];
            setEdges([...edgesRef.current]);
        } else {
            newVertex = node.children.length
                ? { label: node.tree.label, val: 0, x: node.x, y: node.y, px: node.x, py: node.y, completed: false }
                : { label: node.tree.label, val: node.tree.node, x: node.x, y: node.y, px: node.x, py: node.y, completed: false };

            verts = [...verts, newVertex];
            verticesRef.current = verts;
            setVertices([...verts]);
            setCurrent(currentIdx);
        }
        await sleep(500);

        for (let i = 0; i < node.children.length; i++) {
            await recur(node.children[i], node);
            setCurrent(currentIdx);
            await sleep(500);
        }

        let updatedVerts = [...verticesRef.current];
        updatedVerts[currentIdx] = { ...updatedVerts[currentIdx], val: node.tree.node, completed: true };
        verticesRef.current = updatedVerts;
        setVertices([...updatedVerts]);
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    setN={setN}
                    setR={setR}
                    setAlgo={setAlgo}
                    onStart={addNumber}
                    disabled={isRunning}
                />
                <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                    <div className="w-full h-full">
                        <CanvasSvg
                            vertices={vertices}
                            edges={edges}
                            current={current}
                            offset={offset}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
