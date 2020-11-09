import React, {Component} from 'react';
import './style.css'
import queen from './queen.png';
class Cell extends Component {
    render() {
        return (
            <div className={this.getClassName()}>
                { this.props.cell.isPresent && <img src={queen} height='100px' style={{padding:"25px"}}/> }
            </div>
        );
    }
    getClassName = ()=>{
        if(this.props.cell.isAttacked){
            return "boardCell attacked";
        } else if(this.props.cell.isCurrent){
            return "boardCell current";
        }else if(this.props.cell.isPresent){
            return "boardCell present";
        }else if(this.props.cell.isChecked){
            return "boardCell checked";
        } else{
            return "boardCell";
        }
    }
}

export default Cell;