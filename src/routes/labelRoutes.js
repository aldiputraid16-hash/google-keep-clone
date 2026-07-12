const express = require('express');
const router = express.Router();
const labelController = require('../controllers/labelController');

// Menyambungkan URL API dengan fungsi di Controller
router.get('/', labelController.getAllLabels);      
router.post('/', labelController.createLabel);    
router.delete('/:id', labelController.deleteLabel); 

module.exports = router;