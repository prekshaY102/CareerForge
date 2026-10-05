const express = require('express');
const router = express.Router();
const { uploadResume, getResumes, setActiveResume, deleteResume, analyzeResume } = require('../controllers/resumeController');
const protect = require('../middleware/authMiddleware');
const upload = require('../config/upload');

router.use(protect);
router.post('/', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.put('/:id/activate', setActiveResume);
router.post('/:id/analyze', analyzeResume);
router.delete('/:id', deleteResume);

module.exports = router;