import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function PostForm() {
  const { apiRequest, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setMessage({
        type: "error",
        text: "You must be logged in to create a post.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await apiRequest("/posts", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Post created successfully!" });
        setFormData({ title: "", description: "", image: "", location: "" });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Error creating post",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error connecting to server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">Create New Travel Post</h4>
            </div>{" "}
            <div className="card-body">
              {!isAuthenticated && (
                <div className="alert alert-warning" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  You must be logged in to create a post.
                </div>
              )}

              {message.text && (
                <div
                  className={`alert alert-${
                    message.type === "error" ? "danger" : "success"
                  } alert-dismissible fade show`}
                  role="alert"
                >
                  {message.text}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage({ type: "", text: "" })}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter post title"
                    required
                  />
                </div>{" "}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your travel experience..."
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where did you go? (e.g., Paris, France)"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                {formData.image && (
                  <div className="mb-3">
                    <label className="form-label">Image Preview:</label>
                    <div>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{ maxHeight: "200px" }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}{" "}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-info"
                    disabled={loading || !isAuthenticated}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creating Post...
                      </>
                    ) : (
                      "Create Post"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostForm;
