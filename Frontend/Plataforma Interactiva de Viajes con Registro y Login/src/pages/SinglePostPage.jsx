import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { getPostById, deletePost as deletePostService } from '../services/postService'; // Import deletePost
import CommentList from '../components/CommentList';
import AddCommentForm from '../components/AddCommentForm';
import { useAuth } from '../context/AuthContext'; // Para verificar si el usuario es el propietario para los botones de editar/eliminar.

// Página para mostrar un post individual y sus comentarios.
function SinglePostPage() {
  const { postId } = useParams(); // Obtiene el ID del post de los parámetros de la URL.
  const navigate = useNavigate(); // Hook para la navegación programática.
  const { authState } = useAuth(); // Hook para acceder al estado de autenticación.

  // Estados del componente.
  const [post, setPost] = useState(null); // Almacena los datos del post.
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial del post.
  const [error, setError] = useState(null); // Estado para errores al cargar el post.
  const [commentUpdateKey, setCommentUpdateKey] = useState(Date.now()); // Key para forzar la actualización de CommentList.
  const [isDeleting, setIsDeleting] = useState(false); // Estado para la operación de eliminación del post.
  const [deleteError, setDeleteError] = useState(null); // Estado para errores durante la eliminación del post.

  // Callback para cargar los datos del post.
  const fetchPost = useCallback(async () => {
    setIsLoading(true); // Iniciar estado de carga.
    setError(null); // Limpiar errores previos.
    try {
      const fetchedPost = await getPostById(postId); // Llamada al servicio.
      setPost(fetchedPost); // Guardar datos del post.
    } catch (err) {
      setError(err.message || 'Error al cargar el post.'); // Guardar mensaje de error.
      console.error("Error fetching post:", err);
    } finally {
      setIsLoading(false); // Finalizar estado de carga.
    }
  }, [postId]); // Dependencia: postId, para recargar si cambia el ID del post.

  // Efecto para cargar el post cuando el componente se monta o postId cambia.
  useEffect(() => {
    fetchPost();
  }, [fetchPost]); // fetchPost está envuelto en useCallback.

  // Manejador para cuando se añade un nuevo comentario.
  const handleNewComment = (newComment) => {
    console.log('Nuevo comentario añadido, actualizando lista en SinglePostPage:', newComment);
    setCommentUpdateKey(Date.now()); // Actualiza la key para forzar el re-renderizado de CommentList.
  };

  // Manejador para eliminar el post.
  const handleDeletePost = async () => {
    // Confirmación del usuario antes de eliminar.
    if (window.confirm('¿Estás seguro de que deseas eliminar este post? Esta acción no se puede deshacer.')) {
      setIsDeleting(true);
      setDeleteError(null);
      try {
        await deletePostService(post.id); // Llama al servicio para eliminar el post.
        alert('Post eliminado exitosamente.'); // Notificación de éxito.
        navigate('/'); // Redirige a la página principal después de la eliminación.
      } catch (err) {
        setDeleteError(err.message || 'Error al eliminar el post.');
        console.error("Error deleting post:", err);
        // El error se podría mostrar en la UI en lugar de un alert.
        alert(`Error al eliminar el post: ${err.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Renderizado condicional mientras se carga el post o el estado de autenticación.
  if (isLoading || authState.isLoading) {
    return <p>Cargando detalles del post...</p>; // Mensaje de carga.
  }

  // Renderizado condicional si hay un error al cargar el post.
  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>; // Mensaje de error.
  }

  // Renderizado condicional si el post no se encuentra.
  if (!post) {
    return <p>Post no encontrado.</p>; // Mensaje si el post no existe.
  }

  // Comprobación de autoría para mostrar botones de editar/eliminar.
  // authState.user.id es el ID del usuario autenticado.
  // post.userId.id es el ID del autor del post (asumiendo que userId está populado y tiene un campo 'id').
  const isOwner = authState.isAuthenticated &&
                  post.userId &&
                  authState.user &&
                  String(post.userId.id) === String(authState.user.id);

  // Renderizado principal de la página del post.
  return (
    <div className="single-post-page" style={{ padding: '20px' }}>
      {/* Sección de contenido del post */}
      <article className="post-full-content">
        <h2>{post.title}</h2>
        {/* Muestra la imagen del post si existe. */}
        {post.image && <img src={post.image} alt={post.title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '15px' }} />}
        {/* Muestra la descripción del post. */}
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.desc}</p>
        {/* Muestra el nombre de usuario del autor del post. */}
        <p><small>Autor: {post.userId ? post.userId.username : 'Desconocido'}</small></p>

        {/* Acciones del Post (Editar/Eliminar), solo visibles para el autor. */}
        {isOwner && (
          <div className="post-actions" style={{ marginTop: '10px', marginBottom: '20px' }}>
            {/* Enlace para editar el post. */}
            <Link
              to={`/posts/${post.id}/edit`}
              style={{ marginRight: '10px', textDecoration:'none', color:'blue' }}
              onClick={(e) => { if(isDeleting) e.preventDefault(); }} // Deshabilitar si se está eliminando.
              aria-disabled={isDeleting}
            >
              Editar Post
            </Link>
            {/* Botón para eliminar el post. */}
            <button
              onClick={handleDeletePost}
              disabled={isDeleting} // Deshabilitar mientras se elimina.
              style={{
                color: isDeleting ? 'grey' : 'red',
                background:'none', border:'none', padding:'0',
                cursor: isDeleting ? 'default' : 'pointer',
                textDecoration:'underline'
              }}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Post'}
            </button>
          </div>
        )}
        {/* Muestra un error si ocurrió durante la eliminación. */}
        {deleteError && <p style={{ color: 'red' }}>Error al eliminar: {deleteError}</p>}
      </article>

      {/* Sección de comentarios. */}
      <section className="comments-section" style={{ marginTop: '30px' }}>
        <h3>Comentarios</h3>
        <AddCommentForm postId={post.id} onCommentAdded={handleNewComment} />
        <CommentList postId={post.id} key={commentUpdateKey} />
      </section>
    </div>
  );
}

export default SinglePostPage;
