import './cell.css';
const Cell = ({val}) => {
    
    return (
        <div className={'turing-cell'}>
            {val}
        </div>
    );
    
}

export default Cell;