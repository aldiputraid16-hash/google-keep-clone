const db = require('../database/db');

const Label = {
    
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM labels ORDER BY name ASC');
        return rows;
    },

    create: async (name) => {
        const [result] = await db.query('INSERT INTO labels (name) VALUES (?)', [name]);
        return result.insertId;
    },

    delete: async (id) => {
        await db.query('DELETE FROM labels WHERE id = ?', [id]);
    },

    addToNote: async (noteId, labelId) => {
        await db.query('INSERT IGNORE INTO note_labels (note_id, label_id) VALUES (?, ?)', [noteId, labelId]);
    },

    removeFromNote: async (noteId, labelId) => {
        await db.query('DELETE FROM note_labels WHERE note_id = ? AND label_id = ?', [noteId, labelId]);
    },

    getByNote: async (noteId) => {
        const [rows] = await db.query(`
            SELECT l.* FROM labels l 
            JOIN note_labels nl ON l.id = nl.label_id 
            WHERE nl.note_id = ?`, [noteId]);
        return rows;
    }
}; 

module.exports = Label;