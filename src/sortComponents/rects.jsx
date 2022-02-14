import React, {Component} from 'react';
import Rect from "./rect";
import FlipMove from 'react-flip-move';

class Rects extends Component {
    render() {
        let margin = 5;
        if( this.props.rects.length>50 ){
            margin=1;
        }
        return (
            <div>
                <FlipMove
                    className="d-flex justify-content-center align-items-end"
                    duration={this.props.speed}
                    // easing="cubic-bezier(.12,.36,.14,1.2)"
                >
                {this.props.rects.map( (rect,rectidx)=>{
                    return (
                        <Rect
                            marg={margin}
                            key={rect.kk}
                            rect={rect}
                        />
                    );
                } )}
                </FlipMove>
            </div>
        );
    }
}

export default Rects;