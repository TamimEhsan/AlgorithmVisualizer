import './node.css';

export default function Node({ row, col, node, onMouseDown, onMouseEnter, onMouseUp }) {
    const getClassName = () => {
        if (node.isWall) return "node node-wall";
        if (node.isStartNode) return "node node-start";
        if (node.isEndNode) return "node node-end";
        if (node.ispathNode) return "node node-shortest-path";
        if (node.isVisited) return "node node-visited";
        return "node";
    };

    return (
        <div
            id={`node-${row}-${col}`}
            className={getClassName()}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp(row, col)}
        />
    );
}
