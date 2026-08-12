const mongoose = require('mongoose');

// Profile es un documento singleton: solo debe existir uno.
const socialLinksSchema = new mongoose.Schema(
  {
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    website: { type: String, trim: true },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true }, // ej. "Full-stack Developer"
    bio: { type: String, required: true },
    shortBio: { type: String, trim: true }, // para respuestas rápidas del chat
    location: { type: String, trim: true },
    email: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    avatarPublicId: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    availableForWork: { type: Boolean, default: true },
  },
  { timestamps: true }
);

profileSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Profile', profileSchema);
