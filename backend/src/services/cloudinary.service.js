const cloudinary = require('cloudinary').v2;
const config = require('../config/env');

let configured = false;

function ensureConfigured() {
  if (configured) return;
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    throw new Error('Cloudinary no está configurado (revisa las variables CLOUDINARY_* en .env).');
  }
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  configured = true;
}

/**
 * Sube un buffer de imagen a Cloudinary usando un upload_stream.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
function uploadImageBuffer(buffer, folder = 'portfolio-ai') {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

async function deleteImage(publicId) {
  if (!publicId) return;
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadImageBuffer, deleteImage };
