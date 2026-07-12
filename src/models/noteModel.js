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

    // 3. Ambil catatan di sampah
    getTrashed: async () => {
        await db.query('DELETE FROM notes WHERE is_trashed = 1 AND updated_at < DATE_SUB(NOW(), INTERVAL 7 DAY)');
        const [rows] = await db.query('SELECT * FROM notes WHERE is_trashed = 1 ORDER BY id DESC');
        return rows;
    },

    // 4. Menambahkan catatan baru dengan warna dinamis dari form
    create: async (title, content, is_pinned, color) => {
        // Jika form atas tidak mengirim warna, gunakan default Google Keep (#202124)
        const noteColor = color || '#202124';
        const [result] = await db.query(
            'INSERT INTO notes (title, content, is_pinned, color) VALUES (?, ?, ?, ?)', 
            [title, content, is_pinned, noteColor]
        );
        return result.insertId;
    },

    // 5. MENGEDIT / UPDATE CATATAN
    update: async (id, title, content) => {
        await db.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    },

    // 6. Mengubah status arsip
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
    },

    // 10. Mengubah status sematan (Pin)
    updatePinStatus: async (id, is_pinned) => {
        const [result] = await db.query(
            'UPDATE notes SET is_pinned = ?, updated_at = NOW() WHERE id = ?',
            [is_pinned, id]
        );
        return result;
    },

    // 11. Menduplikasi Catatan (Salinan) beserta warnanya
    duplicate: async (id) => {
        const [rows] = await db.query('SELECT title, content, is_pinned, is_archived, color FROM notes WHERE id = ?', [id]);
        if (rows.length > 0) {
            const { title, content, is_pinned, is_archived, color } = rows[0];
            const duplicatedTitle = title ? `${title} (Salinan)` : '';
            const [result] = await db.query(
                'INSERT INTO notes (title, content, is_pinned, is_archived, color) VALUES (?, ?, ?, ?, ?)',
                [duplicatedTitle, content, is_pinned, is_archived, color]
            );
            return result.insertId;
        }
        throw new Error("Catatan asli tidak ditemukan");
    },

    // 12. FITUR BARU: Mengubah warna background catatan di database
    updateColor: async (id, color) => {
        const [result] = await db.query('UPDATE notes SET color = ? WHERE id = ?', [color, id]);
        return result;
    }
};

module.exports = Note;