const express = require('express');
const router = express.Router();
const { uploadResume, getResumes, setActiveResume, deleteResume, analyzeResume } = require('../controllers/resumeController');
const protect = require('../middleware/authMiddleware');
const upload = require('../config/upload');

function handleUpload(req, res, next) {
  upload.single('resume')(req, res, (err) => {
    if (!err) return next();

    console.error('Resume upload error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large (5 MB maximum)' });
    }
    if (err.http_code) {
      return res.status(502).json({ error: `File storage rejected the upload: ${err.message}` });
    }
    return res.status(400).json({ error: err.message || 'Upload failed' });
  });
}

router.use(protect);
router.post('/', handleUpload, uploadResume);
router.get('/', getResumes);
router.put('/:id/activate', setActiveResume);
router.post('/:id/analyze', analyzeResume);
router.delete('/:id', deleteResume);

module.exports = router;