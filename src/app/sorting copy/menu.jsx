import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { CustomToggle } from '@/components/custom-toggle';
import { Button } from '@/components/ui/button';
import { Component } from 'react';


class Menu extends Component {
    render() {
        return (
            <div className="bg-gray-100 p-4 flex flex-wrap items-center gap-4">
                <button
                    className='btn btn-secondary m-2'
                    onClick={this.props.onRandomize}
                    disabled={this.props.disable}
                    style={this.isClickable()}
                >
                    Randomize
                </button>

                {/* <RangeSlider
                    disable={this.props.disable}
                /> */}
                <CustomSlider
                    defaultValue={20}
                    title="Numbers"
                    onChange={this.props.onCountChange}
                    min={10}
                    max={100}
                    step={10}
                    disable={this.props.disable}
                />
                <CustomSlider
                    defaultValue={50}
                    title="Speed"
                    onChange={this.props.onSpeedChange}
                    min={10}
                    max={100}
                    step={1}
                    disable={this.props.disable}
                />

                <CustomSelect
                    title="Select Algorithm 1"
                    options={["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"]}
                    onChange={this.props.onAlgoChanged1}
                />
                <CustomToggle
                    title="Double"
                    onCheckedChange={this.props.onDoubleChange}
                />
                {/* <SwitchLabels
                    disable={this.props.disable}
                    onDoubleChange={this.props.onDoubleChange}
                /> */}
                <CustomSelect
                    title="Select Algorithm 2"
                    options={["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"]}
                    onChange={this.props.onAlgoChanged2}
                />
                <Button
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