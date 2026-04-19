import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  name: { type: String, required: true },
  useCase: { type: String, required: true },
  techStack: { type: [String], required: true },
  link: { type: String },
  image: { type: String },
  icon: { type: String, default: '🚀' },
  bg: { type: String, default: 'linear-gradient(135deg, #0D1B3E 0%, #162040 100%)' },
  color: { type: String, default: '#C9A84C' },
  enabled: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
