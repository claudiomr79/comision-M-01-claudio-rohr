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
import Carousel from "./components/Carousel";

function App() {
  const [currentView, setCurrentView] = useState("home");

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <>
            <div className="container mt-4">
              <div className="jumbotron bg-primary text-white p-5 rounded mb-4">
                <h1 className="display-4">¡Bienvenido a la Plataforma de Viajes!</h1>
                <p className="lead">
                  Descubre destinos increíbles y comparte tus experiencias con otros viajeros.
                </p>
                <hr className="my-4" />
                <p>¡Empieza a explorar publicaciones o comparte tu propia historia de viaje!</p>
                <button
                  className="btn btn-light btn-lg me-3"
                  onClick={() => setCurrentView("posts")}
                >
                  Explorar publicaciones
                </button>
                <button
                  className="btn btn-outline-light btn-lg"
                  onClick={() => setCurrentView("create-post")}
                >
                  Compartir mi historia
                </button>{" "}
              </div>
              <Carousel />
            </div>{" "}
            <Post />
          </>
        );
      case "posts":
        return (
          <div className="container mt-4">
            <h2>Aquí están todos los posteos</h2>
            <Post />
          </div>
        );
      case "register":
        return <Register />;
      case "login":
        return <StartSession />;
      case "create-post":
        return <PostForm />;
      case "manage-posts":
        return <PostList />;
      default:
        return <Post />;
    }
  };
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-grow-1">{renderContent()}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
