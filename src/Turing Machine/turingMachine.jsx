import React, {Component} from 'react';
import EntryPoint from "../binarySearchComponent/entryPoint";
import Search from "../binarySearchComponent/search";
import Ribbon from "./ribbon";

import {getNextStep, getTable} from '../algorithms/turing';
import Menu from "./menu";
import Navbar from "./navbar";
import Table from "./table";

class TuringMachine extends Component {
    constructor() {
        super();
        this.state = {
            cellCount: 0,
            cellStart: 0,
            cellEnd: 0,
            midCell: 0,
            strip: [],
            inputString1: "",
            inputString2: "",
            table: [],
            algo: 0,
            state: -1
        }
    }

    componentDidMount() {
        getNextStep('100');
        this.handleReset();


    }

    handleLeftShift = () => {
        this.setState({
            cellStart: this.state.cellStart + 1,
            cellEnd: this.state.cellEnd + 1,
            midCell: this.state.midCell + 1
        });
    }
    handleRightShift = () => {
        // console.log('aaaaaaa')
        this.setState({
            cellStart: this.state.cellStart - 1,
            cellEnd: this.state.cellEnd - 1,
            midCell: this.state.midCell - 1
        });
    }

    handleSet = () => {
        this.handleReset();
        let string = this.state.inputString1;
        let strip = [...this.state.strip];
        for (let i = 0; i < string.length; i++) {
            strip[50 + i] = {
                ...strip[50 + i],
                val: string[i]
            }
        }
        this.setState({strip});
    }
    handleReset = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let cellCount = Math.floor(width / 50);
        if (cellCount % 2 === 0) cellCount--;
        let strip = [...this.state.strip];
        if (strip.length === 0) strip = getInitialGrid(cellCount);
        for (let i = 0; i < strip.length; i++)
            strip[i].val = 'B';

        this.setState({strip, midCell: 50});
        let cellStart, cellEnd;
        cellStart = 50 + (1 - cellCount) / 2;
        cellEnd = 50 + (cellCount - 1) / 2;
        this.setState({cellStart, cellEnd,state:-1});
    }

    handleStart = () => {
        // this.handleReset();
        this.handleSet();
        this.handleAlgo();
    }

    handleAlgo = async () => {
        await sleep(500);
        let state = 'q0';

        while (state != 'qe') {

            let read = this.state.strip[this.state.midCell].val;
            read = read.toString();
            let [nextState, write, dir, rowIdx] = getNextStep(state, read, this.state.algo);
            this.setState({state: rowIdx});
            let strip = [...this.state.strip];
            strip[this.state.midCell].val = write;
            document.getElementById('stepsText').innerText = 'Reads ' + read + ' on strip';
            // await sleep(500);

            await sleep(1000);

            document.getElementById('stepsText').innerText = 'writes ' + write + ' on strip';

            this.setState({strip});
            await sleep(500);
            if (dir === 'R') this.handleLeftShift();
            else this.handleRightShift();

            state = nextState;
        }
    }

    setInput1 = (event) => {
        let input = event.target.value;
        const filtered = [...input].filter((item) => item === "0" || item === "1").slice(0, 8).join("");
        this.setState({inputString1: filtered});
    }
    setInput2 = (event) => {
        let input = event.target.value;
        const filtered = [...input].filter((item) => item === "0" || item === "1").slice(0, 8).join("");
        this.setState({inputString2: filtered});
    }
    setAlgo = (pos, val) => {
        if (pos === 0) {
            // console.log("sup 0");
            this.setState({algo: val});
        }
    }

    render() {
        return (
            <div>
                <Navbar/>
                <Menu
                    visualize={this.handleStart}
                    onAlgoChanged={this.setAlgo}
                    onReset={this.handleReset}
                    setInput1={this.setInput1}
                    setInput2={this.setInput2}
                />

                {/*<div className='row'>*/}
                {/*    <div className="input-group mt-2 col-3">*/}
                {/*        <input type="text" id='inputText1' className="form-control" placeholder="Input Binary"*/}
                {/*               aria-label="Username"*/}
                {/*               aria-describedby="basic-addon1"*/}
                {/*               onChange={this.setInput1}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className="input-group mt-2 col-3">*/}
                {/*        <input type="text" id='inputText1' className="form-control" placeholder="Input Binary 2"*/}
                {/*               aria-label="Username"*/}
                {/*               aria-describedby="basic-addon1"/>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <center>
                    <br/>
                    <div className='bg-info'>
                        {/*<h3>Turing Machine</h3>*/}
                        <Ribbon
                            strip={this.state.strip}
                            midCell={this.state.midCell}
                            cellCount={this.state.cellCount}
                            cellStart={this.state.cellStart}
                            cellEnd={this.state.cellEnd}
                        ></Ribbon>
                        <button
                            className='btn btn-warning m-3'
                            onClick={this.handleLeftShift}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-caret-left-square-fill" viewBox="0 0 16 16">
                                <path
                                    d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm10.5 10V4a.5.5 0 0 0-.832-.374l-4.5 4a.5.5 0 0 0 0 .748l4.5 4A.5.5 0 0 0 10.5 12z"/>
                            </svg>
                        </button>
                        <button
                            className='btn btn-warning m-3'
                            onClick={this.handleRightShift}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-caret-right-square-fill" viewBox="0 0 16 16">
                                <path
                                    d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4v8z"/>
                            </svg>

                        </button>
                    </div>
                    <br/>

                    <div className='row'>
                        <div className='col-4'>
                            <Table
                                data={getTable(this.state.algo)}
                                state={this.state.state}
                            />
                        </div>
                        <div className='col-4'>
                            <span className='bg-light p-2 font-weight-bold text-lg-center rounded-3' id='stepsText'>
                                 Details goes here
                            </span>
                        </div>
                        <div className='col-4'>
                            {/*<textarea disabled className="form-control" id="Textarea1" rows="3">*/}

                            {/*</textarea>*/}
                        </div>
                    </div>
                </center>
            </div>
        );
    }
}

const getInitialGrid = (totCellCount) => {
    const strip = [];
    for (let cell = 0; cell <= 100; cell++) {
        let currentCell = {
            id: cell,
            val: 'B'
        }
        strip.push(currentCell);
    }
    return strip;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default TuringMachine;