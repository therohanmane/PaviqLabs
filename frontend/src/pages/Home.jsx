import { useEffect, useState, useRef } from 'react'
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
  testimonials: [],
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
    { title: 'Senior Full-Stack Developer', type: 'Full-Time', location: 'Remote', dept: 'Engineering', enabled: false },
    { title: 'Cybersecurity Analyst', type: 'Full-Time', location: 'Hybrid', dept: 'Security', enabled: false },
    { title: 'AI/ML Engineer', type: 'Full-Time', location: 'Remote', dept: 'AI Research', enabled: false },
    { title: 'UI/UX Designer', type: 'Full-Time', location: 'Remote', dept: 'Design', enabled: false },
    { title: 'DevOps Engineer', type: 'Contract', location: 'Remote', dept: 'Infrastructure', enabled: false }
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
                <div className="tech-animation-container">
                  <svg viewBox="0 0 400 400" className="tech-universe-svg">
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor:'#C9A84C', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#E8C97A', stopOpacity:1}} />
                      </linearGradient>
                    </defs>

                    {/* ─── DATA ANALYST: Neural Network & Insights ─── */}
                    <g className="data-layer">
                      {[...Array(12)].map((_, i) => (
                        <line key={`node-line-${i}`} 
                          x1={200 + 130 * Math.cos(i * 30 * Math.PI/180)} 
                          y1={200 + 130 * Math.sin(i * 30 * Math.PI/180)}
                          x2={200} y2={200}
                          className="neural-path"
                        />
                      ))}
                      {[...Array(8)].map((_, i) => (
                        <circle key={`data-point-${i}`}
                          cx={200 + 130 * Math.cos(i * 45 * Math.PI/180)}
                          cy={200 + 130 * Math.sin(i * 45 * Math.PI/180)}
                          r="4" className="data-point-pulse"
                        />
                      ))}
                      {/* Dynamic Chart Overlay */}
                      <path d="M120,280 L140,240 L160,260 L180,210 L200,230 L220,180 L240,220 L260,190" 
                        className="analysis-line" fill="none" stroke="url(#gold-grad)" strokeWidth="2" />
                    </g>

                    {/* ─── DEVOPS: Automated Pipeline & Gears ─── */}
                    <g className="devops-layer">
                      <circle cx="200" cy="200" r="100" className="pipeline-orbit" fill="none" stroke="rgba(201,168,76,0.1)" strokeWidth="1" strokeDasharray="10 5" />
                      {[...Array(4)].map((_, i) => (
                        <rect key={`container-${i}`} x="-10" y="-10" width="20" height="20" rx="4"
                          className={`deployment-box box-${i+1}`} fill="rgba(201,168,76,0.2)" stroke="#C9A84C" strokeWidth="1"
                        />
                      ))}
                      {/* Central Gear */}
                      <g className="core-gear">
                        <circle cx="200" cy="200" r="30" fill="none" stroke="#C9A84C" strokeWidth="6" strokeDasharray="15 5" />
                        <circle cx="200" cy="200" r="15" fill="#C9A84C" />
                      </g>
                    </g>

                    {/* ─── CYBERSECURITY: Encryption & Shield ─── */}
                    <g className="cyber-layer">
                      <circle cx="200" cy="200" r="160" className="scanning-radar" fill="none" stroke="rgba(201,168,76,0.05)" strokeWidth="40" />
                      <path d="M160,140 C160,120 240,120 240,140 L240,180 C240,210 200,230 200,230 C200,230 160,210 160,180 Z" 
                        className="master-shield" fill="rgba(13,27,62,0.6)" stroke="#C9A84C" strokeWidth="3" filter="url(#glow)" />
                      {/* Matrix Rain effect inside shield */}
                      <text x="185" y="165" className="binary-stream" fill="#C9A84C" fontSize="10" fontFamily="monospace">1011</text>
                      <text x="185" y="185" className="binary-stream" fill="#C9A84C" fontSize="10" fontFamily="monospace" style={{animationDelay: '0.5s'}}>0101</text>
                    </g>

                    {/* CORE PULSE */}
                    <circle cx="200" cy="200" r="180" className="outer-pulse" fill="none" stroke="rgba(201,168,76,0.03)" strokeWidth="2" />
                  </svg>
                  <div className="tech-status-container">
                    <span className="status-item"><span className="status-dot"></span> SECURE</span>
                    <span className="status-item"><span className="status-dot"></span> DEPLOYED</span>
                    <span className="status-item"><span className="status-dot"></span> ANALYZED</span>
                  </div>
                </div>
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

      {/* ENGINEERING EXCELLENCE SECTION */}
      <section className="unified-eng-section">
        <div className="pipeline-grid-bg"></div>
        <div className="eng-container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div className="section-eyebrow reveal" style={{ color: 'var(--gold)', justifyContent: 'center' }}>Engineering Excellence</div>
            <h2 className="section-title reveal reveal-delay-1" style={{ color: 'var(--white)' }}>Built for Reliability & Growth.</h2>
            <p className="section-desc reveal reveal-delay-2" style={{ color: 'rgba(255,255,255,0.6)', margin: '1.5rem auto 0', maxWidth: '700px' }}>
              We don't fake scale. We build systems using real-world tools and proven methodologies that ensure your product is secure, stable, and ready to grow.
            </p>
          </div>

          <div className="eng-visual-flow">
            {/* Card 1: SECURITY */}
            <div className="eng-card card-security reveal reveal-delay-3">
              <div className="tier-badge">SECURITY FIRST</div>
              <div className="eng-icon-box">🛡️</div>
              <div className="eng-label">Hardened Security</div>
              <div className="eng-sublabel">Zero-trust architecture. Always.</div>
              
              <div className="tech-stack-list">
                <div className="tech-stack-group">
                  <span className="tech-stack-title">🔐 IDENTITY & ACCESS</span>
                  <div className="tech-stack-item">HashiCorp Vault (Secrets)</div>
                  <div className="tech-stack-item">Keycloak / Auth0 (Identity)</div>
                  <div className="tech-stack-item">AWS IAM + RBAC Policies</div>
                </div>
                <div className="tech-stack-group">
                  <span className="tech-stack-title">🛡️ APP SECURITY</span>
                  <div className="tech-stack-item">Snyk / SonarQube Scanning</div>
                  <div className="tech-stack-item">OWASP Top 10 Hardened Builds</div>
                  <div className="tech-stack-item">Trivy Container Security</div>
                </div>
                <div className="tech-stack-group">
                  <span className="tech-stack-title">🌐 NETWORK & COMPLIANCE</span>
                  <div className="tech-stack-item">Cloudflare WAF + DDoS Shield</div>
                  <div className="tech-stack-item">Security-First Engineering Culture</div>
                </div>
              </div>

              <div className="eng-terminal">
                <div className="terminal-line"><span>> stack</span><span>Vault + Keycloak + Snyk</span></div>
                <div className="terminal-line"><span>> approach</span><span>Zero-trust architecture</span></div>
                <div className="terminal-line"><span>> audit</span><span>OWASP Top 10 hardened</span></div>
                <div className="terminal-line highlight"><span>> status</span><span>Security-first from line 1</span></div>
              </div>
            </div>

            {/* Card 2: DATABASE */}
            <div className="eng-card card-database reveal reveal-delay-4">
              <div className="tier-badge">RELIABLE DATA</div>
              <div className="eng-icon-box">🗄️</div>
              <div className="eng-label">Data Infrastructure</div>
              <div className="eng-sublabel">Honest, scalable stacks.</div>

              <div className="tech-stack-list">
                <div className="tech-stack-group">
                  <span className="tech-stack-title">🗄️ PRIMARY STACK</span>
                  <div className="tech-stack-item">PostgreSQL / MongoDB Atlas</div>
                  <div className="tech-stack-item">Redis Caching Layer</div>
                </div>
                <div className="tech-stack-group">
                  <span className="tech-stack-title">📦 SCALING</span>
                  <div className="tech-stack-item">Horizontal Sharding Ready</div>
                  <div className="tech-stack-item">Read Replicas & Load Balancing</div>
                </div>
                <div className="tech-stack-group">
                  <span className="tech-stack-title">☁️ BACKUP & RECOVERY</span>
                  <div className="tech-stack-item">Automated Daily Backups</div>
                  <div className="tech-stack-item">Point-in-Time Recovery (PITR)</div>
                </div>
              </div>

              <div className="eng-terminal">
                <div className="terminal-line"><span>> primary</span><span>PostgreSQL / MongoDB Atlas</span></div>
                <div className="terminal-line"><span>> caching</span><span>Redis</span></div>
                <div className="terminal-line"><span>> scaling</span><span>Horizontal sharding ready</span></div>
                <div className="terminal-line highlight"><span>> backup</span><span>Automated + PITR recovery</span></div>
              </div>
            </div>

            {/* Card 3: DELIVERY */}
            <div className="eng-card card-delivery reveal reveal-delay-5">
              <div className="tier-badge">MODERN DEVOPS</div>
              <div className="eng-icon-box">🚀</div>
              <div className="eng-label">Reliable Delivery</div>
              <div className="eng-sublabel">Automated pipelines. No surprises.</div>

              <div className="tech-stack-list">
                <div className="tech-stack-group">
                  <span className="tech-stack-title">🚀 INFRASTRUCTURE</span>
                  <div className="tech-stack-item">AWS / GCP + Kubernetes (EKS/GKE)</div>
                  <div className="tech-stack-item">Terraform Infrastructure-as-Code</div>
                </div>
                <div className="tech-stack-group">
                  <span className="tech-stack-title">🌍 PIPELINE</span>
                  <div className="tech-stack-item">GitHub Actions / GitLab CI</div>
                  <div className="tech-stack-item">ArgoCD (GitOps Delivery)</div>
                </div>
                <div className="tech-stack-group">
                  <span className="tech-stack-title">📊 OBSERVABILITY</span>
                  <div className="tech-stack-item">Prometheus + Grafana Metrics</div>
                  <div className="tech-stack-item">OpenTelemetry Tracing</div>
                </div>
              </div>

              <div className="eng-terminal">
                <div className="terminal-line"><span>> infra</span><span>AWS / GCP + Kubernetes</span></div>
                <div className="terminal-line"><span>> pipeline</span><span>GitHub Actions → ArgoCD</span></div>
                <div className="terminal-line"><span>> deploy</span><span>Blue-green, zero downtime</span></div>
                <div className="terminal-line highlight"><span>> monitoring</span><span>Grafana + Prometheus</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            {testimonials.length === 0 && (
              <div className="reveal" style={{ 
                textAlign: 'center', 
                color: '#9A9990', 
                padding: '4rem 0', 
                gridColumn: '1 / -1',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                opacity: 0.8
              }}>
                waiting for 1st feedback
              </div>
            )}
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
            {jobOpenings.length === 0 && (
              <div className="reveal" style={{ 
                textAlign: 'center', 
                color: '#9A9990', 
                padding: '3rem 0', 
                gridColumn: '1 / -1',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                opacity: 0.8
              }}>
                No open roles currently. Check back later!
              </div>
            )}
          </div>
        </section>
      )}

      <ContactSection />
      <Footer />
    </>
  )
}
