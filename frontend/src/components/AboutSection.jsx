export default function AboutSection() {
  const tags = [
    'React & Next.js', 'Node.js', 'AWS / GCP', 'React Native',
    'Python & AI', 'Cybersecurity', 'Figma', 'DevOps',
  ]

  return (
    <section id="about">
      <div className="section-shell about-grid">
        <div className="about-visual reveal">
          <div className="about-card-main">
            <svg className="tech-universe-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="200" cy="200" r="160" stroke="rgba(201,168,76,0.2)" strokeWidth="0.75" />
              <circle cx="200" cy="200" r="120" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" strokeDasharray="4 6" />
              <circle cx="200" cy="200" r="80" stroke="rgba(201,168,76,0.12)" strokeWidth="0.5" />
              <path className="neural-path" d="M80 200 Q200 120 320 200 M120 280 Q200 200 280 120" strokeWidth="0.8" fill="none" />
              <circle className="data-point-pulse" cx="120" cy="140" r="3" />
              <circle className="data-point-pulse" cx="290" cy="160" r="3" style={{ animationDelay: '0.5s' }} />
              <circle className="data-point-pulse" cx="200" cy="310" r="3" style={{ animationDelay: '1s' }} />
              <path
                className="master-shield"
                d="M200 88 L268 118 V196 C268 252 240 292 200 312 C160 292 132 252 132 196 V118 L200 88Z"
                stroke="var(--gold)"
                strokeWidth="2"
                fill="rgba(201,168,76,0.08)"
              />
              <path d="M200 130 V250 M170 190 H230" stroke="var(--gold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
            </svg>
            <div className="tech-status-container">
              <span className="status-item">Secure</span>
              <span className="status-item">Deployed</span>
              <span className="status-item">Analyzed</span>
            </div>
          </div>
        </div>

        <div className="about-content reveal reveal-delay-1">
          <div className="section-eyebrow">About us</div>
          <h2 className="section-title">Where engineering meets design excellence.</h2>
          <p className="section-desc" style={{ maxWidth: 'none' }}>
            PaviqLabs pairs deep engineering expertise with a product mindset — so your roadmap stays ambitious,
            your systems stay dependable, and your users stay delighted.
          </p>
          <p className="section-desc" style={{ maxWidth: 'none', marginTop: '1rem' }}>
            From secure cloud foundations to polished interfaces, we ship outcomes you can measure — not slide decks.
          </p>
          <blockquote className="about-quote">
            We don&apos;t just build your technology — we become its guardian, its engine, and its compass.
          </blockquote>
          <div className="tags">
            {tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
