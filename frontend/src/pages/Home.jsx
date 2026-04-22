import { useEffect, useState } from 'react'
import api from '../utils/api.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import AboutSection from '../components/AboutSection.jsx'
import ContactSection from '../components/ContactSection.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { marqueeItems, processSteps, founders, trustedBy, jobOpenings } from '../utils/site.js'

const isEnabled = (item) => item?.enabled !== false

export default function Home() {
  const [projectsList, setProjectsList] = useState([])
  const [insights, setInsights] = useState([])
  const [servicesList, setServicesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useReveal([projectsList, insights, servicesList, loading])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [p, i, s] = await Promise.all([
          api.get('/projects'),
          api.get('/insights'),
          api.get('/services'),
        ])
        setProjectsList(p.data.projects || [])
        setInsights(i.data.insights || [])
        setServicesList(s.data.services || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const services = servicesList.filter(isEnabled)
  const projects = projectsList.filter(isEnabled)
  const blogInsights = insights.filter(isEnabled)
  const openRoles = jobOpenings.filter((j) => j.enabled)
  const trusted = trustedBy.filter(Boolean)

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>
  }

  if (error) {
    return <div style={{ padding: '100px', textAlign: 'center', color: 'red' }}>{error}</div>
  }

  return (
    <>
      <Navbar />
      <Hero />

      <div className="marquee-section marquee-section--ribbon" aria-label="Capabilities">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item">{item}</div>
          ))}
        </div>
      </div>

      <AboutSection />

      <section id="services">
        <div className="section-shell">
          <div className="services-header">
            <div>
              <div className="section-eyebrow reveal">What we do</div>
              <h2 className="section-title reveal reveal-delay-1">Services built for scale.</h2>
            </div>
            <a href="#contact" className="btn-primary reveal reveal-delay-2" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.78rem' }}>
              Work With Us →
            </a>
          </div>
          {services.length === 0 ? (
            <div className="services-placeholder reveal reveal-delay-2">Services coming soon.</div>
          ) : (
            <div className="services-grid reveal reveal-delay-2">
              {services.map((s) => (
                <div key={s._id} className="service-card">
                  <div className="service-icon" aria-hidden>◆</div>
                  <h3 className="service-title">{s.title}</h3>
                  <p className="service-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="unified-eng-section" id="engineering">
        <div className="pipeline-grid-bg" aria-hidden />
        <div className="eng-container">
          <header className="eng-hero-head reveal">
            <p className="eng-hero-kicker">— Engineering excellence</p>
            <h2 className="eng-hero-title">Built for Reliability &amp; Growth.</h2>
            <p className="eng-hero-desc">
              We don&apos;t fake scale. We build systems using real-world tools and proven methodologies that ensure
              your product is secure, stable, and ready to grow.
            </p>
          </header>

          <div className="eng-visual-flow">
            <article className="eng-card card-security reveal">
              <span className="tier-badge">Security first</span>
              <div className="eng-icon-box" aria-hidden>🛡️</div>
              <h3 className="eng-label">Hardened Security</h3>
              <p className="eng-sublabel">Zero-trust architecture. Always.</p>
              <div className="tech-stack-list">
                <div className="tech-stack-group">
                  <div className="tech-stack-title">Identity &amp; access</div>
                  <div className="tech-stack-item">HashiCorp Vault, Keycloak / Auth0, AWS IAM + RBAC</div>
                </div>
                <div className="tech-stack-group">
                  <div className="tech-stack-title">App security</div>
                  <div className="tech-stack-item">Snyk / SonarQube, OWASP Top 10, Trivy container security</div>
                </div>
              </div>
              <div className="eng-terminal">
                <div className="terminal-line"><span>&gt; stack</span><span>Vault + Keycloak + Snyk</span></div>
                <div className="terminal-line"><span>&gt; approach</span><span>Zero-trust architecture</span></div>
                <div className="terminal-line highlight"><span>&gt; audit</span><span>OWASP hardened</span></div>
              </div>
            </article>

            <article className="eng-card card-database reveal reveal-delay-1">
              <span className="tier-badge">Reliable data</span>
              <div className="eng-icon-box" aria-hidden>🗄️</div>
              <h3 className="eng-label">Data Infrastructure</h3>
              <p className="eng-sublabel">Honest, scalable stacks.</p>
              <div className="tech-stack-list">
                <div className="tech-stack-group">
                  <div className="tech-stack-title">Primary stack</div>
                  <div className="tech-stack-item">PostgreSQL / MongoDB Atlas, Redis caching layer</div>
                </div>
                <div className="tech-stack-group">
                  <div className="tech-stack-title">Scaling</div>
                  <div className="tech-stack-item">Horizontal sharding ready, read replicas &amp; load balancing</div>
                </div>
                <div className="tech-stack-group">
                  <div className="tech-stack-title">Backup &amp; recovery</div>
                  <div className="tech-stack-item">Automated daily backups, point-in-time recovery (PITR)</div>
                </div>
              </div>
              <div className="eng-terminal">
                <div className="terminal-line"><span>&gt; primary</span><span>PostgreSQL / MongoDB</span></div>
                <div className="terminal-line"><span>&gt; caching</span><span>Redis</span></div>
                <div className="terminal-line highlight"><span>&gt; scaling</span><span>Horizontal scaling</span></div>
              </div>
            </article>

            <article className="eng-card card-delivery reveal reveal-delay-2">
              <span className="tier-badge">Modern DevOps</span>
              <div className="eng-icon-box" aria-hidden>🚀</div>
              <h3 className="eng-label">Reliable Delivery</h3>
              <p className="eng-sublabel">Automated pipelines. No surprises.</p>
              <div className="tech-stack-list">
                <div className="tech-stack-group">
                  <div className="tech-stack-title">Infrastructure</div>
                  <div className="tech-stack-item">AWS / GCP + Kubernetes (EKS/GKE), Terraform IaC</div>
                </div>
                <div className="tech-stack-group">
                  <div className="tech-stack-title">Pipeline</div>
                  <div className="tech-stack-item">GitHub Actions / GitLab CI, ArgoCD (GitOps)</div>
                </div>
                <div className="tech-stack-group">
                  <div className="tech-stack-title">Observability</div>
                  <div className="tech-stack-item">Prometheus + Grafana, OpenTelemetry</div>
                </div>
              </div>
              <div className="eng-terminal">
                <div className="terminal-line"><span>&gt; infra</span><span>AWS / GCP + Kubernetes</span></div>
                <div className="terminal-line"><span>&gt; pipeline</span><span>GitHub Actions → ArgoCD</span></div>
                <div className="terminal-line highlight"><span>&gt; deploy</span><span>Blue-green, zero downtime</span></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="process">
        <div className="section-shell">
          <div className="process-section-head reveal">
            <div className="section-eyebrow">How we work</div>
            <h2 className="section-title">A process built on clarity.</h2>
            <p className="section-desc">
              No black boxes. No surprises. Every engagement follows a proven framework that keeps you in control
              and us accountable.
            </p>
          </div>
          <div className="process-steps process-steps--tight">
          {processSteps.map((step, idx) => (
            <div key={step.num} className={`process-step reveal reveal-delay-${Math.min(idx + 1, 4)}`}>
              <div className="process-step-num">{step.num}</div>
              <div className="process-step-icon" aria-hidden>{step.icon}</div>
              <h3 className="process-step-title">{step.title}</h3>
              <p className="process-step-desc">{step.desc}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="section-shell">
          <div className="section-eyebrow reveal">Work</div>
          <h2 className="section-title reveal reveal-delay-1">Selected builds.</h2>
          <p className="section-desc reveal reveal-delay-2">Products and platforms we&apos;ve shipped with our partners.</p>
          {projects.length === 0 ? (
            <div className="services-placeholder reveal reveal-delay-2" style={{ marginTop: '2.5rem' }}>
              Case studies coming soon.
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((p) => (
                <div key={p._id} className="project-card reveal">
                  <div className="project-info">
                    <h3 className="project-title">{p.name}</h3>
                    <p className="project-desc">{p.useCase}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="testimonials">
        <div className="section-shell">
          <div className="section-eyebrow reveal">Client stories</div>
          <h2 className="section-title reveal reveal-delay-1">What our clients say.</h2>
          <div className="services-placeholder reveal reveal-delay-2" style={{ marginTop: '2.5rem' }}>
            waiting for 1st feedback
          </div>
        </div>
      </section>

      <section id="blog">
        <div className="section-shell">
          <div className="section-eyebrow reveal">Insights</div>
          <h2 className="section-title reveal reveal-delay-1">From our engineers.</h2>
          <p className="section-desc reveal reveal-delay-2">Thoughts, tutorials, and deep-dives from the PaviqLabs team.</p>
          {blogInsights.length === 0 ? (
            <div className="services-placeholder reveal reveal-delay-2" style={{ marginTop: '2.5rem' }}>
              More insights coming soon.
            </div>
          ) : (
            <div className="blog-grid">
              {blogInsights.map((post) => (
                <article key={post._id} className="blog-card reveal">
                  <div className="blog-content">
                    <div className="blog-category">Engineering</div>
                    <h3 className="blog-title">{post.title}</h3>
                    <p className="blog-excerpt">{post.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="trusted">
        <div className="section-shell">
          <div className="section-eyebrow reveal">Trusted by</div>
          <h2 className="section-title reveal reveal-delay-1">Companies that trust us.</h2>
          {trusted.length === 0 ? (
            <p className="section-desc reveal reveal-delay-2" style={{ margin: '2rem auto 0', textAlign: 'center', maxWidth: '560px' }}>
              Logos and partner stories will appear here as we publish them.
            </p>
          ) : (
            <div className="trusted-logos">
              {trusted.map((logo) => (
                <div key={logo.name} className="trusted-logo-card reveal">
                  <span className="trusted-logo-name">{logo.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="founders">
        <div className="section-shell">
          <div className="section-eyebrow reveal">The team</div>
          <h2 className="section-title reveal reveal-delay-1">Built by founders, for founders.</h2>
          <p className="section-desc reveal reveal-delay-2">
            PaviqLabs is led by technologists who have built products from zero to scale.
          </p>
          <div className="founders-grid">
            {founders.map((f, idx) => (
              <div key={f.name} className={`founder-card reveal reveal-delay-${Math.min(idx + 1, 3)}`}>
                <div className="founder-avatar" style={{ fontFamily: 'Georgia, serif' }}>{f.initials}</div>
                <h3 className="founder-name">{f.name}</h3>
                <p className="founder-role">{f.role}</p>
                <p className="founder-bio">{f.bio}</p>
                {f.tags?.length > 0 && (
                  <div className="founder-tags">
                    {f.tags.map((t) => (
                      <span key={t} className="founder-tag">{t}</span>
                    ))}
                  </div>
                )}
                <div className="founder-social">
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${f.name} on LinkedIn`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57A1.46 1.46 0 0 1 14.38 12.11A1.46 1.46 0 0 1 15.84 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="careers">
        <div className="section-shell careers-intro">
          <div className="section-eyebrow reveal">Careers</div>
          <h2 className="section-title reveal reveal-delay-1">Join the team.</h2>
          <p className="section-desc reveal reveal-delay-2" style={{ maxWidth: '560px' }}>
            We&apos;re building the future of technology. If you&apos;re exceptional and driven, there&apos;s a place for you at PaviqLabs.
          </p>
          {openRoles.length === 0 ? (
            <p
              className="reveal reveal-delay-2"
              style={{
                marginTop: '3rem',
                textAlign: 'center',
                color: 'var(--mid-gray)',
                fontStyle: 'italic',
                fontSize: '0.95rem',
              }}
            >
              No open roles currently. Check back later!
            </p>
          ) : (
            <div className="jobs-grid">
              {openRoles.map((job) => (
                <div key={job.title} className="job-card reveal">
                  <div className="job-left">
                    <div className="job-title">{job.title}</div>
                    <div className="job-meta">
                      <span className="job-badge type">{job.type}</span>
                      <span className={`job-badge ${job.location === 'Remote' ? 'remote' : ''}`}>{job.location}</span>
                    </div>
                  </div>
                  <a href="#contact" className="job-apply">Apply</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactSection />
      <Footer />
    </>
  )
}
