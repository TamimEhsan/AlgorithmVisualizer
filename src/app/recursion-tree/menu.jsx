import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Component } from 'react';


class Menu extends Component {
    render() {
        return (
            <div className="bg-gray-100 p-4 flex flex-wrap items-center gap-4">

                <CustomSelect
                    title="Select Task"
                    options={['Fibonacci','Binomial Coefficient',"Derangement","Bigmod","Stirling2"]}
                    onChange={this.props.setAlgo}
                />
                <CustomSelect
                    title={'N'}
                    options={["0","1","2","3","4","5","6"]}
                    onChange={this.props.setN}
                />
                <CustomSelect
                    title={'R'}
                    options={["0","1","2","3","4","5","6"]}
                    onChange={this.props.setR}
                />
                <Button
                    onClick={this.props.onReset}
                    disabled={this.props.disable}
                >Reset</Button>

                <Button
                    onClick={this.props.onStart}
                    disabled={this.props.disable}
                >Visualize</Button>

            </div>
    );
    }
    isClickable = () =>
        {
            if (this.props.disable) {
                return {cursor: "not-allowed"};
            } else {
                return {};
            }
        }
    }


    export default Menu;