import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:3002/api/posts");
      if (!res.ok) throw new Error("Error al cargar posts");
      const data = await res.json();
      setPosts(data.posts || data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este post?"))
      return;
    try {
      const res = await fetch(`http://localhost:3002/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== id));
        alert("Post eliminado correctamente");
      } else {
        alert(result.message || "Error al eliminar post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Error de conexión");
    }
  };

  // Agregar edición simple con prompts
  const handleEditPost = async (id, post) => {
    const title = prompt("Nuevo título:", post.title);
    if (title === null) return;
    const desc = prompt("Nueva descripción:", post.desc);
    if (desc === null) return;
    try {
      const res = await fetch(`http://localhost:3002/api/posts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          desc,
          image: post.image,
          location: post.location || "",
          tags: post.tags?.join(",") || "",
        }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Post actualizado correctamente");
        fetchPosts();
      } else {
        alert(result.message || "Error al actualizar post");
      }
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Error de conexión");
    }
  };

  if (loading)
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Gestionar Posts</h2>
        <span className="badge bg-secondary">{posts.length} posts</span>
      </div>
      {!user ? (
        <div className="alert alert-warning text-center">
          <h4>Acceso requerido</h4>
          <p>Debes iniciar sesión para gestionar los posts.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>No hay posts disponibles</h4>
          <p>¡Crea tu primer post para comenzar!</p>
        </div>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={post.image}
                  alt={post.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image")
                  }
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text flex-grow-1">{post.desc}</p>
                  <div className="text-muted small mb-2">
                    Por: {post.author?.name || "Usuario"}
                  </div>
                  <div className="mt-auto">
                    {/* debug permisos */}
                    {console.log(
                      "Post autor ID:",
                      post.author?._id,
                      "Usuario ID:",
                      user?.id
                    )}
                    {user && (
                      <div className="small text-muted mb-2">
                        {`Usuario: ${user.name} (ID: ${user.id})`}
                        <br />
                        {`Autor: ${post.author?.name} (ID: ${post.author?._id})`}
                        <br />
                        {`¿Es autor?: ${
                          String(user.id) === String(post.author?._id)
                            ? "SÍ"
                            : "NO"
                        }`}
                      </div>
                    )}
                    {user &&
                    (String(user.id) === String(post.author?._id) ||
                      user.role === "admin") ? (
                      <div className="btn-group w-100" role="group">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEditPost(post._id, post)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : user ? (
                      <div className="small text-warning">
                        No tienes permisos para editar este post
                      </div>
                    ) : null}
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
