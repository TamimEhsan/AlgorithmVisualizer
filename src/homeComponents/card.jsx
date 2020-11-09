import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "./style.css";
import "./images/graph.png";
import {ExpandMore} from "@material-ui/icons";

const useStyles = makeStyles({
    card: {
        minWidth: 350,
        maxWidth:350,
        minHeight:250,
        borderRadius: 5,
        '&:hover': {
            boxShadow: `0 6px 12px 0 #000000
                .rotate(-12)
                .darken(0.2)
                .fade(0.5)}`
                ,
        },
    },
    media: {
        height: 140
    },
    actionArea: {
        padding:15,
        transition: '0.2s',
        '&:hover': {
            transform: 'scale(1.1)',

        },
    },
});

export default function ImgMediaCard(props) {
    const classes = useStyles();

    return (
        <CardActionArea className={classes.actionArea} m={20}>
            <Card
                className={classes.card}
                >
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="140"
                    src={props.card.img}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2"  >
                        {props.card.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.card.description}
                    </Typography>
                    <ExpandMore/>
                </CardContent>
            </Card>
        </CardActionArea>
    );
}
