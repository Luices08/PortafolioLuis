const Experience = require('../models/Experience');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const listExperience = asyncHandler(async (req, res) => {
  const items = await Experience.find().sort({ order: 1, startDate: -1 });
  return new ApiResponse(200, items).send(res);
});

const createExperience = asyncHandler(async (req, res) => {
  const item = await Experience.create(req.body);
  return new ApiResponse(201, item, 'Experiencia creada').send(res);
});

const updateExperience = asyncHandler(async (req, res) => {
  const item = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw ApiError.notFound('Experiencia no encontrada');
  return new ApiResponse(200, item, 'Experiencia actualizada').send(res);
});

const deleteExperience = asyncHandler(async (req, res) => {
  const item = await Experience.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound('Experiencia no encontrada');
  return new ApiResponse(200, null, 'Experiencia eliminada').send(res);
});

module.exports = { listExperience, createExperience, updateExperience, deleteExperience };
