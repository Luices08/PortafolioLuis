const multer = require('multer');

// Guardamos en memoria (buffer) y subimos directo a Cloudinary,
// sin tocar el disco del servidor.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'));
    }
    cb(null, true);
  },
});

module.exports = upload;
