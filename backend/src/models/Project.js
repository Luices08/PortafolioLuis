const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String }, // id de Cloudinary, para poder borrarla
    alt: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 280 },
    fullDescription: { type: String, required: true },

    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    featured: { type: Boolean, default: false, index: true },

    technologies: { type: [String], default: [] },
    categories: { type: [String], default: [] },

    features: { type: [String], default: [] },
    challenges: { type: [String], default: [] },
    solutions: { type: [String], default: [] },
    learnings: { type: [String], default: [] },

    myRole: { type: String, trim: true },
    duration: { type: String, trim: true }, // ej. "3 meses", "Ene 2024 - Mar 2024"

    images: { type: [imageSchema], default: [] },

    githubUrl: { type: String, trim: true },
    demoUrl: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

// Índice de texto para permitir búsquedas simples en el servicio de contexto del chat
projectSchema.index({
  title: 'text',
  shortDescription: 'text',
  fullDescription: 'text',
  technologies: 'text',
  categories: 'text',
});

projectSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Project', projectSchema);
