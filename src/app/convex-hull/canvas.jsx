import { convex_hull } from "@/lib/algorithms/grahamScan";
import React, { Component } from 'react';

class Canvas extends Component {
    state = {
        dots: [],
        lines: [],
        canvasWidth: 300,
        canvasHeight: 100
    }
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.canvasLineRef = React.createRef();
    }
    componentDidMount() {
        this.redrawDots();
        this.setState({ canvasWidth: this.props.width });
        this.setState({ canvasHeight: this.props.height });
        // console.log(this.state.canvasWidth);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.dots !== prevProps.dots) {
            this.setState({ dots: this.props.dots });
            this.redrawDots();
        }
        if (this.props.onGoing !== prevProps.onGoing) {
            if (this.props.onGoing === true) {
                this.animateLine();
            }
        }
    }

    render() {
        return (
            <>
                <canvas
                    className='absolute'
                    id='canvas1'
                    // style={{backgroundColor:"whitesmoke"}}
                    ref={this.canvasLineRef} width={this.props.width} height={this.props.height}
                />
                <canvas
                    className='absolute'
                    id='canvas2'
                    // style={{backgroundColor:"grey"}}
                    ref={this.myRef} width={this.props.width} height={this.props.height}
                />

            </>
        );
    }

    redrawDots() {
        const canvas = this.myRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'lightgrey';
        ctx.strokeStyle = 'black';
        for (let i = 0; i < this.props.dots.length; i++) {
            ctx.beginPath();
            // ctx.moveTo(this.props.dots[i].xx, this.props.dots[i].yy)
            ctx.arc(this.props.dots[i].xx, this.props.dots[i].yy, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();

        }
        ctx.closePath();
        const res = convex_hull(this.props.dots);

        const cansvas2 = this.canvasLineRef.current;
        const ctx2 = cansvas2.getContext('2d');
        ctx2.clearRect(0, 0, canvas.width, canvas.height);
        this.setState({ lines: res[1] });

    }

    animateLine = async () => {
        const { lines } = this.state;
        const canvas2 = this.canvasLineRef.current;
        const ctx2 = canvas2.getContext('2d');
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        ctx2.fillStyle = '#ffffff';
        ctx2.strokeStyle = '#ffffff';
        for (let i = 0; i < lines.length; i++) {
            if (!this.props.onGoing) {
                ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                return;
            }
            ctx2.beginPath();
            if (lines[i].add) {
                ctx2.beginPath();
                ctx2.lineWidth = 2;
                ctx2.fillStyle = 'black';
                ctx2.moveTo(lines[i].from.xx, lines[i].from.yy)
                ctx2.arc(lines[i].from.xx, lines[i].from.yy, 14, 0, 2 * Math.PI);
                ctx2.fill();
                ctx2.closePath();

                ctx2.beginPath();
                ctx2.fillStyle = 'red';
                ctx2.moveTo(lines[i].to.xx, lines[i].to.yy)
                ctx2.arc(lines[i].to.xx, lines[i].to.yy, 14, 0, 2 * Math.PI);
                ctx2.fill();
                ctx2.closePath();

                ctx2.beginPath();
                ctx2.lineWidth = 2;
                ctx2.strokeStyle = '#000000';
            } else {
                ctx2.beginPath();
                ctx2.fillStyle = 'whitesmoke';
                ctx2.moveTo(lines[i].from.xx, lines[i].from.yy)
                ctx2.arc(lines[i].from.xx, lines[i].from.yy, 15, 0, 2 * Math.PI);
                ctx2.fill();
                ctx2.closePath();

                ctx2.beginPath();
                ctx2.fillStyle = 'whitesmoke';
                ctx2.moveTo(lines[i].to.xx, lines[i].to.yy)
                ctx2.arc(lines[i].to.xx, lines[i].to.yy, 15, 0, 2 * Math.PI);
                ctx2.fill();
                ctx2.closePath();

                ctx2.lineWidth = 4;
                ctx2.strokeStyle = 'whitesmoke';
            }

            ctx2.moveTo(lines[i].from.xx, lines[i].from.yy);
            ctx2.lineTo(lines[i].to.xx, lines[i].to.yy);
            ctx2.stroke();
            ctx2.closePath();
            if (i === lines.length - 1) {
                this.props.onTurnOff();
            }
            await sleep(this.props.speed);
        }
    }

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default Canvas;