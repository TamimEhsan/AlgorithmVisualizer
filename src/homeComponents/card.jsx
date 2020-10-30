import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import "./style.css";
import "./graph.png";
import logo from "../logo.svg";
import graph from "./graph.png"
const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        minHeight:250,
        minWidth:350,
        margin:15
    },
    media: {
        height: 140
    }
});

export default function ImgMediaCard(props) {
    const classes = useStyles();
    return (
        <Card
            className={classes.root}
            m={20}
        >
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="140"
                    src={graph}
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {props.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
