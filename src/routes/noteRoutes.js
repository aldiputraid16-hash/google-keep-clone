const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.getNotes);
router.get('/archived', noteController.getArchivedNotes);
router.get('/trashed', noteController.getTrashedNotes);
router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.put('/:id/archive', noteController.toggleArchive);
router.put('/:id/restore', noteController.restoreFromTrash);
router.delete('/:id/permanent', noteController.deletePermanently);
router.put('/:id/pin', noteController.togglePinNote);
router.post('/:id/duplicate', noteController.duplicateNote);
router.put('/:id/color', noteController.changeNoteColor);
router.get('/:noteId/labels', noteController.getNoteLabels);
router.put('/:id/reminder', noteController.setReminder);

module.exports = router;