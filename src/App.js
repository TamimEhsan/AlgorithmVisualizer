import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Pathfinder from "./pathfinderComponents/pathfinder";
import Home from "./homeComponents/home";

class App extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
        console.log(window.innerHeight,"  ",window.innerWidth);
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/Pathfinder-2.0/' exact component={Home}/>
                    <Route path='/Pathfinder-2.0/pathfinder'  component={Pathfinder}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
