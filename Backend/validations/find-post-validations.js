const { param } = require("express-validator");

const findPostValidation = [
  param("postId").isNumeric().withMessage("La id debe ser un número").toInt(),
];

module.exports = { findPostValidation };
