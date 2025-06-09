/**
 * VALIDACIONES PARA LA ACTUALIZACIÓN DE POSTS
 *
 * Este archivo contiene las validaciones necesarias para actualizar posts existentes
 * utilizando express-validator. Valida tanto el ID del post como los campos opcionales
 * que se pueden actualizar.
 *
 * @author Tu nombre
 * @version 1.0.0
 */

// Importación de las funciones body y param de express-validator para validar campos del cuerpo y parámetros
const { body, param } = require("express-validator");

/**
 * Array de validaciones para la actualización de posts
 * Contiene las reglas de validación que deben cumplir los datos del post a actualizar
 *
 * Parámetros requeridos:
 * - postId: ID del post a actualizar (número entero)
 *
 * Campos opcionales:
 * - title: Título del post (string, opcional)
 * - desc: Descripción del post (string, opcional)
 * - image: URL de la imagen del post (string, formato URL válido, opcional)
 */
const updatePostValidation = [
  // Validación del parámetro postId en la URL
  param("postId")
    .isNumeric() // Debe ser numérico
    .withMessage("La id debe ser un numero")
    .toInt(), // Convierte a entero

  // Validación opcional del campo título
  body("title")
    .optional() // Campo opcional
    .isString() // Si está presente, debe ser un string
    .withMessage("El título debe ser un string"),

  // Validación opcional del campo descripción
  body("desc")
    .optional() // Campo opcional
    .isString() // Si está presente, debe ser un string
    .withMessage("La descripcion debe ser un string"),

  // Validación opcional del campo imagen
  body("image")
    .optional() // Campo opcional
    .isURL() // Si está presente, debe ser una URL válida
    .withMessage("La imagen deber ser una url."),
];

// Exportación de las validaciones para su uso en las rutas
module.exports = { updatePostValidation };
