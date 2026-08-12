const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null }, // null = trabajo actual
    isCurrent: { type: Boolean, default: false },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Experience', experienceSchema);
