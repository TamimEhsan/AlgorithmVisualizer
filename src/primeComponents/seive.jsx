import React, {Component} from 'react';
import Cells from "./cells";
import Navbar from "./navbar";
import DiscreteSlider from "./slider";
import Menu from "./menu";
import {seive} from "../algorithms/prime";
import Spiral from "./spiral";

class Seive extends Component {
    state = {
        number: 100,
        cells:[],
        isRunning:false,
        speed:500,
        primes:[],
        maxPrime:0,
        algo:0
    }

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const cells = getCells(this.state.number);
        this.setState({cells});
    }
    setAlgo = (pos, val) => {
        if (pos === 0) {

            this.setState({algo: val});
            // console.log(this.state.algo);
        }
    }

    render() {
        return (
            <div>
                <Navbar/>
                <Menu
                    onChangeSpeed={this.changeSpeed}
                    onChangeValues={this.handleValueIncease}
                    onVisualize = {this.startAlgo}
                    onRefresh = {this.handleRefresh}
                    isDisabled = {this.state.isRunning}
                    setAlgo={this.setAlgo}
                />
                {this.state.algo === 0 &&
                    <Cells
                        num={this.state.number}
                        cells={this.state.cells}
                    />
                }
                {this.state.algo === 1 &&
                    <Spiral
                        num={this.state.number}
                        primes={this.state.primes}
                        maxPrime={this.state.maxPrime}
                    />
                }

            </div>
        );
    }

    changeSpeed = (speed) => {
        //console.log(typeof speed);
        this.setState({speed:600-speed*10});
    }
    handleValueIncease = (value) => {
        this.setState({number:value});
        if( this.state.algo === 0 ){
            this.setState({cells:getCells(value),isRunning:false});

        }
        // console.log(value);
    }
    handleRefresh = () => {
        this.setState({cells:getCells(this.state.number),isRunning:false});
    }

    startAlgo = () =>{
        console.log(this.state.algo);
        if( this.state.algo === 0 ){
            this.startSeive();
        }else if( this.state.algo === 1 ){
            this.startSpiral();
        }
    }
    startSpiral = async () =>{
        let pprimes = seive(this.state.number*100);
        let primes = [];
        this.setState({primes:[],maxPrime:pprimes[pprimes.length-1]});
        let mod = Math.ceil(this.state.number/10);
        for(let i=0;i<pprimes.length;i++){
            primes.push(pprimes[i]);

            if( i%mod === 0 ){
                this.setState({primes});
                await sleep(10);
            }
        }
        console.log('done');
    }
    startSeive = async () => {
        const speed = this.state.speed;
        this.setState({isRunning:true});
        const prime = [];
        for(let i = 0;i<=this.state.number;i++){
            prime.push(1);
        }
        prime[0] = prime[1] = 0;
        let changedCells = this.state.cells;
        let prevCheck = -1;
        let counter = 0;
        for( let i = 2; i<=this.state.number;i++){
            if( prime[i] === 1 ){
             //   setTimeout(()=>{
                    changedCells = getNewCellPrimeToggled(changedCells,i-1);
                    this.setState({cells:changedCells});
                //},counter*speed);
                await sleep(this.state.speed);
                counter++;
                for(let j = i*i;j<=this.state.number;j+=i){
                    //setTimeout(()=>{
                        if( prevCheck!=-1 ){
                            changedCells = getNewCellVisitingToggled(changedCells,prevCheck);
                        }
                        prevCheck = j-1;
                        changedCells = getNewCellCheckToggled(changedCells,j-1);
                        changedCells = getNewCellVisitingToggled(changedCells,prevCheck);
                        this.setState({cells:changedCells});
                  //  },counter*speed);
                    await sleep(this.state.speed);
                    counter++;
                    prime[j] = 0;
                }
            }
        }
      //  setTimeout(()=>{
            changedCells = getNewCellVisitingToggled(changedCells,prevCheck);
            this.setState({cells:changedCells,isRunning:false});
       // },counter*speed);
    }
}

const getNewCellPrimeToggled = (cells,pos) =>{
    const newCells = cells.slice();
    const cell = newCells[pos];
    const newCell = {
        ...cell,
        isPrime:true
    }
    newCells[pos] = newCell;
    return newCells;
}

const getNewCellVisitingToggled = (cells,pos)=>{
    const newCells = cells.slice();
    const cell = newCells[pos];
    const newCell = {
        ...cell,
        isVisiting:!cell.isVisiting
    }
    newCells[pos] = newCell;
    return newCells;
}

const getNewCellCheckToggled = (cells,pos) =>{
    const newCells = cells.slice();
    const cell = newCells[pos];
    const newCell = {
        ...cell,
        isChecking:true
    }
    newCells[pos] = newCell;
    return newCells;
}

const getCells = (rows)=>{
    const cells = [];
    for(let cell = 1;cell<=rows;cell++){
        cells.push(createCell(cell))
    }
    return cells;
}
const createCell = (val)=>{
    return {
        val,
        isChecking:false,
        isVisiting:false,
        isPrime:false
    };
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default Seive;