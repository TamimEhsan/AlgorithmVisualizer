import React, {Component} from 'react';
import DiscreteSlider from "./slider";
class Menu extends Component {
    render() {
        return (
            <nav className="nav alert-dark">
                <button className="btn btn-primary btn-lg m-2" onClick={this.props.onRefresh} disabled={this.props.isDisabled} style={this.isClickable()}>Refresh</button>
                <DiscreteSlider
                    onChange={this.props.onChangeSpeed}
                    title="speed"
                    marks={false}
                    default={10}
                    step={1}
                    min={10}
                    max={50}
                    isDisabled={false}
                />
                <DiscreteSlider
                    onChange={this.props.onChangeValues}
                    title="Total Number"
                    marks={false}
                    default={50}
                    step={1}
                    min={10}
                    max={200}
                    isDisabled={this.props.isDisabled}
                />
                <button
                    className="btn btn-warning btn-lg m-2"
                    onClick={this.props.onVisualize}
                    disabled={this.props.isDisabled}
                    style={this.isClickable()}
                >
                    Visualize Graham Scan
                </button>

            </nav>
        );
    }
    isClickable = () =>{
        if( this.props.isDisabled ){
            return {cursor: "not-allowed"};
        } else{
            return {};
        }
    }
}

export default Menu;