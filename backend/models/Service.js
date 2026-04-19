import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema({
  num: { type: String, required: true },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  tags: { type: [String], default: [] },
  enabled: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema)
