import './style.css';

export default function Cell({ cell }) {
    const getClassName = () => {
        if (cell.isAttacked) return "boardCell attacked";
        if (cell.isCurrent) return "boardCell current";
        if (cell.isPresent) return "boardCell present";
        if (cell.isChecked) return "boardCell checked";
        return "boardCell";
    };

    const getStyle = () => ({
        backgroundColor: (cell.row + cell.col) % 2 === 0 ? "white" : "grey"
    });

    return (
        <div className={getClassName()} style={getStyle()}>
            {cell.isPresent && (
                <img
                    src="/AlgorithmVisualizer/images/queen-cell.png"
                    alt="Queen"
                    height="100px"
                    style={{ padding: "25px" }}
                />
            )}
        </div>
    );
}
