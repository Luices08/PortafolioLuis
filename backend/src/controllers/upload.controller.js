const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadImageBuffer, deleteImage } = require('../services/cloudinary.service');

// Admin: sube una imagen (proyecto, avatar, etc.) a Cloudinary y devuelve
// la URL + publicId para guardar en el documento correspondiente.
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No se recibió ningún archivo (campo "image")');
  }

  const folder = req.body.folder || 'portfolio-ai/general';
  const result = await uploadImageBuffer(req.file.buffer, folder);

  return new ApiResponse(201, result, 'Imagen subida').send(res);
});

const removeImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw ApiError.badRequest('publicId es requerido');

  await deleteImage(publicId);
  return new ApiResponse(200, null, 'Imagen eliminada').send(res);
});

module.exports = { uploadImage, removeImage };
