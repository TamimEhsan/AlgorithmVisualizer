import './cell.css';

export default function Cell({ cell }) {
    const getClass = () => {
        if (cell.isPrime) return "cell cell-prime bg-success text-light m-2";
        if (cell.isVisiting) return "cell cell-visiting m-2";
        if (cell.isChecking) return "cell cell-check m-2";
        return "cell m-2";
    };

    return (
        <div className={getClass()}>
            <span>{cell.val}</span>
        </div>
    );
}
