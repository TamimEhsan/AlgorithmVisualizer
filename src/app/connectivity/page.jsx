"use client";

import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Navbar from '@/components/navbar';
import { adjacency } from '@/lib/algorithms/graph';
import { CONNECTIVITY_PRESETS, connectedComponentsActions, sccActions } from '@/lib/algorithms/connectivity';
import { useGraphEditor } from '@/components/graph/use-graph-editor';
import GraphCanvas from '@/components/graph/graph-canvas';
import GraphMenu from '@/components/graph/graph-menu';

function ConnectivityInner() {
    const g = useGraphEditor({ initialPreset: CONNECTIVITY_PRESETS[0] });
    const [algo, setAlgo] = useState(0);

    // Undirected: just Connected Components. Directed: SCC (strongly) + WCC (weakly).
    const algorithms = g.directed
        ? ['Strongly Connected (SCC)', 'Weakly Connected (WCC)']
        : ['Connected Components'];

    const onDirectedChange = (val) => { g.setDirected(val); setAlgo(0); };

    const onVisualize = () => {
        const { nodes, edges, directed } = g.getContext();
        const ids = nodes.map((n) => n.id);
        // SCC only when directed + first option; everything else is the
        // (undirected) connected-components computation — i.e. CC or WCC.
        g.run(directed && algo === 0
            ? sccActions(adjacency(edges, true), ids)
            : connectedComponentsActions(adjacency(edges, false), ids));
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <GraphMenu
                    title="Connectivity"
                    algorithms={algorithms}
                    presets={CONNECTIVITY_PRESETS}
                    disabled={g.isRunning}
                    onAlgorithmChange={setAlgo}
                    onDirectedChange={onDirectedChange}
                    onPresetChange={(i) => g.loadPreset(CONNECTIVITY_PRESETS[i])}
                    onSpeedChange={g.setSpeed}
                    onVisualize={onVisualize}
                    onClear={g.clear}
                />
                <GraphCanvas editor={g} />
            </div>
        </div>
    );
}

export default function Connectivity() {
    return (
        <ReactFlowProvider>
            <ConnectivityInner />
        </ReactFlowProvider>
    );
}
