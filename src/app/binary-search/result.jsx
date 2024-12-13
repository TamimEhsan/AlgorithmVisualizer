import { Button } from '@/components/ui/button';
import React, { Component } from 'react';
class Result extends Component {
    render() {
        return (
            <div>
                <span className='text-3xl display-3'>
                    Your number is {this.props.res}
                </span> <br />
                <Button
                    className='btn btn-warning btn-lg'
                    onClick={this.props.onRestart}
                >
                    Restart
                </Button>
            </div>
        );
    }
}

export default Result;