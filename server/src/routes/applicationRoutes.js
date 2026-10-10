const express = require('express');
const router = express.Router();
const { createApplication, getApplications, getApplication, updateApplication, deleteApplication } = require('../controllers/applicationController');
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;