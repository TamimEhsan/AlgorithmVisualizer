import React, {Component} from 'react';
import SimpleSelect from "./simpleSelect";

class Menu extends Component {
    render() {
        return (
            <nav className="nav alert-dark" >
                <SimpleSelect
                    onAlgoChanged = {this.props.onAlgoChanged}
                />
                <button
                    onClick={this.props.onVisualize}
                    className="btn btn-warning m-2">Visualize</button>

            </nav>
        );
    }
}

export default Menu;