/**
 * COMPONENTE NAVBAR - BARRA DE NAVEGACIÓN PRINCIPAL
 *
 * Este componente renderiza la barra de navegación principal de la aplicación.
 * Maneja la navegación entre diferentes vistas, autenticación de usuarios y
 * proporciona acceso a las funcionalidades principales de la plataforma.
 *
 * Características:
 * - Navegación responsiva con Bootstrap
 * - Menú de usuario con dropdown
 * - Indicadores de vista activa
 * - Integración con el contexto de autenticación
 * - Soporte para dispositivos móviles (hamburger menu)
 *
 * @author Tu nombre
 * @version 1.0.0
 */

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Componente Navbar
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.currentView - Vista actualmente seleccionada
 * @param {Function} props.setCurrentView - Función para cambiar de vista
 * @returns {JSX.Element} Elemento JSX de la barra de navegación
 */
function Navbar({ currentView, setCurrentView }) {
  // Obtener datos del usuario y funciones de autenticación del contexto
  const { user, logout, isAuthenticated } = useAuth();

  // Estado para controlar si el menú móvil está colapsado
  const [isCollapsed, setIsCollapsed] = useState(true);

  /**
   * Maneja el click en elementos de navegación
   * Cambia la vista actual y colapsa el menú móvil
   *
   * @param {string} view - Vista a la que navegar
   */
  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsCollapsed(true); // Colapsar menú después de navegar
  };

  return (
    // Barra de navegación principal con Bootstrap
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">
        {/* Logo y nombre de la aplicación */}
        <a
          className="navbar-brand fw-bold"
          href="#home"
          onClick={() => handleNavClick("home")}
        >
          <i className="fas fa-plane me-2"></i>
          Travel Platform
        </a>

        {/* Botón hamburger para dispositivos móviles */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-expanded={!isCollapsed}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenedor del menú colapsable */}
        <div
          className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`}
        >
          {/* Enlaces de navegación principales */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Enlace Home */}
            <li className="nav-item">
              <a
                className={`nav-link ${currentView === "home" ? "active" : ""}`}
                href="#home"
                onClick={() => handleNavClick("home")}
              >
                <i className="fas fa-home me-1"></i>Home
              </a>
            </li>

            {/* Enlace Posts */}
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

            {/* Enlace Crear Post */}
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

            {/* Enlace Gestionar Posts */}
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

          {/* Enlaces de usuario (lado derecho) */}
          <ul className="navbar-nav">
            {/* Mostrar menú de usuario si está autenticado */}
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  {/* Dropdown toggle del usuario */}
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

                  {/* Menú dropdown del usuario */}
                  <ul className="dropdown-menu dropdown-menu-end">
                    {/* Enlace al perfil */}
                    <li>
                      <a className="dropdown-item" href="#profile">
                        <i className="fas fa-user me-2"></i>Profile
                      </a>
                    </li>

                    {/* Enlace para crear post */}
                    <li>
                      <a
                        className="dropdown-item"
                        href="#create-post"
                        onClick={() => handleNavClick("create-post")}
                      >
                        <i className="fas fa-plus me-2"></i>Create Post
                      </a>
                    </li>

                    {/* Separador */}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    {/* Botón de logout */}
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                          logout(); // Cerrar sesión
                          handleNavClick("home"); // Redirigir a home
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // Mostrar enlaces de autenticación si no está logueado
              <>
                {/* Enlace de registro */}
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

                {/* Enlace de login */}
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
