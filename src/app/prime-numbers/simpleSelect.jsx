import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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


        console.log('aa ',event.target.value);
        setAge(event.target.value);
        props.onAlgoChanged(state.pos,event.target.value);
    };

    return (
        <div className="ml-2 mr-2">
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Task</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    onChange={handleChange}
                >
                    <MenuItem value={0} style={{selected:true}} >Seive</MenuItem>
                    <MenuItem value={1} style={{selected:true}} >Archimedes Spiral</MenuItem>
                    {/*<MenuItem value={3} style={{selected:true}} >Bitwise AND</MenuItem>*/}
                    {/*<MenuItem value={4} style={{selected:true}} >Bitwise OR</MenuItem>*/}
                </Select>
            </FormControl>
        </div>
    );
}

export default SimpleSelect;