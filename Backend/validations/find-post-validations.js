/**
 * VALIDACIONES PARA LA BÚSQUEDA DE POSTS POR ID
 *
 * Este archivo contiene las validaciones necesarias para buscar un post específico
 * por su ID utilizando express-validator. Valida que el ID proporcionado en los
 * parámetros de la URL sea un número válido.
 *
 * @author Tu nombre
 * @version 1.0.0
 */

// Importación de la función param de express-validator para validar parámetros de la URL
const { param } = require("express-validator");

/**
 * Array de validaciones para la búsqueda de posts por ID
 * Contiene las reglas de validación para el parámetro postId en la URL
 *
 * Parámetros requeridos:
 * - postId: ID del post a buscar (número entero)
 */
const findPostValidation = [
  // Validación del parámetro postId en la URL
  param("postId")
    .isNumeric() // Debe ser numérico
    .withMessage("La id debe ser un número")
    .toInt(), // Convierte a entero para su uso posterior
];

// Exportación de las validaciones para su uso en las rutas
module.exports = { findPostValidation };
