import React, {Component} from 'react';

import Rects from "./rects";
import {bubbleSort,selectionSort,insertionSort} from "../algorithms/sortingAlgorithms";
import {quickSort} from "../algorithms/quickSort";
import Navbar from "./navbar";
import Menu from "./menu";

class Sort extends Component {
  state = {
      count:20,
      rects: [],
      rects2: [],
      doubles:false,
      speed:50,
      isRunning:false,
      isRunning1:false,
      isRunning2:false,
      algo1:0,
      algo2:0
  }

  componentDidMount() {
      const rect = getInitialRects(this.state.count);
      const rect2 = rect.slice();
      this.setState({rects:rect,rects2:rect2});
  }

    render() {
    return (
        <React.Fragment>
            <Navbar/>
            <Menu
                disable={this.state.isRunning}
                onDoubleChange={this.handleDouble}
                onViusalize={this.handleSort}
                onRandomize={this.handleRandomize}
                onRefresh={this.handleRefresh}
                onCountChange={this.handleCountChange}
                onAlgoChanged={this.handleAlgoChanged}
                onSpeedChange={this.handleSpeedChanged}
            />
            <div className=' justify-content-center'>

                <Rects
                    speed={this.state.speed}
                    rects={this.state.rects}
                />
                { this.state.doubles && <hr style={{width:"90%"}}/>}
                { this.state.doubles &&
                <Rects
                    rects={this.state.rects2}
                /> }
            </div>
        </React.Fragment>
    );
  }
  handleRandomize = () => {
      const rect = getInitialRects(this.state.count);
      const rect2 = rect.slice();
      this.setState({rects:rect,rects2:rect2});
  }
  handleRefresh = () =>{
      const rects = this.state.rects;
      for(let i=0;i<rects.length;i++){
          const rect = {...rects[i],isSorted:false, isSorting:false}
          rects[i] = rect;
      }
      const rects2 = rects.slice();
      this.setState({rects,rects2});
  }

  handleDouble = (val) =>{
      this.setState({doubles:val});
  }
  handleCountChange = (val) => {
      this.setState({count:val});
      this.handleRandomize();
  }
  handleAlgoChanged = (pos,val) =>{
      if( pos === 0 ){
          this.setState({algo1:val});
      } else{
          this.setState({algo2:val});
      }
  }
  handleSpeedChanged = (val) =>{
    const speed = (760-val*7.5);
    this.setState({speed});
  }
  handleSort = () =>{

      this.setState({isRunning:true});
      let steps1;
      switch (this.state.algo1){
          case 0:
              steps1 = bubbleSort(this.state.rects);
              break;
          case 1:
              steps1 = selectionSort(this.state.rects);
              break;
          case 2:
              steps1 = insertionSort(this.state.rects);
              break;
          case 3:
              steps1 = quickSort(this.state.rects2);
              console.log(steps1)
              break;
          default:
              steps1 = bubbleSort(this.state.rects);
              break;
      }
      let steps2;
      if( this.state.doubles ){

          switch (this.state.algo2){
              case 0:
                  steps2 = bubbleSort(this.state.rects2);
                  break;
              case 1:
                  steps2 = selectionSort(this.state.rects2);
                  break;
              case 2:
                  steps2 = insertionSort(this.state.rects2);
                  break;
              case 3:
                  steps2 = quickSort(this.state.rects2);
                  break;
              default:
                  steps2 = bubbleSort(this.state.rects2);
                  break;
          }

      }
      this.handleFirst(steps1);
      if( this.state.doubles ) this.handleSecond(steps2);
  }
  handleFirst = async (steps) =>{
     // console.log("fsdfsdfsdfasdf");
      this.setState({isRunning1:true});

     // const steps = bubbleSort(this.state.rects);
    //  console.log(steps.length);
      const prevRect = this.state.rects;
      for(let i = 0;i<steps.length;i++){
       //   setTimeout(()=>{
              if( i!==0 ){
                  prevRect[steps[i-1].xx] = { ...prevRect[steps[i-1].xx],isSorting:false };
                  prevRect[steps[i-1].yy] = { ...prevRect[steps[i-1].yy],isSorting:false };
              }
              if(steps[i].xx===steps[i].yy){
                  prevRect[steps[i].xx] = {...prevRect[steps[i].xx],isSorted:true,isSorting:false};
              }else if( steps[i].changed ){
                  const recti = {...prevRect[steps[i].xx],isSorting:true};
                  const rectj = {...prevRect[steps[i].yy],isSorting:true};
                  prevRect[steps[i].yy] = recti;
                  prevRect[steps[i].xx] = rectj;
              } else{
                  prevRect[steps[i].xx] = {...prevRect[steps[i].xx],isSorting:true};
                  prevRect[steps[i].yy] = {...prevRect[steps[i].yy],isSorting:true};
              }
              if(i === steps.length-1){
                  this.setState({isRunning1:false});
                  if( this.state.isRunning2 === false ){
                      this.setState({isRunning:false});
                  }
              }
             /* if( i === (steps.length)-2 ){
                  this.setState({isRunning1:false});
                  if( this.state.isRunning2 === false ){
                      this.setState({isRunning:false});
                  }
                  prevRect[steps[i].xx] = {...prevRect[steps[i].xx],isSorting:false,isSorted:true};
                  prevRect[steps[i].yy] = {...prevRect[steps[i].yy],isSorting:false,isSorted:true};
              }*/
              this.setState({rects:prevRect});
              await sleep(this.state.speed);
         // },i*speed);
      }
  }
    handleSecond = async (steps) =>{
        this.setState({isRunning2:true});
        const prevRect = this.state.rects2;
        for(let i = 0;i<steps.length;i++){
         //   setTimeout(()=>{
                if( i!==0 ){
                    prevRect[steps[i-1].xx] = { ...prevRect[steps[i-1].xx],isSorting:false };
                    prevRect[steps[i-1].yy] = { ...prevRect[steps[i-1].yy],isSorting:false };
                }
                if(steps[i].xx===steps[i].yy){
                    prevRect[steps[i].xx] = {...prevRect[steps[i].xx],isSorted:true,isSorting:false};
                }else if( steps[i].changed ){
                    const recti = {...prevRect[steps[i].xx],isSorting:true};
                    const rectj = {...prevRect[steps[i].yy],isSorting:true};
                    prevRect[steps[i].yy] = recti;
                    prevRect[steps[i].xx] = rectj;
                } else{
                    prevRect[steps[i].xx] = {...prevRect[steps[i].xx],isSorting:true};
                    prevRect[steps[i].yy] = {...prevRect[steps[i].yy],isSorting:true};
                }
                if( i === steps.length-1 ){
                    this.setState({isRunning2:false});
                    if( this.state.isRunning1 === false ){
                        this.setState({isRunning:false});
                    }
                }
               /* if( i === (steps.length)-2 ){
                    prevRect[steps[i].xx] = {...prevRect[steps[i].xx],isSorting:false,isSorted:true};
                    prevRect[steps[i].yy] = {...prevRect[steps[i].yy],isSorting:false,isSorted:true};
                    this.setState({isRunning2:false});
                    if( this.state.isRunning1 === false ){
                        this.setState({isRunning:false});
                    }
                }*/
                this.setState({rects2:prevRect});
                await sleep(this.state.speed);
           // },i*speed);
        }
    }


}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const getInitialRects = (tot) => {
    const rects = [];
    for(let i = 0;i<tot;i++){
        rects.push(getRect(i));
    }
    return rects;
}
const getRect = (kk) => {
  return {
      width: Math.floor(Math.random() * 200)+50,
      isSorted:false,
      isSorting:false,
      kk:kk
  }
}
export default Sort;
