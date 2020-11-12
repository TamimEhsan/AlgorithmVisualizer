import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
class TextFields extends Component {
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
                    />

            </div>
        );
    }

}

export default TextFields;