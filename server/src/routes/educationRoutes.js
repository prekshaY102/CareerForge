const express = require('express');
const router = express.Router();
const { addEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', addEducation);
router.put('/:id', updateEducation);
router.delete('/:id', deleteEducation);

module.exports = router;