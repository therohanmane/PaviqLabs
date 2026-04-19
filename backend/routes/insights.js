import express from 'express'
import Insight from '../models/Insight.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let insights = []
    if (!process.env.MONGODB_URI && global.inMemoryInsights) {
      insights = [...global.inMemoryInsights]
    } else {
      insights = await Insight.find().sort({ createdAt: -1 })
    }
    res.json({ success: true, insights })
  } catch (err) {
    console.error('Error fetching insights:', err)
    res.status(500).json({ success: false, message: 'Server error fetching insights' })
  }
})

export default router
