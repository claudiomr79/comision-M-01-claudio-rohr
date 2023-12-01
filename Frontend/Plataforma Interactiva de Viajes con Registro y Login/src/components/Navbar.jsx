import React from 'react';
import './Navbar.css';

function Navbar() {
    return (
        <header id="header">
            <nav>
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#posts">Posts</a></li>
                    <li><a href="#register">Register</a></li>
                    <li><a href="#Login">Login</a></li>
                </ul>
            </nav>
        </header>  
    );
}   

export default Navbar;