import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: 300,
    },
});

function valuetext(value) {
    return `${value}`;
}


export default function DiscreteSlider(props) {
    const classes = useStyles();
    const handleChange = (event) =>{
        if( event.target.innerText === "" ){
            return;
        }
        const num = parseInt(event.target.innerText,10);
        props.onChange(num);
    }
    return (
        <div className={classes.root+" ml-2 mr-2"}>
            <Typography id="discrete-slider" gutterBottom>
                {props.title}
            </Typography>
            <Slider
                defaultValue={props.default}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                onChangeCommitted={handleChange}
                step={props.step}
                marks={props.marks}
                min={props.min}
                max={props.max}
                valueLabelDisplay="on"
                disabled={props.isDisabled}
            />
        </div>
    );
}
