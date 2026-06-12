import { useEffect, useMemo, useRef, useState } from 'react';
import TreeNode from './tree-node';
import TreeEdge from './tree-edge';
import { flattenTree } from './layout';

// Renders a logical tree. On layout change, node positions are tweened with a
// single requestAnimationFrame loop and BOTH nodes and edges read the same
// interpolated coordinates each frame — so edges stay attached to the nodes
// (SVG line endpoints can't be CSS-transitioned, which is why we tween in JS).

const COLGAP = 46;
const ROWGAP = 66;
const PAD = 28;
const DURATION = 600;

const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function TreeCanvas({ tree, layout, nodeState = {}, edgeState = {}, labels = {} }) {
    const [disp, setDisp] = useState(new Map()); // id -> currently displayed {x, y}
    const [box, setBox] = useState(null); // tweened viewBox { W, H }
    const rafRef = useRef(0);

    const model = useMemo(() => {
        if (!tree) return null;
        const { pos, cols, depth } = layout(tree);
        const { nodes, edges } = flattenTree(tree);
        const W = PAD * 2 + Math.max(cols - 1, 0) * COLGAP;
        const H = PAD * 2 + depth * ROWGAP;
        const target = new Map();
        for (const n of nodes) {
            target.set(n.id, { x: PAD + pos[n.id].x * COLGAP, y: PAD + pos[n.id].y * ROWGAP });
        }
        return { nodes, edges, W, H, target };
    }, [tree, layout]);

    // signature of target positions; the tween restarts only when these change
    const sig = model
        ? [...model.target.entries()].map(([id, p]) => `${id}:${p.x},${p.y}`).join('|')
        : '';

    useEffect(() => {
        if (!model) return undefined;
        // existing nodes slide from where they are now; a NEW node emerges from
        // its parent's current spot and slides in with everyone else (so it
        // doesn't pop into place ahead of the nodes that still need to shift)
        const parentOf = new Map();
        for (const e of model.edges) parentOf.set(e.child, e.parent);
        const startPos = new Map();
        for (const n of model.nodes) {
            if (disp.has(n.id)) {
                startPos.set(n.id, disp.get(n.id));
            } else {
                const pid = parentOf.get(n.id);
                const from = (pid && (disp.get(pid) || model.target.get(pid))) || model.target.get(n.id);
                startPos.set(n.id, from);
            }
        }
        // tween the viewBox too, so the auto-fit rescale on growth happens
        // smoothly in lockstep with the nodes (an instant rescale would make
        // nodes appear to arrive at different times in screen space)
        const startBox = box || { W: model.W, H: model.H };
        const start = performance.now();
        cancelAnimationFrame(rafRef.current);
        const step = (now) => {
            const t = Math.min(1, (now - start) / DURATION);
            const e = ease(t);
            const next = new Map();
            for (const n of model.nodes) {
                const s = startPos.get(n.id);
                const g = model.target.get(n.id);
                next.set(n.id, { x: s.x + (g.x - s.x) * e, y: s.y + (g.y - s.y) * e });
            }
            setDisp(next);
            setBox({ W: startBox.W + (model.W - startBox.W) * e, H: startBox.H + (model.H - startBox.H) * e });
            if (t < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sig]);

    if (!model) {
        return <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">empty tree</div>;
    }

    const at = (id) => disp.get(id) || model.target.get(id);
    const vbW = box ? box.W : model.W;
    const vbH = box ? box.H : model.H;

    return (
        <svg viewBox={`0 0 ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
            <defs>
                <filter id="treeShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0.5" stdDeviation="0.6" floodOpacity="0.25" />
                </filter>
            </defs>
            {model.edges.map((e) => {
                if (nodeState[e.parent] === 'hidden' || nodeState[e.child] === 'hidden') return null;
                const a = at(e.parent);
                const b = at(e.child);
                return <TreeEdge key={'e' + e.child} x1={a.x} y1={a.y} x2={b.x} y2={b.y} state={edgeState[e.child]} />;
            })}
            {model.nodes.map((n) => {
                const p = at(n.id);
                return (
                    <TreeNode
                        key={n.id}
                        x={p.x} y={p.y}
                        value={n.value}
                        secondary={labels[n.id]}
                        state={nodeState[n.id]}
                    />
                );
            })}
        </svg>
    );
}
