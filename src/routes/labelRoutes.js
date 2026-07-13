const express = require('express');
const router = express.Router();
const labelController = require('../controllers/labelController');

router.get('/', labelController.getAllLabels);     
router.post('/', labelController.createLabel);    
router.delete('/:id', labelController.deleteLabel); 

router.get('/note/:noteId', labelController.getLabelsByNote);
router.post('/note/:noteId', labelController.addLabelToNote);
router.delete('/note/:noteId', labelController.removeLabelFromNote);

module.exports = router;