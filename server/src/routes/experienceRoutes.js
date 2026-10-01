const express = require('express');
const router = express.Router();
const { addExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', addExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

module.exports = router;