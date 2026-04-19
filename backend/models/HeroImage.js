import mongoose from 'mongoose'

const HeroImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  xPos: { type: Number, default: 50 }, // percentage left
  yPos: { type: Number, default: 50 }, // percentage top
  scale: { type: Number, default: 1 }, 
}, { timestamps: true })

export default mongoose.models.HeroImage || mongoose.model('HeroImage', HeroImageSchema)
