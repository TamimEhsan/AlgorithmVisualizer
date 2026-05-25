import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Component } from 'react';

class Menu extends Component {
    render() {
        const disabled = this.props.disable;
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
            <h2 className="text-lg font-semibold">Settings</h2>

                <CustomSelect
                    title="Select Algorithm"
                    options={this.props.algorithms}
                    onChange={this.props.onAlgoChanged}
                    disabled={disabled}
                />
                <CustomSelect
                    title="Select Maze Division"
                    options={this.props.mazes}
                    onChange={this.props.onMazeChanged}
                    disabled={disabled}
                />
                <Button className="m-1" onClick={this.props.onClearPath} disabled={disabled}>Clear Path</Button>
                <Button className="m-1" onClick={this.props.onClearBoard} disabled={disabled}>Clear Board</Button>
                <Button className="w-full" onClick={this.props.onCreateMaze} disabled={disabled}>Create Maze</Button>
                <Button className="w-full" onClick={this.props.onVisualize} disabled={disabled}>Visualize</Button>
            </div>
        );
    }
}

export default Menu;