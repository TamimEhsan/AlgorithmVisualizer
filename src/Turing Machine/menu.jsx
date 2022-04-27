import React, {Component} from 'react';
import DiscreteSlider from "./slider";
import SimpleSelect from "./simpleSelect";


class Menu extends Component {
    render() {
        return (
            <nav className="nav alert-dark">


                <DiscreteSlider
                    default={50}
                    min={10}
                    max={100}
                    step={1}
                    title="Speed"
                    onCountChange={this.props.onSpeedChange}
                    disable={false}
                />
                <SimpleSelect
                    pos={0}
                    onAlgoChanged={this.props.onAlgoChanged}
                />

                <button
                    className='btn btn-warning btn-lg m-2'
                    // onClick={this.props.onViusalize}
                    disabled={this.props.disable}
                >Reset</button>

                <button
                    className='btn btn-warning btn-lg '
                    onClick={this.props.visualize}
                    disabled={this.props.disable}
                >Visualize</button>

            </nav>
    );
    }
    isClickable = () =>
        {
            if (this.props.disable) {
                return {cursor: "not-allowed"};
            } else {
                return {};
            }
        }
    }


    export default Menu;