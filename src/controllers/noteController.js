const Note = require('../models/noteModel');

// 1. Mengambil semua catatan untuk dikirim ke frontend
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.getAll();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Menerima data catatan baru dari frontend dan menyimpannya
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validasi dasar: isi konten tidak boleh kosong
        if (!content) {
            return res.status(400).json({ message: "Konten catatan tidak boleh kosong" });
        }

        const insertId = await Note.create(title, content);
        res.status(201).json({ id: insertId, title, content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Menerima ID catatan yang mau dihapus dari frontend
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        await Note.delete(id);
        res.status(200).json({ message: "Catatan berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};