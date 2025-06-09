/**
 * COMPONENTE APP - APLICACIÓN PRINCIPAL DE LA PLATAFORMA DE VIAJES
 *
 * Este es el componente raíz de la aplicación que maneja el routing interno,
 * la estructura principal del layout y el estado global de navegación.
 * Utiliza un sistema de navegación basado en estado para cambiar entre vistas.
 *
 * Características principales:
 * - Sistema de navegación SPA (Single Page Application)
 * - Estructura de layout con Navbar, contenido principal y Footer
 * - Integración con AuthProvider para autenticación global
 * - Renderizado condicional basado en la vista actual
 * - Diseño responsivo con Bootstrap
 *
 * Vistas disponibles:
 * - home: Página de inicio con hero section
 * - posts: Lista de posts públicos
 * - register: Formulario de registro
 * - login: Formulario de inicio de sesión
 * - create-post: Formulario para crear nuevos posts
 * - manage-posts: Lista de posts del usuario con opciones CRUD
 *
 * @author Tu nombre
 * @version 1.0.0
 */

import React, { useState } from "react";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Post from "./components/Post";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import StartSession from "./components/StartSession";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";

/**
 * Componente App principal
 *
 * Maneja el estado de navegación y renderiza la estructura principal de la aplicación
 *
 * @returns {JSX.Element} Estructura completa de la aplicación
 */
function App() {
  // Estado para controlar la vista actual (sistema de routing interno)
  const [currentView, setCurrentView] = useState("home");

  /**
   * Función que renderiza el contenido principal basado en la vista actual
   * Utiliza un switch statement para determinar qué componente mostrar
   *
   * @returns {JSX.Element} Componente correspondiente a la vista actual
   */
  const renderContent = () => {
    switch (currentView) {
      // Vista de inicio - Hero section y posts destacados
      case "home":
        return (
          <>
            <div className="container mt-4">
              {/* Hero section con llamadas a la acción */}
              <div className="jumbotron bg-primary text-white p-5 rounded mb-4">
                <h1 className="display-4">Welcome to Travel Platform!</h1>
                <p className="lead">
                  Discover amazing travel destinations and share your
                  experiences with fellow travelers.
                </p>
                <hr className="my-4" />
                <p>Start exploring posts or share your own travel story!</p>

                {/* Botones de acción principales */}
                <button
                  className="btn btn-light btn-lg me-3"
                  onClick={() => setCurrentView("posts")}
                >
                  Explore Posts
                </button>
                <button
                  className="btn btn-outline-light btn-lg"
                  onClick={() => setCurrentView("create-post")}
                >
                  Share Your Story
                </button>
              </div>
            </div>

            {/* Componente de posts para la página de inicio */}
            <Post />
          </>
        );

      // Vista de posts - Lista pública de todos los posts
      case "posts":
        return (
          <div className="container mt-4">
            <h2>Posts Page</h2>
            <Post />
          </div>
        );

      // Vista de registro - Formulario de creación de cuenta
      case "register":
        return <Register />;

      // Vista de login - Formulario de inicio de sesión
      case "login":
        return <StartSession />;

      // Vista de creación de post - Formulario para nuevos posts
      case "create-post":
        return <PostForm />;

      // Vista de gestión de posts - CRUD de posts del usuario
      case "manage-posts":
        return <PostList />;

      // Vista por defecto - Fallback a componente Post
      default:
        return <Post />;
    }
  };

  return (
    // Proveedor de contexto de autenticación para toda la aplicación
    <AuthProvider>
      {/* Estructura principal con flexbox para footer pegajoso */}
      <div className="d-flex flex-column min-vh-100">
        {/* Barra de navegación principal */}
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />

        {/* Contenido principal que crece para ocupar el espacio disponible */}
        <main className="flex-grow-1">{renderContent()}</main>

        {/* Footer que se mantiene en la parte inferior */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
