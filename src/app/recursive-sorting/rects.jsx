import React, { Component } from 'react';
import Rect from "./rect";

const Rects = ({ rects, speed }) => {

    let margin = 5;
    if (rects.length > 50) {
        margin = 1;
    }
    return (
        <div className="flex justify-center items-end">
            {rects.map((rect, rectidx) => {
                return (
                    <Rect
                        marg={margin}
                        key={rectidx}
                        rect={rect}
                    />
                );
            })}
        </div>
    );

}

export default Rects;