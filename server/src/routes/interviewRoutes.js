const express = require('express');
const router = express.Router();
const { generateQuestions, submitAnswer, getQuestions, deleteQuestion } = require('../controllers/interviewController');
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.post('/generate', generateQuestions);
router.put('/:id/answer', submitAnswer);
router.get('/', getQuestions);
router.delete('/:id', deleteQuestion);

module.exports = router;