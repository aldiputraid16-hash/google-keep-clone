const db = require('../database/db');

const Note = {
    // 1. Ambil semua catatan yang tidak diarsip & tidak di sampah
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM notes WHERE is_archived = 0 AND is_trashed = 0 ORDER BY id DESC');
        return rows;
    },

    // 2. Ambil catatan yang diarsipkan saja
    getArchived: async () => {
        const [rows] = await db.query('SELECT * FROM notes WHERE is_archived = 1 AND is_trashed = 0 ORDER BY id DESC');
        return rows;
    },

    // 3. Ambil catatan di sampah (dan otomatis membersihkan data yang > 7 hari)
    getTrashed: async () => {
        // Otomatis hapus permanen jika di sampah sudah lewat dari 7 hari
        await db.query('DELETE FROM notes WHERE is_trashed = 1 AND updated_at < DATE_SUB(NOW(), INTERVAL 7 DAY)');
        
        // Tampilkan sisa catatan sampah yang masih valid
        const [rows] = await db.query('SELECT * FROM notes WHERE is_trashed = 1 ORDER BY id DESC');
        return rows;
    },

    // 4. Menambahkan catatan baru ke database
    create: async (title, content) => {
        const [result] = await db.query('INSERT INTO notes (title, content) VALUES (?, ?)', [title, content]);
        return result.insertId;
    },

    // 5. MENGEDIT / UPDATE CATATAN
    update: async (id, title, content) => {
        await db.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    },

    // 6. Mengubah status arsip (toggle 0 atau 1)
    updateArchiveStatus: async (id, status) => {
        await db.query('UPDATE notes SET is_archived = ?, is_trashed = 0 WHERE id = ?', [status, id]);
    },

    // 7. Mengubah status sampah (Soft Delete)
    softDelete: async (id) => {
        await db.query('UPDATE notes SET is_trashed = 1, is_archived = 0, updated_at = NOW() WHERE id = ?', [id]);
    },

    // 8. Memulihkan catatan dari sampah
    restore: async (id) => {
        await db.query('UPDATE notes SET is_trashed = 0, is_archived = 0 WHERE id = ?', [id]);
    },

    // 9. Menghapus permanen dari database
    deletePermanently: async (id) => {
        await db.query('DELETE FROM notes WHERE id = ?', [id]);
    }
};

module.exports = Note;