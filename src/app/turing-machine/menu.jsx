import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

export default function Menu({ visualize, onAlgoChanged, onReset, setInput1, setInput2, disabled }) {
    return (
        <div className="w-64 min-w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Turing Machine</h2>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Config</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <CustomSelect
                    title="Algorithm"
                    options={["Bitwise NOT", "Add one", "2's Complement"]}
                    onChange={onAlgoChanged}
                    disabled={disabled}
                />
                <div className="space-y-2">
                    <label className="text-sm font-medium">Input Binary</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        placeholder="e.g. 10110"
                        onChange={setInput1}
                        disabled={disabled}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Input Binary 2</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                        placeholder="e.g. 01101"
                        onChange={setInput2}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <Button
                    className="w-full"
                    onClick={visualize}
                    disabled={disabled}
                >
                    <Play /> Visualize
                </Button>
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={onReset}
                    disabled={disabled}
                >
                    <RotateCcw /> Reset
                </Button>
            </div>
        </div>
    );
}
