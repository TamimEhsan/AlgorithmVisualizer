import Cell from "./cell";
import './cells.css';

export default function Cells({ cells }) {
    return (
        <div className="Cells">
            {cells.map((cell, cellidx) => (
                <Cell key={cellidx} cell={cell} />
            ))}
        </div>
    );
}
