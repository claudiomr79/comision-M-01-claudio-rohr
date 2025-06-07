const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');

describe('API de Usuarios', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('debería rechazar el registro sin datos', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('debería rechazar el login sin datos', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
