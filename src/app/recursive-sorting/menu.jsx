import { CustomSelect } from '@/components/custom-select';
import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import { Component } from 'react';


class Menu extends Component {
    render() {
        return (
            <div className="bg-gray-100 p-4 flex flex-wrap items-center gap-4">
                <Button
                    onClick={this.props.onRandomize}
                    disabled={this.props.disable}
                    style={this.isClickable()}
                >
                    Randomize
                </Button>

                {/* <RangeSlider
                    disable={this.props.disable}
                /> */}
                <CustomSlider
                    title="Numbers"
                    defaultValue={20}
                    min={10}
                    max={100}
                    step={10}
                    onChange={this.props.onCountChange}
                    disable={this.props.disable}
                />
                <CustomSlider
                    title="Speed"
                    defaultValue={50}
                    min={10}
                    max={100}
                    step={1}
                    onChange={this.props.onSpeedChange}
                    disable={false}
                />
                <CustomSelect
                    title="Select Algorithm"
                    options={["Merge Sort", "Heap Sort", "Quick Sort"]}
                    onChange={this.props.onAlgoChanged}
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
    isClickable = () =>{
        if( this.props.disable ){
            return {cursor: "not-allowed"};
        } else{
            return {};
        }
    }
}


export default Menu;