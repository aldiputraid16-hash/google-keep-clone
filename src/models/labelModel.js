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
    }
};

module.exports = Label;