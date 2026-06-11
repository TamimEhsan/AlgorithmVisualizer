import { useEffect, useRef, useState } from 'react';
import { MarkerType, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import { newNodeId, edgeId, toFlow } from '@/lib/algorithms/graph';

// Reusable graph editor + action-log executor for the graph visualizers.
// Owns all editing (keyboard add/delete, set start/finish, drag, directed
// toggle, presets, clear) and the executor (run/applyAction). It is
// algorithm-agnostic: callers build an action list and hand it to `run`.
//
// Must be used inside <ReactFlowProvider> (uses useReactFlow).

const ARROW = { type: MarkerType.ArrowClosed, color: '#64748b', width: 16, height: 16 };
const toDelay = (s) => 1100 - s * 10;

// preset -> { nodes, edges, startId } with the first node marked as start
function seed(preset) {
    const { nodes, edges } = toFlow(preset);
    if (nodes[0]) nodes[0] = { ...nodes[0], data: { ...nodes[0].data, role: 'start' } };
    return { nodes, edges, startId: nodes[0]?.id ?? null };
}

export function useGraphEditor({ weighted = false, initialPreset }) {
    const [initial] = useState(() => seed(initialPreset));
    const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
    const [directed, setDirectedState] = useState(false);
    const [mode, setMode] = useState('idle');
    const [status, setStatus] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const { screenToFlowPosition } = useReactFlow();

    const nodesRef = useRef(initial.nodes);
    const edgesRef = useRef(initial.edges);
    const isRunningRef = useRef(false);
    const speedRef = useRef(toDelay(50));
    const modeRef = useRef('idle');
    const pendingEdgeRef = useRef(null);
    const directedRef = useRef(false);
    const startIdRef = useRef(initial.startId);
    const finishIdRef = useRef(null);
    const labelRef = useRef(0);

    useEffect(() => { nodesRef.current = nodes; }, [nodes]);
    useEffect(() => { edgesRef.current = edges; }, [edges]);
    const setModeBoth = (m) => { modeRef.current = m; setMode(m); };

    // --- action appliers ---
    const markNode = (id, state) =>
        setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, state } } : n)));
    const markEdge = (id, state, to) =>
        setEdges((es) => es.map((e) => (e.id === id ? { ...e, data: { ...e.data, state, travelTo: to ?? null } } : e)));
    const setDist = (id, dist) =>
        setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, dist } } : n)));
    const clearMarks = () => {
        setNodes((ns) => ns.map((n) => ({ ...n, data: { ...n.data, state: 'normal', dist: undefined } })));
        setEdges((es) => es.map((e) => ({ ...e, data: { ...e.data, state: 'normal', travelTo: null } })));
        setStatus('');
    };

    const applyAction = (action) => {
        if (action.type === 'markNode') markNode(action.id, action.state);
        else if (action.type === 'markEdge') markEdge(action.id, action.state, action.to);
        else if (action.type === 'setDist') setDist(action.id, action.dist);
        else if (action.type === 'status') setStatus(action.text);
        else if (action.type === 'clear') clearMarks();
    };

    const run = async (actions) => {
        if (!actions || !actions.length || isRunningRef.current) return;
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

    // authoritative graph snapshot for building actions at click time
    const getContext = () => ({
        nodes: nodesRef.current,
        edges: edgesRef.current,
        directed: directedRef.current,
        startId: startIdRef.current,
        finishId: finishIdRef.current,
    });

    // --- editing ---
    const addNodeAt = (position) => {
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
        const data = { state: 'normal' };
        if (weighted) data.weight = 1;
        setEdges((es) => [
            ...es,
            { id: edgeId(a, b), source: a, target: b, type: 'floating', data, markerEnd: directedRef.current ? ARROW : undefined },
        ]);
    };

    const setWeight = (id, w) => {
        if (!weighted || isRunningRef.current) return;
        setEdges((es) => es.map((e) => (e.id === id ? { ...e, data: { ...e.data, weight: w } } : e)));
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

    const deleteNode = (id) => {
        setNodes((ns) => ns.filter((n) => n.id !== id));
        setEdges((es) => es.filter((e) => e.source !== id && e.target !== id));
        if (startIdRef.current === id) startIdRef.current = null;
        if (finishIdRef.current === id) finishIdRef.current = null;
        if (pendingEdgeRef.current === id) pendingEdgeRef.current = null;
    };

    const deleteEdge = (id) => setEdges((es) => es.filter((e) => e.id !== id));

    // directed only: swap endpoints so the arrow flips (id/key kept stable)
    const reverseEdge = (id) => {
        if (!directedRef.current) return;
        setEdges((es) => es.map((e) => (e.id === id ? { ...e, source: e.target, target: e.source } : e)));
    };

    // Persistent modes: add-node drops a node on every pane click; add-edge
    // chains edges through consecutively clicked nodes; delete removes the
    // clicked node/edge. Esc returns to select.
    const onPaneClick = (event) => {
        if (isRunningRef.current) return;
        if (modeRef.current === 'add-node') {
            addNodeAt(screenToFlowPosition({ x: event.clientX, y: event.clientY }));
        } else {
            pendingEdgeRef.current = null; // clicking empty lifts the edge anchor
        }
    };

    const onNodeClick = (_event, node) => {
        if (isRunningRef.current) return;
        const m = modeRef.current;
        if (m === 'add-edge') {
            if (pendingEdgeRef.current == null) {
                pendingEdgeRef.current = node.id;
            } else {
                addEdge(pendingEdgeRef.current, node.id);
                pendingEdgeRef.current = node.id; // chain: anchor moves to this node
            }
        } else if (m === 'delete') {
            deleteNode(node.id);
        }
        // idle: React Flow handles selection
    };

    const onEdgeClick = (_event, edge) => {
        if (isRunningRef.current) return;
        if (modeRef.current === 'delete') deleteEdge(edge.id);
        // idle: React Flow handles selection
    };

    useEffect(() => {
        const onKey = (e) => {
            if (isRunningRef.current) return;
            const el = e.target;
            if (el && el.closest && el.closest('input,select,textarea,[role="combobox"],button')) return;

            const selNode = () => nodesRef.current.find((n) => n.selected);
            const selEdge = () => edgesRef.current.find((n) => n.selected);
            const k = e.key.toLowerCase();

            if (k === 'n') { setModeBoth('add-node'); pendingEdgeRef.current = null; }
            else if (k === 'e') { setModeBoth('add-edge'); pendingEdgeRef.current = null; }
            else if (k === 'd') { setModeBoth('delete'); pendingEdgeRef.current = null; }
            else if (e.key === 'Escape') { setModeBoth('idle'); pendingEdgeRef.current = null; }
            else if (k === 's') { const n = selNode(); if (n) setRole(n.id, 'start'); }
            else if (k === 'f') { const n = selNode(); if (n) setRole(n.id, 'finish'); }
            else if (k === 'x') { const ed = selEdge(); if (ed) reverseEdge(ed.id); }
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                const n = selNode();
                const ed = selEdge();
                if (n) deleteNode(n.id);
                else if (ed) deleteEdge(ed.id);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- menu-facing controls ---
    const setDirected = (val) => {
        directedRef.current = val;
        setDirectedState(val);
        setEdges((es) => es.map((e) => ({ ...e, markerEnd: val ? ARROW : undefined })));
    };
    const loadPreset = (preset) => {
        if (isRunningRef.current) return;
        const g = seed(preset);
        const e = directedRef.current ? g.edges.map((x) => ({ ...x, markerEnd: ARROW })) : g.edges;
        nodesRef.current = g.nodes; edgesRef.current = e;
        startIdRef.current = g.startId; finishIdRef.current = null;
        labelRef.current = 0;
        setNodes(g.nodes); setEdges(e);
        setModeBoth('idle'); setStatus(''); pendingEdgeRef.current = null;
    };
    const clear = () => {
        if (isRunningRef.current) return;
        nodesRef.current = []; edgesRef.current = [];
        startIdRef.current = null; finishIdRef.current = null;
        labelRef.current = 0;
        setNodes([]); setEdges([]);
        setModeBoth('idle'); setStatus(''); pendingEdgeRef.current = null;
    };
    const setSpeed = (s) => { speedRef.current = toDelay(s); };

    return {
        // reactive
        nodes, edges, directed, mode, status, isRunning, weighted,
        // react flow wiring
        onNodesChange, onEdgesChange, onPaneClick, onNodeClick, onEdgeClick,
        // methods
        run, getContext, setWeight, setDirected, loadPreset, clear, setSpeed,
    };
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
