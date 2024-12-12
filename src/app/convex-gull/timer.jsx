import React, {Component} from 'react';

class MyTimer extends Component {
    state={
        time:0,
        going:false,
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if( prevProps.onGoing!==this.props.onGoing ){
            this.setState({going:this.props.onGoing});
            if( this.props.onGoing ){
                this.startCount();
            }
        }
    }
    startCount = async () => {
        while (this.props.onGoing){
            this.setState({time:this.state.time+1});
            if( this.state.time>10){
                this.setState({time:0});
                this.props.onStop();
            }
            await sleep(100);
        }
    }

    render() {
        return (
            <div>
                <h2>
                    <span className='badge badge-danger'>
                    {this.state.time}
                </span>
                </h2>
            </div>
        );
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default MyTimer;