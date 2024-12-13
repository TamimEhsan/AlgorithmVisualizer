import React, {Component} from 'react';
import Cell from "./cell";
import './style.css';
class Cells extends Component {
    render() {
        return (
            <div className='booard m-5' >
                {this.props.board.map( (row,rowidx)=>{
                    return(
                        <div key={rowidx}>
                            {row.map( (cell,cellidx)=>{
                                return(
                                    <Cell
                                        key={cellidx}
                                        cell={cell}/>
                                );
                            } )}
                        </div>
                    );
                } )}
            </div>
        );
    }
}

export default Cells;