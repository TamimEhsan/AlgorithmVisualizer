"use client";

import { useState, useRef } from 'react';
import Navbar from '@/components/navbar';
import { buildList, linkify, makeNode, randomValues } from '@/lib/algorithms/linkedList';
import Canvas from './canvas';
import Menu from './menu';

// Slider (10..100, higher = faster) -> per-step delay in ms.
const toDelay = (s) => 1100 - s * 10;

export default function LinkedList() {
    // Deterministic seed so server-rendered (static export) and client markup
    // match; randomness is applied only via the Random button after mount.
    const [initial] = useState(() => buildList([10, 24, 37, 42, 58]));

    const [nodes, setNodes] = useState(initial.nodes);
    const [nextOf, setNextOf] = useState(initial.nextOf);
    const [prevOf, setPrevOf] = useState(initial.prevOf);
    const [listType, setListType] = useState(0);
    const [nodeState, setNodeState] = useState({});
    const [pointers, setPointers] = useState([]);
    const [isRunning, setIsRunning] = useState(false);

    const nodesRef = useRef(initial.nodes);
    const nextOfRef = useRef(initial.nextOf);
    const prevOfRef = useRef(initial.prevOf);
    const listTypeRef = useRef(0);
    const isRunningRef = useRef(false);
    const speedRef = useRef(toDelay(50));
    const operationRef = useRef(0);
    const valueRef = useRef('42');
    const indexRef = useRef('1');

    // --- state appliers (keep refs and React state in sync) ---
    const applyNodes = (arr) => { nodesRef.current = arr; setNodes(arr); };
    const applyLinks = (nx, pv) => {
        nextOfRef.current = nx; setNextOf(nx);
        prevOfRef.current = pv; setPrevOf(pv);
    };
    const relink = (arr) => {
        const { nextOf: nx, prevOf: pv } = linkify(arr);
        applyNodes(arr);
        applyLinks(nx, pv);
    };
    const mark = (id, kind) => setNodeState((s) => ({ ...s, [id]: kind }));
    const clearMarks = () => { setNodeState({}); setPointers([]); };

    const begin = () => {
        if (isRunningRef.current) return false;
        isRunningRef.current = true;
        setIsRunning(true);
        clearMarks();
        return true;
    };
    const finish = () => { isRunningRef.current = false; setIsRunning(false); };

    // --- operations ---
    const runInsert = async (pos) => {
        if (!begin()) return;
        const arr = [...nodesRef.current];
        const idx = pos === 'head' ? 0
            : pos === 'tail' ? arr.length
                : Math.max(0, Math.min(Number(pos) || 0, arr.length));
        const value = Number(valueRef.current);

        for (let i = 0; i < idx; i++) {
            mark(arr[i].id, 'active');
            await sleep(speedRef.current);
            mark(arr[i].id, 'done');
        }
        const node = makeNode(Number.isFinite(value) ? value : 0);
        arr.splice(idx, 0, node);
        relink(arr);
        mark(node.id, 'found');
        await sleep(speedRef.current);
        clearMarks();
        finish();
    };

    const runDeleteValue = async (value) => {
        if (!begin()) return;
        const arr = [...nodesRef.current];
        let idx = -1;
        for (let i = 0; i < arr.length; i++) {
            mark(arr[i].id, 'active');
            await sleep(speedRef.current);
            if (arr[i].value === value) { idx = i; break; }
            mark(arr[i].id, 'done');
        }
        if (idx >= 0) {
            mark(arr[idx].id, 'remove');
            await sleep(speedRef.current);
            arr.splice(idx, 1);
            relink(arr);
            await sleep(speedRef.current);
        }
        clearMarks();
        finish();
    };

    const runDeleteIndex = async (index) => {
        if (!begin()) return;
        const arr = [...nodesRef.current];
        const idx = Number(index);
        if (idx >= 0 && idx < arr.length) {
            for (let i = 0; i < idx; i++) {
                mark(arr[i].id, 'active');
                await sleep(speedRef.current);
                mark(arr[i].id, 'done');
            }
            mark(arr[idx].id, 'remove');
            await sleep(speedRef.current);
            arr.splice(idx, 1);
            relink(arr);
            await sleep(speedRef.current);
        }
        clearMarks();
        finish();
    };

    const runSearch = async (value) => {
        if (!begin()) return;
        const arr = [...nodesRef.current];
        let found = false;
        for (let i = 0; i < arr.length; i++) {
            mark(arr[i].id, 'active');
            await sleep(speedRef.current);
            if (arr[i].value === value) { mark(arr[i].id, 'found'); found = true; break; }
            mark(arr[i].id, 'done');
        }
        await sleep(speedRef.current);
        if (found) await sleep(speedRef.current);
        clearMarks();
        finish();
    };

    const runReverse = async () => {
        if (!begin()) return;
        const arr = [...nodesRef.current];
        if (arr.length < 2) { finish(); return; }

        const temp = { ...linkify(arr).nextOf };
        let prev = null;
        for (let i = 0; i < arr.length; i++) {
            const curr = arr[i].id;
            const next = i + 1 < arr.length ? arr[i + 1].id : null;
            setPointers([
                ...(prev != null ? [{ label: 'prev', nodeId: prev }] : []),
                { label: 'curr', nodeId: curr },
                ...(next != null ? [{ label: 'next', nodeId: next }] : []),
            ]);
            mark(curr, 'active');
            await sleep(speedRef.current);
            temp[curr] = prev;
            applyLinks({ ...temp }, prevOfRef.current);
            await sleep(speedRef.current);
            mark(curr, 'done');
            prev = curr;
        }
        // settle: physical order mirrors logical, forward links restored
        const reversed = [...arr].reverse();
        relink(reversed);
        setPointers([]);
        await sleep(speedRef.current);
        clearMarks();
        finish();
    };

    const handleVisualize = () => {
        const op = operationRef.current;
        if (op === 0) runInsert('head');
        else if (op === 1) runInsert('tail');
        else if (op === 2) runInsert(indexRef.current);
        else if (op === 3) runDeleteValue(Number(valueRef.current));
        else if (op === 4) runDeleteIndex(indexRef.current);
        else if (op === 5) runSearch(Number(valueRef.current));
        else if (op === 6) runReverse();
    };

    const handleRandomize = () => {
        if (isRunningRef.current) return;
        clearMarks();
        relink(buildList(randomValues(5)).nodes);
    };

    const handleReset = () => {
        if (isRunningRef.current) return;
        clearMarks();
        relink(nodesRef.current.map((n) => ({ ...n })));
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    disabled={isRunning}
                    onListTypeChange={(t) => { listTypeRef.current = t; setListType(t); }}
                    onOperationChange={(op) => { operationRef.current = op; }}
                    onValueChange={(v) => { valueRef.current = v; }}
                    onIndexChange={(v) => { indexRef.current = v; }}
                    onSpeedChange={(s) => { speedRef.current = toDelay(s); }}
                    onVisualize={handleVisualize}
                    onRandomize={handleRandomize}
                    onReset={handleReset}
                />
                <div className="flex flex-1 flex-col items-center justify-center overflow-auto p-6">
                    <div className="w-full max-w-5xl">
                        <Canvas
                            nodes={nodes}
                            nextOf={nextOf}
                            prevOf={prevOf}
                            listType={listType}
                            nodeState={nodeState}
                            pointers={pointers}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
