
import "./node.css";

export default function Node({ node, onMouseDown, onMouseEnter, onMouseUp }) {
    return (
        <div
            id={`node-${node.row}-${node.col}`}
            className={getClassName()}
            onMouseDown={() => onMouseDown(node.row, node.col)}
            onMouseEnter={() => onMouseEnter(node.row, node.col)}
            onMouseUp={() => onMouseUp(node.row, node.col)}
        />
    );

    function getClassName() {
        if (node.isAlive === true) {
            return "node node-wall";
        }else {
            return "node";
        }
    }
}