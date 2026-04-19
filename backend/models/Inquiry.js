import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true, default: '' },
  email: { type: String, required: true, trim: true, lowercase: true },
  company: { type: String, trim: true, default: '' },
  service: { type: String, default: '' },
  message: { type: String, required: true, trim: true },
  read: { type: Boolean, default: false },
  ip: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Inquiry', inquirySchema)
