import Node from "./node";
import './grid.css';

export default function Grid({ grid, onMouseDown, onMouseEnter, onMouseUp }) {
    return (
        <div className="Grid">
            {grid.map((row, rowidx) => (
                <div key={rowidx}>
                    {row.map((node, nodeidx) => (
                        <Node
                            key={nodeidx}
                            row={node.row}
                            col={node.col}
                            node={node}
                            onMouseDown={onMouseDown}
                            onMouseEnter={onMouseEnter}
                            onMouseUp={onMouseUp}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
