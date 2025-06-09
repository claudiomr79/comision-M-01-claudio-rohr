/**
 * PRUEBAS DE LA API DE USUARIOS - PLATAFORMA DE VIAJES
 *
 * Este archivo contiene las pruebas unitarias para los endpoints relacionados
 * con usuarios: registro, login y validaciones. Utiliza Jest y Supertest para
 * realizar pruebas de integración de la API.
 *
 * Funcionalidades probadas:
 * - Validación de datos en registro
 * - Validación de datos en login
 * - Manejo de errores de validación
 *
 * @author Tu nombre
 * @version 1.0.0
 */

// Importación de supertest para realizar peticiones HTTP en tests
const request = require("supertest");
// Importación de mongoose para manejo de la base de datos
const mongoose = require("mongoose");
// Importación de la aplicación Express para testing
const app = require("./app");

/**
 * Suite de pruebas para la API de Usuarios
 * Contiene todas las pruebas relacionadas con autenticación y gestión de usuarios
 */
describe("API de Usuarios", () => {
  /**
   * Hook que se ejecuta después de todas las pruebas
   * Cierra la conexión a MongoDB para evitar memory leaks en tests
   */
  afterAll(async () => {
    await mongoose.connection.close();
  });

  /**
   * Test: Verificar que el registro rechace peticiones sin datos
   * Valida:
   * - Código de estado HTTP 400 (Bad Request)
   * - Manejo correcto de validaciones de campos requeridos
   */
  it("debería rechazar el registro sin datos", async () => {
    // Realizar petición POST al endpoint de registro sin datos
    const res = await request(app).post("/api/users/register").send({}); // Enviar objeto vacío

    // Verificar que responda con error 400 por datos faltantes
    expect(res.statusCode).toBe(400);
  });

  /**
   * Test: Verificar que el login rechace peticiones sin datos
   * Valida:
   * - Código de estado HTTP 400 (Bad Request)
   * - Manejo correcto de validaciones de credenciales requeridas
   */
  it("debería rechazar el login sin datos", async () => {
    // Realizar petición POST al endpoint de login sin datos
    const res = await request(app).post("/api/users/login").send({}); // Enviar objeto vacío

    // Verificar que responda con error 400 por credenciales faltantes
    expect(res.statusCode).toBe(400);
  });
});
