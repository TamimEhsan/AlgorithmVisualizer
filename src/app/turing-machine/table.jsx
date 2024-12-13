import { Component } from 'react';

class Table extends Component {
    render() {
        return (
            <div>
                <table className="table-auto border border-slate-800 border-collapse">
                    <thead>
                    <tr>
                        <th className="border border-slate-500 px-4 py-2" scope="col">State</th>
                        <th className="border border-slate-500 px-4 py-2" scope="col">Input</th>
                        <th className="border border-slate-500 px-4 py-2" scope="col">Next</th>
                        <th className="border border-slate-500 px-4 py-2" scope="col">Output</th>
                        <th className="border border-slate-500 px-4 py-2" scope="col">Direction</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.data.map( (row,rowidx)=>{
                        return (
                            <tr key={rowidx}  className={ rowidx === this.props.state ? 'bg-blue-100' : '' }>
                                <th className="border border-slate-500 px-4 py-2" scope="row">{row[0]}</th>
                                <th className="border border-slate-500 px-4 py-2">{row[1]}</th>
                                <td className="border border-slate-500 px-4 py-2">{row[2]}</td>
                                <td className="border border-slate-500 px-4 py-2">{row[3]}</td>
                                <td className="border border-slate-500 px-4 py-2">{row[4]}</td>
                            </tr>
                        );
                    } )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table;