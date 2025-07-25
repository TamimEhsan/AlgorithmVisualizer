import React from 'react';
import Cell from "./Cell";
import '../styles/cells.css';

const Cells = ({ cells }) => {
    return (
        <div className="Cells">
            {cells.map((cell, cellidx) => (
                <Cell
                    key={cellidx}
                    cell={cell}
                />
            ))}
        </div>
    );
};

export default Cells;
