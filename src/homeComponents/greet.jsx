import React, {Component} from 'react';
import "./style.css"
class Greet extends Component {
    render() {
        return (
            <div className="greet">
                <h1 className="display-3">
                    Algorithm Visualizer
                </h1>
                <hr className="dropdown-divider"/>
                <h1 className="display-5">
                    Visualize algorithms for a better understanding
                </h1>
            </div>
        );
    }
}

export default Greet;