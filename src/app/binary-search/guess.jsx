import React, {Component} from 'react';
import RangeSlider from "./doubleSlider";

class Guess extends Component {
    render() {
        return (
            <div >

                <p>

                    <button className="btn btn-secondary btn-lg" type="button" data-toggle="collapse"
                            data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Toggle Range
                    </button>
                </p>
                <div className="collapse" id="collapseExample">
                    <div className="card card-body">
                        <center style={{justifyContent:"center"}}>
                            <RangeSlider
                                upper={this.props.upper}
                                lower={this.props.lower}
                                max={this.props.max}
                            />
                        </center>
                    </div>
                </div>

               <h1>
                    Is you number greater than {this.getMid()}?
                </h1> <br />
                <button
                    className='btn btn-lg btn-success m-2'
                    onClick={this.props.yesButton}
                >Yes</button>
                <button
                    className='btn btn-lg btn-danger m-2'
                    onClick={this.props.noButton}
                >No</button> <br/>
            </div>
        );
    }
    getMid = () => {
        const mid = Math.floor( (this.props.upper+this.props.lower)/2);
        return mid;
    }
}

export default Guess;