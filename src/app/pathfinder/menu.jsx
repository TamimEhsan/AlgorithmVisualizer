import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Play, Grid3X3, Eraser, Trash2 } from 'lucide-react';
import { Component } from 'react';

class Menu extends Component {
    render() {
        const disabled = this.props.disable;
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <h2 className="text-lg font-semibold">Pathfinder</h2>

                <CustomSelect
                    title="Algorithm"
                    options={this.props.algorithms}
                    onChange={this.props.onAlgoChanged}
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
                        options={this.props.mazes}
                        onChange={this.props.onMazeChanged}
                        disabled={disabled}
                    />
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={this.props.onCreateMaze}
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
                        onClick={this.props.onVisualize}
                        disabled={disabled}
                    >
                        <Play /> Visualize
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            className="flex-1"
                            variant="secondary"
                            size="sm"
                            onClick={this.props.onClearPath}
                            disabled={disabled}
                        >
                            <Eraser /> Path
                        </Button>
                        <Button
                            className="flex-1"
                            variant="secondary"
                            size="sm"
                            onClick={this.props.onClearBoard}
                            disabled={disabled}
                        >
                            <Trash2 /> Board
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;
