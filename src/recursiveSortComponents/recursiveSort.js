import React, {Component} from 'react';
import Rect from "./rect";
import Rects from "./rects";
import mergeSort from '../algorithms/mergeSort';
import heapSort from "../algorithms/heapSort";
import Navbar from "./navbar";
import Menu from "./menu";

class RecursiveSort extends Component {
    state = {
        count: 20,
        rects: [],
        speed: 50,
        isRunning: false,
        algo: 0
    }

    constructor() {
        super();
    }

    componentDidMount() {
        var rects = getInitialRects(this.state.count);
        this.setState({rects});
        /* var rects2 = rects.slice();
         console.log(rects2);
         rects = mergeSort(rects);
         console.log(rects);*/

    }

    render() {
        return (
            <React.Fragment>
                <Navbar/>
                <Menu
                    disable={this.state.isRunning}
                    onViusalize={this.handleSort}
                    onRandomize={this.handleRandomize}
                    onRefresh={this.handleRefresh}
                    onCountChange={this.handleCountChange}
                    onAlgoChanged={this.handleAlgoChanged}
                    onSpeedChange={this.handleSpeedChanged}
                />
                <div className=' justify-content-center'>
                    <Rects
                        rects={this.state.rects}
                    />

                </div>
            </React.Fragment>
        );
    }

    handleRandomize = () => {
        const rect = getInitialRects(this.state.count);
        this.setState({rects: rect});
    }
    handleRefresh = () => {
        const rects = this.state.rects;
        for (let i = 0; i < rects.length; i++) {
            const rect = {...rects[i], isSorted: false, isSorting: false}
            rects[i] = rect;
        }
        this.setState({rects});
    }
    handleCountChange = (val) => {
        this.setState({count: val});
        this.handleRandomize();
    }
    handleAlgoChanged = (pos, val) => {
        if (pos === 0) {
            console.log("sup 0");
            this.setState({algo: val});
        }
    }
    handleSpeedChanged = (val) => {
        const speed = (110 - val);
        this.setState({speed});
    }

    handleSort = () => {

        this.setState({isRunning: true});
        let steps;
        switch (this.state.algo) {
            case 0:
                steps = mergeSort(this.state.rects);
                this.handleMerge(steps);
                break;
            case 1:
                const rects2 = this.state.rects.slice();
                steps = heapSort(rects2);
                this.handleHeap(steps);
                break;
            default:
        }


    }
    handleHeap = async (steps) =>{
        this.setState({isRunning: true});
        let prevRect = this.state.rects;
        for(let i = 0;i<steps.length;i++){
            let step = steps[i];
            //   console.log(step);
            for (let i = 0; i < this.state.count; i++) {
                prevRect[i] = {...prevRect[i], isLeft: false,isSorting: false,isRight:false};
            }
            let {left,right,sorted} = step;
            prevRect[left] = {...prevRect[left],isLeft:true};
            prevRect[right] = {...prevRect[right],isRight:true};
            this.setState({rects: prevRect});
            await sleep(this.state.speed);
            let temp = prevRect[left];
            prevRect[left] = prevRect[right];
            prevRect[right] = temp;
            this.setState({rects: prevRect});
            if( sorted ) prevRect[left] = {...prevRect[left],isSorted: true};
            await sleep(this.state.speed);
            if (i === steps.length - 1) {

                for (let i = 0; i < this.state.count; i++) {
                    prevRect[i] = {...prevRect[i], isLeft: false,isSorting: false,isRight:false,isSorted: true};
                    this.setState({rects: prevRect});
                    await sleep(this.state.speed);
                }
                this.setState({isRunning: false,rects: prevRect});
            }
        }
    }
    handleMerge = async (steps) => {
        this.setState({isRunning1: true});
        const {speed} = this.state;

        let prevRect = this.state.rects;
      //  console.log("steps ", steps.length);
        for (let ii = 0; ii < steps.length; ii++) {
            let step = steps[ii];
            for (let i = 0; i < this.state.count; i++) {
                prevRect[i] = {...prevRect[i], isLeft: false,isSorting: false,isRight:false};
            }
           // console.log(step.left," ",step.mid," ",step.right);
            for (let i = step.left; i <= step.mid; i++) {
                prevRect[i] = {...prevRect[i], isLeft: true,isSorting: false};
            }
            for (let i = step.mid + 1; i <= step.right; i++) {
                prevRect[i] = {...prevRect[i], isRight: true,isLeft:false,isSorting: false};
            }
            this.setState({rects: prevRect});
            await sleep(this.state.speed);await sleep(this.state.speed);await sleep(this.state.speed);
          //  console.log(step);
            for(let i= step.left;i<=step.right;i++){
                prevRect[i] = {...prevRect[i],width:step.val[i-step.left].width,isSorting: true };
                this.setState({rects: prevRect});
                await sleep(this.state.speed);
            }

            if (ii === steps.length - 1) {

                for (let i = 0; i < this.state.count; i++) {
                    prevRect[i] = {...prevRect[i], isLeft: false,isSorting: false,isRight:false,isSorted: true};
                    this.setState({rects: prevRect});
                    await sleep(this.state.speed);
                }
                this.setState({isRunning: false});
            }

            this.setState({rects: prevRect});
            await sleep(this.state.speed);
            prevRect = this.state.rects;
          /*  for (let i = 0; i < this.state.count; i++) {
                prevRect[i] = {...prevRect[i], isLeft: false,isSorting: false,isRight:false,isSorted: false};
            }*/
            this.setState({rects: prevRect});
        }
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getInitialRects = (tot) => {
    const rects = [];
    for (let i = 0; i < tot; i++) {
        rects.push(getRect());
    }
    return rects;
}
const getRect = () => {
    return {
        width: Math.floor(Math.random() * 200) + 50,
        isSorted: false,
        isSorting: false,
        isLeft: false,
        isRight: false
    }
}

export default RecursiveSort;