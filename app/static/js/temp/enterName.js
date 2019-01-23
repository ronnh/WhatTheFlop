import React from "react";

/* enterName.js is the step where the room is created */
class EnterName extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: ''
        };
    }

    render() {
        var handleUsername = this.props.handleUsername;
        return (
            <div className = "center">
                <form className = "form" onSubmit={evt => handleUsername(evt, this.state.username)}>
                    <div id="instruct">Hey! What's your name?</div>
                    {this.props.error ? 
                        <div className = "error"> {this.props.error} </div> : null
                    }
                    <input type="text" className="form input" placeholder="Enter your name" value={this.state.username} onChange={evt => this.updateUsername(evt)} required />
                    <br />
                    <button type="submit" className="btn">NEXT</button>  
                </form>
            </div>
        );
    }

    updateUsername(evt){
        this.setState({
            username: evt.target.value
        });
    }
}

export default EnterName;