import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Component } from 'react';

class Menu extends Component {
    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <CustomSelect
                    title="Select Algorithm"
                    options={this.props.algorithms}
                    onChange={this.props.onAlgoChanged}
                />
                <CustomSelect
                    title="Select Maze Division"
                    options={this.props.mazes}
                    onChange={this.props.onMazeChanged}
                />
                <Button onClick={this.props.onCreateMaze}>Create Maze</Button>
                <Button onClick={this.props.onVisualize}>Visualize</Button>
                <Button onClick={this.props.onClearPath}>Clear Path</Button>
                <Button onClick={this.props.onClearBoard}>Clear Board</Button>
            </div>
        );
    }
}

export default Menu;