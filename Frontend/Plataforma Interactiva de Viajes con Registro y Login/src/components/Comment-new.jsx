import React from "react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "./Comment.css";

function Comment({ postId, showTitle = true }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, token } = useContext(AuthContext);

  const fetchComments = async () => {
    if (!postId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3002/api/comments/post/${postId}`
      );
      const data = await response.json();

      if (data.success) {
        setComments(data.comments);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error loading comments: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:3002/api/comments/post/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newComment.trim() }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setNewComment("");
        await fetchComments(); // Reload comments
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error creating comment: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (
      !token ||
      !window.confirm("¿Estás seguro de que quieres eliminar este comentario?")
    )
      return;

    try {
      const response = await fetch(
        `http://localhost:3002/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        await fetchComments(); // Reload comments
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error deleting comment: " + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="container mt-4" id="comment">
        {showTitle && (
          <h1 className="text-center text-primary mb-4">Comentarios</h1>
        )}

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {/* Comment form for authenticated users */}
        {user && postId && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Agregar comentario</h5>
              <form onSubmit={handleSubmitComment}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Escribe tu comentario..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength="300"
                    required
                  ></textarea>
                  <div className="form-text">
                    {newComment.length}/300 caracteres
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !newComment.trim()}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Enviando...
                    </>
                  ) : (
                    "Comentar"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        )}

        {!loading && !postId && (
          <div className="alert alert-info text-center">
            Selecciona un post para ver sus comentarios
          </div>
        )}

        {!loading && postId && comments.length === 0 && (
          <div className="alert alert-info text-center">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </div>
        )}

        <div className="row">
          {comments.map((comment) => (
            <div key={comment._id} className="col-12 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="card-title text-primary mb-1">
                        {comment.author?.name || "Usuario anónimo"}
                      </h6>
                      <p className="card-text">
                        <small className="text-muted">
                          {comment.author?.email} •{" "}
                          {formatDate(comment.createdAt)}
                        </small>
                      </p>
                      <p className="card-text">{comment.content}</p>
                    </div>
                    {user &&
                      (user.id === comment.author?._id ||
                        user.role === "admin") && (
                        <button
                          className="btn btn-outline-danger btn-sm ms-2"
                          onClick={() => handleDeleteComment(comment._id)}
                          title="Eliminar comentario"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Comment;
