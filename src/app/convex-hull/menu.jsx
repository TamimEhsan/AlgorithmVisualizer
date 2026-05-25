import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';

export default function Menu({ onRefresh, onVisualize, onChangeSpeed, onChangeValues, disabled }) {
    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Convex Hull</h2>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Config</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <CustomSlider
                    title="Speed"
                    defaultValue={10}
                    min={10}
                    max={50}
                    step={1}
                    onChange={onChangeSpeed}
                />
                <CustomSlider
                    title="Total Points"
                    defaultValue={50}
                    min={10}
                    max={200}
                    step={1}
                    onChange={onChangeValues}
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
                    onClick={onVisualize}
                    disabled={disabled}
                >
                    <Play /> Visualize
                </Button>
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={onRefresh}
                    disabled={disabled}
                >
                    <RefreshCw /> Refresh Points
                </Button>
            </div>
        </div>
    );
}
