const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const listSkills = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = category;

  const skills = await Skill.find(filter).sort({ order: 1, name: 1 }).populate('relatedProjects', 'title slug');
  return new ApiResponse(200, skills).send(res);
});

const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  return new ApiResponse(201, skill, 'Habilidad creada').send(res);
});

const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) throw ApiError.notFound('Habilidad no encontrada');
  return new ApiResponse(200, skill, 'Habilidad actualizada').send(res);
});

const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) throw ApiError.notFound('Habilidad no encontrada');
  return new ApiResponse(200, null, 'Habilidad eliminada').send(res);
});

module.exports = { listSkills, createSkill, updateSkill, deleteSkill };
