import React, {Component} from 'react';
import Vertex from "./vertex";
import Cell from "../Turing Machine/cell";
import Edge from "./edge";

class CanvasSvg extends Component {
    constructor() {
        super();
        this.state = {
            pos: {
                x: 50,
                y: 10
            }
        }
    }

    increamentXY = ()=>{
        let pos = this.state.pos;
        pos.x = (pos.x+50)%240;
        this.setState({pos});
    }

    render() {
        console.log(this.props.vertices.length);
        return (
            <div>
                <svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
                    {
                        this.props.edges.map((edge, cellidx) => {
                            return (
                                <Edge
                                    // key={vertex.id}
                                    // id={cell.id+50}

                                    pos={ {x1:edge.x1*10+50,y1:edge.y1*10+10,
                                        x2:edge.x2*10+50,y2:edge.y2*10+10} }
                                />
                            );
                        })}
                    }
                    {
                        this.props.vertices.map((vertex, cellidx) => {
                            return (
                                <Vertex
                                    // key={vertex.id}
                                    // id={cell.id+50}
                                    current={this.props.current === cellidx}
                                    label={vertex.val}
                                    pos={ {x:vertex.x*10+50,y:vertex.y*10+10} }
                                />
                            );
                        })}
                    }


                </svg>
            </div>
        )
            ;
    }
}

export default CanvasSvg;