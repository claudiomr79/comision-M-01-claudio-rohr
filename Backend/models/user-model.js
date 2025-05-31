import mongoose from 'mongoose';

// Esquema de Usuario para MongoDB
// Define la estructura y las validaciones para los documentos de usuario.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio.'],
      unique: true, // Asegura que cada nombre de usuario sea único en la colección.
      trim: true, // Elimina espacios en blanco al principio y al final.
      minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres.'],
      maxlength: [30, 'El nombre de usuario no debe exceder los 30 caracteres.']
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio.'],
      unique: true, // Asegura que cada correo electrónico sea único.
      trim: true,
      lowercase: true, // Convierte el correo a minúsculas antes de guardarlo.
      match: [/.+\@.+\..+/, 'Por favor, introduce un correo electrónico válido.'] // Validación básica de formato de email.
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'] // Se recomienda una validación más robusta en producción.
    },
    // No se incluye 'id' explícitamente ya que MongoDB genera un '_id' automáticamente.
    // Los timestamps añaden automáticamente los campos `createdAt` y `updatedAt`.
  },
  {
    timestamps: true, // Habilita la creación automática de campos createdAt y updatedAt.
  }
);

// Middleware para transformar la salida JSON del usuario (opcional pero recomendado)
// Esto permite, por ejemplo, cambiar '_id' por 'id' y eliminar '__v' o la contraseña.
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // No eliminar la contraseña aquí si se necesita para comparación en algún punto,
    // la exclusión de la contraseña debe hacerse en el controlador antes de enviar la respuesta.
  }
});


// Creación del modelo de Usuario a partir del esquema.
// 'User' será el nombre de la colección en MongoDB (generalmente se pluraliza a 'users').
const UserModel = mongoose.model('User', userSchema);

// Exportación del modelo para ser utilizado en otras partes de la aplicación (controladores).
export { UserModel };
