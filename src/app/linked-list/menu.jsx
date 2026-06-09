import { useState } from 'react';
import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { CustomToggle } from '@/components/custom-toggle';
import { Button } from '@/components/ui/button';
import { Play, Shuffle, RotateCcw } from 'lucide-react';

const OPERATIONS = [
    'Insert at head',
    'Insert at tail',
    'Insert at index',
    'Delete by value',
    'Delete at index',
    'Search',
    'Reverse',
];

const NEEDS_VALUE = new Set([0, 1, 2, 3, 5]);
const NEEDS_INDEX = new Set([2, 4]);

export default function Menu({
    disabled,
    onListTypeChange,
    onOperationChange,
    onValueChange,
    onIndexChange,
    onSpeedChange,
    onVisualize,
    onRandomize,
    onReset,
}) {
    const [operation, setOperation] = useState(0);

    const handleOperation = (op) => {
        setOperation(op);
        onOperationChange(op);
    };

    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Linked List</h2>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Config</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <CustomToggle
                    title="Doubly linked"
                    onCheckedChange={(checked) => onListTypeChange(checked ? 1 : 0)}
                    disabled={disabled}
                />
                <CustomSelect
                    title="Operation"
                    options={OPERATIONS}
                    onChange={handleOperation}
                    disabled={disabled}
                />
                {NEEDS_VALUE.has(operation) && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium whitespace-nowrap">Value</label>
                        <input
                            type="number"
                            defaultValue={42}
                            onChange={(e) => onValueChange(e.target.value)}
                            disabled={disabled}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        />
                    </div>
                )}
                {NEEDS_INDEX.has(operation) && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium whitespace-nowrap">Index</label>
                        <input
                            type="number"
                            defaultValue={1}
                            min={0}
                            onChange={(e) => onIndexChange(e.target.value)}
                            disabled={disabled}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        />
                    </div>
                )}
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
                <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" onClick={onRandomize} disabled={disabled}>
                        <Shuffle /> Random
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={onReset} disabled={disabled}>
                        <RotateCcw /> Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
