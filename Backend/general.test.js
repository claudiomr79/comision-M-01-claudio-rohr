const request = require('supertest');
const app = require('./app');

describe('Healthcheck', () => {
  it('debería responder con status 200 en /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/API is running/);
  });
});

describe('Rutas inexistentes', () => {
  it('debería responder 404 para rutas no definidas', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not found/);
  });
});
