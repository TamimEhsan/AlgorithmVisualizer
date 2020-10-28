import React, {Component} from 'react';
import Window from "./components/window";

class App extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
        console.log(window.innerHeight,"  ",window.innerWidth);
    }

    render() {
        return (
            <React.Fragment>
                <Window/>
            </React.Fragment>
        );
    }
}

export default App;
