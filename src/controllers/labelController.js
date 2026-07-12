const Label = require('../models/labelModel');

// --- CRUD Label Utama ---

// 1. Mengambil semua label
exports.getAllLabels = async (req, res) => {
    try {
        const labels = await Label.getAll();
        res.status(200).json(labels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Membuat label baru
exports.createLabel = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Nama label kosong" });
        const labelId = await Label.create(name);
        res.status(201).json({ message: "Label berhasil dibuat", id: labelId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Menghapus label berdasarkan ID
exports.deleteLabel = async (req, res) => {
    try {
        const { id } = req.params;
        await Label.delete(id);
        res.status(200).json({ message: "Label berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- TAMBAHAN: Menghubungkan Label ke Catatan ---

// 4. Ambil semua label yang terpasang di satu catatan tertentu
exports.getLabelsByNote = async (req, res) => {
    try {
        const labels = await Label.getByNote(req.params.noteId);
        res.status(200).json(labels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Tambahkan label ke catatan
exports.addLabelToNote = async (req, res) => {
    try {
        const { labelId } = req.body;
        await Label.addToNote(req.params.noteId, labelId);
        res.status(201).json({ message: "Label berhasil ditambahkan ke catatan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Hapus label dari catatan
exports.removeLabelFromNote = async (req, res) => {
    try {
        const { labelId } = req.body;
        await Label.removeFromNote(req.params.noteId, labelId);
        res.status(200).json({ message: "Label berhasil dihapus dari catatan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};