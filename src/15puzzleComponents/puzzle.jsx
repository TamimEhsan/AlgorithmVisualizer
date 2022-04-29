import React, {Component} from 'react';
import Navbar from "./navbar";
import FlipMove from 'react-flip-move';
import SvgLines from 'react-mt-svg-lines';
import '../helpers/array_helpers';
import './style.css';
import {times} from 'lodash';

const FLIP_DURATION = 750;

class Puzzle extends Component {
    constructor() {
        super();
        this.state = {
            squares: times(16, i => ({
                value: i
            })),
        };
    }

    balsal = async () => {
        for (let i = 0; i < 15; i++) {
            this.setState({
                squares: this.state.squares.slice().swap(i, i + 1)
            });
            await sleep(500);
        }

    }

    render() {
        let classNames;
        return (

            <div style={{backgroundColor: "#57407c"}}
                 className={'full-height'}
            >
                <Navbar/>
                <div className={'justify-content-around '}
                     style={{textAlign: "Center"}}>
                    <div style={{textAlign: "center", height: "440px", width: "440px", margin: 'auto'}}
                         className={"m-5"}>
                        <FlipMove
                            duration={FLIP_DURATION}
                            easing="cubic-bezier(.12,.36,.14,1.2)"
                        >
                            {this.state.squares.map((stt) =>
                                <div key={stt.value}
                                     className={stt.value === 0 ? "square " : stt.value % 2 === 0 ? 'square shadow correct pt-1' : 'square shadow painted pt-1'}
                                >
                                    {stt.value === 0 ? "" : stt.value}
                                </div>
                            )}
                            <br/>
                        </FlipMove>
                        <button className={"btn btn-secondary"} onClick={this.balsal}>Animate</button>
                    </div>

                    {/*<FlipMove*/}
                    {/*    duration={FLIP_DURATION}*/}
                    {/*          easing="cubic-bezier(.12,.36,.14,1.2)" >*/}
                    {/*    <line key={5464} style={{strokeWidth: "3px", stroke: '#999'}} x2={299} y2={186}*/}
                    {/*          x1={(this.state.squares[0].value + 1) * 50}*/}
                    {/*          y1={(this.state.squares[0].value + 1) * 50}></line>*/}
                    {/*    <div key={this.state.squares[0].value}*/}
                    {/*         className={'square shadow correct pt-1'}>*/}
                    {/*        {this.state.squares[0].value}*/}
                    {/*    </div>*/}
                    {/*    <div key={this.state.squares[1].value}*/}
                    {/*         className={'square shadow correct pt-1'}>*/}
                    {/*        {this.state.squares[1].value}*/}
                    {/*    </div>*/}
                    {/*</FlipMove>*/}
                    {/*/!*<SvgLines animate={true} duration={1000}>*!/*/}
                    {/*/!*    <svg viewBox="0 0 960 500">*!/*/}
                    {/*/!*        <line key={5464} style={{strokeWidth: "3px", stroke: '#999'}} x2={299} y2={186}*!/*/}
                    {/*/!*              x1={(this.state.squares[0].value + 1) * 50}*!/*/}
                    {/*/!*              y1={(this.state.squares[0].value + 1) * 50}></line>*!/*/}
                    {/*/!*    </svg>*!/*/}
                    {/*/!*</SvgLines>*!/*/}
                </div>

            </div>

        );
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default Puzzle;