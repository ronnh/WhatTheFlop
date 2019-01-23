import React from "react";
import { api } from "../api";
import SearchInput, {createFilter} from 'react-search-input';

var failover = [{"url": "https://maps.google.com/?cid=15462320241575581639", "ratings": "4.1", "location": "190 University Ave, Toronto, ON M5H 0A3, Canada", "id": "ChIJEbBG-dE0K4gRx9dxOlYyldY", "name": "Momofuku Noodle Bar"}, {"url": "https://maps.google.com/?cid=1663686169002176904", "ratings": "3.9", "location": "93 Harbord St, Toronto, ON M5S 1G4, Canada", "id": "ChIJP9UKepU0K4gRiPEakcGZFhc", "name": "Magic Noodle"}, {"url": "https://maps.google.com/?cid=2581289755430947068", "ratings": "4.4", "location": "66 Edward St, Toronto, ON M5G 1C9, Canada", "id": "ChIJuRlHUso0K4gR_AjRNluV0iM", "name": "GB Hand-Pulled Noodles \u570b\u5bf6\u862d\u5dde\u62c9\u9762"}, {"url": "https://maps.google.com/?cid=13211509214868073759", "ratings": "4.2", "location": "478 Dundas St W, Toronto, ON M5T 1G9, Canada", "id": "ChIJ0TaxecQ0K4gRH-0CI6K1WLc", "name": "Hey Noodles"}, {"url": "https://maps.google.com/?cid=17434073522828093875", "ratings": "4", "location": "421 Dundas St W, Toronto, ON M5T 2W4, Canada", "id": "ChIJfRIIW8Q0K4gRsyk21H9F8vE", "name": "Origination Noodle House"}, {"url": "https://maps.google.com/?cid=17696082484904343563", "ratings": "3.6", "location": "115 Dundas St W, Toronto, ON M6K 1T7, Canada", "id": "ChIJQ_N7vss0K4gRCzi8HEMdlfU", "name": "Dagu Rice Noodles"}, {"url": "https://maps.google.com/?cid=2727298189850314709", "ratings": "4.6", "location": "786 Broadview Ave, Toronto, ON M4K 2P7, Canada", "id": "ChIJq6q6OaDM1IkR1QeY-kBP2SU", "name": "Ryus Noodle Bar"}, {"url": "https://maps.google.com/?cid=12867163386191710817", "ratings": "4.5", "location": "298 College St, Toronto, ON M5T 1R9, Canada", "id": "ChIJ8amUycE0K4gRYYreNO1YkbI", "name": "Landing Noodles"}, {"url": "https://maps.google.com/?cid=3664566024545769565", "ratings": "4.5", "location": "358 Spadina Ave, Toronto, ON M5T 2G4, Canada", "id": "ChIJEyIHxMM0K4gRXRgENWIn2zI", "name": "Fudao Noodle House"}, {"url": "https://maps.google.com/?cid=9938104830559937172", "ratings": "3.9", "location": "296 Spadina Ave, Toronto, ON M5T 2E7, Canada", "id": "ChIJmR5AnsM0K4gRlGIeZrA964k", "name": "King's Noodle Restaurant"}, {"url": "https://maps.google.com/?cid=7848886624566943114", "ratings": "3.6", "location": "570 Yonge St, Toronto, ON M4Y 1Z3, Canada", "id": "ChIJT_3hwLM0K4gRip2gw8zY7Gw", "name": "Not Just Noodles"}, {"url": "https://maps.google.com/?cid=12975958381798487695", "ratings": "4.3", "location": "123 Queen St W C52, Toronto, ON M5H 3M9, Canada", "id": "ChIJPSPE3izL1IkRj_ZZD2bdE7Q", "name": "Noodle King"}, {"url": "https://maps.google.com/?cid=1435431907251234083", "ratings": "2.2", "location": "220 Yonge St, Toronto, ON M5B 2H1, Canada", "id": "ChIJo0So-AM1K4gRI6X44rat6xM", "name": "Liberty Noodle"}, {"url": "https://maps.google.com/?cid=13256968265161582771", "ratings": "", "location": "689 Yonge St, Toronto, ON M4Y 2B2, Canada", "id": "ChIJcYi7B640K4gRsyiVE2Y2-rc", "name": "Oga Noodle House"}, {"url": "https://maps.google.com/?cid=10691022453299441993", "ratings": "3.8", "location": "62 Vaughan Rd, Toronto, ON M6G 2N2, Canada", "id": "ChIJ16I50MM0K4gRSXGjHkckXpQ", "name": "Thai Noodle"}, {"url": "https://maps.google.com/?cid=9934456976650474359", "ratings": "3", "location": "250 Front St W, Toronto, ON M5V 3G5, Canada", "id": "ChIJK09A0tY0K4gRdxOnOfxH3ok", "name": "ITO Sushi & Noodle"}, {"url": "https://maps.google.com/?cid=3813408229952789563", "ratings": "4", "location": "266 Spadina Ave, Toronto, ON M5T 2E4, Canada", "id": "ChIJW3Izb8M0K4gROxzjsZTy6zQ", "name": "Goldstone Noodle Restaurant"}, {"url": "https://maps.google.com/?cid=8439118928224429584", "ratings": "4.3", "location": "23 Baldwin Street 2nd Floor, Toronto, ON M5T 1L1, Canada", "id": "ChIJoUssFcY0K4gREKYX7vPFHXU", "name": "PanPan Noodle Bar"}, {"url": "https://maps.google.com/?cid=3354270437054291693", "ratings": "4.2", "location": "372 Bloor St W, Toronto, ON M5S 1X7, Canada", "id": "ChIJK_slj5Y0K4gR7R432TDDjC4", "name": "Kenzo Ramen"}];

/* vote.js is where a user votes on activites */
class Suggestion extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			inputValue: '',
			term: '',
			curTerm: '',
			results: [],
			selected: [],
			display: null,
			focus: false,
			typing: false,
			latitude: 0,
			longitude: 0,
			done: false,
			typing: false,
			locString: ''
		};

		this.searchUpdated = this.searchUpdated.bind(this)
		this.timeout = 0;
		this.selectPlace = this.selectPlace.bind(this);
		this.onSuggestionFocus = this.onSuggestionFocus.bind(this);
		this.onSuggestionBlur = this.onSuggestionBlur.bind(this);
	}

	componentWillMount() {
		this.timer = null;
	}

	handleChange(val){
		clearTimeout(this.timer);
		this.setState({term: val});
		this.timer = setTimeout(this.trigChange, 500);
	}

	trigChange(){
		const { term } = this.state.term;
		//this.props.onChange(term);
		const long = this.state.longitude;
		const lat = this.state.latitude;
		api.searchSuggestion(term, long, lat, res => {
				self.setState({
					term: term,
					results: term.length > 0 ? res.data : [],
					focus: true
				});
		 	}
		);
	}

	searchUpdated(term) {
		const self = this;
		clearTimeout(this.timeout);
		var long = this.props.long;
		var lat = this.props.lat;
		this.setState({
			curTerm: term
		});
		if (!term){
			return;
		}
		if((long == 0 || !long) && (lat == 0 || !lat) && this.state.locString == ''){
			this.props.setError("Please enter a location.");
			return;
		}
		if(this.state.locString != ''){
			term = term + ' in ' + this.state.locString;
		}
		this.props.setError("");
		self.timeout = setTimeout(() => {
					if (term != self.state.term){
							// this.setState({
							// 	results: failover,
							// 	focus: true
							// });
						if (!long && !lat){
							long = 0;
							lat = 0;
						}
						 api.searchSuggestion(term, long, lat, res => {
						 	if (!this.state.done){
								self.setState({
									results: term.length > 0 ? res.data : [],
									focus: true
								});
						 	}
						});
					}
				}
			,250);
	}

	selectPlace(place){
		this.setState({
			term: place.target.innerHTML,
			focus: false
		});
	}

	handleNext(e){
		e.preventDefault();
		var currResults = this.state.selected;
		if (this.state.inputValue){
			api.submitSuggestion(this.props.userId, this.props.roomId, this.state.inputValue, null, null);
			if (!currResults.includes(this.state.inputValue)) currResults.push(this.state.inputValue);
		}
		if (this.state.term){
			var toJson = this.state.display ? JSON.stringify(this.state.display) : null;
			//console.log(toJson);
			api.submitSuggestion(this.props.userId, this.props.roomId, this.state.term, toJson, null);
			if (!currResults.includes(this.state.term)) currResults.push(this.state.term);
		}
		if (!this.state.done){
			this.setState({
				selected: currResults,
				inputValue: '',
				term: '',
				display: null,
				results: []
			});
		}

	}

	onKeyPress(e) {
		//13 is the enter key
	    if (e.which === 13) {
	    	e.preventDefault();
	    	var currResults = this.state.selected;
	    	if (this.state.inputValue){
				api.submitSuggestion(this.props.userId, this.props.roomId, this.state.inputValue, null, null);
				if (!currResults.includes(this.state.inputValue)) currResults.push(this.state.inputValue);
			}
			if (!this.state.done){
				this.setState({
					selected: currResults,
					inputValue: '',
					display: null
				});
			}
	    }
	}

	onKeyPressNothing(e) {
		//13 is the enter key
	    if (e.which === 13) {
	    	e.preventDefault();
	    }
	}

	clearSearchOnBackspace(e){
		if (e.which === 8) {
			this.setState({
				results: []
			});
		}
	}

  handleAboutToSubmit(e){
  	e.preventDefault();
  	this.setState({
  		done: true
  	});
  	this.props.handleSubmission(e, this.state.selected);
  }

  updateLoc(evt) {
  	const self = this;
    this.setState({
      locString: evt.target.value
    });
    if(!this.state.curTerm){
    	return;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {self.searchUpdated(self.state.curTerm);}, 250);
  }

  /*
  focus(){
  	if(this.props.long == 0 && this.props.lat == 0 && this.state.locString == ''){
  		alert("Please enter a location");
  	}
  }*/

  render() {
  	var handleSubmission = this.props.handleSubmission;
  	var optional = ' (Optional)';
	const listEvents = this.state.selected.map((event) => <div key={event}>{event}</div> );
    return (
          <div className = "center">
          	{this.props.error ?
                    <div className = "error"> {this.props.error} </div> : null
             }
      		<div id="info-text">
      			<div id="instruct">Here is some info on your place:</div>
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
      		<br/>
      		<div id="instruct">Put your suggestions here!</div>
      		<div id="general-text">
          		Location{(this.props.long == 0 || !this.props.long) && (this.props.lat == 0 || !this.props.lat) ? null : optional}:
          		<form className = "form" onKeyPress={e => this.onKeyPressNothing(e, this.state.inputValue)}>
          			<input type="text" className="form input" placeholder="Eg. Toronto" onChange={evt => this.updateLoc(evt)}/>
          		</form>
          	</div>
          	<div id="general-text" onFocus={this.onSuggestionFocus} onBlur={this.onSuggestionBlur}>
          		Find a place to go: <SearchInput className="search-input" value={this.state.term} onChange={this.searchUpdated} onKeyDown={e => this.clearSearchOnBackspace(e, this.state.inputValue)}/>
          		<div className = "search-result">
          		{this.state.focus ?
          			 this.state.results.map(res => {
          				return ( <div className="Dropdown-option" key={res.id} onMouseEnter={this.onSuggestionHover.bind(this, res)} onMouseDown={this.selectPlace}> {res.name} </div> );
          			}) : null
          		}
          		</div>
          	</div>
          	<div id="general-text">
          		Suggest your own event:
          		<form className = "form" onKeyPress={e => this.onKeyPress(e, this.state.inputValue)}>
                  	<input type="text" className="form input" placeholder="What is your suggestion?" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)} />
              	</form>
          	</div>
          	<div id="extra-large-margin">
          		<div id="general-text">
          			<div id="instruct-no-margin"> Your current suggestions: </div>
          			{listEvents}
          		</div>
          	</div>
          	<div className="extra-margin">
          		<button type="submit" className="btn" onClick={e => this.handleNext(e, this.state.inputValue)}>SUBMIT YOUR SUGGESTION</button>
          	</div>
          	<button type="submit" className="btn" onClick={e => this.handleAboutToSubmit(e)} >DONE</button>
          </div>
    );
  }

	onSuggestionFocus(){
		this.setState({
			focus: true
		});
	}

	onSuggestionBlur(){
		this.setState({
			focus: false
		});
	}

	onSuggestionHover(suggestion, proxy){
		this.setState({
			display: suggestion
		});
	}

  updateInputValue(evt){
      this.setState({
          inputValue: evt.target.value
      });
  }
}

export default Suggestion;
