const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// 1. Ambil semua catatan biasa
router.get('/', noteController.getNotes);

// 2. Ambil catatan yang diarsipkan
router.get('/archived', noteController.getArchivedNotes);

// 3. Ambil catatan di sampah
router.get('/trashed', noteController.getTrashedNotes);

// 4. Tambah catatan baru
router.post('/', noteController.createNote);

// 5. Update isi catatan (Judul / Konten)
router.put('/:id', noteController.updateNote);

// 6. Pindah ke Sampah (Soft Delete)
router.delete('/:id', noteController.deleteNote);

// 7. Mengarsipkan / Mengembalikan dari Arsip
router.put('/:id/archive', noteController.toggleArchive);

// 8. Memulihkan dari sampah
router.put('/:id/restore', noteController.restoreFromTrash);

// 9. Hapus Permanen dari Sampah
router.delete('/:id/permanent', noteController.deletePermanently);

// 10. REVISI UTAMA: Rute Fitur Sematkan Catatan (Pin Note)
router.put('/:id/pin', noteController.togglePinNote);

router.post('/:id/duplicate', noteController.duplicateNote);

// Rute untuk mengubah warna tema catatan
router.put('/:id/color', noteController.changeNoteColor);

// Tambahkan baris ini di file rute catatan Anda
router.get('/:noteId/labels', noteController.getNoteLabels);

router.put('/:id/reminder', noteController.setReminder);

module.exports = router;