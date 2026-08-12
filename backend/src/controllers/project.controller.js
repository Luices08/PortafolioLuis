const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const toSlug = require('../utils/slugify');

// Público: solo proyectos publicados
const listPublicProjects = asyncHandler(async (req, res) => {
  const { category, technology, featured } = req.query;
  const filter = { status: 'published' };

  if (category) filter.categories = category;
  if (technology) filter.technologies = technology;
  if (featured === 'true') filter.featured = true;

  const projects = await Project.find(filter).sort({ featured: -1, createdAt: -1 });
  return new ApiResponse(200, projects).send(res);
});

const getPublicProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, status: 'published' });
  if (!project) throw ApiError.notFound('Proyecto no encontrado');
  return new ApiResponse(200, project).send(res);
});

// Admin: todos los proyectos, incluyendo borradores
const listAdminProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  return new ApiResponse(200, projects).send(res);
});

const getAdminProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound('Proyecto no encontrado');
  return new ApiResponse(200, project).send(res);
});

const createProject = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (!payload.slug) {
    payload.slug = toSlug(payload.title);
  } else {
    payload.slug = toSlug(payload.slug);
  }

  const project = await Project.create(payload);
  return new ApiResponse(201, project, 'Proyecto creado').send(res);
});

const updateProject = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.slug) payload.slug = toSlug(payload.slug);
  else if (payload.title) payload.slug = toSlug(payload.title);

  const project = await Project.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!project) throw ApiError.notFound('Proyecto no encontrado');

  return new ApiResponse(200, project, 'Proyecto actualizado').send(res);
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound('Proyecto no encontrado');
  return new ApiResponse(200, null, 'Proyecto eliminado').send(res);
});

module.exports = {
  listPublicProjects,
  getPublicProjectBySlug,
  listAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
};
