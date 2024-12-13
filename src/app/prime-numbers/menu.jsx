import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';

import { Component } from 'react';

class Menu extends Component {
    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <h2 className="text-lg font-semibold">Settings</h2>
                <CustomSelect
                    title="Select Algorithm"
                    options={["Sieve", "Spiral"]}
                    onChange={this.props.setAlgo}
                />
                <CustomSlider
                    onChange={this.props.onChangeSpeed}
                    title="speed"
                    marks={false}
                    defaultValue={10}
                    step={1}
                    min={10}
                    max={50}
                    isDisabled={false}
                />
                <CustomSlider
                    onChange={this.props.onChangeValues}
                    title="Total Number"
                    marks={false}
                    defaultValue={100}
                    step={1}
                    min={10}
                    max={500}
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
                    style={this.isClickable()}>
                    Visualize
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