"use client";

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { fromValues, insertActions, extractActions, buildActions, heapsortActions } from '@/lib/algorithms/heap';
import { binaryLayout } from '@/components/tree/layout';
import { useTreeEditor } from '@/components/tree/use-tree-editor';
import TreeCanvas from '@/components/tree/tree-canvas';
import HeapMenu from './menu';

export default function BinaryHeap() {
    const [initialTree] = useState(() => fromValues([50, 30, 70, 20, 40, 60, 80]));
    const g = useTreeEditor({ initialTree });

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <HeapMenu
                    disabled={g.isRunning}
                    onInsert={(v) => g.run(insertActions(g.getContext().tree, v))}
                    onExtract={() => g.run(extractActions(g.getContext().tree))}
                    onBuild={(values) => g.run(buildActions(values))}
                    onHeapsort={() => g.run(heapsortActions(g.getContext().tree))}
                    onClear={g.clear}
                    onSpeedChange={g.setSpeed}
                />
                <div className="relative flex-1 p-6">
                    {g.status && (
                        <div className="absolute top-3 left-3 z-10 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow">
                            {g.status}
                        </div>
                    )}
                    <TreeCanvas
                        tree={g.tree}
                        layout={binaryLayout}
                        nodeState={g.nodeState}
                        edgeState={g.edgeState}
                        labels={g.labels}
                    />
                </div>
            </div>
        </div>
    );
}
