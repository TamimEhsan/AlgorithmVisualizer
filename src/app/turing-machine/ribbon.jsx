import React, { Component } from 'react';
import Cell from "./cell";
import FlipMove from 'react-flip-move';

const Ribbon = ({ strip, midCell, cellCount, cellStart, cellEnd }) => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-caret-down-fill" viewBox="0 0 16 16">
                <path
                    d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
            <FlipMove
                className="flex justify-center items-end"
                duration={100}
            // easing="cubic-bezier(.12,.36,.14,1.2)"
            >
                {strip
                    .filter(cell => cell.id >= cellStart && cell.id <= cellEnd)
                    .map((cell, cellidx) => {
                        return (
                            <div key={cell.id}>
                            <Cell
                                id={cell.id + 50}
                                val={cell.val}
                            />
                            </div>
                        );
                    })}
            </FlipMove>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-caret-up-fill" viewBox="0 0 16 16">
                <path
                    d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
            </svg>
        </div>
    );

}

export default Ribbon;