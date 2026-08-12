/**
 * Script de datos de ejemplo para tener una demo funcionando de inmediato.
 * Uso: npm run seed  (desde backend/, con MONGODB_URI ya configurado en .env)
 *
 * Crea (si no existen):
 *  - Un admin con las credenciales de ADMIN_USERNAME / ADMIN_PASSWORD
 *  - Un perfil de ejemplo
 *  - 3 proyectos de ejemplo (publicados)
 *  - Habilidades, experiencia y educación de ejemplo
 *
 * Todo el contenido de ejemplo puede editarse o borrarse luego desde /admin.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../config/env');

const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');

async function run() {
  if (!config.mongoUri) {
    console.error('No hay MONGODB_URI configurado en backend/.env. Configúralo antes de correr el seed.');
    process.exit(1);
  }

  await mongoose.connect(config.mongoUri);
  console.log('[seed] Conectado a MongoDB');

  await seedAdmin();
  const projectIds = await seedProjects();
  await seedProfile();
  await seedSkills(projectIds);
  await seedExperience();
  await seedEducation();

  console.log('[seed] Listo. Puedes iniciar sesión en /admin con las credenciales de ADMIN_USERNAME/ADMIN_PASSWORD.');
  await mongoose.disconnect();
  process.exit(0);
}

async function seedAdmin() {
  const existing = await Admin.findOne({ username: config.admin.username });
  if (existing) {
    console.log('[seed] Admin ya existe, se omite');
    return;
  }
  if (!config.admin.password) {
    console.warn('[seed] ADMIN_PASSWORD no definido en .env: se usará "changeme123" temporalmente. Cámbiala.');
  }
  const passwordHash = await Admin.hashPassword(config.admin.password || 'changeme123');
  await Admin.create({
    username: config.admin.username,
    email: config.admin.email,
    passwordHash,
  });
  console.log(`[seed] Admin creado: ${config.admin.username}`);
}

async function seedProfile() {
  const existing = await Profile.findOne();
  if (existing) {
    console.log('[seed] Perfil ya existe, se omite');
    return;
  }
  await Profile.create({
    fullName: 'Tu Nombre',
    title: 'Desarrollador/a Full-Stack',
    bio:
      'Desarrollador/a full-stack con experiencia construyendo productos web de extremo a extremo: desde el modelado de datos hasta interfaces cuidadas. Me interesa especialmente la intersección entre producto e inteligencia artificial aplicada.',
    shortBio: 'Desarrollador/a full-stack enfocado en producto e IA aplicada.',
    location: 'Remoto',
    email: 'tucorreo@example.com',
    avatarUrl: '',
    resumeUrl: '',
    socialLinks: {
      github: 'https://github.com/tu-usuario',
      linkedin: 'https://linkedin.com/in/tu-usuario',
      twitter: '',
      website: '',
    },
    availableForWork: true,
  });
  console.log('[seed] Perfil de ejemplo creado');
}

async function seedProjects() {
  const count = await Project.countDocuments();
  if (count > 0) {
    console.log('[seed] Ya existen proyectos, se omite');
    return (await Project.find().select('_id')).map((p) => p._id);
  }

  const projects = await Project.insertMany([
    {
      title: 'Portafolio Conversacional (este proyecto)',
      slug: 'portafolio-conversacional',
      shortDescription: 'Portafolio profesional navegable mediante un chatbot con IA, con panel de administración sin código.',
      fullDescription:
        'Aplicación full-stack donde el mecanismo principal de descubrimiento de contenido es una conversación con IA. El backend recupera contexto relevante desde MongoDB y se lo entrega a Gemini, que responde en un formato JSON estructurado que el frontend usa para renderizar componentes visuales (proyectos, habilidades, experiencia, contacto).',
      status: 'published',
      featured: true,
      technologies: ['Next.js', 'React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Gemini API', 'Tailwind CSS'],
      categories: ['Full-Stack', 'IA Aplicada'],
      features: [
        'Chat con IA como navegación principal',
        'Respuestas estructuradas renderizadas como componentes',
        'Panel de administración completo sin tocar código',
        'Autenticación por JWT en cookies HTTP-only',
      ],
      challenges: [
        'Evitar que el modelo de IA invente información no presente en la base de datos',
        'Diseñar un contrato de respuesta estructurado y estable para el frontend',
      ],
      solutions: [
        'Instrucciones de sistema estrictas + contexto acotado recuperado desde MongoDB en cada mensaje',
        'Definición explícita de tipos de componentes UI que Gemini puede solicitar',
      ],
      learnings: [
        'Diseñar contratos JSON claros entre IA y frontend reduce errores de renderizado',
        'Separar la capa de recuperación de contexto de la capa de generación facilita migrar a RAG después',
      ],
      myRole: 'Diseño y desarrollo full-stack',
      duration: '3 semanas',
      images: [],
      githubUrl: '',
      demoUrl: '',
      videoUrl: '',
    },
    {
      title: 'Plataforma de Gestión de Tareas',
      slug: 'plataforma-gestion-tareas',
      shortDescription: 'Aplicación colaborativa de tableros Kanban con actualizaciones en tiempo real.',
      fullDescription:
        'Plataforma de gestión de proyectos estilo Kanban pensada para equipos pequeños, con tableros compartidos, comentarios y notificaciones en tiempo real mediante WebSockets.',
      status: 'published',
      featured: true,
      technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL'],
      categories: ['Productividad', 'Full-Stack'],
      features: ['Tableros Kanban en tiempo real', 'Comentarios y menciones', 'Notificaciones push'],
      challenges: ['Sincronizar estado entre múltiples clientes sin condiciones de carrera'],
      solutions: ['Eventos optimistas en el cliente + reconciliación por versión en el servidor'],
      learnings: ['La sincronización en tiempo real exige pensar el modelo de datos desde el diseño'],
      myRole: 'Desarrollo full-stack',
      duration: '2 meses',
      images: [],
      githubUrl: '',
      demoUrl: '',
      videoUrl: '',
    },
    {
      title: 'API de Analítica de E-commerce',
      slug: 'api-analitica-ecommerce',
      shortDescription: 'API REST para agregación y visualización de métricas de ventas en tiempo real.',
      fullDescription:
        'API REST enfocada en performance para agregar métricas de ventas (ingresos, conversión, cohortes) sobre grandes volúmenes de datos, con cacheo agresivo y consultas optimizadas.',
      status: 'published',
      featured: false,
      technologies: ['Node.js', 'Express', 'MongoDB', 'Redis'],
      categories: ['Backend', 'Datos'],
      features: ['Agregaciones por cohortes', 'Cacheo con Redis', 'Documentación OpenAPI'],
      challenges: ['Consultas de agregación lentas sobre millones de documentos'],
      solutions: ['Índices compuestos + pipeline de agregación optimizado + cacheo de resultados frecuentes'],
      learnings: ['El diseño de índices importa tanto como el código de la aplicación'],
      myRole: 'Desarrollo backend',
      duration: '6 semanas',
      images: [],
      githubUrl: '',
      demoUrl: '',
      videoUrl: '',
    },
  ]);

  console.log(`[seed] ${projects.length} proyectos de ejemplo creados`);
  return projects.map((p) => p._id);
}

async function seedSkills(projectIds) {
  const count = await Skill.countDocuments();
  if (count > 0) {
    console.log('[seed] Ya existen habilidades, se omite');
    return;
  }

  const [proj1] = projectIds;

  await Skill.insertMany([
    { name: 'JavaScript', category: 'frontend', level: 'experto', order: 1, relatedProjects: projectIds },
    { name: 'React', category: 'frontend', level: 'avanzado', order: 2, relatedProjects: projectIds },
    { name: 'Next.js', category: 'frontend', level: 'avanzado', order: 3, relatedProjects: proj1 ? [proj1] : [] },
    { name: 'Node.js', category: 'backend', level: 'experto', order: 4, relatedProjects: projectIds },
    { name: 'Express', category: 'backend', level: 'avanzado', order: 5, relatedProjects: projectIds },
    { name: 'MongoDB', category: 'database', level: 'avanzado', order: 6, relatedProjects: projectIds },
    { name: 'PostgreSQL', category: 'database', level: 'intermedio', order: 7 },
    { name: 'Docker', category: 'devops', level: 'intermedio', order: 8 },
    { name: 'Gemini API', category: 'ai', level: 'intermedio', order: 9, relatedProjects: proj1 ? [proj1] : [] },
    { name: 'Comunicación', category: 'soft-skills', level: 'avanzado', order: 10 },
  ]);
  console.log('[seed] Habilidades de ejemplo creadas');
}

async function seedExperience() {
  const count = await Experience.countDocuments();
  if (count > 0) {
    console.log('[seed] Ya existe experiencia, se omite');
    return;
  }

  await Experience.insertMany([
    {
      company: 'Empresa Actual S.A.',
      role: 'Desarrollador/a Full-Stack Senior',
      location: 'Remoto',
      startDate: new Date('2023-01-01'),
      endDate: null,
      isCurrent: true,
      description: 'Desarrollo de productos web de extremo a extremo, liderazgo técnico de features clave y mentoría de desarrolladores junior.',
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
      order: 1,
    },
    {
      company: 'Startup Anterior',
      role: 'Desarrollador/a Full-Stack',
      location: 'Remoto',
      startDate: new Date('2021-03-01'),
      endDate: new Date('2022-12-31'),
      isCurrent: false,
      description: 'Construcción del producto desde cero, desde el primer commit hasta la primera versión comercial.',
      technologies: ['Vue.js', 'Express', 'PostgreSQL'],
      order: 2,
    },
  ]);
  console.log('[seed] Experiencia de ejemplo creada');
}

async function seedEducation() {
  const count = await Education.countDocuments();
  if (count > 0) {
    console.log('[seed] Ya existe educación, se omite');
    return;
  }

  await Education.insertMany([
    {
      institution: 'Universidad Ejemplo',
      degree: 'Ingeniería en Sistemas',
      fieldOfStudy: 'Ciencias de la Computación',
      startDate: new Date('2016-03-01'),
      endDate: new Date('2021-12-01'),
      isCurrent: false,
      description: 'Formación en algoritmos, estructuras de datos, bases de datos y desarrollo de software.',
      order: 1,
    },
  ]);
  console.log('[seed] Educación de ejemplo creada');
}

run().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
