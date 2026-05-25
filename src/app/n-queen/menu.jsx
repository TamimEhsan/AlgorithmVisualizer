import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Play, Trash2 } from 'lucide-react';
import { Component } from 'react';

class Menu extends Component {
    render() {
        const disabled = this.props.disable;
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <h2 className="text-lg font-semibold">N-Queen</h2>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-gray-300" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Config</span>
                        <div className="h-px flex-1 bg-gray-300" />
                    </div>
                    <CustomSlider
                        title="Grid Size"
                        defaultValue={4}
                        min={1}
                        max={8}
                        step={1}
                        onChange={this.props.onCountChange}
                        disable={disabled}
                    />
                    <CustomSlider
                        title="Speed"
                        defaultValue={50}
                        min={1}
                        max={100}
                        step={1}
                        onChange={this.props.onSpeedChange}
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
                        onClick={this.props.onViusalize}
                        disabled={disabled}
                    >
                        <Play /> Visualize
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={this.props.onClear}
                        disabled={disabled}
                    >
                        <Trash2 /> Clear Board
                    </Button>
                </div>
            </div>
        );
    }
}

export default Menu;
