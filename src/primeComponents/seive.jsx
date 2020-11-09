import React, {Component} from 'react';
import Cells from "./cells";
import Navbar from "./navbar";
import DiscreteSlider from "./slider";
import Menu from "./menu";

class Seive extends Component {
    state = {
        number: 100,
        cells:[],
        isRunning:false,
        speed:500
    }

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const cells = getCells(this.state.number);
        this.setState({cells});
    }

    render() {
        return (
            <div>
                <Navbar/>
                <Menu
                    onChangeSpeed={this.changeSpeed}
                    onChangeValues={this.handleValueIncease}
                    onVisualize = {this.startSeive}
                    onRefresh = {this.handleRefresh}
                    isDisabled = {this.state.isRunning}
                />
                <Cells
                    num={this.state.number}
                    cells={this.state.cells}
                />

            </div>
        );
    }

    changeSpeed = (speed) => {
        //console.log(typeof speed);
        this.setState({speed:600-speed*10});
    }
    handleValueIncease = (value) => {
        this.setState({number:value});
        this.setState({cells:getCells(value),isRunning:false});
        console.log(value);
    }
    handleRefresh = () => {
        this.setState({cells:getCells(this.state.number),isRunning:false});
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