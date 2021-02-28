import React, {Component} from 'react';
import Rect from "./rect";

class Rects extends Component {
    render() {
        let margin = 5;
        if( this.props.rects.length>50 ){
            margin=1;
        }
        return (
            <div className="d-flex justify-content-center align-items-end">
                {this.props.rects.map( (rect,rectidx)=>{
                    return (
                        <Rect
                            marg={margin}
                            key={rectidx}
                            rect={rect}
                        />
                    );
                } )}
            </div>
        );
    }
}

export default Rects;