import React, {Component} from 'react';

class Vertex extends Component {

    constructor() {
        super();

    }
    componentDidMount() {
        if( this.props.id === 0 ) return;
        // document.getElementById('ranim'+this.props.id).beginElement();
        document.getElementById('cxanim'+this.props.id).beginElement();
        document.getElementById('cyanim'+this.props.id).beginElement();
        document.getElementById('tanim'+this.props.id).beginElement();
    }
    render() {

        return (
            <g>
                <circle
                    cx={this.props.pos.x}
                    cy={this.props.pos.y}
                    r={6}
                    // ry={3}
                    stroke="black" stroke-width="0.5" fill={this.props.current?'cyan':'white'}
                >
                    <animate
                        id={'cxanim'+this.props.id}
                        attributeName='cx'
                        values={this.props.pos.px+";"+this.props.pos.x}
                        dur='0.5s'
                        repeatCount="1"
                    />
                    <animate
                        id={'cyanim'+this.props.id}
                        attributeName='cy'
                        values={this.props.pos.py+";"+this.props.pos.y}
                        dur='0.5s'
                        repeatCount="1"
                    />
                    {/*<animate*/}
                    {/*    id={'ranim'+this.props.id}*/}
                    {/*    attributeName='rx'*/}
                    {/*    values='0;3'*/}
                    {/*    dur='0.5s'*/}
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
                    y={this.props.pos.y-4}
                    textAnchor={'middle'}
                    // alignmentBaseline={'top'}
                >
                    <animate
                        id={'tanim'+this.props.id}
                        attributeName='opacity'
                        values='0;0;1'
                        dur='1s'
                        repeatCount="1"
                    />
                    <tspan x={this.props.pos.x} dy='1.2em' >N:{this.props.label}</tspan>
                    <tspan  x={this.props.pos.x} dy='1.2em'>R:{this.props.ret}</tspan>
                </text>

            </g>
        );
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Vertex;