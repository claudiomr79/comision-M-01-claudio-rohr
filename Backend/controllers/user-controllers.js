// Se importa el UserModel de Mongoose que ahora interactúa con MongoDB.
import { UserModel } from '../models/user-model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../settings/envs.js';

const saltRounds = 10; // Número de rondas de sal para el hash de bcrypt.

// Controlador para el registro de nuevos usuarios.
export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  // La validación de entrada (longitud, formato, etc.) ahora es manejada
  // en parte por express-validator (configurado en las rutas) y
  // por las validaciones a nivel de esquema de Mongoose.
  // Errores de validación de express-validator son manejados por `applyValidations`.

  try {
    // Verificar si un usuario ya existe con el mismo email o nombre de usuario.
    // $or permite buscar documentos que coincidan con cualquiera de las condiciones.
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      let message = 'El usuario ya existe.';
      if (existingUser.email === email) {
        message = 'Un usuario con este correo electrónico ya existe.';
      } else if (existingUser.username === username) {
        message = 'Un usuario con este nombre de usuario ya existe.';
      }
      return res.status(409).json({ message }); // 409 Conflict
    }

    // Hashear la contraseña antes de guardarla.
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Crear una nueva instancia del modelo Usuario y guardarla en la base de datos.
    const newUser = new UserModel({ username, email, password: hashedPassword });
    await newUser.save();

    // Generar un JSON Web Token (JWT) para el nuevo usuario.
    // El payload del token incluye el ID del usuario y su email.
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email }, // Usar newUser._id que es el ID de MongoDB
      env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora.
    );

    // Preparar la respuesta del usuario, excluyendo la contraseña.
    const userResponse = newUser.toJSON(); // Usa el transformador toJSON del schema si está configurado
    delete userResponse.password; // Asegurarse de que la contraseña no se envíe.

    // Enviar respuesta de éxito con el usuario y el token.
    res.status(201).json({
      user: userResponse,
      token,
    });

  } catch (error) {
    // Manejo de errores de Mongoose (ej. validación de esquema) u otros errores.
    if (error.name === 'ValidationError') {
      // Extraer mensajes de error de validación de Mongoose.
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    console.error('Error en signupUser:', error);
    res.status(500).json({ message: 'Error interno del servidor al intentar registrar el usuario.' });
  }
};

// Controlador para el inicio de sesión de usuarios.
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // La validación de entrada es manejada por express-validator.

  try {
    // Buscar al usuario por su correo electrónico.
    // Se usa `.select('+password')` porque el schema de Mongoose podría tener la contraseña
    // excluida por defecto en las proyecciones (aunque no lo configuramos así explícitamente).
    // Es una buena práctica ser explícito si se necesita un campo sensible.
    const user = await UserModel.findOne({ email }); //.select('+password'); No es necesario si no se excluye en el schema.

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas. Usuario no encontrado.' }); // 401 Unauthorized
    }

    // Comparar la contraseña proporcionada con la contraseña hasheada almacenada.
    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas. Contraseña incorrecta.' }); // 401 Unauthorized
    }

    // Generar un JWT para el usuario autenticado.
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Usar user._id
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Preparar la respuesta del usuario.
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Enviar respuesta de éxito.
    res.status(200).json({
      user: userResponse,
      token,
    });

  } catch (error) {
    console.error('Error en loginUser:', error);
    res.status(500).json({ message: 'Error interno del servidor al intentar iniciar sesión.' });
  }
};
