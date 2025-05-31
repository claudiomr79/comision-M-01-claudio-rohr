import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { authState, logout: contextLogout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        contextLogout();
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <header id="header">
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    {/* <li><Link to="/posts">Posts</Link></li> */} {/* Example for a posts page */}

                    {authState.isAuthenticated ? (
                        <>
                            {authState.user && <li><span>Welcome, {authState.user.username || authState.user.name}!</span></li>}
                            <li><Link to="/create-post">Create Post</Link></li>
                            <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/signup">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>  
    );
}   

export default Navbar;