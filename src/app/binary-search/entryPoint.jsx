import { CustomInput } from '@/components/custom-input';
import { Button } from '@/components/ui/button';
import { Component } from 'react';


class EntryPoint extends Component {
    state = {
        error: false
    }
    render() {
        return (
            <div className='flex flex-col items-center space-y-4'>
                <CustomInput
                    title="Upper Number"
                    defaultValue={100}
                    type={"number"}
                    onChange={this.setData}
                    placeholder="Enter value..."
                />
                 <br /><br />
                <h1 className='text-3xl'>
                    Guess a number between 0 and {this.props.upper}
                </h1>
                <br />
                <Button
                    onClick={this.props.startGame}
                >
                    Start the game
                </Button>
            </div>
        );
    }

    setData = (val) => {
        if (val === "") {
            val = 0;
        }
        this.props.setUpper(val);
    }
    getData = (e) => {
        if (e.target.value !== "") {
            console.log(e.target.value);
            this.props.setUpper(e.target.value);
        }
        else {
            this.props.setUpper(100)
        }
    }
    validateNumbers = () => {

    }
}

export default EntryPoint;