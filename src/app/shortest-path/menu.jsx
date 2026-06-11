import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { CustomToggle } from '@/components/custom-toggle';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { SP_PRESETS } from '@/lib/algorithms/shortestPath';

const CONTROLS = [
    ['N then click', 'add node'],
    ['E then 2 nodes', 'add edge'],
    ['click weight', 'edit it'],
    ['click + Del', 'delete'],
    ['click + S', 'set start'],
    ['click + F', 'set finish'],
    ['drag', 'move node'],
    ['Esc', 'cancel'],
];

export default function Menu({
    disabled,
    onDirectedChange,
    onAlgorithmChange,
    onPresetChange,
    onSpeedChange,
    onVisualize,
    onClear,
}) {
    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6 overflow-auto">
            <h2 className="text-lg font-semibold">Shortest Path</h2>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Config</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <CustomToggle title="Directed" onCheckedChange={onDirectedChange} disabled={disabled} />
                <CustomSelect
                    title="Algorithm"
                    options={['Dijkstra', 'Bellman-Ford']}
                    onChange={onAlgorithmChange}
                    disabled={disabled}
                />
                <CustomSelect
                    title="Starter graph"
                    options={SP_PRESETS.map((p) => p.name)}
                    onChange={onPresetChange}
                    disabled={disabled}
                />
                <CustomSlider
                    title="Speed"
                    defaultValue={50}
                    min={10}
                    max={100}
                    step={1}
                    onChange={onSpeedChange}
                />
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <Button className="w-full" onClick={onVisualize} disabled={disabled}>
                    <Play /> Visualize
                </Button>
                <Button className="w-full" variant="outline" onClick={onClear} disabled={disabled}>
                    <RotateCcw /> Clear
                </Button>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Controls</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <dl className="text-xs text-gray-600 space-y-1">
                    {CONTROLS.map(([key, desc]) => (
                        <div key={key} className="flex justify-between gap-2">
                            <dt className="font-mono text-gray-800 whitespace-nowrap">{key}</dt>
                            <dd className="text-right">{desc}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
