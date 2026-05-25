import './style.css';

export default function Rect({ marg, rect }) {
    const checkColor = () => {
        if (rect.isSorted) return "green";
        if (rect.isSorting) return "orange";
        if (rect.isLeft) return "red";
        if (rect.isRight) return "purple";
        return "#ADD8E6";
    };

    const checkBorder = () => {
        if (rect.isRange) return "0px solid black";
        return "0px";
    };

    return (
        <div
            className="rect"
            style={{
                height: rect.width,
                border: checkBorder(),
                background: checkColor(),
                margin: marg,
            }}
        />
    );
}
