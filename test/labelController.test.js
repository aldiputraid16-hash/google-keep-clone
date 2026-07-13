const request = require('supertest');
const express = require('express');
const labelController = require('../src/controllers/labelController');
const Label = require('../src/models/labelModel');

jest.mock('../src/models/labelModel');

const app = express();
app.use(express.json());

app.get('/api/labels', labelController.getAllLabels);
app.post('/api/labels', labelController.createLabel);
app.delete('/api/labels/:id', labelController.deleteLabel);

describe('Label Controller Full Coverage Test', () => {
    
    it('GET /api/labels - harus berhasil mengambil semua label', async () => {
        Label.getAll.mockResolvedValue([{ id: 1, name: 'Pekerjaan' }]);
        const res = await request(app).get('/api/labels');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/labels - harus berhasil membuat label', async () => {
        Label.create.mockResolvedValue(1);
        const res = await request(app).post('/api/labels').send({ name: 'Pribadi' });
        expect(res.statusCode).toBe(201);
    });

    it('POST /api/labels - harus gagal jika nama label kosong', async () => {
        const res = await request(app).post('/api/labels').send({ name: '' });
        expect(res.statusCode).toBe(400);
    });

    it('DELETE /api/labels/:id - harus berhasil menghapus label', async () => {
        Label.delete.mockResolvedValue(true);
        const res = await request(app).delete('/api/labels/1');
        expect(res.statusCode).toBe(200);
    });

    it('seharusnya menangani error 500 pada fungsi getAllLabels', async () => {
        Label.getAll.mockRejectedValue(new Error('Database Error'));
        const res = await request(app).get('/api/labels');
        expect(res.statusCode).toBe(500);
    });
});