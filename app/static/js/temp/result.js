import React from "react";
import { api } from "../api";

/* result.js is where a user sees the result */
class Result extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            winner: null,
            resultName: [],
            result: []
        };
    }

    componentDidMount(){
        api.getResult(this.props.roomId, res => {
            var results = res.data.map(res => JSON.parse(res));
            this.setState({
                result: results,
                resultName: results.map(res => res.name ? res.name : res),
                winner: results[0]
            });
        });
    }

    render() {
        var result = this.props.result;
        var handleResult = this.props.handleResult;
        return (
            <div className = "center">
                <div id="instruct">Your Results!</div>
                <div id="instruct-no-margin"> The winner goes to.... </div>
                <div id ="winner"> {this.state.resultName[0]}!! </div>
                <div id ="winner-subtext">
                    { this.state.winner ?
                        <div className="instruct-no-margin">
                            Rating: {this.state.winner.ratings} <br />
                            Location: {this.state.winner.location} 
                        </div> : null }
                </div>
                <div id = "general-text">2nd place: {this.state.resultName[1]} </div>
                <div id = "general-text">3rd place: {this.state.resultName[2]} </div>
                <div id="backToCreate"><button type="button" className="btn" onClick={evt => handleResult(evt, this.state.result[0], this.state.result[1], this.state.result[2])}>DONE</button></div>
            </div>
        );
    }
}

export default Result;