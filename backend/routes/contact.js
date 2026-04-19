import express from 'express'
import { body, validationResult } from 'express-validator'
import Inquiry from '../models/Inquiry.js'
import { sendAdminNotification, sendAutoReply } from '../utils/email.js'

const router = express.Router()

const validate = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 80 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  body('lastName').optional().trim().isLength({ max: 80 }),
  body('company').optional().trim().isLength({ max: 100 }),
  body('service').optional().trim().isLength({ max: 100 }),
]

router.post('/', validate, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg })
  }

  try {
    const { firstName, lastName, email, company, service, message } = req.body
    const ip = req.ip || req.headers['x-forwarded-for'] || ''

    let inquiry;
    if (!process.env.MONGODB_URI && global.inMemoryInquiries) {
      inquiry = { _id: Date.now().toString(), firstName, lastName, email, company, service, message, ip, createdAt: new Date(), read: false }
      global.inMemoryInquiries.push(inquiry);
    } else {
      inquiry = await Inquiry.create({ firstName, lastName, email, company, service, message, ip })
    }

    // Fire-and-forget emails (don't block response)
    Promise.all([
      sendAdminNotification(inquiry),
      sendAutoReply(inquiry),
    ]).catch(err => console.error('Email error:', err))

    res.json({ success: true, message: 'Inquiry received. We\'ll be in touch within 24 hours.' })
  } catch (err) {
    console.error('Contact error:', err)
    res.status(500).json({ success: false, message: 'Server error. Please email us directly.' })
  }
})

export default router
