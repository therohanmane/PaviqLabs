import express from 'express'
import HeroImage from '../models/HeroImage.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let images = []
    if (!process.env.MONGODB_URI && global.inMemoryHeroImages) {
      images = [...global.inMemoryHeroImages]
    } else {
      images = await HeroImage.find().sort({ createdAt: -1 })
    }
    res.json({ success: true, images })
  } catch (err) {
    console.error('Error fetching hero images:', err)
    res.status(500).json({ success: false, message: 'Server error fetching hero images' })
  }
})

export default router
