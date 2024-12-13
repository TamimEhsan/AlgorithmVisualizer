"use client";
import { Component, createRef } from 'react';
import Navbar from '@/components/navbar';
import Canvas from "./canvas";
import Menu from "./menu";
class ConvexHull extends Component {
    
    constructor() {
        super();
        this.state = {
            dots: [],
            lines: [],
            isALgoLive: false,
            width: 100,
            height: 100,
            isRunning: false,
            speed: 100,
            number: 50
        }
        this.containerRef = createRef();
    }
    componentDidMount() {
        this.setState({ 
            width: this.containerRef.current.offsetWidth, 
            height: this.containerRef.current.offsetHeight 
        });
        console.log(this.containerRef.current.offsetWidth);
    }
    render() {
        return (
            <div className="flex flex-col h-screen">
                <Navbar title="Convex Hull" />
                <div className="flex flex-1 overflow-hidden">
                    <Menu
                        onRefresh={this.handleRefreshDots}
                        onVisualize={this.handleVisualize}
                        onChangeSpeed={this.changeSpeed}
                        onChangeValues={this.handleValueIncease}
                    />
                    <div className="flex flex-1 flex-col items-center justify-center overflow-auto">
                        <div className="w-full h-full flex items-center justify-center" ref={this.containerRef}>
                            <Canvas
                                width={this.state.width}
                                height={this.state.height}
                                dots={this.state.dots}
                                onTurnOff={this.handleTurnOff}
                                onGoing={this.state.isRunning}
                                speed={this.state.speed}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    handleValueIncease = (value) => {
        this.setState({ number: value });
        this.handleRefreshDots();
    }
    changeSpeed = (speed) => {
        //console.log(typeof speed);
        this.setState({ speed: 600 - speed * 10 });
    }
    handleAlgoStateChanged = (val) => {
        this.setState({ isAlgoLive: val });
    }
    handleVisualize = () => {
        this.setState({ isRunning: true });
    }
    handleTurnOff = () => {
        this.setState({ onGoing: false });
    }
    handleRefreshDots = () => {
        this.setState({ isRunning: false });
        this.setState({ dots: getNewDots(this.state.number, this.state.width, this.state.height) });
    }

    handleMoreDot = () => {
        const row = Math.floor(Math.random() * 400) + 10;
        const col = Math.floor(Math.random() * 400) + 10;
        const dot = {
            row: row,
            col: col
        }
        const dots = this.state.dots;
        dots.push(dot);
        this.setState(dots);
    }
}
function getNewDots(number, width, height) {
    const dots = [];
    for (let i = 0; i < number; i++) {
        dots.push(getDot(width, height));
    }
    dots.sort((a, b) => {
        if (a.xx !== b.xx) {
            return a.xx - b.xx;
        } else {
            return a.yy - b.yy;
        }
    });
    return dots;
}
function getDot(width, height) {
    width = width - 50;
    height = height - 50;
    const rowpos = Math.floor(Math.random() * height) + 25;
    const colpos = Math.floor(Math.random() * width) + 25;
    return {
        xx: colpos,
        yy: rowpos,
    }
}
export default ConvexHull;