import { useEffect, useState } from 'react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#projects', label: 'Work' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#blog', label: 'Insights' },
  { href: '#careers', label: 'Careers' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [logoClicked, setLogoClicked] = useState(false)

  const handleLogoClick = () => {
    setLogoClicked(true)
    setTimeout(() => setLogoClicked(false), 1000)
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = document.querySelectorAll('section[id]')
      let current = ''
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id })
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
        <a href="#hero" className={`nav-logo ${logoClicked ? 'logo-ping' : ''}`} onClick={handleLogoClick}>
          <img src="/logo.png" alt="PaviqLabs Logo" className="nav-logo-img" />
          <span className="nav-logo-text">PAVIQLABS</span>
        </a>
        <div className="nav-links">
          {links.map(l => (
            <a key={l.href} href={l.href} className={activeSection === l.href.slice(1) ? 'active' : ''}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="nav-cta">Get in Touch</a>
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={close}>✕</button>
        {links.map(l => <a key={l.href} href={l.href} onClick={close}>{l.label}</a>)}
        <a href="#contact" onClick={close} style={{ color: 'var(--gold)' }}>Get in Touch</a>
      </div>
    </>
  )
}
