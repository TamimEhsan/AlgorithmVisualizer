import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Edge from "./edge";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const SimpleSelect = (props) => {
    const classes = useStyles();
    const [age, setAge] = React.useState('0');
    const [state, setState] = React.useState({
        pos: props.pos,
    });
    const handleChange = (event) => {
        console.log(state.pos);
        setAge(event.target.value);
        props.onValueChanged(state.pos, event.target.value);
    };
    // console.log(props.items);
    return (
        <div className="ml-2 mr-2">
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    onChange={handleChange}
                >
                    {props.items.map((item, cellidx) => {
                        return (
                            <MenuItem value={cellidx} style={{selected: true}}>{item}</MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );
}

export default SimpleSelect;