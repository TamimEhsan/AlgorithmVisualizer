"use client";

import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Navbar from '@/components/navbar';
import { weightedAdjacency } from '@/lib/algorithms/graph';
import { MST_PRESETS, kruskalActions, primActions } from '@/lib/algorithms/mst';
import { useGraphEditor } from '@/components/graph/use-graph-editor';
import GraphCanvas from '@/components/graph/graph-canvas';
import GraphMenu from '@/components/graph/graph-menu';

function MstInner() {
    const g = useGraphEditor({ weighted: true, initialPreset: MST_PRESETS[0] });
    const [algo, setAlgo] = useState(0);

    const onVisualize = () => {
        const { nodes, edges, startId } = g.getContext();
        g.run(algo === 1
            ? primActions(weightedAdjacency(edges, false), startId, nodes)
            : kruskalActions(nodes, edges));
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <GraphMenu
                    title="Minimum Spanning Tree"
                    algorithms={['Kruskal', 'Prim']}
                    presets={MST_PRESETS}
                    weighted
                    hideDirected
                    disabled={g.isRunning}
                    onAlgorithmChange={setAlgo}
                    onPresetChange={(i) => g.loadPreset(MST_PRESETS[i])}
                    onSpeedChange={g.setSpeed}
                    onVisualize={onVisualize}
                    onClear={g.clear}
                />
                <GraphCanvas editor={g} />
            </div>
        </div>
    );
}

export default function Mst() {
    return (
        <ReactFlowProvider>
            <MstInner />
        </ReactFlowProvider>
    );
}
