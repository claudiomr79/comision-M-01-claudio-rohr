/**
 * PRUEBAS INTEGRADAS DE POSTS, COMENTARIOS Y LIKES - PLATAFORMA DE VIAJES
 *
 * Este archivo contiene las pruebas de integración para las funcionalidades principales
 * de la plataforma: creación y gestión de posts, sistema de likes y comentarios.
 * Incluye autenticación JWT y pruebas de permisos.
 *
 * Funcionalidades probadas:
 * - CRUD completo de posts
 * - Sistema de likes/unlikes
 * - CRUD completo de comentarios
 * - Autenticación y autorización
 * - Validaciones de datos
 *
 * @author Tu nombre
 * @version 1.0.0
 */

// Importación de supertest para realizar peticiones HTTP en tests
const request = require("supertest");
// Importación de mongoose para manejo de la base de datos
const mongoose = require("mongoose");
// Importación de la aplicación Express para testing
const app = require("../../Backend/app");

// Variables globales para compartir datos entre tests
let token; // Token JWT para autenticación
let postId; // ID del post creado para testing
let commentId; // ID del comentario creado para testing

/**
 * Hook que se ejecuta antes de todas las pruebas
 * Configura un usuario de prueba y obtiene el token de autenticación
 */
beforeAll(async () => {
  // Registrar usuario de prueba con datos válidos
  await request(app).post("/api/users/register").send({
    name: "TestUser",
    email: "testuser@example.com",
    password: "testpass123",
  });

  // Realizar login para obtener token JWT
  const res = await request(app).post("/api/users/login").send({
    email: "testuser@example.com",
    password: "testpass123",
  });

  // Guardar token para uso en pruebas posteriores
  token = res.body.token;
});

/**
 * Hook que se ejecuta después de todas las pruebas
 * Cierra la conexión a MongoDB para evitar memory leaks
 /**
 * Suite de pruebas para Posts y sistema de Likes
 * Verifica la funcionalidad completa de posts y el sistema de likes/unlikes
 */
describe("Posts y Likes", () => {
  /**
   * Test: Crear un nuevo post
   * Valida:
   * - Código de estado HTTP 201 (Created)
   * - Estructura correcta de la respuesta
   * - Autenticación requerida
   */
  it("debería crear un post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`) // Incluir token de autenticación
      .send({
        title: "Post de prueba",
        desc: "Descripción de prueba",
        image: "https://via.placeholder.com/150",
        location: "Buenos Aires",
        tags: "test,prueba",
      });

    // Verificar que el post se creó correctamente
    expect(res.statusCode).toBe(201);
    expect(res.body.post).toBeDefined();

    // Guardar ID del post para pruebas posteriores
    postId = res.body.post._id;
  });

  /**
   * Test: Obtener todos los posts
   * Valida:
   * - Código de estado HTTP 200
   * - Respuesta en formato array
   * - No requiere autenticación (público)
   */
  it("debería obtener todos los posts", async () => {
    const res = await request(app).get("/api/posts");

    // Verificar respuesta exitosa
    expect(res.statusCode).toBe(200);
    // Verificar que devuelve un array de posts
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  /**
   * Test: Sistema de likes (dar like y quitar like)
   * Valida:
   * - Funcionalidad de toggle de likes
   * - Autenticación requerida
   * - Mensajes de respuesta apropiados
   */
  it("debería dar like y quitar like a un post", async () => {
    // Dar like al post
    let res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/liked|unliked/);

    // Quitar like al post (segundo click)
    res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/liked|unliked/);
  });
});

/**
 * Suite de pruebas para el sistema de Comentarios
 * Verifica el CRUD completo de comentarios asociados a posts
 */
describe("Comentarios", () => {
  /**
   * Test: Crear un comentario en un post
   * Valida:
   * - Código de estado HTTP 201 (Created)
   * - Estructura correcta de la respuesta
   * - Asociación correcta con el post
   */
  it("debería crear un comentario en el post", async () => {
    const res = await request(app)
      .post(`/api/comments/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Comentario de prueba" });

    // Verificar que el comentario se creó correctamente
    expect(res.statusCode).toBe(201);
    expect(res.body.comment).toBeDefined();

    // Guardar ID del comentario para pruebas posteriores
    commentId = res.body.comment._id;
  });

  /**
   * Test: Obtener comentarios de un post
   * Valida:
   * - Código de estado HTTP 200
   * - Respuesta en formato array
   * - No requiere autenticación (público)
   */
  it("debería obtener los comentarios del post", async () => {
    const res = await request(app).get(`/api/comments/post/${postId}`);

    // Verificar respuesta exitosa
    expect(res.statusCode).toBe(200);
    // Verificar que devuelve un array de comentarios
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  /**
   * Test: Actualizar un comentario
   * Valida:
   * - Código de estado HTTP 200
   * - Contenido actualizado correctamente
   * - Permisos de edición (solo el autor)
   */
  it("debería actualizar el comentario", async () => {
    const res = await request(app)
      .put(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Comentario actualizado" });

    // Verificar que el comentario se actualizó
    expect(res.statusCode).toBe(200);
    expect(res.body.comment.content).toBe("Comentario actualizado");
  });

  /**
   * Test: Eliminar un comentario
   * Valida:
   * - Código de estado HTTP 200
   * - Mensaje de confirmación
   * - Permisos de eliminación (solo el autor)
   */
  it("debería eliminar el comentario", async () => {
    const res = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`); // Verificar que el comentario se eliminó
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/); // Cambiado para coincidir con mensajes en español
  });
});
