const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');

// Campos que exponemos a Gemini: lo suficiente para responder bien,
// sin mandar la base de datos completa en cada petición (principio #2 de CLAUDE.md).
const PROJECT_FIELDS =
  'title slug shortDescription fullDescription status featured technologies categories features challenges solutions learnings myRole duration githubUrl demoUrl videoUrl images';
const SKILL_FIELDS = 'name category level relatedProjects';
const EXPERIENCE_FIELDS = 'company role location startDate endDate isCurrent description technologies';
const EDUCATION_FIELDS = 'institution degree fieldOfStudy startDate endDate isCurrent description';

const MAX_PROJECTS = 6;
const MAX_SKILLS = 20;

/**
 * Construye el contexto que se envía a Gemini para responder un mensaje.
 * Estrategia actual: búsqueda por texto simple sobre proyectos/habilidades
 * relevantes a la pregunta + siempre incluir el perfil.
 *
 * La arquitectura deja el punto de extensión listo para reemplazar esto
 * por una búsqueda vectorial/RAG más adelante sin tocar gemini.service.js
 * ni el controlador de chat (ver CLAUDE.md, punto 10 del prompt maestro).
 */
async function buildContext(query) {
  const [profile, relevantProjects, allSkills, experience, education] = await Promise.all([
    Profile.findOne().lean(),
    findRelevantProjects(query),
    Skill.find().sort({ order: 1 }).select(SKILL_FIELDS).limit(MAX_SKILLS).lean(),
    Experience.find().sort({ order: 1, startDate: -1 }).select(EXPERIENCE_FIELDS).lean(),
    Education.find().sort({ order: 1, startDate: -1 }).select(EDUCATION_FIELDS).lean(),
  ]);

  return {
    profile: profile || null,
    projects: relevantProjects,
    skills: allSkills,
    experience,
    education,
  };
}

async function findRelevantProjects(query) {
  const publishedFilter = { status: 'published' };

  if (query && query.trim().length > 0) {
    const textResults = await Project.find(
      { ...publishedFilter, $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .select(PROJECT_FIELDS)
      .limit(MAX_PROJECTS)
      .lean();

    if (textResults.length > 0) return textResults;
  }

  // Si no hay coincidencias de texto (o no hay query), devolvemos destacados
  // como contexto por defecto para que el chat siempre tenga algo útil.
  return Project.find(publishedFilter)
    .sort({ featured: -1, createdAt: -1 })
    .select(PROJECT_FIELDS)
    .limit(MAX_PROJECTS)
    .lean();
}

module.exports = { buildContext };
