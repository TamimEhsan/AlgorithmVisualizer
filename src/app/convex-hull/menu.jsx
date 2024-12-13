import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Component } from 'react';

class Menu extends Component {
    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <h2 className="text-lg font-semibold">Settings</h2>
                
                <CustomSlider
                    title="Speed"
                    defaultValue={10}
                    min={10}
                    max={50}
                    step={1}
                    onChange={this.props.onChangeSpeed}
                />
                <CustomSlider
                    title="Total Number"
                    defaultValue={50}
                    min={10}
                    max={200}
                    step={1}
                    onChange={this.props.onChangeValues}
                    isDisabled={this.props.isDisabled}
                />
                <Button
                    className="w-full"
                    onClick={this.props.onRefresh}
                    disabled={this.props.isDisabled}
                    style={this.isClickable()}
                >
                    Refresh
                </Button>
                <Button
                    className="w-full"
                    onClick={this.props.onVisualize}
                    disabled={this.props.isDisabled}
                    style={this.isClickable()}
                >
                    Visualize Graham Scan
                </Button>

            </div>
        );
    }
    isClickable = () => {
        if (this.props.isDisabled) {
            return { cursor: "not-allowed" };
        } else {
            return {};
        }
    }
}

export default Menu;