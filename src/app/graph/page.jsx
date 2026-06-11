"use client";

import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Navbar from '@/components/navbar';
import { PRESETS, adjacency, bfsActions, dfsActions } from '@/lib/algorithms/graph';
import { useGraphEditor } from '@/components/graph/use-graph-editor';
import GraphCanvas from '@/components/graph/graph-canvas';
import GraphMenu from '@/components/graph/graph-menu';

function GraphInner() {
    const g = useGraphEditor({ initialPreset: PRESETS[0] });
    const [algo, setAlgo] = useState(0);

    const onVisualize = () => {
        const { edges, directed, startId, finishId } = g.getContext();
        const adj = adjacency(edges, directed);
        g.run(algo === 1 ? dfsActions(adj, startId, finishId) : bfsActions(adj, startId, finishId));
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <GraphMenu
                    title="Graph Traversal"
                    algorithms={['BFS', 'DFS']}
                    presets={PRESETS}
                    disabled={g.isRunning}
                    onAlgorithmChange={setAlgo}
                    onDirectedChange={g.setDirected}
                    onPresetChange={(i) => g.loadPreset(PRESETS[i])}
                    onSpeedChange={g.setSpeed}
                    onVisualize={onVisualize}
                    onClear={g.clear}
                />
                <GraphCanvas editor={g} />
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
