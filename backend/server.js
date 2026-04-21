import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import compression from 'compression'

// ─── ROUTES ───
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
app.set('trust proxy', 1)

const PORT = process.env.PORT || 5000

// ─── MIDDLEWARE ───
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

// ─── ✅ FINAL CORS FIX ───
const allowedOrigins = [
  'https://paviqlabs.in',
  'https://www.paviqlabs.in',
  'http://localhost:3000',
  'http://localhost:5173',
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      // allow exact domains
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      // allow ALL vercel deployments
      if (origin && origin.endsWith('.vercel.app')) {
        return callback(null, true)
      }

      console.log('❌ CORS Blocked:', origin)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// ─── LOGGER ───
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// ─── RATE LIMIT ───
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
)

// ─── DATABASE ───
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err))
} else {
  console.warn('⚠️ No DB — using in-memory fallback')
}

// ─── ROUTES ───
app.use('/api/contact', contactRoute)
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

// ─── ERROR HANDLER ───
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err.message)

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS error: Origin not allowed',
    })
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  })
})

// ─── START ───
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})