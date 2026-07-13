const request = require('supertest');
const express = require('express');
const noteRoutes = require('../src/routes/noteRoutes');

const app = express();
app.use(express.json());
app.use('/api/notes', noteRoutes);

describe('Note Routes Test', () => {
    
    it('GET /api/notes - seharusnya rute dasar tersedia', async () => {
        const res = await request(app).get('/api/notes/');
        // Kita tidak mengharapkan 404
        expect(res.statusCode).not.toBe(404);
    });

    it('GET /api/notes/archived - seharusnya rute arsip tersedia', async () => {
        const res = await request(app).get('/api/notes/archived');
        expect(res.statusCode).not.toBe(404);
    });

    it('POST /api/notes/1/duplicate - seharusnya rute duplicate tersedia', async () => {
        const res = await request(app).post('/api/notes/1/duplicate');
        expect(res.statusCode).not.toBe(404);
    });

    it('PUT /api/notes/1/pin - seharusnya rute pin tersedia', async () => {
        const res = await request(app).put('/api/notes/1/pin');
        expect(res.statusCode).not.toBe(404);
    });
});