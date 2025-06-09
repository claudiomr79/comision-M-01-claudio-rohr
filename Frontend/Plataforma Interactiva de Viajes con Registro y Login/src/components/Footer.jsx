/**
 * COMPONENTE FOOTER - PIE DE PÁGINA DE LA APLICACIÓN
 *
 * Este componente renderiza el pie de página de la plataforma de viajes.
 * Incluye información de la aplicación, enlaces rápidos de navegación,
 * información de derechos de autor y créditos del desarrollador.
 *
 * Características:
 * - Diseño responsivo con Bootstrap
 * - Enlaces de navegación rápida
 * - Información de copyright
 * - Estilo consistente con el tema de la aplicación
 *
 * @author Tu nombre
 * @version 1.0.0
 */

import React from "react";

/**
 * Componente Footer
 *
 * Renderiza el pie de página con información de la aplicación y enlaces útiles
 *
 * @returns {JSX.Element} Elemento JSX del footer
 */
function Footer() {
  return (
    // Footer principal con fondo oscuro y texto claro
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        {/* Fila principal con información y enlaces */}
        <div className="row">
          {/* Columna izquierda: Información de la aplicación */}
          <div className="col-md-6">
            <h5 className="text-warning">Travel Platform</h5>
            <p className="mb-2">Your gateway to amazing travel experiences</p>
            <p className="text-muted mb-0">
              © 2025 Claudio Rohr - Argentina Programa
            </p>
          </div>

          {/* Columna derecha: Enlaces rápidos */}
          <div className="col-md-6">
            <h6 className="text-warning">Quick Links</h6>
            <ul className="list-unstyled">
              {/* Enlace a Home */}
              <li>
                <a href="#home" className="text-light text-decoration-none">
                  Home
                </a>
              </li>

              {/* Enlace a Posts */}
              <li>
                <a href="#posts" className="text-light text-decoration-none">
                  Posts
                </a>
              </li>

              {/* Enlace a Registro */}
              <li>
                <a href="#register" className="text-light text-decoration-none">
                  Register
                </a>
              </li>

              {/* Enlace a Login */}
              <li>
                <a href="#login" className="text-light text-decoration-none">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador horizontal */}
        <hr className="my-3 text-secondary" />

        {/* Fila inferior: Créditos y mensaje final */}
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
