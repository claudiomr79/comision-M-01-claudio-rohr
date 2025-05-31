// Importa el modelo PostModel de Mongoose.
import { PostModel } from "../models/post-model.js";
import mongoose from "mongoose";

// Controlador para crear un nuevo post.
export const ctrlCreatePost = async (req, res) => {
  const { title, desc, image } = req.body;
  const userId = req.user.userId; // Asume que protectRoute middleware ha añadido userId a req.user.

  try {
    // Crea una nueva instancia del modelo Post y la guarda en la base de datos.
    const newPost = new PostModel({ title, desc, image, userId });
    await newPost.save();

    // Devuelve el post recién creado.
    // El método toJSON() se aplica automáticamente si está configurado en el schema.
    res.status(201).json(newPost);
  } catch (error) {
    // Manejo de errores, por ejemplo, errores de validación de Mongoose.
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    console.error('Error en ctrlCreatePost:', error);
    res.status(500).json({ message: "Error interno del servidor al crear el post." });
  }
};

// Controlador para obtener todos los posts.
export const ctrlGetAllPosts = async (req, res) => {
  try {
    // Busca todos los posts y popula el campo 'userId' para obtener el username y email del autor.
    // '-password' excluye el campo password del usuario populado.
    const posts = await PostModel.find().populate('userId', 'username email -_id'); // Excluye _id del user, ya tenemos id
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error en ctrlGetAllPosts:', error);
    res.status(500).json({ message: "Error interno del servidor al obtener los posts." });
  }
};

// Controlador para obtener un post específico por su ID.
export const ctrlGetPostById = async (req, res) => {
  const { postId } = req.params;

  // Validar si postId es un ObjectId válido de MongoDB.
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "El ID del post proporcionado no es válido." });
  }

  try {
    const post = await PostModel.findById(postId).populate('userId', 'username email -_id');

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado." });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error en ctrlGetPostById:', error);
    // Errores como CastError (si el ID tiene un formato válido pero no existe) podrían manejarse aquí.
    res.status(500).json({ message: "Error interno del servidor al obtener el post." });
  }
};

// Controlador para actualizar un post existente.
export const ctrlUpdatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, desc, image } = req.body;
  const userId = req.user.userId; // ID del usuario autenticado.

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "El ID del post proporcionado no es válido." });
  }

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado." });
    }

    // Verificar si el usuario autenticado es el propietario del post.
    // Es importante convertir post.userId (ObjectId) a string para la comparación.
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Usuario no autorizado para actualizar este post." });
    }

    // Actualizar los campos del post.
    post.title = title || post.title;
    post.desc = desc || post.desc;
    post.image = image || post.image; // Permite actualizar la imagen.
    // No se actualiza userId ya que el autor no debería cambiar.

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    console.error('Error en ctrlUpdatePost:', error);
    res.status(500).json({ message: "Error interno del servidor al actualizar el post." });
  }
};

// Controlador para eliminar un post.
export const ctrlDeletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "El ID del post proporcionado no es válido." });
  }

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado." });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Usuario no autorizado para eliminar este post." });
    }

    await PostModel.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post eliminado exitosamente." });
  } catch (error) {
    console.error('Error en ctrlDeletePost:', error);
    res.status(500).json({ message: "Error interno del servidor al eliminar el post." });
  }
};
