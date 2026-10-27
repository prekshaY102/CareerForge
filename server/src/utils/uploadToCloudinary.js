const cloudinary = require('../config/cloudinary');

function uploadToCloudinary(file) {
  const isPdf = file.mimetype === 'application/pdf';
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'stepwise-resumes',
        resource_type: 'auto',
        timeout: 30000,
        // Word files are stored as raw files, which only keep their extension if it's part of the public_id
        ...(isPdf ? {} : { public_id: `${Date.now()}-${safeName}` }),
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(file.buffer);
  });
}

module.exports = uploadToCloudinary;