import React, { useState, useEffect } from 'react';
import { getCommentsByPostId } from '../services/commentService';
import './Comment.css'; // Asumiendo que podrías querer estilos para los comentarios.

// Componente para mostrar la lista de comentarios de un post.
function CommentList({ postId }) {
  // Estado para almacenar los comentarios.
  const [comments, setComments] = useState([]);
  // Estado para la carga de comentarios.
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  // Estado para errores en la carga de comentarios.
  const [loadCommentsError, setLoadCommentsError] = useState(null);

  // Efecto para cargar los comentarios cuando el componente se monta o postId cambia.
  // La 'key' prop en SinglePostPage también puede forzar un re-montaje y re-fetch.
  useEffect(() => {
    if (!postId) return; // No hacer nada si no hay postId.

    const fetchComments = async () => {
      setIsLoadingComments(true); // Iniciar estado de carga.
      setLoadCommentsError(null); // Limpiar errores previos.
      try {
        const fetchedComments = await getCommentsByPostId(postId); // Llamada al servicio.
        setComments(fetchedComments || []); // Asegurar que comments sea siempre un array.
      } catch (err) {
        setLoadCommentsError(err.message || 'Error al cargar los comentarios.'); // Guardar mensaje de error.
        console.error("Error fetching comments:", err);
        setComments([]); // Limpiar comentarios en caso de error.
      } finally {
        setIsLoadingComments(false); // Finalizar estado de carga.
      }
    };

    fetchComments();
  }, [postId]); // Dependencia: postId, para recargar si cambia el ID del post.

  // Renderizado condicional basado en el estado de carga.
  if (isLoadingComments) {
    return <p>Cargando comentarios...</p>; // Mensaje mientras se cargan los comentarios.
  }

  // Renderizado condicional basado en el estado de error.
  if (loadCommentsError) {
    return <p style={{ color: 'red' }}>Error: {loadCommentsError}</p>; // Mensaje de error.
  }

  // Renderizado si no hay comentarios y no hay error/carga.
  if (comments.length === 0) {
    return <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>;
  }

  // Renderizado de la lista de comentarios.
  return (
    <div className="comment-list" style={{ marginTop: '15px' }}>
      {/* <h4>Comentarios</h4> Ya está en SinglePostPage */}
      {comments.map((comment) => (
        // Cada comentario individual.
        <div key={comment.id} className="comment-item" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
          <p className="comment-text" style={{ margin: '5px 0' }}>{comment.text}</p>
          <small className="comment-meta">
            {/* Muestra el nombre del autor y la fecha de creación. */}
            Por: {comment.author ? comment.author.username : 'Usuario Desconocido'} | Creado: {new Date(comment.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
