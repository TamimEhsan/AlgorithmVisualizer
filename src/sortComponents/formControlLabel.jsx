import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function SwitchLabels(props) {
    const [state, setState] = React.useState({
        checkedA: false,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        props.onDoubleChange(event.target.checked);
    };

    return (
        <FormGroup row>
            <FormControlLabel
                control={<Switch checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                label="Duo"
                disabled={props.disable}
            />

        </FormGroup>
    );
}
