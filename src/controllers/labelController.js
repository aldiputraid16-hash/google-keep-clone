const Label = require('../models/labelModel');

// 1. Mengambil semua label untuk dikirim ke frontend
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
        if (!name) {
            return res.status(400).json({ message: "Nama label tidak boleh kosong" });
        }
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