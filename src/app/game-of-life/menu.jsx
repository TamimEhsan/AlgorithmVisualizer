import { Button } from '@/components/ui/button';
import { Play, Square, Trash2 } from 'lucide-react';

export default function Menu({ onStart, onStop, onClear, isRunning }) {
    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Game of Life</h2>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <Button
                    className="w-full"
                    onClick={onStart}
                    disabled={isRunning}
                >
                    <Play /> Start Simulation
                </Button>
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={onStop}
                    disabled={!isRunning}
                >
                    <Square /> Stop Simulation
                </Button>
                <Button
                    className="w-full"
                    variant="secondary"
                    onClick={onClear}
                    disabled={isRunning}
                >
                    <Trash2 /> Clear Board
                </Button>
            </div>
        </div>
    );
}
