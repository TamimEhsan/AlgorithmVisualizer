"use client";

import { useEffect, useRef, useState } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
    Controls,
    MarkerType,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from '@/components/navbar';
import {
    PRESETS,
    toFlow,
    adjacency,
    bfsActions,
    dfsActions,
    newNodeId,
    edgeId,
} from '@/lib/algorithms/graph';
import GraphNode from './graph-node';
import FloatingEdge from './floating-edge';
import Menu from './menu';

const nodeTypes = { graphNode: GraphNode };
const edgeTypes = { floating: FloatingEdge };
const ARROW = { type: MarkerType.ArrowClosed, color: '#64748b', width: 16, height: 16 };

const toDelay = (s) => 1100 - s * 10;

function initialGraph(presetIndex = 0) {
    const { nodes, edges } = toFlow(PRESETS[presetIndex]);
    if (nodes[0]) nodes[0] = { ...nodes[0], data: { ...nodes[0].data, role: 'start' } };
    return { nodes, edges, startId: nodes[0]?.id ?? null };
}

const MODE_HINT = {
    idle: 'Click a node to select · N add node · E add edge',
    'add-node': 'Add node — click anywhere on the canvas',
    'add-edge': 'Add edge — click two nodes',
};

function GraphInner() {
    const [initial] = useState(() => initialGraph(0));
    const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
    const [directed, setDirected] = useState(false);
    const [mode, setMode] = useState('idle');
    const [isRunning, setIsRunning] = useState(false);

    const { screenToFlowPosition } = useReactFlow();

    // refs read inside async loop / global key handler
    const nodesRef = useRef(initial.nodes);
    const edgesRef = useRef(initial.edges);
    const isRunningRef = useRef(false);
    const speedRef = useRef(toDelay(50));
    const modeRef = useRef('idle');
    const pendingEdgeRef = useRef(null);
    const directedRef = useRef(false);
    const algorithmRef = useRef(0);
    const startIdRef = useRef(initial.startId);
    const finishIdRef = useRef(null);
    const labelRef = useRef(0); // monotonic label counter for user-added nodes

    useEffect(() => { nodesRef.current = nodes; }, [nodes]);
    useEffect(() => { edgesRef.current = edges; }, [edges]);
    const setModeBoth = (m) => { modeRef.current = m; setMode(m); };

    // --- visual action appliers ---
    const markNode = (id, state) =>
        setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, state } } : n)));
    const markEdge = (id, state, to) =>
        setEdges((es) => es.map((e) => (e.id === id ? { ...e, data: { ...e.data, state, travelTo: to ?? null } } : e)));
    const clearMarks = () => {
        setNodes((ns) => ns.map((n) => ({ ...n, data: { ...n.data, state: 'normal' } })));
        setEdges((es) => es.map((e) => ({ ...e, data: { ...e.data, state: 'normal', travelTo: null } })));
    };

    const applyAction = (action) => {
        if (action.type === 'markNode') markNode(action.id, action.state);
        else if (action.type === 'markEdge') markEdge(action.id, action.state, action.to);
        else if (action.type === 'clear') clearMarks();
    };

    const runActions = async (actions) => {
        if (!actions.length || isRunningRef.current) return;
        isRunningRef.current = true;
        setIsRunning(true);
        clearMarks();
        for (const action of actions) {
            applyAction(action);
            await sleep(speedRef.current);
        }
        isRunningRef.current = false;
        setIsRunning(false);
    };

    const handleVisualize = () => {
        const adj = adjacency(edgesRef.current, directedRef.current);
        const planner = algorithmRef.current === 1 ? dfsActions : bfsActions;
        runActions(planner(adj, startIdRef.current, finishIdRef.current));
    };

    // --- editing ---
    const addNodeAt = (position) => {
        // Compute id/label outside the updater: both have side effects and the
        // updater can run twice under React strict mode.
        const id = newNodeId();
        labelRef.current += 1;
        const label = String(labelRef.current);
        setNodes((ns) => [
            ...ns,
            { id, type: 'graphNode', position, data: { label, state: 'normal', role: null } },
        ]);
    };

    const addEdge = (a, b) => {
        if (a === b) return;
        const exists = edgesRef.current.some(
            (e) =>
                (e.source === a && e.target === b) ||
                (!directedRef.current && e.source === b && e.target === a),
        );
        if (exists) return;
        setEdges((es) => [
            ...es,
            {
                id: edgeId(a, b),
                source: a,
                target: b,
                type: 'floating',
                data: { state: 'normal' },
                markerEnd: directedRef.current ? ARROW : undefined,
            },
        ]);
    };

    const setRole = (id, role) => {
        if (role === 'start') { startIdRef.current = id; if (finishIdRef.current === id) finishIdRef.current = null; }
        if (role === 'finish') { finishIdRef.current = id; if (startIdRef.current === id) startIdRef.current = null; }
        setNodes((ns) =>
            ns.map((n) => {
                if (n.id === id) return { ...n, data: { ...n.data, role } };
                if (n.data.role === role) return { ...n, data: { ...n.data, role: null } };
                return n;
            }),
        );
    };

    const onPaneClick = (event) => {
        if (isRunningRef.current) return;
        if (modeRef.current === 'add-node') {
            addNodeAt(screenToFlowPosition({ x: event.clientX, y: event.clientY }));
            setModeBoth('idle');
        }
        pendingEdgeRef.current = null;
    };

    const onNodeClick = (_event, node) => {
        if (isRunningRef.current) return;
        if (modeRef.current === 'add-edge') {
            if (pendingEdgeRef.current == null) {
                pendingEdgeRef.current = node.id;
            } else {
                addEdge(pendingEdgeRef.current, node.id);
                pendingEdgeRef.current = null;
                setModeBoth('idle');
            }
        }
    };

    const onNodesDelete = (deleted) => {
        for (const n of deleted) {
            if (n.id === startIdRef.current) startIdRef.current = null;
            if (n.id === finishIdRef.current) finishIdRef.current = null;
        }
    };

    // global keyboard shortcuts
    useEffect(() => {
        const onKey = (e) => {
            if (isRunningRef.current) return;
            const el = e.target;
            if (el && el.closest && el.closest('input,select,textarea,[role="combobox"],button')) return;

            const selected = nodesRef.current.find((n) => n.selected);
            const k = e.key.toLowerCase();
            if (k === 'n') { setModeBoth('add-node'); pendingEdgeRef.current = null; }
            else if (k === 'e') { setModeBoth('add-edge'); pendingEdgeRef.current = null; }
            else if (k === 's' && selected) setRole(selected.id, 'start');
            else if (k === 'f' && selected) setRole(selected.id, 'finish');
            else if (e.key === 'Escape') { setModeBoth('idle'); pendingEdgeRef.current = null; }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- menu callbacks ---
    const onDirectedChange = (val) => {
        directedRef.current = val;
        setDirected(val);
        setEdges((es) => es.map((e) => ({ ...e, markerEnd: val ? ARROW : undefined })));
    };
    const onPresetChange = (idx) => {
        const g = initialGraph(idx);
        nodesRef.current = g.nodes; edgesRef.current = g.edges;
        startIdRef.current = g.startId; finishIdRef.current = null;
        labelRef.current = 0;
        setNodes(g.nodes); setEdges(g.edges);
        setModeBoth('idle'); pendingEdgeRef.current = null;
    };
    const onClear = () => {
        if (isRunningRef.current) return;
        nodesRef.current = []; edgesRef.current = [];
        startIdRef.current = null; finishIdRef.current = null;
        labelRef.current = 0;
        setNodes([]); setEdges([]);
        setModeBoth('idle'); pendingEdgeRef.current = null;
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Menu
                    disabled={isRunning}
                    onDirectedChange={onDirectedChange}
                    onAlgorithmChange={(a) => { algorithmRef.current = a; }}
                    onPresetChange={onPresetChange}
                    onSpeedChange={(s) => { speedRef.current = toDelay(s); }}
                    onVisualize={handleVisualize}
                    onClear={onClear}
                />
                <div className="relative flex-1">
                    <div className="absolute top-3 left-3 z-10 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow">
                        {MODE_HINT[mode]}
                    </div>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodesDelete={onNodesDelete}
                        onPaneClick={onPaneClick}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        nodesConnectable={false}
                        fitView
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}

export default function Graph() {
    return (
        <ReactFlowProvider>
            <GraphInner />
        </ReactFlowProvider>
    );
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
