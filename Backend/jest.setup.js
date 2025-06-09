/**
 * @file jest.setup.js
 * @description Configuración inicial para Jest - setup de testing
 * @version 1.0.0
 * @author Plataforma de Viajes
 * @date 2025-06-08
 */

const mongoose = require("mongoose");

// Configurar timeout global para tests
jest.setTimeout(30000);

// Variables de entorno para testing
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-jwt-testing-purposes-only";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/travel-platform-test";

// Mock de console para tests más limpios (opcional)
global.console = {
  ...console,
  // Silenciar logs durante tests (opcional)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

/**
 * Configuración de limpieza después de todos los tests
 * Cierra la conexión a MongoDB para evitar handles abiertos
 */
afterAll(async () => {
  // Cerrar todas las conexiones de mongoose
  await mongoose.connection.close();

  // Forzar cierre de todas las conexiones
  if (mongoose.connections.length > 0) {
    await Promise.all(
      mongoose.connections.map((connection) => connection.close())
    );
  }

  // Desconectar mongoose completamente
  await mongoose.disconnect();
});
