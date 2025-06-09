/**
 * @fileoverview Componente PostList - Gestión completa de posts de viajes
 *
 * Este componente proporciona una interfaz administrativa para la gestión
 * completa de posts en la plataforma de viajes. Incluye funcionalidades
 * avanzadas de CRUD (Crear, Leer, Actualizar, Eliminar) con:
 *
 * Características principales:
 * - Visualización en grid responsive de todos los posts
 * - Sistema de permisos granular (propietario/admin)
 * - Modales interactivos para edición y eliminación
 * - Validación de permisos en tiempo real
 * - Manejo de estados de carga y errores
 * - Diseño optimizado para diferentes dispositivos
 * - Integración completa con sistema de autenticación
 *
 * Funcionalidades de gestión:
 * - Edición en línea con modales
 * - Eliminación con confirmación de seguridad
 * - Identificación visual de posts propios
 * - Control de acceso basado en roles
 *
 * @component
 * @author Sistema de Gestión de Viajes
 * @version 1.0.0
 * @since 2024
 */

// Importaciones de React y contextos necesarios
import React, { useState, useEffect } from "react";
// Contexto de autenticación para control de permisos
import { useAuth } from "../contexts/AuthContext";

/**
 * Componente de gestión de lista de posts
 *
 * Proporciona una interfaz administrativa completa para gestionar posts
 * con funcionalidades de visualización, edición y eliminación basadas
 * en permisos de usuario.
 *
 * @returns {JSX.Element} Interfaz de gestión de posts
 */
function PostList() {
  // Estados para manejo de datos y UI
  const [posts, setPosts] = useState([]); // Array de posts cargados
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [error, setError] = useState(null); // Manejo de errores de API

  // Estados para modal de edición
  const [showEditModal, setShowEditModal] = useState(false); // Visibilidad del modal de edición
  const [editData, setEditData] = useState({
    // Datos del post en edición
    id: "",
    title: "",
    desc: "",
  });

  // Estados para modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Visibilidad del modal de eliminación
  const [deleteId, setDeleteId] = useState(""); // ID del post a eliminar

  // Contexto de autenticación para permisos
  const { user, token } = useAuth();

  // Hook de efecto para cargar posts al montar el componente
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Obtener todos los posts desde la API
   *
   * Realiza una consulta GET para cargar todos los posts disponibles
   * con manejo de errores y estados de carga optimizados.
   *
   * @async
   * @function fetchPosts
   * @returns {Promise<void>}
   */
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:3002/api/posts");
      if (!res.ok) throw new Error("Error al cargar posts");

      const data = await res.json();
      // Manejar diferentes estructuras de respuesta de la API
      setPosts(data.posts || data);
    } catch (err) {
      console.error("Error obteniendo posts:", err);
      setError(err.message);
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };
  /**
   * Eliminar un post específico
   *
   * Función interna que se ejecuta después de la confirmación del modal.
   * Realiza la eliminación del post con validación de permisos y
   * actualización automática de la lista.
   *
   * @async
   * @param {string} id - ID único del post a eliminar
   */
  const handleDeletePost = async (id) => {
    try {
      const res = await fetch(`http://localhost:3002/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Token de autenticación requerido
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        // Actualizar lista local removiendo el post eliminado
        setPosts(posts.filter((p) => p._id !== id));
        alert("Post eliminado correctamente");
      } else {
        alert(result.message || "Error al eliminar post");
      }
    } catch (err) {
      console.error("Error eliminando post:", err);
      alert("Error de conexión");
    }
  };

  /**
   * Abrir modal de edición con datos del post
   *
   * Prepara los datos del post seleccionado para edición
   * y muestra el modal correspondiente.
   *
   * @param {Object} post - Objeto del post a editar
   * @param {string} post._id - ID único del post
   * @param {string} post.title - Título del post
   * @param {string} post.desc - Descripción del post
   */
  const openEditModal = (post) => {
    setEditData({
      id: post._id,
      title: post.title,
      desc: post.desc,
    });
    setShowEditModal(true);
  };

  /**
   * Manejar cambios en los campos del modal de edición
   *
   * Actualiza el estado local mientras el usuario edita
   * los campos del formulario en el modal.
   *
   * @param {Event} e - Evento de cambio del input
   */
  const handleModalChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Actualizar un post existente
   *
   * Envía los datos modificados al backend y actualiza
   * la lista local después de una edición exitosa.
   *
   * @async
   */
  const handleUpdatePost = async () => {
    try {
      const res = await fetch(
        `http://localhost:3002/api/posts/${editData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Autenticación requerida
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editData.title,
            desc: editData.desc,
          }),
        }
      );

      if (res.ok) {
        setShowEditModal(false); // Cerrar modal
        fetchPosts(); // Recargar lista actualizada
      } else {
        const err = await res.json();
        alert(err.message || "Error al actualizar");
      }
    } catch (err) {
      console.error("Error actualizando post:", err);
      alert("Error de conexión");
    }
  };

  /**
   * Abrir modal de confirmación para eliminación
   *
   * Muestra el modal de confirmación antes de proceder
   * con la eliminación del post.
   *
   * @param {string} id - ID del post a eliminar
   */
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  /**
   * Confirmar y proceder con la eliminación
   *
   * Ejecuta la eliminación después de la confirmación
   * del usuario y limpia los estados del modal.
   */
  const handleConfirmDelete = () => {
    handleDeletePost(deleteId);
    setShowDeleteModal(false);
    setDeleteId("");
  };

  /**
   * Cancelar la eliminación
   *
   * Cierra el modal de confirmación sin realizar
   * ninguna acción destructiva.
   */
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId("");
  };

  // Mantener orden original de posts para consistencia de UI
  const sortedPosts = posts;
  // Renderizado condicional para estados de carga y error
  if (loading)
    return (
      <div className="container mt-4 text-center">
        {/* Spinner de carga con estilos Bootstrap */}
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container mt-4">
        {/* Mensaje de error con styling de alerta */}
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );

  // Renderizado principal del componente
  return (
    <div className="container mt-4">
      {/* Header con título y contador de posts */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Gestionar Posts</h2>
        <span className="badge bg-secondary">{posts.length} posts</span>
      </div>
      {/* Renderizado condicional basado en estado de autenticación y datos */}
      {!user ? (
        /* Mensaje para usuarios no autenticados */
        <div className="alert alert-warning text-center">
          <h4>Acceso requerido</h4>
          <p>Debes iniciar sesión para gestionar los posts.</p>
        </div>
      ) : posts.length === 0 ? (
        /* Mensaje cuando no hay posts disponibles */
        <div className="alert alert-info text-center">
          <h4>No hay posts disponibles</h4>
          <p>¡Crea tu primer post para comenzar!</p>
        </div>
      ) : (
        /* Grid principal de posts */
        <div className="row">
          {posts.map((post) => {
            // Verificar si el usuario actual es el autor del post
            const isAuthor =
              user && String(post.author?._id) === String(user.id);

            return (
              <div key={post._id} className="col-md-6 col-lg-4 mb-4">
                {/* Card del post con estilos condicionales para posts propios */}
                <div
                  className={`card h-100 shadow-sm${
                    isAuthor ? " shadow-lg border border-primary" : ""
                  }`}
                >
                  {/* Imagen del post con fallback en caso de error */}
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

                  {/* Contenido del card */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text flex-grow-1">{post.desc}</p>

                    {/* Información del autor */}
                    <div className="text-muted small mb-2">
                      Por: {post.author?.name || "Usuario"}
                    </div>

                    {/* Sección de acciones (editar/eliminar) */}
                    <div className="mt-auto">
                      {user &&
                      (String(user.id) === String(post.author?._id) ||
                        user.role === "admin") ? (
                        /* Botones de acción para propietarios y admins */
                        <div className="btn-group w-100" role="group">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => openEditModal(post)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => openDeleteModal(post._id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      ) : user ? (
                        /* Mensaje para usuarios sin permisos */
                        <div className="small text-warning">
                          No tienes permisos para editar este post
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}{" "}
      {/* Modal de edición de post */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* Header del modal */}
              <div className="modal-header">
                <h5 className="modal-title">Editar Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>

              {/* Formulario de edición */}
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={editData.title}
                    onChange={handleModalChange}
                    placeholder="Ingresa el título del post"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="desc"
                    rows="4"
                    value={editData.desc}
                    onChange={handleModalChange}
                    placeholder="Describe tu experiencia de viaje..."
                  ></textarea>
                </div>
              </div>

              {/* Botones de acción del modal */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdatePost}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Header del modal de eliminación */}
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancelDelete}
                ></button>
              </div>

              {/* Mensaje de confirmación */}
              <div className="modal-body">
                <p>¿Estás seguro de que quieres eliminar este post?</p>
                <small className="text-muted">
                  Esta acción no se puede deshacer.
                </small>
              </div>

              {/* Botones de confirmación */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelDelete}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Exportación del componente PostList
 *
 * Este componente proporciona una interfaz administrativa completa
 * para la gestión de posts con funcionalidades avanzadas de CRUD
 * y control de permisos granular.
 */
export default PostList;
