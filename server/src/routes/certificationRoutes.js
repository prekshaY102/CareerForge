const express = require('express');
const router = express.Router();
const { addCertification, updateCertification, deleteCertification } = require('../controllers/certificationController');
const protect = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', addCertification);
router.put('/:id', updateCertification);
router.delete('/:id', deleteCertification);

module.exports = router;