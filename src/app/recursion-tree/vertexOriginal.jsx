import React, {Component} from 'react';

class Vertex extends Component {

    constructor() {
        super();
        this.state = {
            prevPoss:{
                x:0,
                y:0
            },
            poss:{
                x:0,
                y:0,
                xx:0,
                yy:0
            },
            prevX:0
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.poss.x !== this.props.pos.x) {
            let pp = this.state.poss;
            pp.xx = pp.x;
            pp.yy = pp.y;
            pp.x = this.props.pos.x;
            pp.y = this.props.pos.y;
            this.setState({poss:pp});
            document.getElementById('vbanim').beginElement();
        }
    }
    render() {

        return (
            <g>
                <circle
                    cx={this.state.poss.x}
                    cy={this.state.poss.y}
                    r={this.props.radius}
                    stroke="black" stroke-width="1" fill="red"
                >
                    {/*<animate*/}
                    {/*    attributeName='r'*/}
                    {/*    values='0;25;5;10'*/}
                    {/*    dur='1s'*/}
                    {/*    repeatCount="1"*/}
                    {/*/>*/}
                    <animate
                        id={'vbanim'}
                        attributeName='cx'
                        values={(this.state.poss.x-50)+';'+this.state.poss.x}
                        dur='2s'
                        repeatCount="1"
                    />
                </circle>
                <text
                    style={{font:'5px sans-serif'}}
                    x={this.props.pos.x}
                    y={this.props.pos.y}
                >
                    {this.props.label}
                </text>
                <rect width="10" height="10">
                    <animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="2" />
                </rect>
            </g>
        );
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Vertex;