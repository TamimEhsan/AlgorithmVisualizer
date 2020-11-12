import React, { useState, useEffect, useRef } from 'react';

const Canvas2 = (props) => {
    const [lines,setLine] = useState([]);
    const [points,setPoints] = useState([]);
    const [isAlgoLive,setIsAlgoLive] = useState(false);
    const [pos,setPos] = useState(0);
    const [canvasDimH,setCanvasDimH] = useState(50);
    const [canvasDimW,setCanvasDimW] = useState(50);

    const canvasDots = useRef();
    const canvasLines = useRef();

    useEffect( () =>{
       let interval = null;
       console.log("inside the timer",pos);
       if( isAlgoLive ){
           if( pos >= points.length ){
               props.onAlgoStateChanged(false);
               setIsAlgoLive(false);
               return ;
           }
           interval = setInterval(() => {
               let ctx1 = canvasDots.current.getContext("2d");
              // ctx1.clearRect(0,0,canvasDimW,canvasDimH);
               ctx1.beginPath();
               ctx1.strokeStyle = "#ffffff";
               ctx1.fillStyle = "#ffffff";
               //for( let i = 0; i <points.length;i++ ){
                   ctx1.moveTo(points[pos].xx, points[pos].yy);
                   ctx1.arc(points[pos].xx, points[pos].yy, 10, 0, 2 * Math.PI);
                   ctx1.fill();
              // }
               setPos(pos => pos+1);

           }, 1000);




       } else{
           clearInterval(interval);
       }
    },[pos,points]);

    useEffect(()=>{
        setCanvasDimW(props.width);
    },[props.width]);

    useEffect(()=>{
        setCanvasDimH(props.height);
    },[props.height]);

    useEffect(()=>{
        setPoints([]);
        setPoints(props.dots);
        setIsAlgoLive(true);
        console.log( "changed", canvasDots.current );
       if(canvasDots.current!== undefined){
           console.log( "changed 2" );
           let ctx1 = canvasDots.current.getContext("2d");
           ctx1.clearRect(0,0,canvasDimW,canvasDimH);
           ctx1.beginPath();
           ctx1.strokeStyle = "#000000";
           ctx1.fillStyle = "#000000";
           for( let i = 0; i <points.length;i++ ){
               ctx1.moveTo(points[i].xx, points[i].yy);
               ctx1.arc(points[i].xx, points[i].yy, 10, 0, 2 * Math.PI);
               ctx1.fill();
           }
       }

    },[props.dots]);
    useEffect(()=>{
        console.log("invoked");
        setLine(props.lines);
        setPos(0);
        setIsAlgoLive(false);
    },[props.lines]);

    useEffect(()=>{
        if( props.isAlgoLive === true ){
            setIsAlgoLive(true);
        }else{
            setIsAlgoLive(false);
        }
    },[props.isAlgoLive]);


    return(
        <div>
            <canvas ref={canvasDots} width={canvasDimW} height={canvasDimH} style={{backgroundColor:"grey"}}/>
        </div>

    );
}

export default Canvas2;