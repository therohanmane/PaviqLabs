import { Router } from 'express'

const router = Router()

const RESPONSES = {
  greeting: 'Hey 👋 Welcome to PaviqLabs. How can I help you today?',
  services: 'We offer web development, mobile apps, cloud, DevOps, AI, and cybersecurity solutions.',
  pricing: 'Pricing depends on your requirements. Would you like a quick estimate?',
  project: 'Awesome 🚀 Tell us a bit about your idea and we can guide you.',
  contact: 'You can connect with our team. Would you like to book a call?',
  tech: 'We use React, Node.js, AWS, Kubernetes, and modern scalable tech.',
  security: 'We follow best practices like OWASP, secure APIs, and zero-trust architecture.',
  portfolio: 'Explore our work in the Projects section — tell us what you would like to build next.',
  fallback: 'Got it 👍 Could you please explain a bit more?',
}

const FOLLOW_UP = 'Would you like to start a project or talk to our team?'

/**
 * Rule-based intent detection (keyword / pattern matching).
 * @param {string} message
 * @returns {string} intent key
 */
export function matchIntent(message) {
  const m = String(message || '')
    .toLowerCase()
    .trim()
  if (!m) return 'fallback'

  if (/\b(hi|hello|hey|howdy)\b/.test(m)) return 'greeting'

  if (
    /\bportfolio\b/.test(m) ||
    /case stud/.test(m) ||
    /\bshowcase\b/.test(m) ||
    /\bour work\b/.test(m) ||
    /\bpast work\b/.test(m) ||
    /\bwork samples\b/.test(m) ||
    /\bpast projects\b/.test(m)
  ) {
    return 'portfolio'
  }

  if (/\b(security|secure|owasp|pentest|vapt|zero[\s-]?trust)\b/.test(m) || /\bsafe\b/.test(m)) {
    return 'security'
  }

  if (/\b(price|pricing|cost|budget|quote|estimate|how much)\b/.test(m)) return 'pricing'

  if (m.includes('what do you do') || /\b(service|services|offer|capabilities)\b/.test(m)) {
    return 'services'
  }

  if (/\b(build|mvp|idea|startup|launch|product|project)\b/.test(m)) return 'project'

  if (/\b(contact|call|email|talk|reach|meeting|book|schedule)\b/.test(m)) return 'contact'

  if (/\b(tech|technology|stack|framework|language|platform|architecture)\b/.test(m)) return 'tech'

  return 'fallback'
}

function buildReply(intent) {
  const body = RESPONSES[intent] || RESPONSES.fallback
  return `${body} ${FOLLOW_UP}`
}

router.post('/', (req, res) => {
  const { message } = req.body || {}
  if (typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Expected JSON body: { "message": string }' })
  }

  const trimmed = message.trim().slice(0, 2000)
  const intent = matchIntent(trimmed)
  const reply = buildReply(intent)

  res.json({ reply, intent })
})

export default router
