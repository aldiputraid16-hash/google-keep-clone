const db = require('../database/db');

const Note = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM notes WHERE is_archived = 0 AND is_trashed = 0 ORDER BY id DESC');
        return rows;
    },

    getArchived: async () => {
        const [rows] = await db.query('SELECT * FROM notes WHERE is_archived = 1 AND is_trashed = 0 ORDER BY id DESC');
        return rows;
    },

    getTrashed: async () => {
        await db.query('DELETE FROM notes WHERE is_trashed = 1 AND updated_at < DATE_SUB(NOW(), INTERVAL 7 DAY)');
        const [rows] = await db.query('SELECT * FROM notes WHERE is_trashed = 1 ORDER BY id DESC');
        return rows;
    },

    create: async (title, content, is_pinned, color) => {
        // Jika form atas tidak mengirim warna, gunakan default Google Keep (#202124)
        const noteColor = color || '#202124';
        const [result] = await db.query(
            'INSERT INTO notes (title, content, is_pinned, color) VALUES (?, ?, ?, ?)', 
            [title, content, is_pinned, noteColor]
        );
        return result.insertId;
    },

    update: async (id, title, content) => {
        await db.query('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    },

    updateArchiveStatus: async (id, status) => {
        await db.query('UPDATE notes SET is_archived = ?, is_trashed = 0 WHERE id = ?', [status, id]);
    },

    softDelete: async (id) => {
        await db.query('UPDATE notes SET is_trashed = 1, is_archived = 0, updated_at = NOW() WHERE id = ?', [id]);
    },

    restore: async (id) => {
        await db.query('UPDATE notes SET is_trashed = 0, is_archived = 0 WHERE id = ?', [id]);
    },

    deletePermanently: async (id) => {
        await db.query('DELETE FROM notes WHERE id = ?', [id]);
    },

    updatePinStatus: async (id, is_pinned) => {
        const [result] = await db.query(
            'UPDATE notes SET is_pinned = ?, updated_at = NOW() WHERE id = ?',
            [is_pinned, id]
        );
        return result;
    },

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

    updateColor: async (id, color) => {
        const [result] = await db.query('UPDATE notes SET color = ? WHERE id = ?', [color, id]);
        return result;
    }
};

updateReminder: async (id, time) => {
    await db.query('UPDATE notes SET reminder_time = ? WHERE id = ?', [time, id]);
}

module.exports = Note;