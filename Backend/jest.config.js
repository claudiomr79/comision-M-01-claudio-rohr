/**
 * @file jest.config.js
 * @description Configuración de Jest para testing del backend
 * @version 1.0.0
 * @author Plataforma de Viajes
 * @date 2025-06-08
 */

module.exports = {
  // Entorno de ejecución para Node.js
  testEnvironment: "node",

  // Patrones de archivos de test a ejecutar
  testMatch: ["**/tests/backend/**/*.test.js"],

  // Directorio raíz desde donde buscar tests
  rootDir: "../",

  // Directorios donde Jest buscará módulos
  moduleDirectories: ["Backend/node_modules", "node_modules"],

  // Mapeo de módulos para resolver rutas correctamente
  moduleNameMapper: {
    "^supertest$": "<rootDir>/Backend/node_modules/supertest",
    "^mongoose$": "<rootDir>/Backend/node_modules/mongoose",
  },

  // Archivos para cobertura de código
  collectCoverageFrom: [
    "Backend/**/*.js",
    "!Backend/node_modules/**",
    "!Backend/jest.config.js",
    "!tests/**",
  ],

  // Directorios a ignorar
  testPathIgnorePatterns: ["/node_modules/", "/Frontend/"],

  // Configuración de cobertura
  coverageDirectory: "tests/coverage",
  coverageReporters: ["text", "lcov", "html"],
  // Tiempo máximo por test (30 segundos)
  testTimeout: 30000,

  // Detectar handles abiertos y forzar cierre
  detectOpenHandles: true,
  forceExit: true,

  // Variables de entorno para tests
  setupFilesAfterEnv: ["<rootDir>/Backend/jest.setup.js"],
};
