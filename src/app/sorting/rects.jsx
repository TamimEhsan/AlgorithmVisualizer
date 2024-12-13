import React from 'react';
import FlipMove from 'react-flip-move';
import Rect from "./rect";

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