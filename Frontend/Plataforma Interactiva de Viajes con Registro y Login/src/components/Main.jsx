import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For linking to single post pages
import { getAllPosts } from '../services/postService';
// CommentList y AddCommentForm se moverán a una vista de post individual más adelante.

// Componente principal que muestra el listado de posts.
function Main() {
  // Estado para almacenar los posts.
  const [posts, setPosts] = useState([]);
  // Estado para la carga de posts.
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  // Estado para errores en la carga de posts.
  const [loadPostsError, setLoadPostsError] = useState(null);

  // Efecto para cargar los posts cuando el componente se monta.
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoadingPosts(true); // Iniciar estado de carga.
      setLoadPostsError(null); // Limpiar errores previos.
      try {
        const fetchedPosts = await getAllPosts(); // Llamada al servicio.
        setPosts(fetchedPosts || []); // Asegurar que posts sea siempre un array.
      } catch (err) {
        setLoadPostsError(err.message || 'Error al cargar los posts.'); // Guardar mensaje de error.
        console.error("Error fetching posts:", err);
        setPosts([]); // Limpiar posts en caso de error.
      } finally {
        setIsLoadingPosts(false); // Finalizar estado de carga.
      }
    };

    fetchPosts();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar.

  // Renderizado condicional basado en el estado de carga.
  if (isLoadingPosts) {
    return <p>Cargando posts...</p>; // Mensaje mientras se cargan los posts.
  }

  // Renderizado condicional basado en el estado de error.
  if (loadPostsError) {
    return <p style={{ color: 'red' }}>Error: {loadPostsError}</p>; // Mensaje de error.
  }

  // Renderizado principal del componente.
  return (
    <main className="container">
      <h1>Últimos Posts</h1>
      {/* Si no hay posts y no hay error/carga, mostrar mensaje específico. */}
      {posts.length === 0 ? (
        <p>No hay posts disponibles todavía. ¿Por qué no creas uno?</p>
      ) : (
        // Lista de posts.
        <div className="posts-list">
          {posts.map(post => (
            // Cada post es un artículo con un resumen.
            <article key={post.id} className="post-summary" style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px' }}>
              <h2>{post.title}</h2>
              {/* Muestra una parte de la descripción o un mensaje si no hay descripción. */}
              <p>{post.desc ? post.desc.substring(0, 100) + '...' : 'Sin descripción.'}</p>
              {/* Muestra la imagen si existe. */}
              {post.image && <img src={post.image} alt={post.title} style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', marginBottom: '10px' }} />}
              {/* Muestra el nombre del autor del post. post.userId ahora es un objeto populado. */}
              <p><small>Autor: {post.userId ? post.userId.username : 'Desconocido'}</small></p>
              {/* Enlace para leer más, que lleva a la página del post individual. */}
              <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'blue' }}>Leer más</Link>
            </article>
          ))}
        </div>
      )}
      {/*
        La sección de visualización de un post individual y comentarios que estaba aquí
        se moverá a un componente de página dedicado (ej. PostPage.jsx o similar).
        Main.jsx ahora se enfoca en listar todos los posts.
      */}
    </main>
  );
}

export default Main;