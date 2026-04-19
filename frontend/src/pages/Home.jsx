import { useEffect, useState } from 'react'
import api from '../utils/api.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import ContactSection from '../components/ContactSection.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { marqueeItems } from '../utils/site.js'

const DEFAULT_SETTINGS = {
  sectionsEnabled: { about: true, services: true, process: true, testimonials: true, blog: true, trustedBy: true, founders: true, careers: true },
  quotes: {
    hero: 'Speed without security is a gamble. Security without speed is a cage. We give you both.',
    about: "We don't just build your technology — we become its guardian, its engine, and its compass.",
    footer: '',
    businessCard: '',
    emailSignature: '',
    socialMedia: ''
  },
  servicesHeading: 'Services built for scale.',
  aboutHeading: 'Where engineering meets design excellence.',
  aboutDesc1: "PaviqLabs is a technology company built by builders. We combine deep engineering expertise with a product mindset to deliver solutions that scale, perform, and impress. From early-stage startups to enterprise clients, we're the team that makes it happen.",
  aboutDesc2: 'Our philosophy is simple: understand the problem deeply, design with precision, build with care, and ship with confidence.',
  aboutTags: ['React & Next.js', 'Node.js', 'AWS / GCP', 'React Native', 'Python & AI', 'Cybersecurity', 'Figma', 'DevOps'],
  aboutBadges: [
    { label: 'Projects Delivered', value: '10', suffix: '+', enabled: true },
    { label: 'Client Satisfaction', value: '100', suffix: '%', enabled: true }
  ],
  testimonials: [
    { text: 'PaviqLabs transformed our digital infrastructure in just 3 months. The attention to detail and technical depth is unmatched. Our platform now handles 10x the load with zero downtime.', name: 'Arjun Mehta', role: 'CTO, FinNova Solutions', initials: 'AM', stars: 5, enabled: true },
    { text: 'Working with PaviqLabs was a game-changer. They delivered a cybersecurity audit that uncovered critical vulnerabilities and provided actionable recommendations our team could act on immediately.', name: 'Priya Sharma', role: 'CISO, HealthBridge India', initials: 'PS', stars: 5, enabled: true },
    { text: 'The mobile app they built for us exceeded all expectations. Clean code, beautiful UI, and they genuinely understood our users. Highly recommend for any serious digital project.', name: 'Rahul Gupta', role: 'Founder, RetailEdge', initials: 'RG', stars: 5, enabled: true }
  ],
  processSteps: [
    { num: '01', icon: '🔍', title: 'Discover & Assess', desc: 'We map your requirements, infrastructure, and security posture before touching a single tool.', enabled: true },
    { num: '02', icon: '🛠️', title: 'Plan & Architect', desc: 'We design a secure, scalable solution — cloud setup, pipelines, and tech stack — before we build.', enabled: true },
    { num: '03', icon: '⚡', title: 'Build & Secure', desc: 'Development and security run in parallel — not as an afterthought. Every sprint ships tested, hardened code.', enabled: true },
    { num: '04', icon: '🚀', title: 'Deploy & Monitor', desc: 'CI/CD deployment, live monitoring, and continuous security checks — long after go-live.', enabled: true }
  ],
  trustedBy: [],
  founders: [
    { 
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
  jobOpenings: [
    { title: 'Senior Full-Stack Developer', type: 'Full-Time', location: 'Remote', dept: 'Engineering', enabled: true },
    { title: 'Cybersecurity Analyst', type: 'Full-Time', location: 'Hybrid', dept: 'Security', enabled: true },
    { title: 'AI/ML Engineer', type: 'Full-Time', location: 'Remote', dept: 'AI Research', enabled: true },
    { title: 'UI/UX Designer', type: 'Full-Time', location: 'Remote', dept: 'Design', enabled: true },
    { title: 'DevOps Engineer', type: 'Contract', location: 'Remote', dept: 'Infrastructure', enabled: true }
  ]
}

// helper: item is enabled if enabled is undefined (old data) or true
const isEnabled = (item) => item.enabled !== false

export default function Home() {
  const [projectsList, setProjectsList] = useState([])
  const [insights, setInsights] = useState([])
  const [servicesList, setServicesList] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  useReveal([projectsList, insights, servicesList, settings])

  useEffect(() => {
    api.get('/projects').then(res => setProjectsList(res.data.projects)).catch(() => {})
    api.get('/insights').then(res => setInsights(res.data.insights)).catch(() => {})
    api.get('/services').then(res => {
      if (res.data.services?.length > 0) setServicesList(res.data.services)
    }).catch(() => {})
    api.get('/settings').then(res => {
      if (res.data.settings) setSettings(prev => ({ ...prev, ...res.data.settings }))
    }).catch(() => {})
  }, [])

  // Resolved data — filtered by enabled flags
  const sec = { ...DEFAULT_SETTINGS.sectionsEnabled, ...(settings.sectionsEnabled || {}) }
  const aboutBadges   = (settings.aboutBadges   || DEFAULT_SETTINGS.aboutBadges).filter(isEnabled)
  const aboutTags     = settings.aboutTags       || DEFAULT_SETTINGS.aboutTags
  const testimonials  = (settings.testimonials   || DEFAULT_SETTINGS.testimonials).filter(isEnabled)
  const processSteps  = (settings.processSteps   || DEFAULT_SETTINGS.processSteps).filter(isEnabled)
  // trustedBy may be strings (old) or objects (new) — normalise
  const trustedByRaw  = settings.trustedBy       || DEFAULT_SETTINGS.trustedBy
  const trustedBy     = trustedByRaw.map(t => typeof t === 'string' ? { name: t, enabled: true, logo: '' } : t).filter(isEnabled)
  const founders      = (settings.founders       || DEFAULT_SETTINGS.founders).filter(isEnabled)
  const jobOpenings   = (settings.jobOpenings    || DEFAULT_SETTINGS.jobOpenings).filter(isEnabled)
  const services      = servicesList.filter(isEnabled)
  const projects      = projectsList.filter(isEnabled)
  const blogInsights  = insights.filter(isEnabled)
  const aboutQuote    = settings.quotes?.about   || DEFAULT_SETTINGS.quotes.about

  return (
    <>
      <Navbar />
      <Hero />

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item">{item}</div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      {sec.about && (
        <section id="about">
          <div className="about-grid">
            <div className="about-visual reveal">
              <div className="about-card-main">
                <img src="/logo.png" alt="PaviqLabs" className="about-logo-image" />
              </div>
              {aboutBadges.map((badge, i) => (
                <div key={i} className={`about-badge about-badge-${i + 1}`}>
                  <div className="about-badge-label">{badge.label}</div>
                  <div className="about-badge-val">{badge.value}<span>{badge.suffix}</span></div>
                </div>
              ))}
            </div>
            <div className="about-content">
              <div className="section-eyebrow reveal">About Us</div>
              <h2 className="section-title reveal reveal-delay-1">
                {settings.aboutHeading || DEFAULT_SETTINGS.aboutHeading}
              </h2>
              <p className="section-desc reveal reveal-delay-2">
                {settings.aboutDesc1 || DEFAULT_SETTINGS.aboutDesc1}
              </p>
              <p className="section-desc reveal reveal-delay-3" style={{ marginTop: '1rem' }}>
                {settings.aboutDesc2 || DEFAULT_SETTINGS.aboutDesc2}
              </p>
              {/* About Quote */}
              <blockquote className="reveal reveal-delay-4" style={{
                margin: '1.5rem 0 0',
                padding: '1rem 1.25rem',
                borderLeft: '3px solid #C9A84C',
                background: 'rgba(201,168,76,0.06)',
                borderRadius: '0 10px 10px 0',
                fontStyle: 'italic',
                fontSize: '0.97rem',
                lineHeight: 1.7,
                color: 'rgba(13,27,62,0.75)',
                fontFamily: '"DM Sans", sans-serif'
              }}>
                &ldquo;{aboutQuote}&rdquo;
              </blockquote>
              <div className="tags reveal reveal-delay-4" style={{ marginTop: '1.4rem' }}>
                {aboutTags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SERVICES */}
      {sec.services && (
        <section id="services">
          <div className="services-header">
            <div>
              <div className="section-eyebrow reveal">What We Do</div>
              <h2 className="section-title reveal reveal-delay-1">{settings.servicesHeading || 'Services built for scale.'}</h2>
            </div>
            <a href="#contact" className="btn-primary reveal reveal-delay-2">Work With Us →</a>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={s._id || s.num} className="service-card reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="service-num">{s.num}</div>
                <div className="service-icon">{s.icon}</div>
                <div className="service-title">{s.title}</div>
                <div className="service-desc">{s.desc}</div>
                <div className="service-tags">
                  {(s.tags || []).map(t => <span key={t} className="service-tag">{t}</span>)}
                </div>
              </div>
            ))}
            {services.length === 0 && (
              <div className="reveal" style={{ textAlign: 'center', color: '#9A9990', padding: '3rem 0', gridColumn: '1 / -1' }}>Services coming soon.</div>
            )}
          </div>
        </section>
      )}

      {/* PROCESS */}
      {sec.process && (
        <section id="process">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-eyebrow reveal">How We Work</div>
            <h2 className="section-title reveal reveal-delay-1">A process built on clarity.</h2>
            <p className="section-desc reveal reveal-delay-2">
              No black boxes. No surprises. Every engagement follows a proven framework that keeps you in control and us accountable.
            </p>
            <div className="process-steps">
              {processSteps.map((step, i) => (
                <div key={step.num} className="process-step reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="process-step-num">{step.num}</div>
                  <div className="process-step-icon">{step.icon}</div>
                  <div className="process-step-title">{step.title}</div>
                  <div className="process-step-desc">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {sec.projects && (
        <section id="projects">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-eyebrow reveal">Our Work</div>
            <h2 className="section-title reveal reveal-delay-1">Projects we're proud of.</h2>
            <p className="section-desc reveal reveal-delay-2">A selection of products and platforms we've designed, built, and shipped.</p>
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div key={p._id || p.name} className="project-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="project-visual" style={{ background: p.bg || 'linear-gradient(135deg, #0D1B3E 0%, #162040 100%)', position: 'relative', overflow: 'hidden' }}>
                  {p.image ? <img src={p.image} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, mixBlendMode: 'luminosity' }} alt={p.name} />
                    : p.link ? <img src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(p.link)}?w=800`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, mixBlendMode: 'luminosity' }} alt={p.name} /> : null}
                  <div className="project-visual-badge" style={{ color: p.color || '#C9A84C', position: 'relative', zIndex: 2 }}>{p.domain}</div>
                  {(!p.image && !p.link) && <div className="project-visual-icon" style={{ position: 'relative', zIndex: 2 }}>{p.icon || '🚀'}</div>}
                </div>
                <div className="project-info">
                  <div className="project-title">{p.name}</div>
                  <div className="project-desc">{p.useCase}</div>
                  <div className="project-tech">{p.techStack.map(t => <span key={t} className="project-tech-pill">{t}</span>)}</div>
                  {p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-cta" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>Visit Project →</a>
                    : <button className="project-cta" style={{ marginTop: '1rem' }}>View Case Study →</button>}
                </div>
              </div>
            ))}
            {projects.length === 0 && <div className="reveal" style={{ textAlign: 'center', color: '#9A9990', padding: '3rem 0', gridColumn: '1 / -1' }}>More projects coming soon.</div>}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {sec.testimonials && (
        <section id="testimonials">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-eyebrow reveal">Client Stories</div>
            <h2 className="section-title reveal reveal-delay-1">What our clients say.</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={t.name + i} className="testimonial-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="testimonial-stars">{Array.from({ length: t.stars || 5 }).map((_, j) => <span key={j} className="testimonial-star">★</span>)}</div>
                <div className="testimonial-quote">"</div>
                <div className="testimonial-text">{t.text}</div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div><div className="testimonial-name">{t.name}</div><div className="testimonial-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BLOG */}
      {sec.blog && (
        <section id="blog">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-eyebrow reveal">Insights</div>
            <h2 className="section-title reveal reveal-delay-1">From our engineers.</h2>
            <p className="section-desc reveal reveal-delay-2">Thoughts, tutorials, and deep-dives from the PaviqLabs team.</p>
          </div>
          <div className="blog-grid">
            {blogInsights.map((post, i) => (
              <div key={post._id || post.title} className="blog-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="blog-thumb" style={{ background: post.bg, position: 'relative', overflow: 'hidden' }}>
                  {post.image ? <img src={post.image} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt={post.title} />
                    : <span style={{ fontSize: '2.5rem', position: 'relative', zIndex: 2 }}>{post.icon}</span>}
                </div>
                <div className="blog-content">
                  <div className="blog-category">{post.category}</div>
                  <div className="blog-title">{post.title}</div>
                  <div className="blog-excerpt">{post.excerpt}</div>
                  <div className="blog-meta"><span className="blog-date">{post.date}</span><button className="blog-read">{post.readTime} →</button></div>
                </div>
              </div>
            ))}
            {blogInsights.length === 0 && <div className="reveal" style={{ textAlign: 'center', color: '#9A9990', padding: '3rem 0', gridColumn: '1 / -1' }}>More insights coming soon.</div>}
          </div>
        </section>
      )}

      {/* TRUSTED BY */}
      {sec.trustedBy && (
        <section id="trusted">
          <div className="section-eyebrow">Trusted By</div>
          <h2 className="section-title reveal" style={{ textAlign: 'center' }}>Companies that trust us.</h2>
          <div className="trusted-logos">
            {trustedBy.map((item, i) => (
              <div key={(item.name || item) + i} className="trusted-logo-card reveal">
                {item.logo ? (
                  <img src={item.logo} alt={item.name || 'Partner'} className="trusted-logo-img" />
                ) : (
                  <div className="trusted-logo-name">{item.name || item}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOUNDERS */}
      {sec.founders && (
        <section id="founders">
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-eyebrow reveal">The Team</div>
            <h2 className="section-title reveal reveal-delay-1">Built by founders, for founders.</h2>
            <p className="section-desc reveal reveal-delay-2">PaviqLabs is led by technologists who have built products from zero to scale.</p>
          </div>
          <div className="founders-grid">
            {founders.map((f, i) => (
              <div key={f.name + i} className={`founder-card reveal reveal-delay-${i + 1}`}>
                <div className="founder-avatar">{f.initials}</div>
                <div className="founder-name">{f.name}</div>
                <div className="founder-role">{f.role}</div>
                <div className="founder-divider" />
                <div className="founder-bio">{f.bio}</div>
                {f.tags && f.tags.length > 0 && (
                  <div className="founder-tags">
                    {f.tags.map((tag, idx) => (
                      <span key={idx} className="founder-tag">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="founder-social">
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57A1.46 1.46 0 0 1 14.38 12.11A1.46 1.46 0 0 1 15.84 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CAREERS */}
      {sec.careers && (
        <section id="careers">
          <div className="careers-intro">
            <div className="section-eyebrow reveal">Careers</div>
            <h2 className="section-title reveal reveal-delay-1">Join the team.</h2>
            <p className="section-desc reveal reveal-delay-2">We're building the future of technology. If you're exceptional and driven, there's a place for you at PaviqLabs.</p>
          </div>
          <div className="jobs-grid">
            {jobOpenings.map((job, i) => (
              <div key={job.title + i} className="job-card reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="job-left">
                  <div className="job-title">{job.title}</div>
                  <div className="job-meta">
                    <span className="job-badge">{job.dept}</span>
                    <span className="job-badge type">{job.type}</span>
                    <span className="job-badge remote">{job.location}</span>
                  </div>
                </div>
                <a href="mailto:careers@paviqlabs.in" className="job-apply">Apply Now →</a>
              </div>
            ))}
          </div>
        </section>
      )}

      <ContactSection />
      <Footer />
    </>
  )
}
