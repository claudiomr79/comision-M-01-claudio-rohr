import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
// import { useAuth } from '../context/AuthContext'; // No es estrictamente necesario si la página siempre está protegida por ProtectedRoute

// Página para crear un nuevo post.
function CreatePostPage() {
  // Estados para los campos del formulario.
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(''); // URL de la imagen.
  // Estados para el manejo de errores y carga.
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación.

  // Manejador para el envío del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const newPostData = { title, desc, image };
      const createdPost = await createPost(newPostData);
      console.log('Post created successfully:', createdPost);
      // Assuming createdPost has an id, navigate to its page or home
      // If your backend returns the created post with its ID:
      // navigate(`/posts/${createdPost.id}`);
      // For now, navigate to home
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create post. Please try again.');
      console.error('Create post error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container" style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
          <input
            type="text"
            id="title"
            name="title" // Añadir name para posible uso futuro o consistencia
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null); // Limpiar error al escribir
            }}
            required
            disabled={loading} // Deshabilitar input durante la carga
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="desc" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea
            id="desc"
            name="desc" // Añadir name
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
              if (error) setError(null); // Limpiar error al escribir
            }}
            required
            rows="5"
            disabled={loading} // Deshabilitar input durante la carga
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px' }}>Image URL:</label>
          <input
            type="url"
            id="image"
            name="image" // Añadir name
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              if (error) setError(null); // Limpiar error al escribir
            }}
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={loading} // Deshabilitar input durante la carga
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* Muestra el mensaje de error si existe */}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '10px 15px', marginTop: '10px' }}>
          {loading ? 'Creando Post...' : 'Crear Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
