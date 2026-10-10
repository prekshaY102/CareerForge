const express = require('express');
const router = express.Router();
const { createJobDescription, getJobDescriptions, getJobDescription, deleteJobDescription, analyzeMatch, getMatchAnalyses } = require('../controllers/jobDescriptionController');
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createJobDescription);
router.get('/', getJobDescriptions);
router.get('/:id', getJobDescription);
router.delete('/:id', deleteJobDescription);
router.get('/:id/analyze-match', analyzeMatch);
router.get('/:id/match-analyses', getMatchAnalyses);
module.exports = router;