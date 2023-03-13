import React from 'react';

import Example from '../example/Example';
import States from '../states/States';

class P4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            component: 'States',
        };
        this.handleChangeBound = () => this.handleChange();
    }

    handleChange() {
        this.setState({component: this.state.component === 'States' ? 'Examples' : 'States'});
    }

    render() {
        return (
            <div>
                <button onClick={this.handleChangeBound}>
                    Switch to {this.state.component === 'States' ? 'Example' : 'States'}
                </button>
                {this.state.component === 'States' ? <States/> : <Example/>}
            </div>
        );
    }
}
export default P4;

