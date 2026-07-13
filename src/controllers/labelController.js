const Label = require('../models/labelModel');

exports.getAllLabels = async (req, res) => {
    try {
        const labels = await Label.getAll();
        res.status(200).json(labels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

exports.deleteLabel = async (req, res) => {
    try {
        const { id } = req.params;
        await Label.delete(id);
        res.status(200).json({ message: "Label berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLabelsByNote = async (req, res) => {
    try {
        const labels = await Label.getByNote(req.params.noteId);
        res.status(200).json(labels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addLabelToNote = async (req, res) => {
    try {
        const { labelId } = req.body;
        await Label.addToNote(req.params.noteId, labelId);
        res.status(201).json({ message: "Label berhasil ditambahkan ke catatan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeLabelFromNote = async (req, res) => {
    try {
        const { labelId } = req.body;
        await Label.removeFromNote(req.params.noteId, labelId);
        res.status(200).json({ message: "Label berhasil dihapus dari catatan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};