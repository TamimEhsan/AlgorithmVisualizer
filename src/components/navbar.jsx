import React from 'react';
import { Link } from "react-router-dom";

export default function Navbar(props){
    
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-light">
            <div>
            <span className="navbar-brand text-black px-3">{props.title}</span>
            <Link to={"/"} className="text-decoration-none text-black"> Home </Link>
            </div>
            {/* <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent" >
                <Link to={"/"} className="text-decoration-none text-black"> Home </Link>
            </div> */}

        </nav>
    );
    
}
