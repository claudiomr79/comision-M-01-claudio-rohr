import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header id="header">
      <nav>
        <ul>
          <li>
            <Link to={`/`}>Inicio </Link>
          </li>
          <li>
            <Link to={`/post`}>Posts</Link>
          </li>
          <li>
            <Link to={`/register`}>Registro</Link>
          </li>
          <li>
            <Link to={`/login`}>Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
