import { useState } from 'react';
import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Search, RotateCcw } from 'lucide-react';

// Sidebar for tree visualizers: a value field + insert/delete/search actions,
// clear, and a speed slider. Callers pass the op handlers (they get the number).

export default function TreeMenu({ title, disabled, onInsert, onDelete, onSearch, onClear, onSpeedChange }) {
    const [value, setValue] = useState('');
    const num = () => Number(value);
    const valid = value.trim() !== '' && Number.isFinite(num());

    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6 overflow-auto">
            <h2 className="text-lg font-semibold">{title}</h2>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium whitespace-nowrap">Value</label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={disabled}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                    />
                </div>
                <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => valid && onInsert(num())} disabled={disabled || !valid}>
                        <Plus /> Insert
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={() => valid && onDelete(num())} disabled={disabled || !valid}>
                        <Minus /> Delete
                    </Button>
                </div>
                <Button className="w-full" variant="outline" onClick={() => valid && onSearch(num())} disabled={disabled || !valid}>
                    <Search /> Search
                </Button>
                <CustomSlider title="Speed" defaultValue={50} min={10} max={100} step={1} onChange={onSpeedChange} />
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <Button className="w-full" variant="outline" onClick={onClear} disabled={disabled}>
                    <RotateCcw /> Clear
                </Button>
            </div>
        </div>
    );
}
