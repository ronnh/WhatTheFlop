// http://fraserxu.me/react-dropdown/

import React from "react";
import Dropdown from "react-dropdown";

import { api } from "../api";

/* order.js is the ordering page */
class Order extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			suggestions:[],
			first: '',
			second: '',
			third: '',
			firstFocus: false,
			secondFocus: false,
			thirdFOcus: false,
			display: null
		};

		this.firstFocusToggle = this.firstFocusToggle.bind(this);
		this.secondFocusToggle = this.secondFocusToggle.bind(this);
		this.thirdFocusToggle = this.thirdFocusToggle.bind(this);

		this.selectPlaceForFirst = this.selectPlaceForFirst.bind(this);
		this.selectPlaceForSecond = this.selectPlaceForSecond.bind(this);
		this.selectPlaceForThird = this.selectPlaceForThird.bind(this);

		this.onHoverer = this.onHoverer.bind(this);
	}

	componentDidMount(){
		var roomId = this.props.roomId;
		api.getSuggestions(roomId, suggestions => {
			this.setState({
				suggestions: suggestions ? suggestions.data : []
			});
		});
		api.setUserStatus(this.props.userId, "ranking", null);
	}

	selectPlaceForFirst(){
		this.setState({
			first: this.state.display.name
		});
		api.setUserStatus(this.props.userId, "ranking", null);
	}

	selectPlaceForSecond(){
		this.setState({
			second: this.state.display.name
		});
		api.setUserStatus(this.props.userId, "ranking", null);
	}

	selectPlaceForThird(){
		this.setState({
			third: this.state.display.name
		});
		api.setUserStatus(this.props.userId, "ranking", null);
	}

	render(){
		var handleOrder = this.props.handleOrder;
		return (
			<div className="center">
						<div id="info-text">
							<div id="info">Here is some info on your place:</div>
							{this.state.display ?
								<div className="suggestion-info">
							Name: {this.state.display.name}<br />
							Rating: {this.state.display.ratings}<br />
							Location: {this.state.display.location}
						</div>
							: <div className="suggestion-info">
							Hover over a suggestion to see!
								</div> }
						</div>
        		<div id="instruct">Rank your top three most preferred activities!</div>
      	      		{this.props.error ?
                    <div className = "error"> {this.props.error} </div> : null
                }
        		<div id="instruct"> Rank 1: </div>
	          	<div id="general-text">
								<div className="Dropdown-root">
	            		<div className="Dropdown-control" onFocus={this.firstFocusToggle} onBlur={this.firstFocusToggle} tabIndex="-1">
										<div className="Dropdown-placeholder">{this.state.first == '' ? "Choose an Event!" : this.state.first}</div>
										<span className="Dropdown-arrow"></span>
									</div>
								</div>
								<div className = "search-result">
								{this.state.firstFocus ?
									 this.state.suggestions.map(res => {
										return ( <div className="Dropdown-option" key={res.id} onMouseEnter={this.onSuggestionHover.bind(this, res)} onMouseDown={this.selectPlaceForFirst}> {res.name} </div> );
									}) : null
								}
								</div>
	          	</div>

        		<div id="instruct-no-margin"> Rank 2: </div>
							<div id="general-text">
								<div className="Dropdown-root">
									<div className="Dropdown-control" onFocus={this.secondFocusToggle} onBlur={this.secondFocusToggle} tabIndex="-1">
										<div className="Dropdown-placeholder">{this.state.second == '' ? "Choose an Event!" : this.state.second}</div>
										<span className="Dropdown-arrow"></span>
									</div>
								</div>
								<div className = "search-result">
								{this.state.secondFocus ?
									 this.state.suggestions.map(res => {
										return ( <div className="Dropdown-option" key={res.id} onMouseEnter={this.onSuggestionHover.bind(this, res)} onMouseDown={this.selectPlaceForSecond}> {res.name} </div> );
									}) : null
								}
								</div>
							</div>

        		<div id="instruct-no-margin"> Rank 3: </div>
							<div id="general-text">
								<div className="Dropdown-root">
									<div className="Dropdown-control" onFocus={this.thirdFocusToggle} onBlur={this.thirdFocusToggle} tabIndex="-1">
										<div className="Dropdown-placeholder">{this.state.third == '' ? "Choose an Event!" : this.state.third}</div>
										<span className="Dropdown-arrow"></span>
									</div>
								</div>
								<div className = "search-result">
								{this.state.thirdFocus ?
									 this.state.suggestions.map(res => {
										return ( <div className="Dropdown-option" key={res.id} onMouseEnter={this.onSuggestionHover.bind(this, res)} onMouseDown={this.selectPlaceForThird}> {res.name} </div> );
									}) : null
								}
								</div>
							</div>
            	<button type="submit" className="btn" onMouseOver={this.onHoverer} onClick={e => handleOrder(e, this.state.first, this.state.second, this.state.third)} >DONE RANKING</button>
			</div>
		);
	}

	firstFocusToggle(){
		this.setState({firstFocus: !this.state.firstFocus});
	}

	secondFocusToggle(){
		this.setState({secondFocus: !this.state.secondFocus});
	}

	thirdFocusToggle(){
		this.setState({thirdFocus: !this.state.thirdFocus});
	}

	onSuggestionHover(suggestion, proxy){
		this.setState({
			display: suggestion
		});
	}

	onHoverer(){}

}

export default Order;
