// Importa los modelos de Mongoose necesarios.
import { CommentModel } from '../models/comment-model.js';
import { PostModel } from '../models/post-model.js';
// UserModel no es necesario aquí si solo populamos, ya que el schema lo maneja.
// import { UserModel } from '../models/user-model.js';
import mongoose from 'mongoose';

// Controlador para crear un nuevo comentario.
export const createComment = async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params; // ID del post al que se añade el comentario.
  const userId = req.user.userId; // ID del usuario que crea el comentario (de protectRoute).

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "El ID del post proporcionado no es válido." });
  }

  try {
    // Verificar primero si el post existe.
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado.' });
    }

    // Crear y guardar el nuevo comentario.
    const newComment = new CommentModel({
      text,
      userId,
      postId, // postId ya es un ObjectId válido o la validación anterior falló
    });
    await newComment.save();

    // Opcional: popular el comentario con datos del autor antes de devolverlo.
    const populatedComment = await CommentModel.findById(newComment._id).populate('userId', 'username email -_id');

    res.status(201).json(populatedComment);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    console.error('Error en createComment:', error);
    res.status(500).json({ message: 'Error interno del servidor al crear el comentario.' });
  }
};

// Controlador para obtener todos los comentarios de un post específico.
export const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "El ID del post proporcionado no es válido." });
  }

  try {
    // Verificar si el post existe (opcional, pero buena práctica).
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado, no se pueden obtener comentarios.' });
    }

    // Buscar todos los comentarios para el postId y popular la información del autor.
    // Se excluye la contraseña del autor y el _id (ya tenemos 'id' por el toJSON).
    const comments = await CommentModel.find({ postId: postId })
                                     .populate('userId', 'username email -_id')
                                     .sort({ createdAt: -1 }); // Ordenar por más reciente

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error en getCommentsByPostId:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener los comentarios.' });
  }
};
// TODO: Implementar controladores para actualizar y eliminar comentarios si es necesario,
// incluyendo la lógica de autorización (solo el autor del comentario o admin puede modificar/eliminar).
