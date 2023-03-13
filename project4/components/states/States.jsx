import React from 'react';
import './States.css';
/**
 * Define States, a React component of CS142 Project 4, Problem 2. The model
 * data for this view (the state names) is available at
 * window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
    this.state = {
      states: window.cs142models.statesModel(),
      filter: "",
    };
    this.handleChangeBound = event => this.handleChange(event);
  }

  handleChange(event) {
    this.setState({filter: event.target.value});
  }
  render() {
    const lowerFilter = this.state.filter.toLowerCase();
    const filteredStates = this.state.states.filter(state=> state.toLowerCase().includes(lowerFilter));
    return (
      <div className='container'>
        <div>Please input the filter substring:</div>
        <br></br>
        <input className='filter-input' type='text' value={this.state.filter} onChange={this.handleChangeBound}></input>
        <p>States containing {this.state.filter}</p>
        {filteredStates.length === 0 ? (
          <p className='list'>There is no matching states.</p>
        ) : (
          <ul className='list'>
            {filteredStates.sort().map(state => (
              <li key={state}>{state}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default States;
