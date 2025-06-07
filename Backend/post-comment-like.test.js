const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');

let token;
let postId;
let commentId;

beforeAll(async () => {
  // Registrar usuario de prueba
  await request(app).post('/api/users/register').send({
    name: 'TestUser',
    email: 'testuser@example.com',
    password: 'testpass123'
  });
  // Login para obtener token
  const res = await request(app).post('/api/users/login').send({
    email: 'testuser@example.com',
    password: 'testpass123'
  });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Posts y Likes', () => {
  it('debería crear un post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Post de prueba',
        desc: 'Descripción de prueba',
        image: 'https://via.placeholder.com/150',
        location: 'Buenos Aires',
        tags: 'test,prueba'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.post).toBeDefined();
    postId = res.body.post._id;
  });

  it('debería obtener todos los posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });

  it('debería dar like y quitar like a un post', async () => {
    // Like
    let res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/liked|unliked/);
    // Unlike
    res = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/liked|unliked/);
  });
});

describe('Comentarios', () => {
  it('debería crear un comentario en el post', async () => {
    const res = await request(app)
      .post(`/api/comments/post/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Comentario de prueba' });
    expect(res.statusCode).toBe(201);
    expect(res.body.comment).toBeDefined();
    commentId = res.body.comment._id;
  });

  it('debería obtener los comentarios del post', async () => {
    const res = await request(app).get(`/api/comments/post/${postId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it('debería actualizar el comentario', async () => {
    const res = await request(app)
      .put(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Comentario actualizado' });
    expect(res.statusCode).toBe(200);
    expect(res.body.comment.content).toBe('Comentario actualizado');
  });

  it('debería eliminar el comentario', async () => {
    const res = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/);
  });
});
