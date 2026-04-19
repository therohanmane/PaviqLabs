import express from 'express'
import Settings from '../models/Settings.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let settings
    if (!process.env.MONGODB_URI && global.inMemorySettings) {
      settings = global.inMemorySettings
    } else {
      settings = await Settings.findOne()
      if (!settings && global.inMemorySettings) {
        settings = global.inMemorySettings
      }
    }
    res.json({ success: true, settings })
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching settings' })
  }
})

export default router
