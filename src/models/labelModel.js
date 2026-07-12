const db = require('../database/db');

// Objek Label untuk menampung fungsi-fungsi CRUD tabel labels
const Label = {
    // 1. Mengambil semua label yang tersedia
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM labels ORDER BY name ASC');
        return rows;
    },

    // 2. Menambahkan label baru
    create: async (name) => {
        const [result] = await db.query('INSERT INTO labels (name) VALUES (?)', [name]);
        return result.insertId;
    },

    // 3. Menghapus label berdasarkan ID
    delete: async (id) => {
        await db.query('DELETE FROM labels WHERE id = ?', [id]);
    },

    // 4. Menempelkan label ke catatan (di dalam objek)
    addToNote: async (noteId, labelId) => {
        await db.query('INSERT IGNORE INTO note_labels (note_id, label_id) VALUES (?, ?)', [noteId, labelId]);
    },

    // 5. Menghapus label dari catatan (di dalam objek)
    removeFromNote: async (noteId, labelId) => {
        await db.query('DELETE FROM note_labels WHERE note_id = ? AND label_id = ?', [noteId, labelId]);
    },

    // 6. Mengambil semua label untuk catatan tertentu (di dalam objek)
    getByNote: async (noteId) => {
        const [rows] = await db.query(`
            SELECT l.* FROM labels l 
            JOIN note_labels nl ON l.id = nl.label_id 
            WHERE nl.note_id = ?`, [noteId]);
        return rows;
    }
}; // <--- Kurung kurawal penutup objek di sini!

module.exports = Label;