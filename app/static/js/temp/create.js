import React from "react";

/* create.js is where a user enters a room name */
class Create extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: ''
        };
    }

    render() {
	    var handleCreate = this.props.handleCreate;
        var handleBackToOption = this.props.handleBackToOption;
	    return (
            <div className = "center">
                <div id="instruct">What would you like to call your room?</div>
                {this.props.error ? 
                    <div className = "error"> {this.props.error} </div> : null
                }
                <form className="form" onSubmit={evt => handleCreate(evt, this.state.inputValue)} >
                    <input type="text" className="form input" placeholder="Enter your room name" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} required />
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

export default Create;  