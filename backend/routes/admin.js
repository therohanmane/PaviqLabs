import express from 'express'
import jwt from 'jsonwebtoken'
import Inquiry from '../models/Inquiry.js'
import Project from '../models/Project.js'
import Settings from '../models/Settings.js'
import Insight from '../models/Insight.js'
import HeroImage from '../models/HeroImage.js'
import Service from '../models/Service.js'

const router = express.Router()

// Auth middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' })
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
        next()
    } catch {
        res.status(401).json({ message: 'Token invalid or expired' })
    }
}

// POST /api/admin/login
router.post('/login', (req, res) => {
    const { username, password } = req.body
    const validUser = process.env.ADMIN_USERNAME || 'admin'
    const validPass = process.env.ADMIN_PASSWORD || 'PaviqLabs@2025'

    if (username !== validUser || password !== validPass) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '8h' })
    res.json({ token })
})

// GET /api/admin/inquiries
router.get('/inquiries', auth, async(req, res) => {
    try {
        let inquiries = []
        if (!process.env.MONGODB_URI && global.inMemoryInquiries) {
            inquiries = [...global.inMemoryInquiries].reverse().slice(0, 200)
        } else {
            inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(200)
        }
        res.json({ inquiries })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// PATCH /api/admin/inquiries/:id/read
router.patch('/inquiries/:id/read', auth, async(req, res) => {
    try {
        if (!process.env.MONGODB_URI && global.inMemoryInquiries) {
            const inq = global.inMemoryInquiries.find(i => i._id === req.params.id)
            if (inq) inq.read = true
        } else {
            await Inquiry.findByIdAndUpdate(req.params.id, { read: true })
        }
        res.json({ success: true })
    } catch {
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE /api/admin/inquiries/:id
router.delete('/inquiries/:id', auth, async(req, res) => {
    try {
        if (!process.env.MONGODB_URI && global.inMemoryInquiries) {
            global.inMemoryInquiries = global.inMemoryInquiries.filter(i => i._id !== req.params.id)
        } else {
            await Inquiry.findByIdAndDelete(req.params.id)
        }
        res.json({ success: true })
    } catch {
        res.status(500).json({ message: 'Server error' })
    }
})

// POST /api/admin/projects
router.post('/projects', auth, async(req, res) => {
    try {
        const { domain, name, useCase, techStack, link, image } = req.body
        let project
        if (!process.env.MONGODB_URI && global.inMemoryProjects) {
            project = {
                _id: Date.now().toString(),
                domain,
                name,
                useCase,
                techStack,
                link,
                image,
                icon: '🚀',
                bg: 'linear-gradient(135deg, #0D1B3E 0%, #162040 100%)',
                color: '#C9A84C',
                createdAt: new Date()
            }
            global.inMemoryProjects.push(project)
        } else {
            project = await Project.create({ domain, name, useCase, techStack, link, image })
        }
        res.json({ success: true, project })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// PUT /api/admin/projects/:id
router.put('/projects/:id', auth, async(req, res) => {
    try {
        const { domain, name, useCase, techStack, link, image } = req.body
        let project
        if (!process.env.MONGODB_URI && global.inMemoryProjects) {
            const idx = global.inMemoryProjects.findIndex(p => p._id === req.params.id)
            if (idx !== -1) {
                global.inMemoryProjects[idx] = {...global.inMemoryProjects[idx], domain, name, useCase, techStack, link, image }
                project = global.inMemoryProjects[idx]
            }
        } else {
            project = await Project.findByIdAndUpdate(req.params.id, { domain, name, useCase, techStack, link, image }, { new: true })
        }
        res.json({ success: true, project })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', auth, async(req, res) => {
    try {
        if (!process.env.MONGODB_URI && global.inMemoryProjects) {
            global.inMemoryProjects = global.inMemoryProjects.filter(p => p._id !== req.params.id)
        } else {
            await Project.findByIdAndDelete(req.params.id)
        }
        res.json({ success: true })
    } catch {
        res.status(500).json({ message: 'Server error' })
    }
})

// PUT /api/admin/settings
router.put('/settings', auth, async(req, res) => {
    try {
        const {
            heroStats,
            servicesHeading,
            sectionsEnabled,
            quotes,
            aboutHeading,
            aboutDesc1,
            aboutDesc2,
            aboutTags,
            aboutBadges,
            testimonials,
            processSteps,
            trustedBy,
            founders,
            jobOpenings
        } = req.body
        let settings
        if (!process.env.MONGODB_URI && global.inMemorySettings) {
            if (heroStats !== undefined) global.inMemorySettings.heroStats = heroStats
            if (servicesHeading !== undefined) global.inMemorySettings.servicesHeading = servicesHeading
            if (sectionsEnabled !== undefined) global.inMemorySettings.sectionsEnabled = sectionsEnabled
            if (quotes !== undefined) global.inMemorySettings.quotes = quotes
            if (aboutHeading !== undefined) global.inMemorySettings.aboutHeading = aboutHeading
            if (aboutDesc1 !== undefined) global.inMemorySettings.aboutDesc1 = aboutDesc1
            if (aboutDesc2 !== undefined) global.inMemorySettings.aboutDesc2 = aboutDesc2
            if (aboutTags !== undefined) global.inMemorySettings.aboutTags = aboutTags
            if (aboutBadges !== undefined) global.inMemorySettings.aboutBadges = aboutBadges
            if (testimonials !== undefined) global.inMemorySettings.testimonials = testimonials
            if (processSteps !== undefined) global.inMemorySettings.processSteps = processSteps
            if (trustedBy !== undefined) global.inMemorySettings.trustedBy = trustedBy
            if (founders !== undefined) global.inMemorySettings.founders = founders
            if (jobOpenings !== undefined) global.inMemorySettings.jobOpenings = jobOpenings
            settings = global.inMemorySettings
        } else {
            const update = {}
            if (heroStats !== undefined) update.heroStats = heroStats
            if (servicesHeading !== undefined) update.servicesHeading = servicesHeading
            if (sectionsEnabled !== undefined) update.sectionsEnabled = sectionsEnabled
            if (quotes !== undefined) update.quotes = quotes
            if (aboutHeading !== undefined) update.aboutHeading = aboutHeading
            if (aboutDesc1 !== undefined) update.aboutDesc1 = aboutDesc1
            if (aboutDesc2 !== undefined) update.aboutDesc2 = aboutDesc2
            if (aboutTags !== undefined) update.aboutTags = aboutTags
            if (aboutBadges !== undefined) update.aboutBadges = aboutBadges
            if (testimonials !== undefined) update.testimonials = testimonials
            if (processSteps !== undefined) update.processSteps = processSteps
            if (trustedBy !== undefined) update.trustedBy = trustedBy
            if (founders !== undefined) update.founders = founders
            if (jobOpenings !== undefined) update.jobOpenings = jobOpenings
            settings = await Settings.findOneAndUpdate({}, update, { new: true, upsert: true })
        }
        res.json({ success: true, settings })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// PUT /api/admin/update-credentials
router.put('/update-credentials', auth, async(req, res) => {
    try {
        const { username, password, newPassword } = req.body
        const currentUsername = process.env.ADMIN_USERNAME || 'admin'
        const currentPassword = process.env.ADMIN_PASSWORD || 'PaviqLabs@2025'

        // Verify current password
        if (password !== currentPassword) {
            return res.status(401).json({ message: 'Current password incorrect.' })
        }

        // Update credentials
        if (username) process.env.ADMIN_USERNAME = username
        if (newPassword) process.env.ADMIN_PASSWORD = newPassword

        res.json({ success: true, message: 'Credentials updated. Please use new ones next time you login.' })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// POST /api/admin/insights
router.post('/insights', auth, async(req, res) => {
    try {
        const { category, title, excerpt, date, readTime, icon, bg, image } = req.body
        let insight
        if (!process.env.MONGODB_URI && global.inMemoryInsights) {
            insight = {
                _id: Date.now().toString(),
                category,
                title,
                excerpt,
                date,
                readTime,
                icon: icon || '💡',
                bg: bg || 'linear-gradient(135deg, #0D1B3E, #162040)',
                image,
                createdAt: new Date()
            }
            global.inMemoryInsights.push(insight)
        } else {
            insight = await Insight.create({ category, title, excerpt, date, readTime, icon, bg, image })
        }
        res.json({ success: true, insight })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// PUT /api/admin/insights/:id
router.put('/insights/:id', auth, async(req, res) => {
    try {
        const { category, title, excerpt, date, readTime, icon, bg, image } = req.body
        let insight
        if (!process.env.MONGODB_URI && global.inMemoryInsights) {
            const idx = global.inMemoryInsights.findIndex(i => i._id === req.params.id)
            if (idx !== -1) {
                global.inMemoryInsights[idx] = {...global.inMemoryInsights[idx], category, title, excerpt, date, readTime, icon, bg, image }
                insight = global.inMemoryInsights[idx]
            }
        } else {
            insight = await Insight.findByIdAndUpdate(req.params.id, { category, title, excerpt, date, readTime, icon, bg, image }, { new: true })
        }
        res.json({ success: true, insight })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE /api/admin/insights/:id
router.delete('/insights/:id', auth, async(req, res) => {
    try {
        if (!process.env.MONGODB_URI && global.inMemoryInsights) {
            global.inMemoryInsights = global.inMemoryInsights.filter(i => i._id !== req.params.id)
        } else {
            await Insight.findByIdAndDelete(req.params.id)
        }
        res.json({ success: true })
    } catch {
        res.status(500).json({ message: 'Server error' })
    }
})

// POST /api/admin/hero-images
router.post('/hero-images', auth, async(req, res) => {
    try {
        const { title, image, xPos, yPos, scale } = req.body
        let heroImage
        if (!process.env.MONGODB_URI && global.inMemoryHeroImages) {
            heroImage = { _id: Date.now().toString(), title, image, xPos: xPos || 50, yPos: yPos || 50, scale: scale || 1, createdAt: new Date() }
            global.inMemoryHeroImages.push(heroImage)
        } else {
            heroImage = await HeroImage.create({ title, image, xPos, yPos, scale })
        }
        res.json({ success: true, heroImage })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE /api/admin/hero-images/:id
router.delete('/hero-images/:id', auth, async(req, res) => {
    try {
        if (!process.env.MONGODB_URI && global.inMemoryHeroImages) {
            global.inMemoryHeroImages = global.inMemoryHeroImages.filter(i => i._id !== req.params.id)
        } else {
            await HeroImage.findByIdAndDelete(req.params.id)
        }
        res.json({ success: true })
    } catch {
        res.status(500).json({ message: 'Server error' })
    }
})

// POST /api/admin/services
router.post('/services', auth, async(req, res) => {
    try {
        const { num, icon, title, desc, tags } = req.body
        let service
        if (!process.env.MONGODB_URI && global.inMemoryServices) {
            service = { _id: Date.now().toString(), num, icon, title, desc, tags, createdAt: new Date() }
            global.inMemoryServices.push(service)
        } else {
            service = await Service.create({ num, icon, title, desc, tags })
        }
        res.json({ success: true, service })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// PUT /api/admin/services/:id
router.put('/services/:id', auth, async(req, res) => {
    try {
        const { num, icon, title, desc, tags } = req.body
        let service
        if (!process.env.MONGODB_URI && global.inMemoryServices) {
            const idx = global.inMemoryServices.findIndex(s => s._id === req.params.id)
            if (idx !== -1) {
                global.inMemoryServices[idx] = {...global.inMemoryServices[idx], num, icon, title, desc, tags }
                service = global.inMemoryServices[idx]
            }
        } else {
            service = await Service.findByIdAndUpdate(req.params.id, { num, icon, title, desc, tags }, { new: true })
        }
        res.json({ success: true, service })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE /api/admin/services/:id
router.delete('/services/:id', auth, async(req, res) => {
    try {
        if (!process.env.MONGODB_URI && global.inMemoryServices) {
            global.inMemoryServices = global.inMemoryServices.filter(s => s._id !== req.params.id)
        } else {
            await Service.findByIdAndDelete(req.params.id)
        }
        res.json({ success: true })
    } catch {
        res.status(500).json({ message: 'Server error' })
    }
})

// PATCH /api/admin/toggle-visibility/:type/:id
router.patch('/toggle-visibility/:type/:id', auth, async(req, res) => {
    const { type, id } = req.params
    try {
        let model
        let memoryArr
        if (type === 'projects') {
            model = Project
            memoryArr = 'inMemoryProjects'
        } else if (type === 'services') {
            model = Service
            memoryArr = 'inMemoryServices'
        } else if (type === 'insights') {
            model = Insight
            memoryArr = 'inMemoryInsights'
        } else {
            return res.status(400).json({ message: 'Invalid type' })
        }

        if (!process.env.MONGODB_URI && global[memoryArr]) {
            const item = global[memoryArr].find(i => i._id === id)
            if (item) {
                item.enabled = item.enabled === false ? true : false
                return res.json({ success: true, enabled: item.enabled })
            }
        } else {
            const item = await model.findById(id)
            if (item) {
                item.enabled = !item.enabled
                await item.save()
                return res.json({ success: true, enabled: item.enabled })
            }
        }
        res.status(404).json({ message: 'Item not found' })
    } catch (err) {
        console.error('Toggle error:', err)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router