import mongoose from 'mongoose'

const SettingsSchema = new mongoose.Schema({
  // ─── Visibility ───
  sectionsEnabled: {
    about: { type: Boolean, default: true },
    services: { type: Boolean, default: true },
    process: { type: Boolean, default: true },
    testimonials: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    trustedBy: { type: Boolean, default: true },
    founders: { type: Boolean, default: true },
    careers: { type: Boolean, default: true }
  },

  // ─── Quotes ───
  quotes: {
    hero: { type: String },
    about: { type: String },
    footer: { type: String },
    businessCard: { type: String },
    emailSignature: { type: String },
    socialMedia: { type: String }
  },

  // ─── Hero Stats ───
  heroStats: [{
    value: { type: String, required: true },
    suffix: { type: String, default: '' },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true }
  }],

  // ─── Services Section ───
  servicesHeading: { type: String, default: 'Services built for scale.' },

  // ─── About Section ───
  aboutHeading: { type: String, default: 'Where engineering meets design excellence.' },
  aboutDesc1: { type: String, default: "PaviqLabs is a technology company built by builders. We combine deep engineering expertise with a product mindset to deliver solutions that scale, perform, and impress. From early-stage startups to enterprise clients, we're the team that makes it happen." },
  aboutDesc2: { type: String, default: 'Our philosophy is simple: understand the problem deeply, design with precision, build with care, and ship with confidence.' },
  aboutTags: [{ type: String }],
  aboutBadges: [{
    label: { type: String },
    value: { type: String },
    suffix: { type: String, default: '' },
    enabled: { type: Boolean, default: true }
  }],

  // ─── Testimonials ───
  testimonials: [{
    text: { type: String },
    name: { type: String },
    role: { type: String },
    initials: { type: String },
    stars: { type: Number, default: 5 },
    enabled: { type: Boolean, default: true }
  }],

  // ─── Process Steps ───
  processSteps: [{
    num: { type: String },
    icon: { type: String },
    title: { type: String },
    desc: { type: String },
    enabled: { type: Boolean, default: true }
  }],

  // ─── Trusted By ───
  trustedBy: [{
    name: { type: String },
    logo: { type: String, default: '' },
    enabled: { type: Boolean, default: true }
  }],

  // ─── Team / Founders ───
  founders: [{
    initials: { type: String },
    name: { type: String },
    role: { type: String },
    bio: { type: String },
    linkedin: { type: String },
    tags: [{ type: String }],
    enabled: { type: Boolean, default: true }
  }],

  // ─── Job Openings ───
  jobOpenings: [{
    title: { type: String },
    type: { type: String },
    location: { type: String },
    dept: { type: String },
    enabled: { type: Boolean, default: true }
  }],

}, { timestamps: true })

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema)
