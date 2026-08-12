const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['frontend', 'backend', 'database', 'devops', 'ai', 'tools', 'soft-skills', 'other'],
      default: 'other',
      index: true,
    },
    level: {
      type: String,
      enum: ['basico', 'intermedio', 'avanzado', 'experto'],
      default: 'intermedio',
    },
    icon: { type: String, trim: true }, // URL del ícono (Cloudinary) o nombre de ícono
    iconPublicId: { type: String, trim: true }, // publicId en Cloudinary, para poder borrarlo al reemplazar/eliminar
    relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

skillSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Skill', skillSchema);
