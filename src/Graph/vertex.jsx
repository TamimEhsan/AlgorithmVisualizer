import React, {Component} from 'react';

class Vertex extends Component {

    constructor() {
        super();

    }

    render() {

        return (
            <g>
                <circle
                    cx={this.props.pos.x}
                    cy={this.props.pos.y}
                    r={3}
                    stroke="black" stroke-width="0.5" fill={this.props.current?'cyan':'white'}
                >
                    {/*<animate*/}
                    {/*    attributeName='r'*/}
                    {/*    values='0;25;5;10'*/}
                    {/*    dur='1s'*/}
                    {/*    repeatCount="1"*/}
                    {/*/>*/}
                    {/*<animate*/}
                    {/*    id={'vbanim'}*/}
                    {/*    attributeName='cx'*/}
                    {/*    values={(this.state.poss.x-50)+';'+this.state.poss.x}*/}
                    {/*    dur='2s'*/}
                    {/*    repeatCount="1"*/}
                    {/*/>*/}
                </circle>
                <text
                    style={{font:'3px sans-serif'}}
                    x={this.props.pos.x}
                    y={this.props.pos.y}
                >
                    {this.props.label}
                </text>

            </g>
        );
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Vertex;