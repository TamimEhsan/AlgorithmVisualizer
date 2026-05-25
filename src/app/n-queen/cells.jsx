import Cell from "./cell";
import './style.css';

export default function Cells({ board }) {
    return (
        <div className="booard m-5">
            {board.map((row, rowidx) => (
                <div key={rowidx}>
                    {row.map((cell, cellidx) => (
                        <Cell key={cellidx} cell={cell} />
                    ))}
                </div>
            ))}
        </div>
    );
}
