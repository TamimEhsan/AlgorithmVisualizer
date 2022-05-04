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
        let off = this.props.offset;
        return (
            <div>
                <svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
                    {
                        this.props.edges.map((edge, cellidx) => {
                            return (
                                <Edge
                                    // key={vertex.id}
                                    id={cellidx}

                                    pos={ {x1:(edge.x1-off)*15+120,y1:edge.y1*15+10,
                                        x2:(edge.x2-off)*15+120,y2:edge.y2*15+10} }
                                />
                            );
                        })}
                    }
                    {
                        this.props.vertices.map((vertex, cellidx) => {
                            return (
                                <Vertex
                                    // key={vertex.id}
                                    id={cellidx}
                                    current={this.props.current === cellidx}
                                    label={vertex.label}
                                    ret={vertex.val}
                                    pos={ {x:(vertex.x-off)*15+120,y:vertex.y*15+10,
                                        px:(vertex.px-off)*15+120,py:vertex.py*15+10} }
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