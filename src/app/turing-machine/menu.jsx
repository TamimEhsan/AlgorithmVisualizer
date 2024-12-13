import React, { Component } from 'react';

import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';


class Menu extends Component {
    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <h2 className="text-lg font-semibold">Settings</h2>
                <CustomSelect
                    title="Select Algorithm"
                    options={["Bitwise NOT", "Add one", "2's Complement"]}
                    onChange={this.props.onAlgoChanged}
                />


                <div className="input-group mt-2 col-3">
                    <input type="text" id='inputText1' className="form-control" placeholder="Input Binary"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={this.props.setInput1}
                    />
                </div>
                <div className="input-group mt-2 col-3">
                    <input type="text" id='inputText1' className="form-control" placeholder="Input Binary 2"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={this.props.setInput2}
                    />
                </div>


                <Button
                    className="w-full"
                    onClick={this.props.onReset}
                    disabled={this.props.disable}
                >Reset</Button>

                <Button
                    className="w-full"
                    onClick={this.props.visualize}
                    disabled={this.props.disable}
                >Visualize</Button>

            </div>
        );
    }
    isClickable = () => {
        if (this.props.disable) {
            return { cursor: "not-allowed" };
        } else {
            return {};
        }
    }
}


export default Menu;