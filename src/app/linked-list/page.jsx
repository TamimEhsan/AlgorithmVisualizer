"use client";

import { useState, useRef } from 'react';
import Navbar from '@/components/navbar';
import {
    buildList,
    linkify,
    randomValues,
    reduceStructure,
    insertActions,
    deleteByValueActions,
    deleteByIndexActions,
    searchActions,
    reverseActions,
} from '@/lib/algorithms/linkedList';
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
    const [liftedId, setLiftedId] = useState(null);
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
    const applyStructure = ({ nodes: n, nextOf: nx, prevOf: pv }) => {
        nodesRef.current = n; setNodes(n);
        nextOfRef.current = nx; setNextOf(nx);
        prevOfRef.current = pv; setPrevOf(pv);
    };
    const relink = (arr) => applyStructure({ nodes: arr, ...linkify(arr) });

    // Apply one action: visual actions touch marks/pointers; everything else is
    // a structural change handled by the lib reducer.
    const applyAction = (action) => {
        switch (action.type) {
            case 'mark':
                setNodeState((s) => ({ ...s, [action.id]: action.state }));
                break;
            case 'pointers':
                setPointers(action.items);
                break;
            case 'lift':
                setLiftedId(action.id);
                break;
            case 'drop':
                setLiftedId(null);
                break;
            case 'clear':
                setNodeState({});
                setPointers([]);
                setLiftedId(null);
                break;
            default:
                if (action.type === 'stageNode') setLiftedId(action.id);
                applyStructure(reduceStructure(
                    { nodes: nodesRef.current, nextOf: nextOfRef.current, prevOf: prevOfRef.current },
                    action,
                ));
        }
    };

    const runActions = async (actions) => {
        if (!actions.length || isRunningRef.current) return;
        isRunningRef.current = true;
        setIsRunning(true);
        setNodeState({});
        setPointers([]);
        setLiftedId(null);
        for (const action of actions) {
            applyAction(action);
            await sleep(speedRef.current);
        }
        isRunningRef.current = false;
        setIsRunning(false);
    };

    const handleVisualize = () => {
        const op = operationRef.current;
        const list = {
            nodes: nodesRef.current,
            nextOf: nextOfRef.current,
            prevOf: prevOfRef.current,
            listType: listTypeRef.current,
        };
        const value = Number(valueRef.current);
        let actions = [];
        if (op === 0) actions = insertActions(list, 'head', value);
        else if (op === 1) actions = insertActions(list, 'tail', value);
        else if (op === 2) actions = insertActions(list, indexRef.current, value);
        else if (op === 3) actions = deleteByValueActions(list, value);
        else if (op === 4) actions = deleteByIndexActions(list, indexRef.current);
        else if (op === 5) actions = searchActions(list, value);
        else if (op === 6) actions = reverseActions(list);
        runActions(actions);
    };

    const handleRandomize = () => {
        if (isRunningRef.current) return;
        setNodeState({});
        setPointers([]);
        setLiftedId(null);
        relink(buildList(randomValues(5)).nodes);
    };

    const handleReset = () => {
        if (isRunningRef.current) return;
        setNodeState({});
        setPointers([]);
        setLiftedId(null);
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
                            liftedId={liftedId}
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
