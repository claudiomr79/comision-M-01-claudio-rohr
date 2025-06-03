import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Navbar({ currentView, setCurrentView }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsCollapsed(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">
        <a
          className="navbar-brand fw-bold"
          href="#home"
          onClick={() => handleNavClick("home")}
        >
          <i className="fas fa-plane me-2"></i>
          Travel Platform
        </a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`}
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                className={`nav-link ${currentView === "home" ? "active" : ""}`}
                href="#home"
                onClick={() => handleNavClick("home")}
              >
                <i className="fas fa-home me-1"></i>Home
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  currentView === "posts" ? "active" : ""
                }`}
                href="#posts"
                onClick={() => handleNavClick("posts")}
              >
                <i className="fas fa-images me-1"></i>Posts
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  currentView === "create-post" ? "active" : ""
                }`}
                href="#create-post"
                onClick={() => handleNavClick("create-post")}
              >
                <i className="fas fa-plus me-1"></i>Create Post
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  currentView === "manage-posts" ? "active" : ""
                }`}
                href="#manage-posts"
                onClick={() => handleNavClick("manage-posts")}
              >
                <i className="fas fa-cog me-1"></i>Manage Posts
              </a>
            </li>
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user me-1"></i>
                    {user?.name || "User"}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#profile">
                        <i className="fas fa-user me-2"></i>Profile
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#create-post"
                        onClick={() => handleNavClick("create-post")}
                      >
                        <i className="fas fa-plus me-2"></i>Create Post
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          logout();
                          handleNavClick("home");
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      currentView === "register" ? "active" : ""
                    }`}
                    href="#register"
                    onClick={() => handleNavClick("register")}
                  >
                    <i className="fas fa-user-plus me-1"></i>Register
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${
                      currentView === "login" ? "active" : ""
                    }`}
                    href="#login"
                    onClick={() => handleNavClick("login")}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i>Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
