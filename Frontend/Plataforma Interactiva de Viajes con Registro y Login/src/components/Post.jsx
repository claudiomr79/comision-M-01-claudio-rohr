import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import Comment from "./Comment";

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [likingPosts, setLikingPosts] = useState(new Set());
  const { user, token } = useAuth();

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/posts");
      const data = await response.json();

      if (data.success) {
        setPosts(data.posts);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleComments = (postId) => {
    const newExpandedPosts = new Set(expandedPosts);
    if (newExpandedPosts.has(postId)) {
      newExpandedPosts.delete(postId);
    } else {
      newExpandedPosts.add(postId);
    }
    setExpandedPosts(newExpandedPosts);
  };

  const handleLike = async (postId) => {
    console.log("Attempting to like post with ID:", postId); // Add this line for debugging
    if (!token || likingPosts.has(postId)) return;

    setLikingPosts((prev) => new Set(prev).add(postId));

    try {
      const response = await fetch(
        `http://localhost:3002/api/posts/${postId}/like`,
        {
          method: "POST", // Changed from PUT to POST
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the specific post in the posts array
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likes: data.post.likes } : post
          )
        );
      } else {
        console.error("Error liking post:", data.message);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const isLiked = (post) => {
    if (!user || !post.likes) return false;
    // Check if any object in post.likes has a user property equal to user.id
    return post.likes.some(
      (like) => like.user === user.id || like.user?._id === user.id
    );
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center text-success mb-4">Travel Posts</h1>
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-warning" role="alert">
          Error connecting to backend. Showing sample data.
        </div>
      )}{" "}
      <div className="row">
        {posts.length > 0
          ? posts.map((post) => (
              <div key={post._id} className="col-12 mb-4">
                <div className="card shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={post.image}
                        className="card-img h-100"
                        alt={post.title}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title text-success">
                          {post.title}
                        </h5>
                        <p className="card-text">{post.description}</p>
                        {post.location && (
                          <p className="text-muted small">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {post.location}
                          </p>
                        )}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <button
                              className={`btn btn-sm me-2 ${
                                isLiked(post)
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                              onClick={() => handleLike(post._id)}
                              disabled={!user || likingPosts.has(post._id)}
                            >
                              {likingPosts.has(post._id) ? (
                                <span
                                  className="spinner-border spinner-border-sm me-1"
                                  role="status"
                                ></span>
                              ) : (
                                <i
                                  className={`fas fa-heart me-1 ${
                                    isLiked(post) ? "text-white" : ""
                                  }`}
                                ></i>
                              )}
                              {post.likes?.length || 0}
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => toggleComments(post._id)}
                            >
                              <i className="fas fa-comment me-1"></i>
                              {expandedPosts.has(post._id)
                                ? "Ocultar"
                                : "Ver"}{" "}
                              Comentarios
                            </button>
                          </div>
                          <small className="text-muted">
                            por {post.author?.name || "Anónimo"}
                          </small>
                        </div>

                        {/* Comments Section */}
                        {expandedPosts.has(post._id) && (
                          <div className="border-top pt-3">
                            <Comment postId={post._id} showTitle={false} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  No posts available. Start the backend server to see posts.
                </div>
              </div>
            )}
      </div>
    </div>
  );
}

export default Post;
