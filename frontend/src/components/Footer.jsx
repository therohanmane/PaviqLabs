import { useState, useEffect } from 'react'
import api from '../utils/api.js'

export default function Footer() {
  const [footerTagline, setFooterTagline] = useState('')
  const [socialBio, setSocialBio] = useState('')

  useEffect(() => {
    api.get('/settings').then(res => {
      const q = res.data.settings?.quotes
      if (q?.footer) setFooterTagline(q.footer)
      if (q?.socialMedia) setSocialBio(q.socialMedia)
    }).catch(() => {})
  }, [])

  return (
    <footer>
      <div className="footer-logo">Paviq<span>Labs</span></div>

      {/* Social Media Bio - Only shows if set in admin */}
      {socialBio && (
        <p style={{
          fontStyle: 'italic',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.45)',
          margin: '0.6rem auto 1.4rem',
          maxWidth: '480px',
          lineHeight: 1.6,
          letterSpacing: '0.01em'
        }}>
          "{socialBio}"
        </p>
      )}

      <div className="footer-links">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#blog">Insights</a>
        <a href="#careers">Careers</a>
        <a href="#contact">Contact</a>
      </div>

      {/* Footer Tagline - Only shows if set in admin */}
      {footerTagline && (
        <div style={{
          margin: '1.4rem auto 0.5rem',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#C9A84C',
          opacity: 0.8
        }}>
          {footerTagline}
        </div>
      )}

      <div className="footer-copy">© {new Date().getFullYear()} PaviqLabs. All rights reserved.</div>
    </footer>
  )
}
