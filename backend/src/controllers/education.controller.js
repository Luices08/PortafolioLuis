const Education = require('../models/Education');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const listEducation = asyncHandler(async (req, res) => {
  const items = await Education.find().sort({ order: 1, startDate: -1 });
  return new ApiResponse(200, items).send(res);
});

const createEducation = asyncHandler(async (req, res) => {
  const item = await Education.create(req.body);
  return new ApiResponse(201, item, 'Educación creada').send(res);
});

const updateEducation = asyncHandler(async (req, res) => {
  const item = await Education.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw ApiError.notFound('Educación no encontrada');
  return new ApiResponse(200, item, 'Educación actualizada').send(res);
});

const deleteEducation = asyncHandler(async (req, res) => {
  const item = await Education.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('Educación no encontrada');
  return new ApiResponse(200, null, 'Educación eliminada').send(res);
});

module.exports = { listEducation, createEducation, updateEducation, deleteEducation };
