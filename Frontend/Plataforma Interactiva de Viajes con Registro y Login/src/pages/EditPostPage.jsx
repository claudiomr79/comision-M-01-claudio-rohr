import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';

// Página para editar un post existente.
function EditPostPage() {
  const { postId } = useParams(); // Obtiene el ID del post de los parámetros de la URL.
  const navigate = useNavigate(); // Hook para la navegación programática.
  const { authState } = useAuth(); // Hook para acceder al estado de autenticación.

  // Estado para los datos del formulario del post.
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    image: '',
  });
  // Estado para los datos del formulario del post.
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    image: '',
  });
  const [initialLoading, setInitialLoading] = useState(true); // Carga inicial de datos del post.
  const [isSubmitting, setIsSubmitting] = useState(false); // Envío del formulario de actualización.
  const [loadError, setLoadError] = useState(null); // Error al cargar datos iniciales.
  const [submitError, setSubmitError] = useState(null); // Error al enviar el formulario.
  const [originalAuthorId, setOriginalAuthorId] = useState(null);

  // Carga los datos del post para edición.
  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;
      setInitialLoading(true);
      setLoadError(null); // Limpiar error de carga previo.
      try {
        const postData = await getPostById(postId);
        if (!postData) {
          setLoadError("Post no encontrado.");
          return;
        }

        const authorId = postData.userId && (postData.userId.id || postData.userId._id || postData.userId);
        setOriginalAuthorId(String(authorId)); // Convertir a String para comparación consistente.

        // Verificar autorización antes de poblar el formulario.
        if (!authState.isAuthenticated || String(authorId) !== String(authState.user.id)) {
          setLoadError("No estás autorizado para editar este post.");
          return;
        }

        setFormData({
          title: postData.title || '',
          desc: postData.desc || '',
          image: postData.image || '',
        });
      } catch (err) {
        setLoadError(err.message || "Error al cargar el post.");
        console.error("Error fetching post for edit:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    // Solo intentar cargar datos si el estado de autenticación no está cargando y el usuario está autenticado.
    if (!authState.isLoading && authState.isAuthenticated) {
        fetchPostData();
    } else if (!authState.isLoading && !authState.isAuthenticated) {
        setLoadError("Debes iniciar sesión para editar un post.");
        setInitialLoading(false);
    }
    // Si authState.isLoading es true, el efecto esperará a que cambie.
  }, [postId, authState.isAuthenticated, authState.user, authState.isLoading]);

  // Manejador para los cambios en los inputs del formulario.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null); // Limpiar error de envío al escribir.
  };

  // Manejador para el envío del formulario de actualización.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Doble verificación de autorización por si acaso.
    if (String(originalAuthorId) !== String(authState.user.id)) {
        setSubmitError("No estás autorizado para editar este post.");
        return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await updatePost(postId, formData);
      navigate(`/posts/${postId}`); // Redirigir a la página del post.
    } catch (err) {
      setSubmitError(err.message || "Error al actualizar el post.");
      console.error("Error updating post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizado durante la carga inicial o si authState está cargando.
  if (initialLoading || authState.isLoading) {
    return <p>Cargando datos del post...</p>;
  }

  // Mostrar error de carga si existe (ej. post no encontrado, no autorizado).
  if (loadError) {
    return <p style={{ color: 'red' }}>Error: {loadError}</p>;
  }

  // Este chequeo es una salvaguarda, el error de carga ya debería haberlo cubierto.
  // Si el usuario no es el autor original (verificado después de cargar el post).
  if (String(originalAuthorId) !== String(authState.user.id)) {
    return <p style={{ color: 'red' }}>Error: No estás autorizado para editar este post (verificación final).</p>;
  }

  // Renderizado del formulario de edición.
  return (
    <div className="edit-post-container" style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Editar Post</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo Título */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isSubmitting || initialLoading} // Deshabilitar si está cargando o enviando.
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {/* Campo Descripción */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="desc" style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
            rows="5"
            disabled={isSubmitting || initialLoading}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {/* Campo URL de Imagen */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>URL de la Imagen:</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={isSubmitting || initialLoading}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {/* Mostrar error de envío si existe */}
        {submitError && <p style={{ color: 'red', marginTop: '10px' }}>{submitError}</p>}
        <button type="submit" disabled={isSubmitting || initialLoading} style={{ padding: '10px 15px', marginTop: '10px' }}>
          {isSubmitting ? 'Guardando Cambios...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}

export default EditPostPage;
