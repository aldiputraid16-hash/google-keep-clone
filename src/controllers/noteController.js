const Note = require('../models/noteModel');

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.getAll();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { title, content, is_pinned, color } = req.body;
        const noteId = await Note.create(title, content, is_pinned, color);
        res.status(201).json({ message: "Catatan berhasil dibuat", id: noteId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        await Note.softDelete(id);
        res.status(200).json({ message: "Catatan dipindahkan ke sampah" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        await Note.update(id, title, content);
        
        res.status(200).json({ message: "Catatan berhasil diperbarui" });
    } catch (error) {
        console.error("Error updating note:", error); 
        res.status(500).json({ error: error.message });
    }
};

exports.getArchivedNotes = async (req, res) => {
    try {
        const notes = await Note.getArchived();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTrashedNotes = async (req, res) => {
    try {
        const notes = await Note.getTrashed();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.toggleArchive = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_archived } = req.body;
        await Note.updateArchiveStatus(id, is_archived);
        res.status(200).json({ message: "Status arsip berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.restoreFromTrash = async (req, res) => {
    try {
        const { id } = req.params;
        await Note.restore(id);
        res.status(200).json({ message: "Catatan berhasil dipulihkan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePermanently = async (req, res) => {
    try {
        const { id } = req.params;
        await Note.deletePermanently(id);
        res.status(200).json({ message: "Catatan dihapus permanen dari database" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.togglePinNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_pinned } = req.body; 

        await Note.updatePinStatus(id, is_pinned);
        
        res.status(200).json({ message: "Status sematan catatan berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.duplicateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const newInsertId = await Note.duplicate(id);
        res.status(201).json({ message: "Salinan catatan berhasil dibuat", id: newInsertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.changeNoteColor = async (req, res) => {
    try {
        const { id } = req.params;
        const { color } = req.body;
        await Note.updateColor(id, color);
        res.status(200).json({ message: "Warna catatan berhasil diperbarui", color });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNoteLabels = async (req, res) => {
    try {
        const { noteId } = req.params;
        const Label = require('../models/labelModel'); 
        const labels = await Label.getLabelsByNote(noteId);
        res.status(200).json(labels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reminder_time } = req.body;
        
        await Note.updateReminder(id, reminder_time);
        res.status(200).json({ message: "Pengingat tersimpan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

