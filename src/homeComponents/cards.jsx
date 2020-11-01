import React, {Component} from 'react';
import ImgMediaCard from "./card";
import "./style.css";
import {Link} from "react-router-dom";
class Cards extends Component {
    state = {
        cards:[
            {
                id:1,
                title:"Pathfinder",
                description:"Visualize graph algorithms like dijkstra, BFS, DFS",
                route:"/Pathfinder-2.0/pathfinder"
            },
            {
                id:2,
                title:"Prime Numbers",
                description:"Visulaize how Seive is better than brute force",
                route:"/Pathfinder-2.0/prime"
            },
            {
                id:3,
                title:"Sorting Algorithm",
                description:"Coming soon...",
                route:"/Pathfinder-2.0/"
            },
            {
                id:3,
                title:"8 Queen",
                description:"Coming soon...",
                route:"/Pathfinder-2.0/"
            },
            {
                id:4,
                title:"Backtracking",
                description:"Coming soon...",
                route:"/Pathfinder-2.0/"
            }
        ]
    }
    render() {
        return (
            <div className="d-flex flex-wrap justify-content-center Cards p-lg-5" >
                {
                    this.state.cards.map(card=>(
                        <Link to={card.route}>
                            <ImgMediaCard
                                key={card.id}
                                title={card.title}
                                description={card.description}/>
                        </Link>
                    ))
                }
            </div>
        );
    }
}

export default Cards;