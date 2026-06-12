import { useState, useRef } from 'react';
import { flattenTree } from './layout';

// Reusable tree editor + action-log executor (SVG tree counterpart of
// useGraphEditor). Holds the logical tree + visual marks and plays an action
// list with a delay. Algorithm-agnostic: callers build actions and call run().

const toDelay = (s) => 1100 - s * 10;

export function useTreeEditor({ initialTree = null } = {}) {
    const [tree, setTreeState] = useState(initialTree);
    const [nodeState, setNodeState] = useState({});
    const [edgeState, setEdgeState] = useState({});
    const [labels, setLabels] = useState({});
    const [status, setStatus] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const treeRef = useRef(initialTree);
    const isRunningRef = useRef(false);
    const speedRef = useRef(toDelay(50));

    const applyTree = (t) => { treeRef.current = t; setTreeState(t); };
    const clearMarks = () => { setNodeState({}); setEdgeState({}); setLabels({}); setStatus(''); };

    const applyAction = (a) => {
        if (a.type === 'setTree') {
            applyTree(a.tree);
            // recursion reveals a fixed tree: lay it out once, hidden, then
            // un-hide nodes via markNode as the walk visits them
            if (a.hidden && a.tree) {
                const hidden = {};
                for (const n of flattenTree(a.tree).nodes) hidden[n.id] = 'hidden';
                setNodeState(hidden);
            }
        } else if (a.type === 'markNode') setNodeState((s) => ({ ...s, [a.id]: a.state }));
        else if (a.type === 'markEdge') setEdgeState((s) => ({ ...s, [a.childId]: a.state }));
        else if (a.type === 'setLabel') setLabels((s) => ({ ...s, [a.id]: a.secondary }));
        else if (a.type === 'status') setStatus(a.text);
        else if (a.type === 'clear') clearMarks();
    };

    const run = async (actions) => {
        if (!actions || !actions.length || isRunningRef.current) return;
        isRunningRef.current = true;
        setIsRunning(true);
        clearMarks();
        for (const a of actions) {
            applyAction(a);
            // a structural change triggers the ~0.6s re-layout slide; always give
            // it time to finish, even when the speed slider is set fast
            const delay = a.type === 'setTree' ? Math.max(speedRef.current, 650) : speedRef.current;
            await sleep(delay);
        }
        isRunningRef.current = false;
        setIsRunning(false);
    };

    const getContext = () => ({ tree: treeRef.current });
    const clear = () => { if (isRunningRef.current) return; applyTree(null); clearMarks(); };
    const setSpeed = (s) => { speedRef.current = toDelay(s); };

    return { tree, nodeState, edgeState, labels, status, isRunning, run, getContext, clear, setSpeed };
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
