/**
 * VALIDACIONES PARA LA CREACIÓN DE POSTS
 *
 * Este archivo contiene las validaciones necesarias para la creación de nuevos posts
 * utilizando express-validator. Valida que los campos requeridos estén presentes
 * y tengan el formato correcto.
 *
 * @author Tu nombre
 * @version 1.0.0
 */

// Importación de la función body de express-validator para validar campos del cuerpo de la petición
const { body } = require("express-validator");

/**
 * Array de validaciones para la creación de posts
 * Contiene las reglas de validación que deben cumplir los datos del post
 *
 * Campos requeridos:
 * - title: Título del post (string, no vacío)
 * - desc: Descripción del post (string, no vacío)
 * - image: URL de la imagen del post (string, formato URL válido)
 */
const createPostValidation = [
  // Validación del campo título
  body("title")
    .notEmpty() // No puede estar vacío
    .withMessage("El título es requerido.")
    .isString() // Debe ser un string
    .withMessage("El título debe ser un string"),

  // Validación del campo descripción
  body("desc")
    .notEmpty() // No puede estar vacío
    .withMessage("La descripcion es requerida.")
    .isString() // Debe ser un string
    .withMessage("La descripcion debe ser un string"),

  // Validación del campo imagen
  body("image")
    .notEmpty() // No puede estar vacío
    .withMessage("La image es requerida.")
    .isURL() // Debe ser una URL válida
    .withMessage("La imagen deber ser una url."),
];

// Exportación de las validaciones para su uso en las rutas
module.exports = { createPostValidation };
