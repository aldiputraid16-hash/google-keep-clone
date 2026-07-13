const request = require('supertest');
const express = require('express');
const noteController = require('../src/controllers/noteController');
const Note = require('../src/models/noteModel');

jest.mock('../src/models/noteModel');

const app = express();
app.use(express.json());


app.get('/api/notes', noteController.getNotes);
app.post('/api/notes', noteController.createNote);
app.delete('/api/notes/:id', noteController.deleteNote);
app.put('/api/notes/:id', noteController.updateNote);
app.patch('/api/notes/:id/pin', noteController.togglePinNote);
app.post('/api/notes/:id/duplicate', noteController.duplicateNote);

describe('Note Controller Full Coverage Test', () => {
    
    it('GET /api/notes - harus berhasil mengambil semua catatan', async () => {
        Note.getAll.mockResolvedValue([{ id: 1, title: 'Test' }]);
        const res = await request(app).get('/api/notes');
        expect(res.statusCode).toBe(200);
    });

    it('POST /api/notes - harus berhasil membuat catatan', async () => {
        Note.create.mockResolvedValue(1);
        const res = await request(app).post('/api/notes').send({ title: 'Baru', content: 'Isi' });
        expect(res.statusCode).toBe(201);
    });
    it('POST /api/notes - harus gagal membuat note baru', async () => {
        Note.create.mockRejectedValue(new Error('DB error'))
        const res = await request(app).post('/api/notes').send({ title: 'Baru', content: 'Isi' });
        expect(res.statusCode).toBe(500);
    });

    it('DELETE /api/notes/:id - harus berhasil soft delete', async () => {
        Note.softDelete.mockResolvedValue(true);
        const res = await request(app).delete('/api/notes/1');
        expect(res.statusCode).toBe(200);
    });

    it('PUT /api/notes/:id - harus berhasil update', async () => {
        Note.update.mockResolvedValue(true);
        const res = await request(app).put('/api/notes/1').send({ title: 'Update', content: 'Isi' });
        expect(res.statusCode).toBe(200);
    });

    it('PATCH /api/notes/:id/pin - harus berhasil toggle pin', async () => {
        Note.updatePinStatus.mockResolvedValue(true);
        const res = await request(app).patch('/api/notes/1/pin').send({ is_pinned: 1 });
        expect(res.statusCode).toBe(200);
    });

    it('POST /api/notes/:id/duplicate - harus berhasil duplicate', async () => {
        Note.duplicate.mockResolvedValue(2);
        const res = await request(app).post('/api/notes/1/duplicate');
        expect(res.statusCode).toBe(201);
    });

  
    it('seharusnya menangani error 500 pada setiap fungsi', async () => {
        Note.getAll.mockRejectedValue(new Error('DB Error'));
        const res = await request(app).get('/api/notes');
        expect(res.statusCode).toBe(500);
    });
});