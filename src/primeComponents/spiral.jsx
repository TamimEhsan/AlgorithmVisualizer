import React, {Component} from 'react';
import Cell from "./cell";

class Spiral extends Component {

    render() {
        let Maxwidth = window.innerWidth;
        let MaxHeight = window.innerHeight;

        let width,height;
        let maxPrime = this.props.maxPrime;
        if( Maxwidth>MaxHeight ){
            let ratio = Maxwidth/MaxHeight;
            height = maxPrime;
            width = ratio*height;
        }else{
            let ratio = MaxHeight/Maxwidth;
            width = maxPrime;
            height = ratio*width;

        }

        // console.log(width,height);
        let radius = (Math.min(width,height))/300;
        return (
            <div className={'bg-dark'}>
                {/*sdfsdfsdfsdfsdfsdf*/}
                <svg viewBox={"0 0 "+2*width+" "+2*height} xmlns="http://www.w3.org/2000/svg">
                    {this.props.primes.map( (cell,cellidx)=>{
                        return (
                            <circle
                                id={cellidx}
                                cx={cell*Math.cos(cell)+width}
                                cy={cell*Math.sin(cell)+height}
                                r={radius}
                                stroke="black" stroke-width="0.5" fill='#51c4b5'

                            />
                        );
                    } )}
                </svg>
            </div>
        );
    }
}

export default Spiral;