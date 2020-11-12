import React, {Component} from 'react';
import ImgMediaCard from "./card";
import ImgMediaCard2 from "./card2";
import "./style.css";
import {Link} from "react-router-dom";
import graph from "./images/graph.png";
import primes from "./images/primes.jpg"
import sort from "./sort.png"
import queen from './images/queen.PNG'
import binSearch from './images/binaryTree.png'
import {getDetails} from "./cardDetails";
class Cards extends Component {

    state = {
        cards:[]
    }

    componentDidMount() {
        this.setState({cards:getDetails()});
    }

    render() {
        return (
            <div className="d-flex flex-wrap justify-content-center Cards p-lg-5" >
                {
                    this.state.cards.map(card=>(
                        <div>
                            <ImgMediaCard2
                                className="d-flex flex-wrap"
                                key={card.id}
                                card={card}/>
                        </div>
                    ))
                }

            </div>
        );
    }
}

export default Cards;
/*
<div>
   <ImgMediaCard2
       className="d-flex flex-wrap"
       key={card.id}
       card={card}/>
</div>
 */