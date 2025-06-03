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

function App() {
  const [currentView, setCurrentView] = useState("home");

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <>
            <div className="container mt-4">
              <div className="jumbotron bg-primary text-white p-5 rounded mb-4">
                <h1 className="display-4">Welcome to Travel Platform!</h1>
                <p className="lead">
                  Discover amazing travel destinations and share your
                  experiences with fellow travelers.
                </p>
                <hr className="my-4" />
                <p>Start exploring posts or share your own travel story!</p>
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
                </button>{" "}
              </div>
            </div>{" "}
            <Post />
          </>
        );
      case "posts":
        return (
          <div className="container mt-4">
            <h2>Posts Page</h2>
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
