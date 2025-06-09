// Archivo: user-controllers.js
// Controladores de usuario: registro, inicio de sesión, perfil y actualización de perfil en la API REST

const User = require("../models/user-model.js");
const jwt = require("jsonwebtoken");

// Genera un token JWT firmado para el usuario con ID proporcionado
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "7d" } // Expira en 7 días
  );
};

// Controlador: Registro de usuario
// - Valida si el email ya existe
// - Crea un nuevo usuario con contraseña hasheada
// - Genera y devuelve un JWT junto con datos públicos del usuario
const ctrlRegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Verificar si ya existe un usuario con el mismo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un usuario con este email",
      });
    }

    // Crear usuario en la base de datos (el password se hashea en el middleware del modelo)
    const user = await User.create({ name, email, password });

    // Generar token JWT para el nuevo usuario
    const token = generateToken(user._id);

    // Devolver respuesta con token y datos (sin exponer contraseña)
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error de registro:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error al registrar usuario",
      });
  }
};

// Controlador: Login de usuario
// - Verifica credenciales
// - Genera y devuelve JWT si es válido
const ctrlLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Buscar usuario por email e incluir campo password (por defecto excluido)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email o contraseña inválidos" });
    }

    // Comparar contraseña proporcionada contra hash en DB
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Email o contraseña inválidos" });
    }

    // Generar nuevo token JWT
    const token = generateToken(user._id);

    // Devolver datos del usuario y token
    res.status(200).json({
      success: true,
      message: "Usuario logueado exitosamente",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error de login:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al iniciar sesión" });
  }
};

// Controlador: Obtener perfil del usuario autenticado
// - Requiere middleware de auth que setea req.user.id
const ctrlGetUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener perfil de usuario" });
  }
};

// Controlador: Actualizar datos del perfil del usuario
// - Permite cambiar nombre y email
const ctrlUpdateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Actualiza y retorna el usuario modificado
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: "Perfil actualizado exitosamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Error al actualizar perfil",
      });
  }
};

module.exports = {
  ctrlRegisterUser,
  ctrlLoginUser,
  ctrlGetUserProfile,
  ctrlUpdateUserProfile,
};
