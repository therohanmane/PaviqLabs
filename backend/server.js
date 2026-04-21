import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import compression from 'compression'

// Routes
import contactRoute from './routes/contact.js'
import adminRoute from './routes/admin.js'
import projectsRoute from './routes/projects.js'
import settingsRoute from './routes/settings.js'
import insightsRoute from './routes/insights.js'
import heroImagesRoute from './routes/heroImages.js'
import servicesRoute from './routes/services.js'
import chatRoute from './routes/chat.js'

// ─── INIT ───
const app = express()
app.set('trust proxy', 1) // ✅ FIXES RENDER + RATE LIMIT ISSUE

const PORT = process.env.PORT || 5000

// ─── MIDDLEWARE (ORDER MATTERS) ───
app.use(compression())

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))

app.use(helmet({
  contentSecurityPolicy: false,
}))

app.use(cors({
  origin:
    process.env.NODE_ENV === 'production'
      ? [
          'https://paviqlabs.in',
          'https://www.paviqlabs.in',
          'https://paviq-labs-63x3.vercel.app'
        ]
      : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// ─── RATE LIMIT ───
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many requests' },
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
})

app.use(generalLimiter)

// ─── DATABASE ───
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err))
} else {
  console.warn('⚠️ No DB — using in-memory fallback')
  global.inMemoryProjects = []
  global.inMemorySettings = {}
  global.inMemoryInsights = []
  global.inMemoryHeroImages = []
  global.inMemoryServices = []
}

// ─── ROUTES ───
app.use('/api/contact', contactLimiter, contactRoute)
app.use('/api/admin', adminRoute)
app.use('/api/projects', projectsRoute)
app.use('/api/settings', settingsRoute)
app.use('/api/insights', insightsRoute)
app.use('/api/hero-images', heroImagesRoute)
app.use('/api/services', servicesRoute)
app.use('/api/chat', chatRoute)

// ─── HEALTH CHECK ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  })
})

// ❌ REMOVED FRONTEND SERVING (VERY IMPORTANT)
// Backend = API only

// ─── ERROR HANDLER ───
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

// ─── START SERVER ───
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})