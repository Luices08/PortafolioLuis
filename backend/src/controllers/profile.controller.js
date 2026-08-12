const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Público: obtener el perfil (documento singleton)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    throw ApiError.notFound('El perfil todavía no ha sido configurado');
  }
  return new ApiResponse(200, profile).send(res);
});

// Admin: crear o actualizar el perfil (upsert, porque es singleton)
const upsertProfile = asyncHandler(async (req, res) => {
  const existing = await Profile.findOne();

  let profile;
  if (existing) {
    Object.assign(existing, req.body);
    profile = await existing.save();
  } else {
    profile = await Profile.create(req.body);
  }

  return new ApiResponse(200, profile, 'Perfil actualizado').send(res);
});

module.exports = { getProfile, upsertProfile };
