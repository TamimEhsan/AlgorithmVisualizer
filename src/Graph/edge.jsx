import React, {Component} from 'react';

class Edge extends Component {
    render() {
        return (
            <g>
                <line x1={this.props.pos.x1} y1={this.props.pos.y1} x2={this.props.pos.x2} y2={this.props.pos.y2}
                      // style={{"stroke:rgb(255,0,0);stroke-width:2"}}/>
                      style={{stroke:'rgb(255,0,0)', strokeWidth:'0.5'}}/>
            </g>
        );
    }
}

export default Edge;