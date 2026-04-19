import mongoose from 'mongoose'

const InsightSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  icon: { type: String, default: '💡' },
  bg: { type: String, default: 'linear-gradient(135deg, #0D1B3E, #162040)' },
  image: { type: String },
  enabled: { type: Boolean, default: true }
}, { timestamps: true })

export default mongoose.models.Insight || mongoose.model('Insight', InsightSchema)
