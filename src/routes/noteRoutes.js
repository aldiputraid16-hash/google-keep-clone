const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// 1. Jalur Catatan Utama (CRUD Biasa)
router.get('/', noteController.getNotes);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote); // Ini akan memicu SOFT DELETE (masuk sampah)

// 2. Jalur Khusus Fitur Arsip
router.get('/archived', noteController.getArchivedNotes);
router.put('/:id/archive', noteController.toggleArchive);

// 3. Jalur Khusus Fitur Sampah
router.get('/trashed', noteController.getTrashedNotes);
router.put('/:id/restore', noteController.restoreFromTrash); // Untuk tombol pulihkan
router.delete('/:id/permanent', noteController.deletePermanently); // Untuk hapus selamanya dari database

module.exports = router;