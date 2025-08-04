import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { div } from '@/components/ui/div';
import { Component } from 'react';

class Menu extends Component {
    handleInputChange = (event) => {
        const value = parseInt(event.target.value) || 0;
        this.props.setInputValue(value);
    }

    handleHeapTypeChange = (index) => {
        this.props.setHeapType(index === 0); // 0 = Max Heap, 1 = Min Heap
    }

    render() {
        return (
            <div className="w-64 bg-gray-100 p-4 space-y-6">
                <h2 className="text-lg font-semibold">Heap Controls</h2>
                
                <CustomSelect
                    title="Heap Type"
                    options={['Max Heap', 'Min Heap']}
                    onChange={this.handleHeapTypeChange}
                />

                <div className="space-y-2">
                    <div htmlFor="value-input">Value to Insert</div>
                    <Input
                        id="value-input"
                        type="number"
                        value={this.props.inputValue}
                        onChange={this.handleInputChange}
                        placeholder="Enter value"
                        disabled={this.props.disable}
                    />
                </div>

                <div className="space-y-2">
                    <div>Heap Info</div>
                    <div className="text-sm text-gray-600">
                        <p>Type: {this.props.isMaxHeap ? 'Max Heap' : 'Min Heap'}</p>
                        <p>Size: {this.props.heapSize}</p>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={this.props.onPush}
                    disabled={this.props.disable}
                    style={this.isClickable()}
                >
                    Push Value
                </Button>

                <Button
                    className="w-full"
                    onClick={this.props.onPop}
                    disabled={this.props.disable || this.props.heapSize === 0}
                    style={this.isClickable()}
                >
                    Pop Value
                </Button>

                <Button
                    className="w-full"
                    onClick={this.props.onReset}
                    disabled={this.props.disable}
                    variant="outline"
                    style={this.isClickable()}
                >
                    Reset Heap
                </Button>
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
