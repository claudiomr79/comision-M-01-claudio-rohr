/**
 * CONFIGURACIÓN DE VARIABLES DE ENTORNO
 *
 * Este archivo centraliza la configuración de variables de entorno de la aplicación.
 * Utiliza dotenv para cargar variables desde un archivo .env y proporciona valores
 * por defecto para el funcionamiento básico de la aplicación.
 *
 * @author Tu nombre
 * @version 1.0.0
 */

// Importación de dotenv para manejar variables de entorno
const dotenv = require("dotenv");

// Configuración de dotenv para cargar variables desde el archivo .env
dotenv.config();

/**
 * Objeto que contiene todas las variables de entorno de la aplicación
 * con sus valores por defecto si no están definidas en el archivo .env
 *
 * Variables disponibles:
 * - PORT: Puerto en el que correrá el servidor (por defecto 3002)
 */
const env = {
  // Puerto del servidor - si no está definido en .env, usa 3002
  PORT: process.env.PORT || 3002,
};

// Exportación del objeto de configuración para su uso en toda la aplicación
module.exports = { env };
