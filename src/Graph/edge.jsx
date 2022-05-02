import React, {Component} from 'react';

class Edge extends Component {
    constructor() {
        super();
        this.state={
            x1:0
        }
    }
    componentDidMount() {
        this.setState({x1:this.props.pos.x1});
        document.getElementById('vbanim1'+this.props.id).beginElement();
        document.getElementById('vbanim2'+this.props.id).beginElement();
    }

    componentDidUpdate(prevProps) {
        if (this.state.x1 !== this.props.pos.x1) {
            this.setState({x1:this.props.pos.x1});
            document.getElementById('vbanim1'+this.props.id).beginElement();
            document.getElementById('vbanim2'+this.props.id).beginElement();
        }
    }
    getPolyPoints = ()=>{
        let x1 = this.props.pos.x1;
        let y1 = this.props.pos.y1;
        let x2 = this.props.pos.x2;
        let y2 = this.props.pos.y2;
        let l = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
        let r = 6.5;
        let xx1 = ( x1*(l-r)+x2*r )/l;
        let yy1 = ( y1*(l-r)+y2*r )/l;
        return xx1+","+yy1+" "+x2+","+y2;
    }
    getPolyPointsX = ()=>{
        let x1 = this.props.pos.x1;
        let y1 = this.props.pos.y1;
        let x2 = this.props.pos.x2;
        let y2 = this.props.pos.y2;
        let l = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
        let r = 6.5;
        let xx1 = ( x2*(l-r)+x1*r )/l;
        let yy1 = ( y2*(l-r)+y1*r )/l;
        return xx1;
        // return xx1+","+yy1+" "+x2+","+y2;
    }
    getPolyPointsY = ()=>{
        let x1 = this.props.pos.x1;
        let y1 = this.props.pos.y1;
        let x2 = this.props.pos.x2;
        let y2 = this.props.pos.y2;
        let l = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
        let r = 6.5;
        let xx1 = ( x2*(l-r)+x1*r )/l;
        let yy1 = ( y2*(l-r)+y1*r )/l;
        return yy1;
        // return xx1+","+yy1+" "+x2+","+y2;
    }
    render() {
        return (
            <g>
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                            markerWidth="4" markerHeight="4"
                            orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" />
                    </marker>
                </defs>
                <line x2={this.getPolyPointsX()} y2={this.getPolyPointsY()} x1={this.props.pos.x1} y1={this.props.pos.y1}
                      style={{stroke:'black', strokeWidth:'0.5'}}
                      marker-end="url(#arrow)"
                >
                    <animate
                        id={'vbanim1'+this.props.id}
                        attributeName='x2'
                        values={this.props.pos.x1+';'+this.getPolyPointsX()}
                        dur='0.5s'
                        repeatCount="1"
                    />
                    <animate
                        id={'vbanim2'+this.props.id}
                        attributeName='y2'
                        values={this.props.pos.y1+';'+this.getPolyPointsY()}
                        dur='0.5s'
                        repeatCount="1"
                    />
                </line>
                {/*<polyline points={this.getPolyPoints()} fill="none" stroke="black" strokeWidth={'0.5'}*/}
                {/*          marker-start="url(#arrow)" />*/}
            </g>
        );
    }
}

export default Edge;