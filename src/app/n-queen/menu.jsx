import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import React, { Component } from 'react';

class Menu extends Component {
    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <h2 className="text-lg font-semibold">Settings</h2>

                <CustomSlider
                    title="Grid size"
                    defaultValue={4}
                    min={1}
                    max={8}
                    step={1}
                    onChange={this.props.onCountChange}
                    disable={this.props.disable}
                />
                <CustomSlider
                    title="Speed"
                    defaultValue={50}
                    min={1}
                    max={100}
                    step={1}
                    onChange={this.props.onSpeedChange}
                />
                <Button
                    className="w-full"
                    onClick={this.props.onClear}
                    disabled={this.props.disable}
                    style={this.isClickable()}
                >
                    Clear Board
                </Button>
                <Button
                    className="w-full"
                    onClick={this.props.onViusalize}
                    disabled={this.props.disable}
                    style={this.isClickable()}
                >
                    Visualize
                </Button>

            </div>
        );
    }
    isClickable = () => {
        if (this.props.disable) {
            return { cursor: "not-allowed" };
        } else {
            return {};
        }
    }
}


export default Menu;