const multer = require('multer');
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require('./cloudinary');

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPdf = file.mimetype === 'application/pdf';
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    return {
      folder: 'stepwise-resumes',
      resource_type: 'auto',
      // Word files are stored as raw files, which only keep their extension if it's in the public_id
      ...(isPdf ? {} : { public_id: `${Date.now()}-${safeName}` }),
    };
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  },
});