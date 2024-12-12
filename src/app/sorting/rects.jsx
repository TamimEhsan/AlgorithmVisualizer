import React, { Component } from 'react';
import Rect from "./rect";
import FlipMove from 'react-flip-move';

const Rects = ({ rects, speed }) => {

    let margin = 5;
    if (rects.length > 50) {
        margin = 1;
    }
    return (
        <div>
            <FlipMove
                className="flex justify-center items-end"
                duration={speed}
            // easing="cubic-bezier(.12,.36,.14,1.2)"
            >
                {rects.map((rect, rectidx) => {
                    return (
                        <div key={rectidx}>
                            <Rect
                            marg={margin}
                            rect={rect}
                        />
                        </div>
                    );
                })}
            </FlipMove>
        </div>
    );

}

export default Rects;