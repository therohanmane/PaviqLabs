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

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <a href="https://www.linkedin.com/company/paviqlabs" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57A1.46 1.46 0 0 1 14.38 12.11A1.46 1.46 0 0 1 15.84 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/></svg>
        </a>
        <a href="https://www.instagram.com/paviqlabs/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a href="https://wa.me/919405980596" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
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
