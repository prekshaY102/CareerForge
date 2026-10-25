require('dotenv').config();
const cloudinary = require('./src/config/cloudinary');

async function run() {
  try {
    const ping = await cloudinary.api.ping();
    console.log('Credentials OK:', ping);
  } catch (err) {
    console.error('Credentials check failed:', err.error?.message || err.message || err);
  }

  try {
    const result = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { folder: 'careerforge-test' }
    );
    console.log('Upload works:', result.secure_url);
  } catch (err) {
    console.error('Upload failed:', err.error?.message || err.message || err);
  }
}

run();
