import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import GraphNode from './graph-node';
import FloatingEdge, { EdgeWeightContext } from './floating-edge';

// Renders the editable graph for a useGraphEditor() instance: the React Flow
// canvas, the mode-indicator + status overlays, and (for weighted editors) the
// EdgeWeightContext provider that enables inline weight editing.

const nodeTypes = { graphNode: GraphNode };
const edgeTypes = { floating: FloatingEdge };

const baseHint = {
    'add-node': 'Add node — click anywhere on the canvas',
    'add-edge': 'Add edge — click two nodes',
};

export default function GraphCanvas({ editor }) {
    const idleHint = editor.weighted
        ? 'Click a node to select · N add node · E add edge · click a weight to edit'
        : 'Click a node to select · N add node · E add edge';
    const hint = baseHint[editor.mode] || idleHint;

    return (
        <div className="relative flex-1">
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                <div className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow">
                    {hint}
                </div>
                {editor.status && (
                    <div className="self-start rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow">
                        {editor.status}
                    </div>
                )}
            </div>
            <EdgeWeightContext.Provider value={editor.weighted ? editor.setWeight : null}>
                <ReactFlow
                    nodes={editor.nodes}
                    edges={editor.edges}
                    onNodesChange={editor.onNodesChange}
                    onEdgesChange={editor.onEdgesChange}
                    onNodesDelete={editor.onNodesDelete}
                    onPaneClick={editor.onPaneClick}
                    onNodeClick={editor.onNodeClick}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    nodesConnectable={false}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </EdgeWeightContext.Provider>
        </div>
    );
}
