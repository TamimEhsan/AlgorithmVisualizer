import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';

export default function Menu({ onChangeSpeed, onChangeValues, onVisualize, onRefresh, disabled, setAlgo }) {
    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Prime Numbers</h2>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Config</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <CustomSelect
                    title="Algorithm"
                    options={["Sieve", "Spiral"]}
                    onChange={setAlgo}
                    disabled={disabled}
                />
                <CustomSlider
                    onChange={onChangeSpeed}
                    title="Speed"
                    defaultValue={10}
                    step={1}
                    min={10}
                    max={50}
                />
                <CustomSlider
                    onChange={onChangeValues}
                    title="Total Numbers"
                    defaultValue={100}
                    step={1}
                    min={10}
                    max={500}
                    disabled={disabled}
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
                <Button className="w-full" variant="outline" onClick={onRefresh} disabled={disabled}>
                    <RefreshCw /> Refresh
                </Button>
            </div>
        </div>
    );
}
