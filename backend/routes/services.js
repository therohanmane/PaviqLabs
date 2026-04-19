import express from 'express'
import Service from '../models/Service.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let services = []
    if (!process.env.MONGODB_URI && global.inMemoryServices) {
      services = [...global.inMemoryServices]
    } else {
      services = await Service.find().sort({ num: 1 })
    }
    res.json({ services })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
