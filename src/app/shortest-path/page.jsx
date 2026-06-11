"use client";

import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Navbar from '@/components/navbar';
import {
    SP_PRESETS,
    weightedAdjacency,
    edgeList,
    dijkstraActions,
    bellmanFordActions,
} from '@/lib/algorithms/shortestPath';
import { useGraphEditor } from '@/components/graph/use-graph-editor';
import GraphCanvas from '@/components/graph/graph-canvas';
import GraphMenu from '@/components/graph/graph-menu';

function ShortestPathInner() {
    const g = useGraphEditor({ weighted: true, initialPreset: SP_PRESETS[0] });
    const [algo, setAlgo] = useState(0);

    const onVisualize = () => {
        const { nodes, edges, directed, startId, finishId } = g.getContext();
        const ids = nodes.map((n) => n.id);
        if (algo === 1) {
            g.run(bellmanFordActions(edgeList(edges, directed), startId, finishId, ids));
        } else {
            g.run(dijkstraActions(weightedAdjacency(edges, directed), startId, finishId, ids));
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <GraphMenu
                    title="Shortest Path"
                    algorithms={['Dijkstra', 'Bellman-Ford']}
                    presets={SP_PRESETS}
                    weighted
                    disabled={g.isRunning}
                    onAlgorithmChange={setAlgo}
                    onDirectedChange={g.setDirected}
                    onPresetChange={(i) => g.loadPreset(SP_PRESETS[i])}
                    onSpeedChange={g.setSpeed}
                    onVisualize={onVisualize}
                    onClear={g.clear}
                />
                <GraphCanvas editor={g} />
            </div>
        </div>
    );
}

export default function ShortestPath() {
    return (
        <ReactFlowProvider>
            <ShortestPathInner />
        </ReactFlowProvider>
    );
}
