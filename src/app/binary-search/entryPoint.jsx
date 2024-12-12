import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';


class EntryPoint extends Component {
    state={
        error:false
    }
    render() {
        return (
            <div>
                <TextField
                    error={this.state.error}
                    id="standard-error-helper-text"
                    label="Upper Number"
                    type="number"
                    variant="outlined"
                    onChange={this.getData}
                /> <br /><br />
                <h1>
                    Guess a number between 0 and {this.props.upper}
                </h1>
                <br />
                <button
                    className='btn btn-warning btn-lg'
                    onClick={this.props.startGame}
                >
                    Start the game
                </button>
            </div>
        );
    }
    getData = (e)=>{
        if( e.target.value!== "" ){
            console.log(e.target.value);
            this.props.setUpper(e.target.value);
        }
        else{
            this.props.setUpper(100)
        }
    }
    validateNumbers = () =>{

    }
}

export default EntryPoint;