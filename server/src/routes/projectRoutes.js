const express = require('express');
const router = express.Router();
const { addProject, updateProject, deleteProject } = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', addProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;