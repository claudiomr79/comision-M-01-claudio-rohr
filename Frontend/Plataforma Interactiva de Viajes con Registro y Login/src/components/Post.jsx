/**
 * @fileoverview Componente Post - Visualización principal de posts de viajes
 *
 * Este componente maneja la visualización de todos los posts de la plataforma de viajes.
 * Incluye funcionalidades avanzadas como:
 * - Carga dinámica de posts desde la API
 * - Sistema de likes interactivo con estados optimistas
 * - Expansión/colapso de sección de comentarios
 * - Manejo de estados de carga y errores
 * - Integración con sistema de autenticación
 * - Diseño responsive con Bootstrap
 *
 * Características principales:
 * - Grid responsive para diferentes tamaños de pantalla
 * - Indicadores visuales de estados de carga
 * - Prevención de clicks múltiples en likes
 * - Integración seamless con el componente Comment
 *
 * @component
 * @author Sistema de Gestión de Viajes
 * @version 1.0.0
 * @since 2024
 */

// Importaciones de React y hooks necesarios
import React, { useState, useEffect, useContext } from "react";
// Contexto de autenticación para manejo de usuarios
import { useAuth } from "../contexts/AuthContext";
// Componente de comentarios para integración
import Comment from "./Comment";

/**
 * Componente principal para mostrar posts de viajes
 *
 * Este componente gestiona la visualización de todos los posts con funcionalidades
 * interactivas como likes, comentarios y estados de carga optimizados.
 *
 * @returns {JSX.Element} Componente de visualización de posts
 */
function Post() {
  // Estados para gestión de datos y UI
  const [posts, setPosts] = useState([]); // Array de posts cargados
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [error, setError] = useState(null); // Manejo de errores de red
  const [expandedPosts, setExpandedPosts] = useState(new Set()); // Posts con comentarios expandidos
  const [likingPosts, setLikingPosts] = useState(new Set()); // Posts en proceso de like (prevención doble click)

  // Extracción de datos del contexto de autenticación
  const { user, token } = useAuth();

  /**
   * Función para obtener posts desde la API del backend
   *
   * Realiza una consulta GET a la API de posts y maneja diferentes
   * escenarios de respuesta incluyendo errores de conexión.
   *
   * @async
   * @function fetchPosts
   * @returns {Promise<void>}
   */
  const fetchPosts = async () => {
    try {
      // Realizar petición a la API de posts
      const response = await fetch("http://localhost:3002/api/posts");
      const data = await response.json();

      // Procesar respuesta según estructura de datos
      if (data.success) {
        setPosts(data.posts); // Respuesta estructurada con éxito
      } else {
        setPosts(data); // Respuesta directa (retrocompatibilidad)
      }
    } catch (error) {
      // Manejo de errores de red o parsing
      console.error("Error obteniendo posts:", error);
      setError(error);
    } finally {
      // Finalizar estado de carga independientemente del resultado
      setLoading(false);
    }
  };
  // Hook de efecto para cargar posts al montar el componente
  useEffect(() => {
    fetchPosts(); // Cargar posts automáticamente
  }, []);

  /**
   * Alternar la visualización de comentarios para un post específico
   *
   * Gestiona el estado de expansión/colapso de la sección de comentarios
   * utilizando un Set para optimizar las operaciones de búsqueda.
   *
   * @param {string} postId - ID único del post
   */
  const toggleComments = (postId) => {
    const newExpandedPosts = new Set(expandedPosts);
    if (newExpandedPosts.has(postId)) {
      newExpandedPosts.delete(postId); // Colapsar comentarios
    } else {
      newExpandedPosts.add(postId); // Expandir comentarios
    }
    setExpandedPosts(newExpandedPosts);
  };

  /**
   * Manejar la acción de dar like a un post
   *
   * Implementa un sistema de likes optimista con prevención de clicks múltiples.
   * Actualiza la UI inmediatamente y sincroniza con el backend.
   *
   * @async
   * @param {string} postId - ID único del post a dar like
   */
  const handleLike = async (postId) => {
    console.log("Intentando dar like al post con ID:", postId); // Debug para desarrollo

    // Validaciones antes de procesar el like
    if (!token || likingPosts.has(postId)) return; // Usuario no autenticado o like en proceso

    // Marcar post como "en proceso de like" para prevenir clicks múltiples
    setLikingPosts((prev) => new Set(prev).add(postId));

    try {
      // Realizar petición POST para dar/quitar like
      const response = await fetch(
        `http://localhost:3002/api/posts/${postId}/like`,
        {
          method: "POST", // Método correcto para toggle de likes
          headers: {
            Authorization: `Bearer ${token}`, // Token de autenticación
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Actualización optimista: actualizar solo el post específico
        setPosts((prevPosts) =>
          prevPosts.map(
            (post) =>
              post._id === postId
                ? { ...post, likes: data.post.likes } // Nuevo estado de likes
                : post // Mantener otros posts sin cambios
          )
        );
      } else {
        console.error("Error al dar like:", data.message);
      }
    } catch (error) {
      console.error("Error de conexión al dar like:", error);
    } finally {
      // Remover post del estado "en proceso" independientemente del resultado
      setLikingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };
  /**
   * Determinar si el usuario actual ha dado like a un post
   *
   * Verifica si el usuario autenticado está presente en el array de likes
   * del post, considerando diferentes estructuras de datos posibles.
   *
   * @param {Object} post - Objeto del post a verificar
   * @param {Array} post.likes - Array de likes del post
   * @returns {boolean} true si el usuario ha dado like, false en caso contrario
   */
  const isLiked = (post) => {
    if (!user || !post.likes) return false; // Sin usuario o sin likes

    // Verificar si algún objeto en post.likes corresponde al usuario actual
    return post.likes.some(
      (like) => like.user === user.id || like.user?._id === user.id
    );
  };

  // Renderizado del componente
  return (
    <div className="container mt-4">
      {/* Título principal de la sección */}
      <h1 className="text-center text-success mb-4">Posts de Viajes</h1>

      {/* Indicador de carga con spinner animado */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {/* Mensaje de error de conexión */}
      {error && (
        <div className="alert alert-warning" role="alert">
          Error conectando al backend. Mostrando datos de ejemplo.
        </div>
      )}

      {/* Grid principal de posts */}
      <div className="row">
        {posts.length > 0
          ? posts.map((post) => (
              <div key={post._id} className="col-12 mb-4">
                {/* Card individual del post con diseño horizontal */}
                <div className="card shadow-sm">
                  <div className="row g-0">
                    {/* Columna de imagen (responsive) */}
                    <div className="col-md-4">
                      <img
                        src={post.image}
                        className="card-img h-100"
                        alt={post.title}
                        style={{
                          objectFit: "cover",
                        }} /* Mantener proporción de imagen */
                      />
                    </div>

                    {/* Columna de contenido */}
                    <div className="col-md-8">
                      <div className="card-body">
                        {/* Título del post */}
                        <h5 className="card-title text-success">
                          {post.title}
                        </h5>

                        {/* Descripción del post */}
                        <p className="card-text">{post.description}</p>

                        {/* Ubicación (si existe) */}
                        {post.location && (
                          <p className="text-muted small">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {post.location}
                          </p>
                        )}

                        {/* Sección de acciones (likes y comentarios) */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            {/* Botón de like con estados dinámicos */}
                            <button
                              className={`btn btn-sm me-2 ${
                                isLiked(post)
                                  ? "btn-success" // Estilo para like activo
                                  : "btn-outline-success" // Estilo para like inactivo
                              }`}
                              onClick={() => handleLike(post._id)}
                              disabled={!user || likingPosts.has(post._id)} // Deshabilitar si no hay usuario o está procesando
                            >
                              {/* Spinner durante procesamiento de like */}
                              {likingPosts.has(post._id) ? (
                                <span
                                  className="spinner-border spinner-border-sm me-1"
                                  role="status"
                                ></span>
                              ) : (
                                /* Icono de corazón con colores dinámicos */
                                <i
                                  className={`fas fa-heart me-1 ${
                                    isLiked(post) ? "text-white" : ""
                                  }`}
                                ></i>
                              )}
                              {/* Contador de likes */}
                              {post.likes?.length || 0}
                            </button>

                            {/* Botón para alternar comentarios */}
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

                          {/* Información del autor */}
                          <small className="text-muted">
                            por {post.author?.name || "Anónimo"}
                          </small>
                        </div>

                        {/* Sección de comentarios (condicional) */}
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
          : /* Mensaje cuando no hay posts disponibles */
            !loading && (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  No hay posts disponibles. Inicia el servidor backend para ver
                  posts.
                </div>
              </div>
            )}
      </div>
    </div>
  );
}

/**
 * Exportación del componente Post
 *
 * Este componente proporciona una interfaz completa para visualizar posts
 * de viajes con funcionalidades interactivas optimizadas para la experiencia
 * del usuario en la plataforma de viajes.
 */
export default Post;
