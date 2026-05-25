import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Play, Grid3X3, Eraser, Trash2 } from 'lucide-react';

export default function Menu({ onAlgoChanged, onVisualize, algorithms, mazes, onMazeChanged, onCreateMaze, onClearBoard, onClearPath, disabled }) {
    return (
        <div className="w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Pathfinder</h2>

            <CustomSelect
                title="Algorithm"
                options={algorithms}
                onChange={onAlgoChanged}
                disabled={disabled}
            />

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-300" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Maze</span>
                    <div className="h-px flex-1 bg-gray-300" />
                </div>
                <CustomSelect
                    title="Division Type"
                    options={mazes}
                    onChange={onMazeChanged}
                    disabled={disabled}
                />
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={onCreateMaze}
                    disabled={disabled}
                >
                    <Grid3X3 /> Generate Maze
                </Button>
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
                <div className="flex gap-2">
                    <Button
                        className="flex-1"
                        variant="secondary"
                        size="sm"
                        onClick={onClearPath}
                        disabled={disabled}
                    >
                        <Eraser /> Path
                    </Button>
                    <Button
                        className="flex-1"
                        variant="secondary"
                        size="sm"
                        onClick={onClearBoard}
                        disabled={disabled}
                    >
                        <Trash2 /> Board
                    </Button>
                </div>
            </div>
        </div>
    );
}
