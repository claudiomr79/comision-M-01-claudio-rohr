/**
 * @fileoverview Controladores de comentarios - Gestión completa de comentarios en posts
 *
 * Este archivo contiene todos los controladores necesarios para la gestión de comentarios
 * en la plataforma de viajes. Incluye operaciones CRUD (Crear, Leer, Actualizar, Eliminar)
 * con validaciones de seguridad, control de permisos y optimizaciones de caché.
 *
 * Funcionalidades principales:
 * - Crear comentarios en posts específicos
 * - Obtener comentarios con paginación y caché optimizado
 * - Actualizar comentarios (solo propietario o admin)
 * - Eliminar comentarios con limpieza automática de referencias
 *
 * @author Sistema de Gestión de Viajes
 * @version 1.0.0
 * @since 2024
 */

// Importación de modelos de datos
const Comment = require("../models/comment-model.js"); // Modelo de comentarios
const Post = require("../models/post-model.js"); // Modelo de posts

/**
 * Crear un nuevo comentario en un post específico
 *
 * Este controlador maneja la creación de comentarios con las siguientes validaciones:
 * - Verificación de existencia del post
 * - Validación de autenticación del usuario
 * - Asociación automática del comentario al post
 * - Actualización de referencias en el modelo de post
 *
 * @route POST /api/comments/:postId
 * @access Privado (requiere autenticación)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.content - Contenido del comentario
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.postId - ID del post donde se agregará el comentario
 * @param {Object} req.user - Usuario autenticado (añadido por middleware)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} Respuesta JSON con éxito/error y datos del comentario creado
 */
const ctrlCreateComment = async (req, res) => {
  try {
    const { content } = req.body; // Extraer contenido del comentario
    const { postId } = req.params; // Extraer ID del post

    // Verificar que el post existe antes de crear el comentario
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post no encontrado",
      });
    }

    // Crear el nuevo comentario con los datos validados
    const comment = await Comment.create({
      content, // Contenido del comentario
      author: req.user.id, // ID del usuario autenticado
      post: postId, // ID del post asociado
    });

    // Agregar la referencia del comentario al array de comentarios del post
    post.comments.push(comment._id);
    await post.save(); // Guardar los cambios en el post

    // Respuesta exitosa con el comentario creado
    res.status(201).json({
      success: true,
      message: "Comentario creado exitosamente",
      comment,
    });

    console.log(
      `Comentario creado exitosamente para el post ${postId} por el usuario ${req.user.id}`
    );
  } catch (error) {
    // Manejo de errores con logging detallado
    console.error("Error al crear comentario:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al crear el comentario",
    });
  }
};

/**
 * Obtener comentarios de un post específico con optimización de caché
 *
 * Esta función implementa una estrategia optimizada para obtener comentarios:
 * - Consulta paginada para mejor rendimiento
 * - Cabeceras de caché apropiadas para evitar consultas innecesarias
 * - Validación de modificaciones para respuestas 304 correctas
 * - Ordenamiento por fecha de creación (más recientes primero)
 *
 * OPTIMIZACIÓN: Se implementan cabeceras Last-Modified y ETag para evitar
 * códigos 304 problemáticos en consultas repetidas sin cambios reales.
 *
 * @route GET /api/comments/post/:postId
 * @access Público
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.postId - ID del post
 * @param {Object} req.query - Parámetros de consulta
 * @param {number} req.query.page - Página solicitada (por defecto: 1)
 * @param {number} req.query.limit - Límite de comentarios por página (por defecto: 10)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} Respuesta JSON con comentarios paginados y metadatos
 */
const ctrlGetPostComments = async (req, res) => {
  try {
    const { postId } = req.params; // ID del post
    const { page = 1, limit = 10 } = req.query; // Parámetros de paginación

    // Obtener comentarios con paginación y ordenamiento
    const comments = await Comment.find({ post: postId })
      .sort("-createdAt") // Ordenar por fecha (más recientes primero)
      .limit(limit * 1) // Limitar resultados
      .skip((page - 1) * limit) // Saltar comentarios de páginas anteriores
      .populate("author", "username email"); // Poblar datos del autor

    // Contar total de comentarios para calcular páginas
    const total = await Comment.countDocuments({ post: postId });

    // OPTIMIZACIÓN DE CACHÉ: Implementar cabeceras apropiadas
    // Calcular hash ETag basado en el contenido de los comentarios
    const etag = require("crypto")
      .createHash("md5")
      .update(JSON.stringify(comments))
      .digest("hex");

    // Obtener la fecha de modificación más reciente
    const lastModified =
      comments.length > 0
        ? new Date(
            Math.max(...comments.map((comment) => new Date(comment.updatedAt)))
          )
        : new Date();

    // Configurar cabeceras de caché
    res.set({
      ETag: `"${etag}"`, // ETag para validación de caché
      "Last-Modified": lastModified.toUTCString(), // Fecha de última modificación
      "Cache-Control": "public, max-age=60", // Caché público por 60 segundos
    });

    // Verificar si el cliente tiene una versión actualizada
    const clientETag = req.headers["if-none-match"];
    const clientLastModified = req.headers["if-modified-since"];

    if (
      clientETag === `"${etag}"` ||
      (clientLastModified && new Date(clientLastModified) >= lastModified)
    ) {
      // El cliente tiene la versión más reciente
      return res.status(304).end();
    }

    // Respuesta exitosa con comentarios y metadatos de paginación
    res.status(200).json({
      success: true,
      count: comments.length, // Cantidad de comentarios en esta página
      total, // Total de comentarios del post
      pagination: {
        page: parseInt(page), // Página actual
        pages: Math.ceil(total / limit), // Total de páginas
        hasNextPage: page < Math.ceil(total / limit), // Indica si hay página siguiente
        hasPrevPage: page > 1, // Indica si hay página anterior
      },
      comments, // Array de comentarios
    });

    console.log(
      `Comentarios obtenidos para el post ${postId} - Página ${page} de ${Math.ceil(
        total / limit
      )}`
    );
  } catch (error) {
    // Manejo de errores con logging detallado
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los comentarios",
    });
  }
};

/**
 * Actualizar un comentario existente
 *
 * Este controlador permite la actualización de comentarios con estrictas
 * validaciones de seguridad:
 * - Solo el propietario del comentario puede editarlo
 * - Los administradores tienen permisos especiales
 * - Validación de existencia del comentario
 * - Actualización con validadores automáticos
 *
 * @route PUT /api/comments/:commentId
 * @access Privado (requiere autenticación y propiedad)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.content - Nuevo contenido del comentario
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.commentId - ID del comentario a actualizar
 * @param {Object} req.user - Usuario autenticado (añadido por middleware)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} Respuesta JSON con éxito/error y comentario actualizado
 */
const ctrlUpdateComment = async (req, res) => {
  try {
    const { commentId } = req.params; // ID del comentario a actualizar
    const { content } = req.body; // Nuevo contenido

    // Buscar el comentario existente
    let comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comentario no encontrado",
      });
    }

    // Verificar permisos: solo el propietario o admin pueden actualizar
    if (
      comment.author._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "No autorizado para actualizar este comentario",
      });
    }

    // Actualizar el comentario con validaciones automáticas
    comment = await Comment.findByIdAndUpdate(
      commentId,
      { content }, // Nuevo contenido
      {
        new: true, // Devolver el documento actualizado
        runValidators: true, // Ejecutar validaciones del modelo
      }
    );

    // Respuesta exitosa con el comentario actualizado
    res.status(200).json({
      success: true,
      message: "Comentario actualizado exitosamente",
      comment,
    });

    console.log(
      `Comentario ${commentId} actualizado por el usuario ${req.user.id}`
    );
  } catch (error) {
    // Manejo de errores con logging detallado
    console.error("Error al actualizar comentario:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error al actualizar el comentario",
    });
  }
};

/**
 * Eliminar un comentario específico
 *
 * Este controlador maneja la eliminación completa de comentarios con:
 * - Validación de permisos estricta (propietario o admin)
 * - Limpieza automática de referencias en el post asociado
 * - Eliminación cascada del comentario de la base de datos
 * - Logging de seguridad para auditoría
 *
 * @route DELETE /api/comments/:commentId
 * @access Privado (requiere autenticación y propiedad)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.commentId - ID del comentario a eliminar
 * @param {Object} req.user - Usuario autenticado (añadido por middleware)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} Respuesta JSON con confirmación de eliminación
 */
const ctrlDeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params; // ID del comentario a eliminar

    // Buscar el comentario a eliminar
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comentario no encontrado",
      });
    }

    // Verificar permisos: solo el propietario o admin pueden eliminar
    if (
      comment.author._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "No autorizado para eliminar este comentario",
      });
    }

    // Remover la referencia del comentario del post asociado
    // Esto mantiene la integridad referencial en la base de datos
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId }, // Eliminar el ID del comentario del array
    });

    // Eliminar el comentario de la base de datos
    await Comment.findByIdAndDelete(commentId);

    // Respuesta exitosa de eliminación
    res.status(200).json({
      success: true,
      message: "Comentario eliminado exitosamente",
    });

    console.log(
      `Comentario ${commentId} eliminado por el usuario ${req.user.id}`
    );
  } catch (error) {
    // Manejo de errores con logging detallado
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el comentario",
    });
  }
};

/**
 * Exportación de todos los controladores de comentarios
 *
 * Estos controladores proporcionan una API completa para la gestión
 * de comentarios en la plataforma de viajes, incluyendo operaciones
 * CRUD con optimizaciones de rendimiento y validaciones de seguridad.
 */
module.exports = {
  ctrlCreateComment, // Crear nuevo comentario
  ctrlGetPostComments, // Obtener comentarios con optimización de caché
  ctrlUpdateComment, // Actualizar comentario existente
  ctrlDeleteComment, // Eliminar comentario con limpieza de referencias
};
