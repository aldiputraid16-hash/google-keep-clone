const db = require('../database/db');

// Objek Note yang menampung fungsi-fungsi CRUD ke database
const Note = {
    // 1. Mengambil semua catatan dari database (Terbaru di atas)
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM notes ORDER BY id DESC');
        return rows;
    },

    // 2. Menambahkan catatan baru ke database
    create: async (title, content) => {
        const [result] = await db.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content]);
        return result.insertId; // Mengembalikan ID catatan yang baru dibuat
    },

    // 3. Menghapus catatan berdasarkan ID
    delete: async (id) => {
        await db.query('DELETE FROM notes WHERE id = ?', [id]);
    },
// 3. Menghapus catatan berdasarkan ID (kode lama...)
    delete: async (id) => {
        await db.query('DELETE FROM notes WHERE id = ?', [id]);
    }, // <-- Pastikan ada koma di sini sebelum menambah fungsi baru

    // 4. MENGEDIT/UPDATE CATATAN (TAMBAHAN BARU)
    update: async (id, title, content) => {
        await db.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    }

};

module.exports = Note;