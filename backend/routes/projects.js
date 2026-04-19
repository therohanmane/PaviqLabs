import express from 'express'
import Project from '../models/Project.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let projects = []
    if (!process.env.MONGODB_URI && global.inMemoryProjects) {
      projects = [...global.inMemoryProjects].reverse()
    } else {
      projects = await Project.find().sort({ createdAt: -1 })
    }
    res.json({ success: true, projects })
  } catch (err) {
    console.error('Error fetching projects:', err)
    res.status(500).json({ success: false, message: 'Server error fetching projects' })
  }
})

export default router
