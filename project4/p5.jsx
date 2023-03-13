import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Link } from 'react-router-dom';
import States from './components/states/States';
import Example from './components/example/Example';
import Header from './components/header/Header';

ReactDOM.render(
    <div>
        <Header/>
        <HashRouter>
            <div><Link to="/states">States</Link></div>
            <div><Link to="/example">Example</Link></div>
            <Route path='/states' component={States}></Route>
            <Route path='/example' component={Example}></Route>
        </HashRouter>           
    </div>,
    document.getElementById('reactapp'),
);