"use client";

import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Navbar from '@/components/navbar';
import { FLOW_PRESETS, maxFlowActions } from '@/lib/algorithms/networkFlow';
import { useGraphEditor } from '@/components/graph/use-graph-editor';
import GraphCanvas from '@/components/graph/graph-canvas';
import GraphMenu from '@/components/graph/graph-menu';

function NetworkFlowInner() {
    const g = useGraphEditor({ weighted: true, initialDirected: true, initialPreset: FLOW_PRESETS[0] });
    const [algo, setAlgo] = useState(0); // 0 = Edmonds-Karp, 1 = Ford-Fulkerson

    const onVisualize = () => {
        const { edges, startId, finishId } = g.getContext();
        g.run(maxFlowActions(edges, startId, finishId, algo === 1 ? 'ff' : 'ek'));
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <GraphMenu
                    title="Network Flow"
                    algorithms={['Edmonds-Karp', 'Ford-Fulkerson']}
                    presets={FLOW_PRESETS}
                    weighted
                    hideDirected
                    disabled={g.isRunning}
                    onAlgorithmChange={setAlgo}
                    onDirectedChange={g.setDirected}
                    onPresetChange={(i) => g.loadPreset(FLOW_PRESETS[i])}
                    onSpeedChange={g.setSpeed}
                    onVisualize={onVisualize}
                    onClear={g.clear}
                />
                <GraphCanvas editor={g} />
            </div>
        </div>
    );
}

export default function NetworkFlow() {
    return (
        <ReactFlowProvider>
            <NetworkFlowInner />
        </ReactFlowProvider>
    );
}
