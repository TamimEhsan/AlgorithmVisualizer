import { Component } from 'react';
import TreeEdge from "../common/tree/TreeEdge";
import TreeVertex from "../common/tree/TreeVertex";

class CanvasSvg extends Component {
    render() {
        let off = this.props.offset;
        
        return (
            <div className="w-full h-full">
                <svg viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {this.props.edges.map((edge, index) => (
                        <TreeEdge
                            key={`edge-${index}`}
                            id={index}
                            pos={{
                                x1: (edge.x1 - off) * 15 + 120,
                                y1: edge.y1 * 15 + 10,
                                x2: (edge.x2 - off) * 15 + 120,
                                y2: edge.y2 * 15 + 10
                            }}
                        />
                    ))}
                    
                    {this.props.vertices.map((vertex, index) => (
                        <TreeVertex
                            key={`vertex-${index}`}
                            id={index}
                            current={this.props.current === index}
                            label={vertex.label}
                            ret={vertex.val}
                            pos={{
                                x: (vertex.x - off) * 15 + 120,
                                y: vertex.y * 15 + 10,
                                px: (vertex.px - off) * 15 + 120,
                                py: vertex.py * 15 + 10
                            }}
                        />
                    ))}
                </svg>
            </div>
        );
    }
}

export default CanvasSvg;
