import { useState, useEffect } from 'react'
import api from '../utils/api.js'

const services = [
  'Web Development', 'Mobile App Development', 'Cybersecurity',
  'Cloud Solutions', 'AI & Automation', 'UI/UX Design', 'IT Consulting', 'Other',
]

export default function ContactSection() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', company: '', service: '', otherService: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [businessCard, setBusinessCard] = useState('')
  const [emailSignature, setEmailSignature] = useState('')

  useEffect(() => {
    api.get('/settings').then(res => {
      const q = res.data.settings?.quotes
      if (q?.businessCard) setBusinessCard(q.businessCard)
      if (q?.emailSignature) setEmailSignature(q.emailSignature)
    }).catch(() => {})
  }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.firstName || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const payload = { ...form }
      if (payload.service === 'Other' && payload.otherService) {
        payload.service = `Other: ${payload.otherService}`
      }
      await api.post('/contact', payload)
      setSuccess(true)
      setForm({ firstName: '', lastName: '', email: '', company: '', service: '', otherService: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please email info@paviqlabs.in directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact">
      <div className="contact-grid">
        <div>
          <div className="section-eyebrow reveal">Get In Touch</div>
          <h2 className="section-title reveal reveal-delay-1">Let's build something great together.</h2>
          <p className="section-desc reveal reveal-delay-2" style={{ marginTop: '1rem' }}>
            Whether you have a project in mind or just want to explore possibilities — we'd love to hear from you.
          </p>

          <div className="contact-info reveal reveal-delay-3">
            <div className="contact-info-item">
              <div className="contact-info-icon">✉️</div>
              <div>
                <div className="contact-info-label">Email</div>
                <div className="contact-info-val"><a href="mailto:info@paviqlabs.in">info@paviqlabs.in</a></div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">📞</div>
              <div>
                <div className="contact-info-label">Phone</div>
                <div className="contact-info-val"><a href="tel:+919405980596">+91 9405 980 596</a></div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-info-icon">📍</div>
              <div>
                <div className="contact-info-label">Location</div>
                <div className="contact-info-val">India — Serving Clients Globally</div>
              </div>
            </div>
          </div>

          {/* ── Business Card Quote - Only shows if set in admin ── */}
          {businessCard && (
            <div className="reveal reveal-delay-4" style={{
              margin: '1.8rem 0 0.6rem',
              padding: '1rem 1.25rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(13,27,62,0.18) 100%)',
              border: '1px solid rgba(201,168,76,0.25)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.4rem' }}>
                🪪 PaviqLabs · Our Promise
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F5F4F0', lineHeight: 1.4, fontFamily: '"DM Sans", sans-serif' }}>
                {businessCard}
              </div>
            </div>
          )}

          {/* ── Email Signature - Only shows if set in admin ── */}
          {emailSignature && (
            <div className="reveal reveal-delay-4" style={{
              margin: '0.75rem 0 1.5rem',
              padding: '0.7rem 1rem',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              borderLeft: '2px solid rgba(201,168,76,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', lineHeight: 1.5 }}>
                ✍️ <em>"{emailSignature}"</em>
              </span>
            </div>
          )}

          <div className="contact-social-links reveal reveal-delay-4">
            <a href="https://www.linkedin.com/company/paviqlabs" target="_blank" rel="noopener noreferrer" className="social-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57A1.46 1.46 0 0 1 14.38 12.11A1.46 1.46 0 0 1 15.84 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://wa.me/919405980596" target="_blank" rel="noopener noreferrer" className="social-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        <div className="contact-form reveal reveal-delay-2">
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" placeholder="First Name" value={form.firstName} onChange={set('firstName')} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Last Name" value={form.lastName} onChange={set('lastName')} />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" placeholder="Email Address" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input type="text" placeholder="Company" value={form.company} onChange={set('company')} />
          </div>
          <div className="form-group">
            <label>Service Interested In</label>
            <select value={form.service} onChange={set('service')}>
              <option value="">Select a service...</option>
              {services.map(s => <option key={s}>{s}</option>)}
            </select>
            {form.service === 'Other' && (
              <input
                type="text"
                placeholder="Type other service interested in..."
                value={form.otherService}
                onChange={set('otherService')}
                style={{ marginTop: '0.8rem' }}
              />
            )}
          </div>
          <div className="form-group">
            <label>Project Details *</label>
            <textarea placeholder="Project Details" value={form.message} onChange={set('message')} />
          </div>

          {error && (
            <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.1)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.3)' }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="form-success">
              ✅ Message sent! We'll get back to you within 24 hours.
            </div>
          )}

          <button className="form-submit" onClick={submit} disabled={loading}>
            {loading ? 'Sending...' : 'Send Message →'}
          </button>
        </div>
      </div>
    </section>
  )
}
