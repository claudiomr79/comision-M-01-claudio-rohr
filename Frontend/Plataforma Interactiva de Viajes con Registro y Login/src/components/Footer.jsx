import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="text-warning">Travel Platform</h5>
            <p className="mb-2">Your gateway to amazing travel experiences</p>
            <p className="text-muted mb-0">
              © 2025 Claudio Rohr - Argentina Programa
            </p>
          </div>
          <div className="col-md-6">
            <h6 className="text-warning">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <a href="#home" className="text-light text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="#posts" className="text-light text-decoration-none">
                  Posts
                </a>
              </li>
              <li>
                <a href="#register" className="text-light text-decoration-none">
                  Register
                </a>
              </li>
              <li>
                <a href="#login" className="text-light text-decoration-none">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-3 text-secondary" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-muted">
              Made with <i className="fas fa-heart text-danger"></i> for
              Argentina Programa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
