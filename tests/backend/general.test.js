/**
 * PRUEBAS GENERALES DEL SERVIDOR - PLATAFORMA DE VIAJES
 *
 * Este archivo contiene las pruebas generales para verificar el funcionamiento básico
 * del servidor Express. Incluye tests para el healthcheck y manejo de rutas inexistentes.
 *
 * Pruebas incluidas:
 * - Healthcheck de la API
 * - Manejo de errores 404 para rutas no definidas
 * - Verificación de respuestas del servidor
 *
 * @author Tu nombre
 * @version 1.0.0
 */

// Importación de supertest para realizar peticiones HTTP en tests
const request = require("supertest");
// Importación de la aplicación Express para testing
const app = require("../../Backend/app");

/**
 * Suite de pruebas para el Healthcheck de la API
 * Verifica que el endpoint de salud responda correctamente
 */
describe("Healthcheck", () => {
  /**
   * Test: Verificar que el endpoint /api/health responda con status 200
   * Valida:
   * - Código de estado HTTP 200
   * - Estructura de respuesta correcta (success: true)
   * - Mensaje de confirmación de que la API está funcionando
   */
  it("debería responder con status 200 en /api/health", async () => {
    // Realizar petición GET al endpoint de healthcheck
    const res = await request(app).get("/api/health");

    // Verificar código de estado HTTP
    expect(res.statusCode).toBe(200);
    // Verificar que la respuesta indique éxito
    expect(res.body.success).toBe(true);
    // Verificar que el mensaje contenga confirmación de funcionamiento
    expect(res.body.message).toMatch(/API is running/);
  });
});

/**
 * Suite de pruebas para el manejo de rutas inexistentes
 * Verifica que el servidor responda adecuadamente a rutas no definidas
 */
describe("Rutas inexistentes", () => {
  /**
   * Test: Verificar que rutas no definidas respondan con error 404
   * Valida:
   * - Código de estado HTTP 404
   * - Estructura de respuesta de error (success: false)
   * - Mensaje de error apropiado
   */
  it("debería responder 404 para rutas no definidas", async () => {
    // Realizar petición GET a una ruta que no existe
    const res = await request(app).get("/ruta-que-no-existe");

    // Verificar código de estado HTTP 404
    expect(res.statusCode).toBe(404);
    // Verificar que la respuesta indique error
    expect(res.body.success).toBe(false);
    // Verificar que el mensaje contenga información de "not found"
    expect(res.body.message).toMatch(/not found/);
  });
});
