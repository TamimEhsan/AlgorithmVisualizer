import { CustomSlider } from '@/components/custom-slider';
import { Button } from '@/components/ui/button';
import React, { Component } from 'react';

class Menu extends Component {
    render() {
        return (
            <div className="bg-gray-100 p-4 flex flex-wrap items-center gap-4">
            <Button
                onClick={this.props.onClear}
                disabled={this.props.disable}
                style={this.isClickable()}
            >
                Clear Board
            </Button>

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