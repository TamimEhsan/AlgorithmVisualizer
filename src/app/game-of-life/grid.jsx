
import './grid.css';
import Node from "./node";


export default function Grid({ grid, onMouseDown, onMouseEnter, onMouseUp }) {
    return (
        <div className="Grid">
            {grid.map((row, rowidx) => {
                return (
                    <div key={rowidx}>
                        {row.map((node, nodeidx) => {
                            const { row, col, isAlive } = node;
                            return (
                                <Node
                                    key={nodeidx}
                                    row={row}
                                    col={col}
                                    node={node}
                                    isAlive={isAlive}
                                    onMouseDown={onMouseDown}
                                    onMouseEnter={onMouseEnter}
                                    onMouseUp={onMouseUp}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}