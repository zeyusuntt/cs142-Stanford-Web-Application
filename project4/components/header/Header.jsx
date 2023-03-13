import React from "react";
import './Header.css';

class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <header className='container'>
                <h1>This is me!</h1>
                <nav>
                    <ul>
                        <li><a href="https://www.stanford.edu">School</a></li>
                        <li><a href="https://www.linkedin.com/in/zeyusunstanford/">Contact</a></li>
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Header;