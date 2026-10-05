const multer = require('multer');
const CloudinaryStorage  = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'careerforge-resumes',
    resource_type: 'auto',
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});

module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });