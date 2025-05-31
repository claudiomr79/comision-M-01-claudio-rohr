import React, { useState } from 'react';
import { createComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';

// Componente para añadir un nuevo comentario a un post.
function AddCommentForm({ postId, onCommentAdded }) {
  const [text, setText] = useState(''); // Estado para el texto del comentario.
  const [submitError, setSubmitError] = useState(null); // Estado para errores de envío.
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el proceso de envío.
  const { authState } = useAuth(); // Hook para acceder al estado de autenticación.

  // Si el usuario no está autenticado, mostrar un mensaje para iniciar sesión.
  if (!authState.isAuthenticated) {
    return <p>Por favor, <Link to="/login" style={{color: 'blue'}}>inicia sesión</Link> para añadir un comentario.</p>;
  }

  // Manejador para el envío del formulario de comentario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setSubmitError('El texto del comentario no puede estar vacío.');
      return;
    }
    setSubmitError(null); // Limpiar errores previos.
    setIsSubmitting(true); // Iniciar estado de envío.

    try {
      const newComment = await createComment(postId, { text }); // Llamada al servicio.
      onCommentAdded(newComment); // Ejecutar callback para notificar al padre (ej. refrescar lista).
      setText(''); // Limpiar el campo de texto después del envío.
    } catch (err) {
      setSubmitError(err.message || 'Error al enviar el comentario.'); // Guardar mensaje de error.
      console.error("Error submitting comment:", err);
    } finally {
      setIsSubmitting(false); // Finalizar estado de envío.
    }
  };

  // Renderizado del formulario.
  return (
    <form onSubmit={handleSubmit} className="add-comment-form" style={{ marginTop: '20px' }}>
      <h4>Añadir un Comentario</h4>
      {/* Muestra el error de envío si existe. */}
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      <div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (submitError) setSubmitError(null); // Limpiar error al escribir.
          }}
          placeholder="Escribe tu comentario aquí..."
          rows="3"
          required
          disabled={isSubmitting} // Deshabilitar mientras se envía.
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
        />
      </div>
      <button type="submit" disabled={isSubmitting} style={{ marginTop: '10px', padding: '8px 15px' }}>
        {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
      </button>
    </form>
  );
}

export default AddCommentForm;
