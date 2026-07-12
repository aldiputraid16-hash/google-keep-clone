const Note = require('../models/noteModel');

// 1. Mengambil semua catatan biasa (is_archived=0, is_trashed=0)
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.getAll();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Menerima data catatan baru 
exports.createNote = async (req, res) => {
    try {
        // Ambil title, content, dan is_pinned dari request body frontend
        const { title, content, is_pinned } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Konten catatan tidak boleh kosong" });
        }

        // Amankan nilai pin: jika dari frontend kosong/undefined, otomatis beri nilai 0
        const pinStatus = is_pinned !== undefined ? is_pinned : 0;

        // Kirim 3 argumen sesuai struktur baru di noteModel.js
        const insertId = await Note.create(title, content, pinStatus);
        
        res.status(201).json({ id: insertId, title, content, is_pinned: pinStatus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Mengubah fungsi delete biasa menjadi SOFT DELETE (Pindah ke Sampah)
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        await Note.softDelete(id);
        res.status(200).json({ message: "Catatan dipindahkan ke sampah" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Menerima data perubahan catatan dari frontend berdasarkan ID
exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Konten catatan tidak boleh kosong" });
        }

        await Note.update(id, title, content);
        res.status(200).json({ message: "Catatan berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Mengambil catatan yang statusnya diarsip
exports.getArchivedNotes = async (req, res) => {
    try {
        const notes = await Note.getArchived();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Mengambil catatan yang statusnya di sampah
exports.getTrashedNotes = async (req, res) => {
    try {
        const notes = await Note.getTrashed();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Mengarsipkan atau mengembalikan catatan dari arsip
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

// 8. Memulihkan catatan kembali dari sampah (TAMBAHAN UTAMA)
exports.restoreFromTrash = async (req, res) => {
    try {
        const { id } = req.params;
        await Note.restore(id);
        res.status(200).json({ message: "Catatan berhasil dipulihkan" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 9. Hapus Permanen (Dipanggil saat berada di menu Sampah)
exports.deletePermanently = async (req, res) => {
    try {
        const { id } = req.params;
        await Note.deletePermanently(id);
        res.status(200).json({ message: "Catatan dihapus permanen dari database" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/// Fungsi untuk mengubah status sematan (Pin) catatan
exports.togglePinNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_pinned } = req.body; // Menerima nilai 1 atau 0 dari frontend

        // Memanggil method dari model Note (Bukan db.query langsung)
        await Note.updatePinStatus(id, is_pinned);
        
        res.status(200).json({ message: "Status sematan catatan berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};