import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de Comment para MongoDB
// Define la estructura y las validaciones para los documentos de comentarios.
const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, 'El texto del comentario es obligatorio.'],
      trim: true,
      minlength: [1, 'El comentario no puede estar vacío.'],
      maxlength: [1000, 'El comentario no debe exceder los 1000 caracteres.']
    },
    userId: { // Referencia al usuario que escribió el comentario.
      type: Schema.Types.ObjectId,
      required: [true, 'El ID del usuario es obligatorio.'],
      ref: 'User', // Referencia al modelo 'User'.
    },
    postId: { // Referencia al post al que pertenece el comentario.
      type: Schema.Types.ObjectId,
      required: [true, 'El ID del post es obligatorio.'],
      ref: 'Post', // Referencia al modelo 'Post'.
    },
    // No se incluye 'id' explícitamente ya que MongoDB genera un '_id' automáticamente.
  },
  {
    timestamps: true, // Habilita createdAt y updatedAt.
  }
);

// Middleware para transformar la salida JSON del comentario.
commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Creación del modelo Comment a partir del esquema.
const CommentModel = mongoose.model('Comment', commentSchema);

// Exportación del modelo.
export { CommentModel };
