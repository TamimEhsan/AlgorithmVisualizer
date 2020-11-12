import React, {Component} from 'react';

class Result extends Component {
    render() {
        return (
            <div>
                <span className='display-3'>
                    Your number is {this.props.res}
                </span> <br />
                <button
                    className='btn btn-warning btn-lg'
                    onClick={this.props.onRestart}
                >
                    Restart
                </button>
            </div>
        );
    }
}

export default Result;