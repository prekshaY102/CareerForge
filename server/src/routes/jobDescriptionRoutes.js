const express = require('express');
const router = express.Router();
const { createJobDescription, getJobDescriptions, getJobDescription, deleteJobDescription } = require('../controllers/jobDescriptionController');
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createJobDescription);
router.get('/', getJobDescriptions);
router.get('/:id', getJobDescription);
router.delete('/:id', deleteJobDescription);

module.exports = router;