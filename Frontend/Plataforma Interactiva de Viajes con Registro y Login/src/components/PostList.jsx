import React, { useState, useEffect } from "react";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:4000/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        throw new Error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`http://localhost:4000/posts/${postId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== postId));
          alert("Post deleted successfully!");
        } else {
          alert("Error deleting post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Error connecting to server");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error loading posts: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Manage Posts</h2>
        <span className="badge bg-secondary">{posts.length} posts</span>
      </div>

      {posts.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>No posts available</h4>
          <p>Create your first travel post to get started!</p>
        </div>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={post.image}
                  className="card-img-top"
                  alt={post.title}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Image+Not+Found";
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text flex-grow-1">{post.desc}</p>
                  <div className="mt-auto">
                    <div className="btn-group w-100" role="group">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => console.log("Edit post:", post.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PostList;
