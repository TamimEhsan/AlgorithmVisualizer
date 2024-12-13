import './style.css';

const Rect = ({ marg, rect }) => {

    const checkColor = () => {
        if (rect.isSorted) {
            return "green";
        } else if (rect.isSorting) {
            return "red";
        } else {
            return "black"
        }
    }

    return (
        <div
            className='rect'
            style={{
                height: rect.width,
                background: checkColor(),
                margin: marg,
                // float:'left',
                verticalAlign: 'middle'
            }}
        >
        </div>
    );


}

export default Rect;