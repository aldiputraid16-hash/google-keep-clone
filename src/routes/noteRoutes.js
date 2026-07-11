const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// 1. Endpoint untuk mengambil semua catatan (GET /api/notes)
router.get('/', noteController.getNotes);

// 2. Endpoint untuk menambah catatan baru (POST /api/notes)
router.post('/', noteController.createNote);

// 3. Endpoint untuk menghapus catatan berdasarkan ID (DELETE /api/notes/:id)
router.delete('/:id', noteController.deleteNote);

module.exports = router;