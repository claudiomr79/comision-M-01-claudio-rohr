import mongoose from 'mongoose';
const { Schema } = mongoose;

// Esquema de Post para MongoDB
// Define la estructura y las validaciones para los documentos de posts (publicaciones).
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'El título del post es obligatorio.'],
      trim: true, // Elimina espacios en blanco al principio y al final.
      minlength: [3, 'El título debe tener al menos 3 caracteres.'],
      maxlength: [150, 'El título no debe exceder los 150 caracteres.']
    },
    desc: { // Descripción del post
      type: String,
      required: [true, 'La descripción del post es obligatoria.'],
      trim: true,
      minlength: [5, 'La descripción debe tener al menos 5 caracteres.']
    },
    image: { // URL de la imagen del post
      type: String,
      trim: true,
      // Opcional: validación de URL si se desea
      // match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, 'Por favor, introduce una URL de imagen válida.']
    },
    userId: { // Referencia al usuario que creó el post
      type: Schema.Types.ObjectId, // Tipo especial de Mongoose para IDs de MongoDB.
      required: [true, 'El ID del usuario es obligatorio.'],
      ref: 'User', // Establece una referencia al modelo 'User'. Esto es crucial para el `populate`.
    },
    // No se incluye 'id' explícitamente ya que MongoDB genera un '_id' automáticamente.
  },
  {
    timestamps: true, // Habilita la creación automática de campos createdAt y updatedAt.
  }
);

// Middleware para transformar la salida JSON del post
postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(); // Convierte _id a id (string)
    delete returnedObject._id; // Elimina _id
    delete returnedObject.__v; // Elimina la versión (__v)
  }
});

// Creación del modelo Post a partir del esquema.
// 'Post' será el nombre de la colección en MongoDB (generalmente se pluraliza a 'posts').
const PostModel = mongoose.model('Post', postSchema);

// Exportación del modelo para ser utilizado en otras partes de la aplicación.
export { PostModel };
