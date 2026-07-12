const request = require('supertest');
const app = require('../server');
const Note = require('../src/models/noteModel');
const db = require('../src/database/db');

// Mock model agar pengujian stabil
jest.mock('../src/models/noteModel', () => ({
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn() // Menambahkan mock delete
}));

describe('NoteController Test', () => {
    
    it('seharusnya mendapatkan semua catatan (GET /api/notes)', async () => {
        Note.getAll.mockImplementation((callback) => callback(null, [{ id: 1, title: 'Test' }]));

        const res = await request(app).get('/api/notes');
        expect(res.statusCode).toBe(200);
    });

    it('seharusnya berhasil mengupdate catatan (PUT /api/notes/:id)', async () => {
        Note.update.mockImplementation((id, data, callback) => callback(null, true));

        const res = await request(app)
            .put('/api/notes/1')
            .send({ title: 'Judul', content: 'Konten' });

        expect(res.statusCode).toBe(200);
    });
});

afterAll(async () => {
    if (db && db.end) {
        await db.end();
    }
});