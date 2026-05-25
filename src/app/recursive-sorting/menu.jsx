import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Play, Shuffle } from 'lucide-react';

export default function Menu({ disabled, onViusalize, onRandomize, onCountChange, onAlgoChanged, onSpeedChange }) {
    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Recursive Sorting</h2>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Config</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <CustomSlider
                    title="Numbers"
                    defaultValue={20}
                    min={10}
                    max={100}
                    step={10}
                    onChange={onCountChange}
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
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithm</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <CustomSelect
                    title="Algorithm"
                    options={["Merge Sort", "Heap Sort", "Quick Sort"]}
                    onChange={onAlgoChanged}
                    disabled={disabled}
                />
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <Button
                    className="w-full"
                    onClick={onViusalize}
                    disabled={disabled}
                >
                    <Play /> Visualize
                </Button>
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={onRandomize}
                    disabled={disabled}
                >
                    <Shuffle /> Randomize
                </Button>
            </div>
        </div>
    );
}
