/**
 * @fileoverview Componente PostForm - Formulario de creación de posts de viajes
 *
 * Este componente proporciona una interfaz completa para la creación de nuevos
 * posts de viajes en la plataforma. Incluye funcionalidades avanzadas como:
 *
 * Características principales:
 * - Formulario responsivo con validación en tiempo real
 * - Vista previa de imágenes con manejo de errores
 * - Integración completa con sistema de autenticación
 * - Manejo de estados de carga y mensajes de feedback
 * - Validación de campos requeridos
 * - Limpieza automática del formulario después del envío exitoso
 * - Diseño moderno con Bootstrap y componentes interactivos
 *
 * Funcionalidades de UX:
 * - Mensajes de éxito/error con dismissible alerts
 * - Spinners de carga durante el envío
 * - Validación de autenticación antes del envío
 * - Placeholder informativos para mejor guía del usuario
 *
 * @component
 * @author Sistema de Gestión de Viajes
 * @version 1.0.0
 * @since 2024
 */

// Importaciones de React y contextos necesarios
import React, { useState } from "react";
// Contexto de autenticación para validación y requests
import { useAuth } from "../contexts/AuthContext";

/**
 * Componente de formulario para crear posts de viajes
 *
 * Proporciona una interfaz intuitiva y completa para que los usuarios
 * autenticados puedan crear y compartir sus experiencias de viaje.
 *
 * @returns {JSX.Element} Formulario de creación de posts
 */
function PostForm() {
  // Desestructuración del contexto de autenticación
  const { apiRequest, isAuthenticated } = useAuth();

  // Estado del formulario con todos los campos necesarios
  const [formData, setFormData] = useState({
    title: "", // Título del post
    desc: "", // Descripción detallada
    image: "", // URL de la imagen
    location: "", // Ubicación del viaje
  });

  // Estados de UI para manejo de carga y mensajes
  const [loading, setLoading] = useState(false); // Estado de envío
  const [message, setMessage] = useState({ type: "", text: "" }); // Mensajes de feedback

  /**
   * Manejar cambios en los campos del formulario
   *
   * Actualiza el estado del formulario cuando el usuario
   * modifica cualquier campo de entrada.
   *
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // Actualizar campo específico
    });
  };

  /**
   * Manejar el envío del formulario
   *
   * Procesa la creación del post con validaciones previas,
   * manejo de estados de carga y feedback al usuario.
   *
   * @async
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    // Validación de autenticación antes del envío
    if (!isAuthenticated) {
      setMessage({
        type: "error",
        text: "Debes iniciar sesión para crear un post.",
      });
      return;
    }

    // Iniciar estado de carga y limpiar mensajes previos
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Realizar petición a la API para crear el post
      const response = await apiRequest("/posts", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Éxito: mostrar mensaje y limpiar formulario
        setMessage({
          type: "success",
          text: "¡Post creado exitosamente!",
        });
        // Resetear formulario para nuevo post
        setFormData({
          title: "",
          desc: "",
          image: "",
          location: "",
        });
      } else {
        // Error del servidor: mostrar mensaje específico
        setMessage({
          type: "error",
          text: data.message || "Error al crear el post",
        });
      }
    } catch (error) {
      // Error de conexión: mostrar mensaje genérico
      setMessage({
        type: "error",
        text: "Error de conexión al servidor",
      });
    } finally {
      // Finalizar estado de carga independientemente del resultado
      setLoading(false);
    }
  };
  // Renderizado del componente
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* Card principal del formulario */}
          <div className="card shadow">
            {/* Header del formulario */}
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">Crear Nuevo Post de Viaje</h4>
            </div>

            {/* Cuerpo del formulario */}
            <div className="card-body">
              {/* Alerta para usuarios no autenticados */}
              {!isAuthenticated && (
                <div className="alert alert-warning" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Debes iniciar sesión para crear un post.
                </div>
              )}

              {/* Mensajes de feedback (éxito/error) */}
              {message.text && (
                <div
                  className={`alert alert-${
                    message.type === "error" ? "danger" : "success"
                  } alert-dismissible fade show`}
                  role="alert"
                >
                  {message.text}
                  {/* Botón para cerrar el mensaje */}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage({ type: "", text: "" })}
                  ></button>
                </div>
              )}

              {/* Formulario principal */}
              <form onSubmit={handleSubmit}>
                {/* Campo de título */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Título
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ingresa el título de tu post"
                    required
                  />
                </div>

                {/* Campo de descripción */}
                <div className="mb-3">
                  <label htmlFor="desc" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="desc"
                    name="desc"
                    rows="4"
                    value={formData.desc}
                    onChange={handleChange}
                    placeholder="Describe tu experiencia de viaje..."
                    required
                  ></textarea>
                </div>

                {/* Campo de ubicación */}
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="¿Dónde fuiste? (ej: París, Francia)"
                  />
                </div>

                {/* Campo de URL de imagen */}
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    required
                  />
                </div>

                {/* Vista previa de imagen (condicional) */}
                {formData.image && (
                  <div className="mb-3">
                    <label className="form-label">
                      Vista previa de imagen:
                    </label>
                    <div>
                      <img
                        src={formData.image}
                        alt="Vista previa"
                        className="img-thumbnail"
                        style={{ maxHeight: "200px" }}
                        onError={(e) => {
                          // Ocultar imagen si falla la carga
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Botón de envío */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-info"
                    disabled={loading || !isAuthenticated}
                  >
                    {loading ? (
                      /* Estado de carga con spinner */
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creando Post...
                      </>
                    ) : (
                      /* Estado normal */
                      "Crear Post"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Exportación del componente PostForm
 *
 * Este componente proporciona una interfaz completa y user-friendly
 * para la creación de posts de viajes con validación en tiempo real
 * y feedback interactivo para el usuario.
 */
export default PostForm;
