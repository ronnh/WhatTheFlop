import React from "react";

/* join.js is where a user enters a room ID*/
class Join extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: ''
        };
    }

    render() {
	    var handleJoin = this.props.handleJoin;
        var handleBackToOption = this.props.handleBackToOption;
	    return (
            <div className = "center">
                <div id="instruct">Joining an existing room? Put your Room ID here!</div>
                {this.props.error ? 
                    <div className = "error"> {this.props.error} </div> : null
                }
                <form className = "form" onSubmit={evt => handleJoin(evt, this.state.inputValue)}>
                    <input type="text" className="form input" placeholder="Enter your room ID" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} required />
                    <div id="back"><button type="submit" className="btn">NEXT</button></div>
                    <button type="button" className="btn" onClick={evt => handleBackToOption(evt)}>BACK</button>
                </form>
            </div>
	    );
    }

    updateInputValue(evt){
        this.setState({
            inputValue: evt.target.value
        });
    }
}

export default Join;