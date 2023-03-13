import React from 'react';
import ReactDOM from 'react-dom';

import P4 from './components/p4/P4';
import Header from './components/header/Header';

ReactDOM.render(
    <div>
        <Header/>
        <P4/>
    </div>,
    document.getElementById('reactapp'),
);