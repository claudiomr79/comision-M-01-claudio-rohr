const { body, param } = require("express-validator");

const updatePostValidation = [
  param("postId").isNumeric().withMessage("La id debe ser un numero").toInt(),
  body("title")
    .optional()
    .isString()
    .withMessage("El título debe ser un string"),
  body("desc")
    .optional()
    .isString()
    .withMessage("La descripcion debe ser un string"),
  body("image").optional().isURL().withMessage("La imagen deber ser una url."),
];

module.exports = { updatePostValidation };
