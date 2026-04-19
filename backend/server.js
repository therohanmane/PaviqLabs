import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import contactRoute from './routes/contact.js'
import adminRoute from './routes/admin.js'
import projectsRoute from './routes/projects.js'
import settingsRoute from './routes/settings.js'
import insightsRoute from './routes/insights.js'
import heroImagesRoute from './routes/heroImages.js'
import servicesRoute from './routes/services.js'

const __dirname = path.dirname(fileURLToPath(
    import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

// ─── SECURITY MIDDLEWARE ───
app.use(helmet({
    contentSecurityPolicy: false, // handled by frontend
}))
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ?
        ['https://paviqlabs.in', 'https://www.paviqlabs.in'] :
        ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
}))

// ─── RATE LIMITING ───
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5, // 5 requests per window
    message: { success: false, message: 'Too many submissions. Please wait before trying again.' },
    standardHeaders: true,
})
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 })
app.use(generalLimiter)

// ─── BODY PARSING ───
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

// ─── LOGGING ───
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// ─── DATABASE ───
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✅ MongoDB connected'))
        .catch(err => console.error('MongoDB error:', err))
} else {
    console.warn('⚠️  MONGODB_URI not set — using in-memory storage (inquiries won\'t persist)')
        // Fallback in-memory store for demo purposes
    global.inMemoryInquiries = []
    global.inMemoryProjects = []
    global.inMemorySettings = {
        // ─── Section-level visibility ───
        sectionsEnabled: {
            about: true,
            services: true,
            process: true,
            testimonials: true,
            blog: true,
            trustedBy: true,
            founders: true,
            careers: true
        },
        // ─── Brand Quotes ───
        quotes: {
            hero: 'Speed without security is a gamble. Security without speed is a cage. We give you both.',
            about: 'We don\'t just build your technology — we become its guardian, its engine, and its compass.',
            footer: '',
            businessCard: '',
            emailSignature: '',
            socialMedia: ''
        },
        // Hero & Services
        servicesHeading: 'Services built for scale.',
        heroStats: [
            { value: '10', suffix: '+', label: 'Projects Delivered', enabled: true },
            { value: '4', suffix: '+', label: 'Years Experience', enabled: true },
            { value: '🌏', suffix: '', label: 'Clients Globally', enabled: true },
            { value: '⭐', suffix: '', label: '5-Star Rated', enabled: true }
        ],
        // About Section
        aboutHeading: 'Where engineering meets design excellence.',
        aboutDesc1: "PaviqLabs is a technology company built by builders. We combine deep engineering expertise with a product mindset to deliver solutions that scale, perform, and impress. From early-stage startups to enterprise clients, we're the team that makes it happen.",
        aboutDesc2: 'Our philosophy is simple: understand the problem deeply, design with precision, build with care, and ship with confidence.',
        aboutTags: ['React & Next.js', 'Node.js', 'AWS / GCP', 'React Native', 'Python & AI', 'Cybersecurity', 'Figma', 'DevOps'],
        aboutBadges: [
            { label: 'Projects Delivered', value: '10', suffix: '+', enabled: true },
            { label: 'Client Satisfaction', value: '100', suffix: '%', enabled: true }
        ],
        // Testimonials
        testimonials: [
            { text: 'PaviqLabs transformed our digital infrastructure in just 3 months. The attention to detail and technical depth is unmatched. Our platform now handles 10x the load with zero downtime.', name: 'Arjun Mehta', role: 'CTO, FinNova Solutions', initials: 'AM', stars: 5, enabled: true },
            { text: 'Working with PaviqLabs was a game-changer. They delivered a cybersecurity audit that uncovered critical vulnerabilities and provided actionable recommendations our team could act on immediately.', name: 'Priya Sharma', role: 'CISO, HealthBridge India', initials: 'PS', stars: 5, enabled: true },
            { text: 'The mobile app they built for us exceeded all expectations. Clean code, beautiful UI, and they genuinely understood our users. Highly recommend for any serious digital project.', name: 'Rahul Gupta', role: 'Founder, RetailEdge', initials: 'RG', stars: 5, enabled: true }
        ],
        // Process Steps
        processSteps: [
            { num: '01', icon: '🔍', title: 'Discover & Assess', desc: 'We map your requirements, infrastructure, and security posture before touching a single tool.', enabled: true },
            { num: '02', icon: '🛠️', title: 'Plan & Architect', desc: 'We design a secure, scalable solution — cloud setup, pipelines, and tech stack — before we build.', enabled: true },
            { num: '03', icon: '⚡', title: 'Build & Secure', desc: 'Development and security run in parallel — not as an afterthought. Every sprint ships tested, hardened code.', enabled: true },
            { num: '04', icon: '🚀', title: 'Deploy & Monitor', desc: 'CI/CD deployment, live monitoring, and continuous security checks — long after go-live.', enabled: true }
        ],
        // Trusted By (objects with name, logo, enabled)
        trustedBy: [],
        // Team / Founders
        founders: [{
                initials: 'RK',
                name: 'Rohan',
                role: 'CO-FOUNDER · CYBERSECURITY & NETWORKING',
                bio: "Rohan leads security at our core. Deeply skilled in ethical hacking, penetration testing, network architecture, and cloud security, he is passionate about building digital environments that are robust, resilient, and threat-proof from day one.",
                linkedin: 'https://www.linkedin.com/company/paviqlabs',
                tags: ['Ethical Hacking', 'Pentesting', 'Network Security', 'Cloud Security', 'Threat Analysis'],
                enabled: true
            },
            {
                initials: 'KS',
                name: 'Kaushal',
                role: 'CO-FOUNDER · DEVOPS & INFRASTRUCTURE',
                bio: "Kaushal is the force behind our infrastructure. With strong command over DevOps practices, cloud platforms, and deployment pipelines, he ensures every product we build is scalable, reliable, and delivered seamlessly from development to production.",
                linkedin: 'https://www.linkedin.com/company/paviqlabs',
                tags: ['DevOps', 'CI/CD Pipelines', 'Cloud Platforms', 'Containerisation', 'Deployment'],
                enabled: true
            }
        ],
        // Job Openings
        jobOpenings: [
            { title: 'Senior Full-Stack Developer', type: 'Full-Time', location: 'Remote', dept: 'Engineering', enabled: true },
            { title: 'Cybersecurity Analyst', type: 'Full-Time', location: 'Hybrid', dept: 'Security', enabled: true },
            { title: 'AI/ML Engineer', type: 'Full-Time', location: 'Remote', dept: 'AI Research', enabled: true },
            { title: 'UI/UX Designer', type: 'Full-Time', location: 'Remote', dept: 'Design', enabled: true },
            { title: 'DevOps Engineer', type: 'Contract', location: 'Remote', dept: 'Infrastructure', enabled: true }
        ]
    }
    global.inMemoryInsights = [
        { _id: 'i1', category: 'Cybersecurity', title: 'Zero Trust Architecture: Why Your VPN Isn\'t Enough in 2025', excerpt: 'As remote work becomes permanent, legacy VPN solutions create dangerous blind spots. Here\'s why zero trust is the future of enterprise security.', date: 'Apr 10, 2025', readTime: '6 min read', icon: '🔐', bg: 'linear-gradient(135deg, #0D1B3E, #162040)', enabled: true },
        { _id: 'i2', category: 'AI & Automation', title: 'Building Production LLM Apps: Lessons from the Trenches', excerpt: 'From prompt engineering to RAG pipelines and evaluation frameworks — what we learned shipping AI features to 50,000+ users.', date: 'Mar 28, 2025', readTime: '8 min read', icon: '🤖', bg: 'linear-gradient(135deg, #1a0533, #2d1052)', enabled: true },
        { _id: 'i3', category: 'Cloud', title: 'Kubernetes Cost Optimization: Saving 40% Without Sacrificing Performance', excerpt: 'Real-world strategies for right-sizing clusters, using spot instances, and implementing autoscaling policies that actually work.', date: 'Mar 15, 2025', readTime: '5 min read', icon: '☁️', bg: 'linear-gradient(135deg, #0D3B2E, #1A5C46)', enabled: true }
    ]
    global.inMemoryHeroImages = []
    global.inMemoryServices = [
        { _id: 's1', num: '01', icon: '🌐', title: 'Web Development', desc: 'Pixel-perfect, high-performance web applications engineered with React, Next.js, and modern stacks. From landing pages to enterprise portals.', tags: ['React', 'Next.js', 'Node.js', 'TypeScript'], enabled: true },
        { _id: 's2', num: '02', icon: '📱', title: 'Mobile App Development', desc: 'Native and cross-platform mobile applications for iOS and Android. Seamless UX that drives engagement and retention.', tags: ['React Native', 'Flutter', 'Swift', 'Kotlin'], enabled: true },
        { _id: 's3', num: '03', icon: '🔐', title: 'Cybersecurity', desc: 'Comprehensive security audits, penetration testing, and enterprise-grade security architectures to protect your digital assets.', tags: ['Pen Testing', 'VAPT', 'SOC', 'ISO 27001'], enabled: true },
        { _id: 's4', num: '04', icon: '☁️', title: 'Cloud Solutions', desc: 'Scalable, resilient cloud infrastructure on AWS, GCP, and Azure. DevOps pipelines, containerization, and managed services.', tags: ['AWS', 'GCP', 'Azure', 'Kubernetes'], enabled: true },
        { _id: 's5', num: '05', icon: '🤖', title: 'AI & Automation', desc: 'Intelligent automation and AI integrations that transform workflows. Custom LLM applications, ML pipelines, and intelligent bots.', tags: ['LLM', 'OpenAI', 'Python', 'TensorFlow'], enabled: true },
        { _id: 's6', num: '06', icon: '🎨', title: 'UI/UX Design', desc: 'Human-centred design that converts. Research-driven wireframes, prototypes, and design systems that delight users.', tags: ['Figma', 'Design Systems', 'Prototyping', 'Research'], enabled: true },
    ]
}

// ─── API ROUTES ───
app.use('/api/contact', contactLimiter, contactRoute)
app.use('/api/admin', adminRoute)
app.use('/api/projects', projectsRoute)
app.use('/api/settings', settingsRoute)
app.use('/api/insights', insightsRoute)
app.use('/api/hero-images', heroImagesRoute)
app.use('/api/services', servicesRoute)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), env: process.env.NODE_ENV })
})

// ─── SERVE FRONTEND (production) ───
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'))
    })
}

// ─── ERROR HANDLER ───
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ success: false, message: 'Internal server error' })
})

app.listen(PORT, () => {
    console.log(`🚀 PaviqLabs server running on http://localhost:${PORT}`)
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`   Admin panel: http://localhost:${PORT}/admin`)
})