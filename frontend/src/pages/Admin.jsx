import { useState, useEffect, useRef, useCallback } from 'react'
import api from '../utils/api.js'

// ─── Status Dot (minimal enabled/disabled indicator) ───
const StatusDot = ({ active }) => (
  <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#22c55e' : '#ef4444', flexShrink: 0, boxShadow: active ? '0 0 6px rgba(34,197,94,0.5)' : '0 0 6px rgba(239,68,68,0.4)' }} title={active ? 'Enabled' : 'Disabled'} />
)

// ─── Simple Toggle Component ───
const Toggle = ({ checked, onChange, label }) => (
  <div 
    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
    onClick={() => onChange(!checked)}
  >
    <div 
      style={{
        width: 34, height: 18, borderRadius: 20, background: checked ? '#0D1B3E' : '#EDECE8',
        position: 'relative', transition: 'background 0.2s'
      }}
    >
      <div style={{
        width: 12, height: 12, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: checked ? 19 : 3, transition: 'left 0.2s'
      }} />
    </div>
    {label && <span style={{ fontSize: '0.75rem', color: '#6B6A66', fontWeight: 600 }}>{checked ? 'ON' : 'OFF'}</span>}
  </div>
)

// ─── Reusable Context Menu (3-dot kebab) ───
const ContextMenu = ({ actions, id, openMenu, setOpenMenu }) => {
  const ref = useRef(null)
  const isOpen = openMenu === id

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenMenu(null) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, setOpenMenu])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpenMenu(isOpen ? null : id) }}
        style={{
          background: isOpen ? '#EDECE8' : 'transparent', border: 'none', cursor: 'pointer',
          width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s', fontSize: '1.1rem', color: '#6B6A66', lineHeight: 1
        }}
        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#F7F6F2' }}
        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}
      >⋮</button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 999,
          background: 'white', borderRadius: 12, boxShadow: '0 8px 30px rgba(13,27,62,0.15), 0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #EDECE8', minWidth: 180, overflow: 'hidden',
          animation: 'menuFadeIn 0.15s ease-out'
        }}>
          {actions.map((action, i) => {
            if (action.divider) return <div key={i} style={{ height: 1, background: '#EDECE8', margin: '4px 0' }} />
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); action.onClick(); setOpenMenu(null) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: '9px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', color: action.danger ? '#dc2626' : '#0D1B3E',
                  fontFamily: 'DM Sans, sans-serif', textAlign: 'left',
                  transition: 'background 0.12s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = action.danger ? 'rgba(239,68,68,0.06)' : '#F7F6F2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '0.9rem', width: 20, textAlign: 'center' }}>{action.icon}</span>
                <span style={{ fontWeight: 500 }}>{action.label}</span>
                {action.tag && <span style={{ marginLeft: 'auto', fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: action.tag === 'ON' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)', color: action.tag === 'ON' ? '#166534' : '#dc2626', fontWeight: 600 }}>{action.tag}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}


export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginErr, setLoginErr] = useState('')
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState({ total: 0, unread: 0, today: 0 })
  const [tab, setTab] = useState('inquiries')
  const [projects, setProjects] = useState([])
  const [projectForm, setProjectForm] = useState({ domain: '', name: '', useCase: '', techStack: '', link: '', image: '' })
  const [services, setServices] = useState([])
  const [serviceForm, setServiceForm] = useState({ num: '', icon: '', title: '', desc: '', tags: '' })
  const [editingService, setEditingService] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [insights, setInsights] = useState([])
  const [insightForm, setInsightForm] = useState({ category: '', title: '', excerpt: '', date: '', readTime: '', icon: '💡', bg: 'linear-gradient(135deg, #0D1B3E, #162040)', image: '' })
  const [editingInsight, setEditingInsight] = useState(null)
  const [heroImages, setHeroImages] = useState([])
  const [heroImageForm, setHeroImageForm] = useState({ title: '', image: '', xPos: 50, yPos: 50, scale: 1 })
  const [openMenu, setOpenMenu] = useState(null)
  const [securityForm, setSecurityForm] = useState({ username: '', password: '', newPassword: '' })
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' })
  const [settings, setSettings] = useState({
    quotes: {
      hero: 'Speed without security is a gamble. Security without speed is a cage. We give you both.',
      about: "We don't just build your technology — we become its guardian, its engine, and its compass.",
      footer: 'Engineered for speed. Hardened for trust.',
      businessCard: 'Code it. Secure it. Scale it.',
      emailSignature: 'Your growth, our responsibility.',
      socialMedia: 'Innovation moves fast. Threats move faster. We move fastest.'
    },
    sectionsEnabled: { about: true, services: true, process: true, testimonials: true, blog: true, trustedBy: true, founders: true, careers: true },
    servicesHeading: 'Services built for scale.',
    heroStats: [
      { value: '10', suffix: '+', label: 'Projects Delivered', enabled: true },
      { value: '4', suffix: '+', label: 'Years Experience', enabled: true },
      { value: '🌏', suffix: '', label: 'Clients Globally', enabled: true },
      { value: '⭐', suffix: '', label: '5-Star Rated', enabled: true }
    ],
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
      { initials: 'RM', name: 'Rohan Mane', role: 'Co-Founder', bio: "A passionate technologist and entrepreneur driving PaviqLabs' product vision and engineering excellence.", linkedin: 'https://www.linkedin.com/company/paviqlabs', enabled: true },
      { initials: 'KS', name: 'Kaushal Singh', role: 'Co-Founder', bio: "A strategic mind with a deep passion for cybersecurity and digital transformation.", linkedin: 'https://www.linkedin.com/company/paviqlabs', enabled: true }
    ],
    jobOpenings: [
      { title: 'Senior Full-Stack Developer', type: 'Full-Time', location: 'Remote', dept: 'Engineering', enabled: false },
      { title: 'Cybersecurity Analyst', type: 'Full-Time', location: 'Hybrid', dept: 'Security', enabled: false },
      { title: 'AI/ML Engineer', type: 'Full-Time', location: 'Remote', dept: 'AI Research', enabled: false },
      { title: 'UI/UX Designer', type: 'Full-Time', location: 'Remote', dept: 'Design', enabled: false },
      { title: 'DevOps Engineer', type: 'Contract', location: 'Remote', dept: 'Infrastructure', enabled: false }
    ]
  })

  const login = async () => {
    try {
      const res = await api.post('/admin/login', loginForm)
      const t = res.data.token
      localStorage.setItem('admin_token', t)
      setToken(t)
      setLoginErr('')
    } catch {
      setLoginErr('Invalid credentials.')
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken('')
  }

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/inquiries')
      setInquiries(res.data.inquiries)
      const today = new Date().toDateString()
      setStats({
        total: res.data.inquiries.length,
        unread: res.data.inquiries.filter(i => !i.read).length,
        today: res.data.inquiries.filter(i => new Date(i.createdAt).toDateString() === today).length,
      })
    } catch { }
    setLoading(false)
  }

  const markRead = async (id) => {
    try {
      await api.patch(`/admin/inquiries/${id}/read`)
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, read: true } : i))
      setStats(s => ({ ...s, unread: Math.max(0, s.unread - 1) }))
    } catch { }
  }

  const deleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry?')) return
    try {
      await api.delete(`/admin/inquiries/${id}`)
      
      const inqToDelete = inquiries.find(i => i._id === id)
      setInquiries(prev => prev.filter(i => i._id !== id))
      if (selected?._id === id) setSelected(null)
      
      if (inqToDelete) {
        const isToday = new Date(inqToDelete.createdAt).toDateString() === new Date().toDateString()
        setStats(s => ({
          total: Math.max(0, s.total - 1),
          unread: !inqToDelete.read ? Math.max(0, s.unread - 1) : s.unread,
          today: isToday ? Math.max(0, s.today - 1) : s.today
        }))
      }
    } catch { }
  }

  const toggleVisibility = async (type, id) => {
    try {
      const res = await api.patch(`/admin/toggle-visibility/${type}/${id}`)
      if (res.data.success) {
        if (type === 'projects') setProjects(prev => prev.map(p => p._id === id ? { ...p, enabled: res.data.enabled } : p))
        if (type === 'services') setServices(prev => prev.map(s => s._id === id ? { ...s, enabled: res.data.enabled } : s))
        if (type === 'insights') setInsights(prev => prev.map(i => i._id === id ? { ...i, enabled: res.data.enabled } : i))
      }
    } catch (err) {
      console.error('Toggle visibility error:', err)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setProjects(res.data.projects)
    } catch { }
  }

  const fetchServices = async () => {
    try {
      const res = await api.get('/services')
      setServices(res.data.services)
    } catch { }
  }

  const saveService = async (e) => {
    e.preventDefault()
    if (!serviceForm.title || !serviceForm.icon) return
    try {
      const tagsArr = typeof serviceForm.tags === 'string' ? serviceForm.tags.split(',').map(s => s.trim()).filter(Boolean) : serviceForm.tags
      if (editingService) {
        const res = await api.put(`/admin/services/${editingService}`, { ...serviceForm, tags: tagsArr })
        setServices(prev => prev.map(s => s._id === editingService ? res.data.service : s))
      } else {
        const res = await api.post('/admin/services', { ...serviceForm, tags: tagsArr })
        setServices(prev => [...prev, res.data.service])
      }
      setServiceForm({ num: '', icon: '', title: '', desc: '', tags: '' })
      setEditingService(null)
    } catch { }
  }

  const startEditService = (s) => {
    setEditingService(s._id)
    setServiceForm({ num: s.num, icon: s.icon, title: s.title, desc: s.desc, tags: (s.tags || []).join(', ') })
  }

  const cancelEditService = () => {
    setEditingService(null)
    setServiceForm({ num: '', icon: '', title: '', desc: '', tags: '' })
  }

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await api.delete(`/admin/services/${id}`)
      setServices(prev => prev.filter(s => s._id !== id))
    } catch { }
  }

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings')
      if (res.data.settings) {
        setSettings(prev => ({ ...prev, ...res.data.settings }))
      }
    } catch { }
  }

  const saveSettings = async (e) => {
    e.preventDefault()
    try {
      await api.put('/admin/settings', settings)
      alert("Settings saved successfully!")
    } catch { 
      alert("Failed to save settings.")
    }
  }

  const saveProject = async (e) => {
    e.preventDefault()
    if (!projectForm.name || !projectForm.domain || !projectForm.useCase || !projectForm.techStack) return
    try {
      const techStackArr = typeof projectForm.techStack === 'string' ? projectForm.techStack.split(',').map(s => s.trim()).filter(Boolean) : projectForm.techStack
      if (editingProject) {
        const res = await api.put(`/admin/projects/${editingProject}`, { ...projectForm, techStack: techStackArr })
        setProjects(prev => prev.map(p => p._id === editingProject ? res.data.project : p))
      } else {
        const res = await api.post('/admin/projects', { ...projectForm, techStack: techStackArr })
        setProjects([res.data.project, ...projects])
      }
      setProjectForm({ domain: '', name: '', useCase: '', techStack: '', link: '', image: '' })
      setEditingProject(null)
    } catch { }
  }

  const startEdit = (p) => {
    setEditingProject(p._id)
    setProjectForm({
      domain: p.domain,
      name: p.name,
      useCase: p.useCase,
      techStack: p.techStack.join(', '),
      link: p.link || '',
      image: p.image || ''
    })
  }

  const cancelEdit = () => {
    setEditingProject(null)
    setProjectForm({ domain: '', name: '', useCase: '', techStack: '', link: '', image: '' })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => setProjectForm(f => ({ ...f, image: event.target.result }))
    reader.readAsDataURL(file)
  }

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/admin/projects/${id}`)
      setProjects(prev => prev.filter(p => p._id !== id))
    } catch { }
  }

  const fetchInsights = async () => {
    try {
      const res = await api.get('/insights')
      setInsights(res.data.insights)
    } catch { }
  }

  const saveInsight = async (e) => {
    e.preventDefault()
    if (!insightForm.title || !insightForm.category || !insightForm.excerpt) return
    try {
      if (editingInsight) {
        const res = await api.put(`/admin/insights/${editingInsight}`, insightForm)
        setInsights(prev => prev.map(i => i._id === editingInsight ? res.data.insight : i))
      } else {
        const res = await api.post('/admin/insights', insightForm)
        setInsights([res.data.insight, ...insights])
      }
      setInsightForm({ category: '', title: '', excerpt: '', date: '', readTime: '', icon: '💡', bg: 'linear-gradient(135deg, #0D1B3E, #162040)', image: '' })
      setEditingInsight(null)
    } catch { }
  }

  const startEditInsight = (i) => {
    setEditingInsight(i._id)
    setInsightForm({
      category: i.category,
      title: i.title,
      excerpt: i.excerpt,
      date: i.date || '',
      readTime: i.readTime || '',
      icon: i.icon || '💡',
      bg: i.bg || '',
      image: i.image || ''
    })
  }

  const cancelEditInsight = () => {
    setEditingInsight(null)
    setInsightForm({ category: '', title: '', excerpt: '', date: '', readTime: '', icon: '💡', bg: 'linear-gradient(135deg, #0D1B3E, #162040)', image: '' })
  }

  const handleInsightImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => setInsightForm(f => ({ ...f, image: event.target.result }))
    reader.readAsDataURL(file)
  }

  const deleteInsight = async (id) => {
    if (!confirm('Delete this insight?')) return
    try {
      await api.delete(`/admin/insights/${id}`)
      setInsights(prev => prev.filter(i => i._id !== id))
    } catch { }
  }

  const fetchHeroImages = async () => {
    try {
      const res = await api.get('/hero-images')
      setHeroImages(res.data.images)
    } catch { }
  }

  const saveHeroImage = async (e) => {
    e.preventDefault()
    if (!heroImageForm.title || !heroImageForm.image) return
    try {
      const res = await api.post('/admin/hero-images', heroImageForm)
      setHeroImages([res.data.heroImage, ...heroImages])
      setHeroImageForm({ title: '', image: '', xPos: 50, yPos: 50, scale: 1 })
    } catch { }
  }

  const handleHeroImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => setHeroImageForm(f => ({ 
      ...f, 
      image: event.target.result,
      xPos: f.xPos === 50 ? Math.floor(Math.random() * 80) + 10 : f.xPos,
      yPos: f.yPos === 50 ? Math.floor(Math.random() * 80) + 10 : f.yPos
    }))
    reader.readAsDataURL(file)
  }

  const deleteHeroImage = async (id) => {
    if (!confirm('Delete this hero image?')) return
    try {
      await api.delete(`/admin/hero-images/${id}`)
      setHeroImages(prev => prev.filter(i => i._id !== id))
    } catch { }
  }

  const handleSecurityUpdate = async (e) => {
    e.preventDefault()
    setSecurityMsg({ type: '', text: '' })
    try {
      await api.put('/admin/update-credentials', securityForm)
      setSecurityMsg({ type: 'success', text: 'Credentials updated successfully!' })
      setSecurityForm({ username: '', password: '', newPassword: '' })
    } catch (err) {
      setSecurityMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update credentials.' })
    }
  }

  // ─── Settings Helpers ───
  const toggleSec = (key, val) => setSettings(s => ({ ...s, sectionsEnabled: { ...(s.sectionsEnabled || {}), [key]: val } }))
  const toggleItem = (arrKey, idx, val) => {
    const a = [...(settings[arrKey] || [])]
    if (a[idx]) {
      a[idx] = { ...a[idx], enabled: val }
      setSettings(s => ({ ...s, [arrKey]: a }))
    }
  }
  const moveItem = (arrKey, idx, dir) => {
    const a = [...(settings[arrKey] || [])]
    const t = idx + dir
    if (t < 0 || t >= a.length) return
    ;[a[idx], a[t]] = [a[t], a[idx]]
    setSettings(s => ({ ...s, [arrKey]: a }))
  }
  const duplicateItem = (arrKey, idx) => {
    const a = [...(settings[arrKey] || [])]
    if (a[idx]) {
      a.splice(idx + 1, 0, { ...a[idx] })
      setSettings(s => ({ ...s, [arrKey]: a }))
    }
  }
  const removeItem = (arrKey, idx) => {
    setSettings(s => ({ ...s, [arrKey]: (s[arrKey] || []).filter((_, i) => i !== idx) }))
  }

  const SectionHeader = ({ icon, label, secKey, onAdd, addLabel, sec }) => {
    const enabled = sec[secKey] !== false
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <StatusDot active={enabled} />
          <div style={{ ...adminStyles.detailTitle, fontSize: '1.1rem', margin: 0, opacity: enabled ? 1 : 0.4 }}>{icon} {label}</div>
          <ContextMenu id={`sec-${secKey}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={[
            { icon: enabled ? '🔴' : '🟢', label: enabled ? 'Disable Section' : 'Enable Section', tag: enabled ? 'ON' : 'OFF', onClick: () => toggleSec(secKey, !enabled) },
            { divider: true },
            { icon: '🔄', label: 'Reset to Default', onClick: () => { if (confirm(`Reset ${label} to default?`)) { /* no-op for now */ } } },
          ]} />
        </div>
        {onAdd && <button type="button" style={{ ...adminStyles.refreshBtn, background: '#C9A84C' }} onClick={onAdd}>{addLabel || '+ Add'}</button>}
      </div>
    )
  }

  const itemMenu = (arrKey, idx, total, enabled) => [
    { icon: enabled ? '🔴' : '🟢', label: enabled ? 'Disable' : 'Enable', tag: enabled ? 'ON' : 'OFF', onClick: () => toggleItem(arrKey, idx, !enabled) },
    { divider: true },
    { icon: '📋', label: 'Duplicate', onClick: () => duplicateItem(arrKey, idx) },
    { icon: '⬆️', label: 'Move Up', onClick: () => moveItem(arrKey, idx, -1) },
    { icon: '⬇️', label: 'Move Down', onClick: () => moveItem(arrKey, idx, 1) },
    { divider: true },
    { icon: '🗑', label: 'Remove', danger: true, onClick: () => removeItem(arrKey, idx) },
  ]

  useEffect(() => {
    if (token) {
      fetchInquiries()
      fetchProjects()
      fetchInsights()
      fetchSettings()
      fetchHeroImages()
      fetchServices()
    }
  }, [token])

  const adminStyles = {
    page: { fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', background: '#F7F6F2', cursor: 'auto' },
    nav: { background: '#0D1B3E', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    navLogo: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'white' },
    navLogoSpan: { color: '#C9A84C' },
    logoutBtn: { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.4rem 1rem', borderRadius: '100px', cursor: 'pointer', fontSize: '0.85rem' },
    statsRow: { display: 'flex', gap: '1.5rem', padding: '2rem', flexWrap: 'wrap' },
    statCard: { background: 'white', borderRadius: '16px', padding: '1.5rem', flex: 1, minWidth: '140px', boxShadow: '0 2px 12px rgba(13,27,62,0.06)' },
    statNum: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#0D1B3E' },
    statLabel: { fontSize: '0.78rem', color: '#6B6A66', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' },
    mainArea: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', padding: '0 2rem 2rem' },
    list: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(13,27,62,0.06)' },
    listHeader: { padding: '1.2rem 1.5rem', borderBottom: '1px solid #EDECE8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    listTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0D1B3E' },
    refreshBtn: { background: '#0D1B3E', color: 'white', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '100px', cursor: 'pointer', fontSize: '0.78rem' },
    inquiryItem: (read, selected) => ({
      padding: '1.1rem 1.5rem', borderBottom: '1px solid #EDECE8', cursor: 'pointer',
      background: selected ? '#F7F6F2' : read ? 'white' : 'rgba(201,168,76,0.06)',
      borderLeft: selected ? '3px solid #0D1B3E' : read ? '3px solid transparent' : '3px solid #C9A84C',
      transition: 'background 0.2s',
    }),
    inqName: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#0D1B3E' },
    inqService: { fontSize: '0.75rem', color: '#6B6A66', marginTop: '2px' },
    inqDate: { fontSize: '0.72rem', color: '#9A9990' },
    detail: { background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(13,27,62,0.06)', alignSelf: 'start', position: 'sticky', top: '1rem' },
    detailTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#0D1B3E', marginBottom: '0.5rem' },
    badge: { display: 'inline-block', background: '#EDECE8', color: '#0D1B3E', padding: '3px 10px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600, marginRight: '6px', marginBottom: '4px' },
    field: { marginTop: '1.2rem' },
    fieldLabel: { fontSize: '0.7rem', color: '#9A9990', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' },
    fieldVal: { fontSize: '0.9rem', color: '#0D1B3E', lineHeight: 1.6 },
    msgBox: { background: '#F7F6F2', borderRadius: '12px', padding: '1rem', fontSize: '0.875rem', color: '#6B6A66', lineHeight: 1.7, marginTop: '0.5rem' },
    actionRow: { display: 'flex', gap: '0.75rem', marginTop: '1.5rem' },
    replyBtn: { background: '#0D1B3E', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '100px', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
    deleteBtn: { background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', padding: '0.6rem 1.2rem', borderRadius: '100px', cursor: 'pointer', fontSize: '0.85rem' },
    empty: { padding: '3rem', textAlign: 'center', color: '#9A9990' },
    loginBox: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060E21' },
    loginCard: { background: 'white', borderRadius: '24px', padding: '3rem', width: '100%', maxWidth: '400px' },
    loginTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#0D1B3E', marginBottom: '2rem' },
    input: { width: '100%', border: '1px solid #EDECE8', borderRadius: '10px', padding: '0.85rem 1rem', fontSize: '0.9rem', outline: 'none', marginBottom: '1rem', fontFamily: 'DM Sans, sans-serif' },
    loginBtn: { width: '100%', background: '#0D1B3E', color: 'white', border: 'none', borderRadius: '100px', padding: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' },
    errMsg: { color: '#dc2626', fontSize: '0.82rem', marginBottom: '1rem' },
  }

  if (!token) {
    return (
      <div style={adminStyles.loginBox}>
        <div style={adminStyles.loginCard}>
          <div style={adminStyles.loginTitle}>Admin Login</div>
          {loginErr && <div style={adminStyles.errMsg}>⚠️ {loginErr}</div>}
          <input style={adminStyles.input} placeholder="Username" value={loginForm.username}
            onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))} />
          <input style={adminStyles.input} type="password" placeholder="Password" value={loginForm.password}
            onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && login()} />
          <button style={adminStyles.loginBtn} onClick={login}>Sign In →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={adminStyles.page}>
      <div style={adminStyles.nav}>
        <div style={adminStyles.navLogo}>Paviq<span style={adminStyles.navLogoSpan}>Labs</span> Admin</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', textDecoration: 'none' }}>← View Site</a>
          <button style={adminStyles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', padding: '0 2rem', borderBottom: '1px solid #EDECE8', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div onClick={() => setTab('inquiries')} style={{ cursor: 'pointer', padding: '1.5rem 0', fontWeight: 700, color: tab === 'inquiries' ? '#0D1B3E' : '#9A9990', borderBottom: tab === 'inquiries' ? '3px solid #0D1B3E' : '3px solid transparent', whiteSpace: 'nowrap' }}>Inquiries</div>
        
        {/* Projects Tab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div onClick={() => setTab('projects')} style={{ cursor: 'pointer', padding: '1.5rem 0', fontWeight: 700, color: tab === 'projects' ? '#0D1B3E' : '#9A9990', borderBottom: tab === 'projects' ? '3px solid #0D1B3E' : '3px solid transparent', whiteSpace: 'nowrap', opacity: settings.sectionsEnabled?.projects === false ? 0.5 : 1 }}>Projects</div>
          <ContextMenu id="tab-projects" openMenu={openMenu} setOpenMenu={setOpenMenu} actions={[
            { icon: settings.sectionsEnabled?.projects === false ? '🟢' : '🔴', label: settings.sectionsEnabled?.projects === false ? 'Turn Section ON' : 'Turn Section OFF', tag: settings.sectionsEnabled?.projects === false ? 'OFF' : 'ON', onClick: () => toggleSec('projects', settings.sectionsEnabled?.projects === false) }
          ]} />
        </div>

        {/* Services Tab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div onClick={() => setTab('services')} style={{ cursor: 'pointer', padding: '1.5rem 0', fontWeight: 700, color: tab === 'services' ? '#0D1B3E' : '#9A9990', borderBottom: tab === 'services' ? '3px solid #0D1B3E' : '3px solid transparent', whiteSpace: 'nowrap', opacity: settings.sectionsEnabled?.services === false ? 0.5 : 1 }}>Services</div>
          <ContextMenu id="tab-services" openMenu={openMenu} setOpenMenu={setOpenMenu} actions={[
            { icon: settings.sectionsEnabled?.services === false ? '🟢' : '🔴', label: settings.sectionsEnabled?.services === false ? 'Turn Section ON' : 'Turn Section OFF', tag: settings.sectionsEnabled?.services === false ? 'OFF' : 'ON', onClick: () => toggleSec('services', settings.sectionsEnabled?.services === false) }
          ]} />
        </div>

        {/* Insights Tab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div onClick={() => setTab('insights')} style={{ cursor: 'pointer', padding: '1.5rem 0', fontWeight: 700, color: tab === 'insights' ? '#0D1B3E' : '#9A9990', borderBottom: tab === 'insights' ? '3px solid #0D1B3E' : '3px solid transparent', whiteSpace: 'nowrap', opacity: settings.sectionsEnabled?.blog === false ? 0.5 : 1 }}>Insights</div>
          <ContextMenu id="tab-blog" openMenu={openMenu} setOpenMenu={setOpenMenu} actions={[
            { icon: settings.sectionsEnabled?.blog === false ? '🟢' : '🔴', label: settings.sectionsEnabled?.blog === false ? 'Turn Section ON' : 'Turn Section OFF', tag: settings.sectionsEnabled?.blog === false ? 'OFF' : 'ON', onClick: () => toggleSec('blog', settings.sectionsEnabled?.blog === false) }
          ]} />
        </div>

        <div onClick={() => setTab('hero')} style={{ cursor: 'pointer', padding: '1.5rem 0', fontWeight: 700, color: tab === 'hero' ? '#0D1B3E' : '#9A9990', borderBottom: tab === 'hero' ? '3px solid #0D1B3E' : '3px solid transparent', whiteSpace: 'nowrap' }}>Hero Media</div>
        <div onClick={() => setTab('settings')} style={{ cursor: 'pointer', padding: '1.5rem 0', fontWeight: 700, color: tab === 'settings' ? '#0D1B3E' : '#9A9990', borderBottom: tab === 'settings' ? '3px solid #0D1B3E' : '3px solid transparent', whiteSpace: 'nowrap' }}>Site Settings</div>
        <div onClick={() => setTab('security')} style={{ cursor: 'pointer', padding: '1.5rem 0', fontWeight: 700, color: tab === 'security' ? '#0D1B3E' : '#9A9990', borderBottom: tab === 'security' ? '3px solid #0D1B3E' : '3px solid transparent', whiteSpace: 'nowrap' }}>Security</div>
      </div>

      {tab === 'inquiries' && (
        <>
          <div style={adminStyles.statsRow}>
            {[
              { label: 'Total Inquiries', val: stats.total },
              { label: 'Unread', val: stats.unread, highlight: true },
              { label: 'Today', val: stats.today },
            ].map(s => (
              <div key={s.label} style={{ ...adminStyles.statCard, borderLeft: s.highlight ? '3px solid #C9A84C' : '3px solid #EDECE8' }}>
                <div style={{ ...adminStyles.statNum, color: s.highlight ? '#C9A84C' : '#0D1B3E' }}>{s.val}</div>
                <div style={adminStyles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={adminStyles.mainArea}>
        <div style={adminStyles.list}>
          <div style={adminStyles.listHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={adminStyles.listTitle}>Inquiries</div>
              {stats.unread > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#dc2626', padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {stats.unread} Pending
                </div>
              )}
            </div>
            <button style={adminStyles.refreshBtn} onClick={fetchInquiries}>↻ Refresh</button>
          </div>
          {loading && <div style={adminStyles.empty}>Loading...</div>}
          {!loading && inquiries.length === 0 && <div style={adminStyles.empty}>No inquiries yet.</div>}
          {inquiries.map(inq => (
            <div
              key={inq._id}
              style={adminStyles.inquiryItem(inq.read, selected?._id === inq._id)}
              onClick={() => { setSelected(inq); if (!inq.read) markRead(inq._id) }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={adminStyles.inqName}>{inq.firstName} {inq.lastName}</div>
                {!inq.read && <div style={{ ...adminStyles.badge, background: 'rgba(201,168,76,0.2)', color: '#8B6F34' }}>NEW</div>}
              </div>
              <div style={adminStyles.inqService}>{inq.email} · {inq.service || 'General'}</div>
              <div style={adminStyles.inqDate}>{new Date(inq.createdAt).toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        <div style={adminStyles.detail}>
          {!selected ? (
            <div style={adminStyles.empty}>← Select an inquiry to view details</div>
          ) : (
            <>
              <div style={adminStyles.detailTitle}>{selected.firstName} {selected.lastName}</div>
              <div>
                {selected.company && <span style={adminStyles.badge}>{selected.company}</span>}
                {selected.service && <span style={{ ...adminStyles.badge, background: 'rgba(201,168,76,0.15)', color: '#8B6F34' }}>{selected.service}</span>}
                <span style={{ ...adminStyles.badge, background: selected.read ? '#EDECE8' : 'rgba(74,222,128,0.1)', color: selected.read ? '#6B6A66' : '#166534' }}>
                  {selected.read ? 'Read' : 'Unread'}
                </span>
              </div>
              <div style={adminStyles.field}>
                <div style={adminStyles.fieldLabel}>Email</div>
                <div style={adminStyles.fieldVal}><a href={`mailto:${selected.email}`} style={{ color: '#0D1B3E' }}>{selected.email}</a></div>
              </div>
              <div style={adminStyles.field}>
                <div style={adminStyles.fieldLabel}>Submitted</div>
                <div style={adminStyles.fieldVal}>{new Date(selected.createdAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</div>
              </div>
              <div style={adminStyles.field}>
                <div style={adminStyles.fieldLabel}>Message</div>
                <div style={adminStyles.msgBox}>{selected.message}</div>
              </div>
              <div style={adminStyles.actionRow}>
                <a href={`mailto:${selected.email}?subject=Re: Your inquiry to PaviqLabs`} style={adminStyles.replyBtn}>✉️ Reply via Email</a>
                <button style={adminStyles.deleteBtn} onClick={() => deleteInquiry(selected._id)}>🗑 Delete</button>
              </div>
            </>
          )}
        </div>
        </div>
        </>
      )}
      
      {tab === 'projects' && (
        <div style={{ ...adminStyles.mainArea, paddingTop: '2rem' }}>
          <div style={adminStyles.list}>
            <div style={adminStyles.listHeader}>
              <div style={adminStyles.listTitle}>Live Projects</div>
              <button style={adminStyles.refreshBtn} onClick={fetchProjects}>↻ Refresh</button>
            </div>
            {projects.length === 0 && <div style={adminStyles.empty}>No projects added yet.</div>}
            {projects.map(p => (
              <div key={p._id} style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #EDECE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: p.enabled === false ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ContextMenu id={`proj-${p._id}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={[
                    { icon: p.enabled === false ? '🟢' : '🔴', label: p.enabled === false ? 'Enable Project' : 'Disable Project', tag: p.enabled === false ? 'OFF' : 'ON', onClick: () => toggleVisibility('projects', p._id) },
                    { divider: true },
                    { icon: '🗑', label: 'Delete', danger: true, onClick: () => deleteProject(p._id) }
                  ]} />
                  <Toggle checked={p.enabled !== false} onChange={() => toggleVisibility('projects', p._id)} label />
                  <div>
                    <div style={adminStyles.inqName}>{p.name}</div>
                    <div style={adminStyles.inqService}>{p.domain} · {p.useCase.slice(0, 50)}...</div>
                  </div>
                </div>
                <div>
                  <button style={{ ...adminStyles.replyBtn, padding: '0.4rem 0.8rem', textDecoration: 'none' }} onClick={() => startEdit(p)}>Edit</button>
                </div>
              </div>
            ))}
          </div>

          <div style={adminStyles.detail}>
            <div style={adminStyles.detailTitle}>{editingProject ? 'Edit Project' : 'Add New Project'}</div>
            <p style={{ ...adminStyles.inqService, marginBottom: '1.5rem' }}>{editingProject ? 'Update your project details below.' : 'Create a new robust project to showcase on the landing page.'}</p>
            <form onSubmit={saveProject}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={adminStyles.fieldLabel}>Domain (e.g. FinTech)</div>
                  <input style={adminStyles.input} required value={projectForm.domain} onChange={e => setProjectForm(f => ({ ...f, domain: e.target.value }))} />
                </div>
                <div>
                  <div style={adminStyles.fieldLabel}>Project Name</div>
                  <input style={adminStyles.input} required value={projectForm.name} onChange={e => setProjectForm(f => ({ ...f, name: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={adminStyles.fieldLabel}>Use Case / Description</div>
                <textarea style={{ ...adminStyles.input, minHeight: '80px', resize: 'vertical' }} required value={projectForm.useCase} onChange={e => setProjectForm(f => ({ ...f, useCase: e.target.value }))} />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={adminStyles.fieldLabel}>Tech Stack (comma separated)</div>
                <input style={adminStyles.input} required placeholder="React, Node.js, AWS" value={projectForm.techStack} onChange={e => setProjectForm(f => ({ ...f, techStack: e.target.value }))} />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={adminStyles.fieldLabel}>Project Link (optional)</div>
                <input style={adminStyles.input} placeholder="https://..." value={projectForm.link} onChange={e => setProjectForm(f => ({ ...f, link: e.target.value }))} />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={adminStyles.fieldLabel}>Custom Project Image (optional)</div>
                <p style={{ fontSize: '0.7rem', color: '#9A9990', marginBottom: '8px' }}>Overrides automated snapshots.</p>
                {projectForm.image && <div style={{marginBottom: '0.5rem'}}><img src={projectForm.image} style={{height: 48, borderRadius: 4, objectFit: 'cover'}} alt="preview" /></div>}
                <input type="file" accept="image/*" style={{ ...adminStyles.input, padding: '0.4rem' }} onChange={handleImageUpload} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ ...adminStyles.loginBtn, width: 'auto', padding: '0.8rem 2rem' }}>{editingProject ? 'Save Changes' : '+ Create Project'}</button>
                {editingProject && <button type="button" onClick={cancelEdit} style={{ ...adminStyles.loginBtn, background: '#EDECE8', color: '#0D1B3E', width: 'auto', padding: '0.8rem 2rem' }}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === 'services' && (
        <div style={{ ...adminStyles.mainArea, paddingTop: '2rem' }}>
          <div style={adminStyles.list}>
            <div style={adminStyles.listHeader}>
              <div style={adminStyles.listTitle}>Service Cards</div>
              <button style={adminStyles.refreshBtn} onClick={fetchServices}>↻ Refresh</button>
            </div>
            {services.length === 0 && <div style={adminStyles.empty}>No services yet.</div>}
            {services.map(s => (
              <div key={s._id} style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #EDECE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: s.enabled === false ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ContextMenu id={`serv-${s._id}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={[
                    { icon: s.enabled === false ? '🟢' : '🔴', label: s.enabled === false ? 'Enable Service' : 'Disable Service', tag: s.enabled === false ? 'OFF' : 'ON', onClick: () => toggleVisibility('services', s._id) },
                    { divider: true },
                    { icon: '🗑', label: 'Delete', danger: true, onClick: () => deleteService(s._id) }
                  ]} />
                  <Toggle checked={s.enabled !== false} onChange={() => toggleVisibility('services', s._id)} label />
                  <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                  <div>
                    <div style={adminStyles.inqName}>{s.num} — {s.title}</div>
                    <div style={adminStyles.inqService}>{(s.tags || []).join(', ')}</div>
                  </div>
                </div>
                <div>
                  <button style={{ ...adminStyles.replyBtn, padding: '0.4rem 0.8rem', textDecoration: 'none' }} onClick={() => startEditService(s)}>Edit</button>
                </div>
              </div>
            ))}
          </div>
          <div style={adminStyles.detail}>
            <div style={adminStyles.detailTitle}>{editingService ? 'Edit Service' : 'Add Service Card'}</div>
            <p style={{ ...adminStyles.inqService, marginBottom: '1.5rem' }}>{editingService ? 'Update service details.' : 'Add a new service card to the homepage.'}</p>
            <form onSubmit={saveService}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 60px 1fr', gap: '1rem' }}>
                <div><div style={adminStyles.fieldLabel}>Num</div><input style={adminStyles.input} placeholder="01" value={serviceForm.num} onChange={e => setServiceForm(f => ({ ...f, num: e.target.value }))} /></div>
                <div><div style={adminStyles.fieldLabel}>Icon</div><input style={adminStyles.input} placeholder="🌐" value={serviceForm.icon} onChange={e => setServiceForm(f => ({ ...f, icon: e.target.value }))} /></div>
                <div><div style={adminStyles.fieldLabel}>Title</div><input style={adminStyles.input} required value={serviceForm.title} onChange={e => setServiceForm(f => ({ ...f, title: e.target.value }))} /></div>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={adminStyles.fieldLabel}>Description</div>
                <textarea style={{ ...adminStyles.input, minHeight: '80px', resize: 'vertical' }} required value={serviceForm.desc} onChange={e => setServiceForm(f => ({ ...f, desc: e.target.value }))} />
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={adminStyles.fieldLabel}>Tags (comma separated)</div>
                <input style={adminStyles.input} placeholder="React, Node.js, TypeScript" value={serviceForm.tags} onChange={e => setServiceForm(f => ({ ...f, tags: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ ...adminStyles.loginBtn, width: 'auto', padding: '0.8rem 2rem' }}>{editingService ? 'Save Changes' : '+ Add Service'}</button>
                {editingService && <button type="button" onClick={cancelEditService} style={{ ...adminStyles.loginBtn, background: '#EDECE8', color: '#0D1B3E', width: 'auto', padding: '0.8rem 2rem' }}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === 'settings' && (() => {
        const sec = settings.sectionsEnabled || {}
        return (
          <div style={{ ...adminStyles.mainArea, paddingTop: '2rem', display: 'block' }}>
            <style>{`@keyframes menuFadeIn { from { opacity:0; transform:translateY(-6px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
            <div style={{ ...adminStyles.detail, maxWidth: '860px', margin: '0 auto', alignSelf: 'auto' }}>
              <div style={adminStyles.detailTitle}>Site Settings</div>
              <p style={{ ...adminStyles.inqService, marginBottom: '2rem' }}>All changes update the live homepage after saving. Use the ⋮ menu to manage sections and items.</p>
              <form onSubmit={saveSettings}>

                {/* ── Services Heading ── */}
                <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #EDECE8', paddingBottom: '2rem' }}>
                  <SectionHeader icon="📋" label="Services Section" secKey="services" sec={sec} />
                  <div style={{ opacity: sec.services === false ? 0.4 : 1 }}>
                    <div style={adminStyles.fieldLabel}>Main Heading</div>
                    <input style={adminStyles.input} value={settings.servicesHeading || ''} onChange={e => setSettings(s => ({ ...s, servicesHeading: e.target.value }))} />
                  </div>
                </div>

                {/* ── Hero Stats ── */}
                <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #EDECE8', paddingBottom: '2rem' }}>
                  <div style={{ ...adminStyles.detailTitle, fontSize: '1.1rem', marginBottom: '0.3rem' }}>📊 Hero Statistics</div>
                  <p style={{ ...adminStyles.inqService, marginBottom: '1.2rem' }}>The metric badges in the hero section.</p>
                  {(settings.heroStats || []).map((stat, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '1rem', marginBottom: '1rem', background: stat.enabled !== false ? '#F7F6F2' : '#fdf2f2', padding: '1rem', borderRadius: '12px', alignItems: 'start', opacity: stat.enabled !== false ? 1 : 0.55 }}>
                      <div><div style={adminStyles.fieldLabel}>Value / Emoji</div><input style={adminStyles.input} value={stat.value} onChange={e => { const a = [...settings.heroStats]; a[idx] = { ...a[idx], value: e.target.value }; setSettings(s => ({ ...s, heroStats: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>Suffix (e.g. +)</div><input style={adminStyles.input} value={stat.suffix} onChange={e => { const a = [...settings.heroStats]; a[idx] = { ...a[idx], suffix: e.target.value }; setSettings(s => ({ ...s, heroStats: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>Label</div><input style={adminStyles.input} value={stat.label} onChange={e => { const a = [...settings.heroStats]; a[idx] = { ...a[idx], label: e.target.value }; setSettings(s => ({ ...s, heroStats: a })) }} /></div>
                      <div style={{ paddingTop: '22px', display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot active={stat.enabled !== false} /><ContextMenu id={`hs-${idx}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={itemMenu('heroStats', idx, (settings.heroStats||[]).length, stat.enabled !== false)} /></div>
                    </div>
                  ))}
                </div>

                {/* ── About Section ── */}
                <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #EDECE8', paddingBottom: '2rem' }}>
                  <SectionHeader icon="👤" label="About Section" secKey="about" sec={sec} />
                  <div style={{ opacity: sec.about === false ? 0.4 : 1 }}>
                    <div style={adminStyles.fieldLabel}>Heading</div>
                    <input style={adminStyles.input} value={settings.aboutHeading || ''} onChange={e => setSettings(s => ({ ...s, aboutHeading: e.target.value }))} />
                    <div style={{ marginTop: '0.75rem' }}><div style={adminStyles.fieldLabel}>Description Paragraph 1</div>
                    <textarea style={{ ...adminStyles.input, minHeight: '70px', resize: 'vertical' }} value={settings.aboutDesc1 || ''} onChange={e => setSettings(s => ({ ...s, aboutDesc1: e.target.value }))} /></div>
                    <div style={{ marginTop: '0.75rem' }}><div style={adminStyles.fieldLabel}>Description Paragraph 2</div>
                    <textarea style={{ ...adminStyles.input, minHeight: '60px', resize: 'vertical' }} value={settings.aboutDesc2 || ''} onChange={e => setSettings(s => ({ ...s, aboutDesc2: e.target.value }))} /></div>
                    <div style={{ marginTop: '0.75rem' }}><div style={adminStyles.fieldLabel}>Tech Tags (comma separated)</div>
                    <input style={adminStyles.input} value={(settings.aboutTags || []).join(', ')} onChange={e => setSettings(s => ({ ...s, aboutTags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} /></div>
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ ...adminStyles.detailTitle, fontSize: '0.95rem', marginBottom: '0.5rem' }}>About Stat Badges</div>
                      {(settings.aboutBadges || []).map((b, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 60px auto', gap: '1rem', marginBottom: '0.75rem', background: b.enabled !== false ? '#F7F6F2' : '#fdf2f2', padding: '0.75rem', borderRadius: '10px', alignItems: 'start', opacity: b.enabled !== false ? 1 : 0.55 }}>
                          <div><div style={adminStyles.fieldLabel}>Label</div><input style={adminStyles.input} value={b.label} onChange={e => { const a = [...settings.aboutBadges]; a[idx] = { ...a[idx], label: e.target.value }; setSettings(s => ({ ...s, aboutBadges: a })) }} /></div>
                          <div><div style={adminStyles.fieldLabel}>Value</div><input style={adminStyles.input} value={b.value} onChange={e => { const a = [...settings.aboutBadges]; a[idx] = { ...a[idx], value: e.target.value }; setSettings(s => ({ ...s, aboutBadges: a })) }} /></div>
                          <div><div style={adminStyles.fieldLabel}>Suffix</div><input style={adminStyles.input} value={b.suffix} onChange={e => { const a = [...settings.aboutBadges]; a[idx] = { ...a[idx], suffix: e.target.value }; setSettings(s => ({ ...s, aboutBadges: a })) }} /></div>
                          <div style={{ paddingTop: '22px', display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot active={b.enabled !== false} /><ContextMenu id={`ab-${idx}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={itemMenu('aboutBadges', idx, (settings.aboutBadges||[]).length, b.enabled !== false)} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Testimonials ── */}
                <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #EDECE8', paddingBottom: '2rem' }}>
                  <SectionHeader icon="💬" label="Testimonials" secKey="testimonials" sec={sec} onAdd={() => setSettings(s => ({ ...s, testimonials: [...(s.testimonials || []), { text: '', name: '', role: '', initials: '', stars: 5, enabled: true }] }))} />
                  {(settings.testimonials || []).map((t, idx) => (
                    <div key={idx} style={{ background: t.enabled !== false ? '#F7F6F2' : '#fdf2f2', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', opacity: t.enabled !== false ? 1 : 0.55 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <StatusDot active={t.enabled !== false} />
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0D1B3E' }}>{t.name || `Review ${idx + 1}`}</span>
                        </div>
                        <ContextMenu id={`tm-${idx}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={itemMenu('testimonials', idx, (settings.testimonials||[]).length, t.enabled !== false)} />
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}><div style={adminStyles.fieldLabel}>Review Text</div><textarea style={{ ...adminStyles.input, minHeight: '70px', resize: 'vertical' }} value={t.text} onChange={e => { const a = [...settings.testimonials]; a[idx] = { ...a[idx], text: e.target.value }; setSettings(s => ({ ...s, testimonials: a })) }} /></div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px 60px', gap: '0.75rem' }}>
                        <div><div style={adminStyles.fieldLabel}>Name</div><input style={adminStyles.input} value={t.name} onChange={e => { const a = [...settings.testimonials]; a[idx] = { ...a[idx], name: e.target.value }; setSettings(s => ({ ...s, testimonials: a })) }} /></div>
                        <div><div style={adminStyles.fieldLabel}>Role / Company</div><input style={adminStyles.input} value={t.role} onChange={e => { const a = [...settings.testimonials]; a[idx] = { ...a[idx], role: e.target.value }; setSettings(s => ({ ...s, testimonials: a })) }} /></div>
                        <div><div style={adminStyles.fieldLabel}>Initials</div><input style={adminStyles.input} value={t.initials} onChange={e => { const a = [...settings.testimonials]; a[idx] = { ...a[idx], initials: e.target.value }; setSettings(s => ({ ...s, testimonials: a })) }} /></div>
                        <div><div style={adminStyles.fieldLabel}>Stars</div><input type="number" min="1" max="5" style={adminStyles.input} value={t.stars} onChange={e => { const a = [...settings.testimonials]; a[idx] = { ...a[idx], stars: Number(e.target.value) }; setSettings(s => ({ ...s, testimonials: a })) }} /></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Process Steps ── */}
                <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #EDECE8', paddingBottom: '2rem' }}>
                  <SectionHeader icon="⚙️" label="Process Steps" secKey="process" sec={sec} />
                  {(settings.processSteps || []).map((step, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '50px 60px 1fr 2fr auto', gap: '0.75rem', background: step.enabled !== false ? '#F7F6F2' : '#fdf2f2', padding: '0.75rem', borderRadius: '10px', marginBottom: '0.75rem', alignItems: 'start', opacity: step.enabled !== false ? 1 : 0.55 }}>
                      <div><div style={adminStyles.fieldLabel}>Num</div><input style={adminStyles.input} value={step.num} onChange={e => { const a = [...settings.processSteps]; a[idx] = { ...a[idx], num: e.target.value }; setSettings(s => ({ ...s, processSteps: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>Icon</div><input style={adminStyles.input} value={step.icon} onChange={e => { const a = [...settings.processSteps]; a[idx] = { ...a[idx], icon: e.target.value }; setSettings(s => ({ ...s, processSteps: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>Title</div><input style={adminStyles.input} value={step.title} onChange={e => { const a = [...settings.processSteps]; a[idx] = { ...a[idx], title: e.target.value }; setSettings(s => ({ ...s, processSteps: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>Description</div><input style={adminStyles.input} value={step.desc} onChange={e => { const a = [...settings.processSteps]; a[idx] = { ...a[idx], desc: e.target.value }; setSettings(s => ({ ...s, processSteps: a })) }} /></div>
                      <div style={{ paddingTop: '22px', display: 'flex', alignItems: 'center', gap: 6 }}><StatusDot active={step.enabled !== false} /><ContextMenu id={`ps-${idx}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={itemMenu('processSteps', idx, (settings.processSteps||[]).length, step.enabled !== false)} /></div>
                    </div>
                  ))}
                </div>

                {/* ── Trusted By ── */}
                <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #EDECE8', paddingBottom: '2rem' }}>
                  <SectionHeader icon="🤝" label="Trusted By" secKey="trustedBy" sec={sec} onAdd={() => setSettings(s => ({ ...s, trustedBy: [...(s.trustedBy || []), { name: '', logo: '', enabled: true }] }))} />
                  <p style={{ ...adminStyles.inqService, marginBottom: '1rem' }}>Add company names and logos. Logos appear instead of text on the homepage.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', opacity: sec.trustedBy === false ? 0.4 : 1 }}>
                    {(settings.trustedBy || []).map((item, idx) => {
                      const name = typeof item === 'string' ? item : item.name
                      const logo = typeof item === 'string' ? '' : (item.logo || '')
                      const enabled = typeof item === 'string' ? true : item.enabled !== false
                      return (
                        <div key={idx} style={{ background: enabled ? '#F7F6F2' : '#fdf2f2', borderRadius: '12px', padding: '1rem', opacity: enabled ? 1 : 0.55 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <StatusDot active={enabled} />
                            <input style={{ border: '1px solid #EDECE8', background: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', flex: 1, outline: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px' }} placeholder="Company name" value={name} onChange={e => { const a = [...settings.trustedBy]; a[idx] = { ...(typeof a[idx] === 'object' ? a[idx] : { enabled: true, logo: '' }), name: e.target.value }; setSettings(s => ({ ...s, trustedBy: a })) }} />
                            <ContextMenu id={`tb-${idx}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={itemMenu('trustedBy', idx, (settings.trustedBy||[]).length, enabled)} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {logo && <img src={logo} alt={name || 'Logo'} style={{ height: 40, maxWidth: 120, objectFit: 'contain', borderRadius: 6, background: 'white', padding: '4px', border: '1px solid #EDECE8' }} />}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0D1B3E', color: 'white', borderRadius: '100px', padding: '0.35rem 0.9rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {logo ? '🔄 Replace Logo' : '📷 Upload Logo'}
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                                const file = e.target.files[0]
                                if (!file) return
                                const reader = new FileReader()
                                reader.onload = (ev) => { const a = [...settings.trustedBy]; a[idx] = { ...(typeof a[idx] === 'object' ? a[idx] : { name: a[idx], enabled: true }), logo: ev.target.result }; setSettings(s => ({ ...s, trustedBy: a })) }
                                reader.readAsDataURL(file)
                              }} />
                            </label>
                            {logo && <button type="button" onClick={() => { const a = [...settings.trustedBy]; a[idx] = { ...(typeof a[idx] === 'object' ? a[idx] : { name: a[idx], enabled: true }), logo: '' }; setSettings(s => ({ ...s, trustedBy: a })) }} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626', borderRadius: '100px', padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.72rem' }}>Remove Logo</button>}
                          </div>
                        </div>
                      )
                    })}
                    {(settings.trustedBy || []).length === 0 && <div style={{ textAlign: 'center', color: '#9A9990', padding: '1.5rem', fontSize: '0.85rem' }}>No companies added yet. Click "+ Add" to get started.</div>}
                  </div>
                </div>

                {/* ── Founders / Team ── */}
                <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #EDECE8', paddingBottom: '2rem' }}>
                  <SectionHeader icon="👥" label="Team / Founders" secKey="founders" sec={sec} onAdd={() => setSettings(s => ({ ...s, founders: [...(s.founders || []), { initials: '', name: '', role: '', bio: '', linkedin: '', tags: [], enabled: true }] }))} />
                  {(settings.founders || []).map((f, idx) => (
                    <div key={idx} style={{ background: f.enabled !== false ? '#F7F6F2' : '#fdf2f2', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', opacity: f.enabled !== false ? 1 : 0.55 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <StatusDot active={f.enabled !== false} />
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0D1B3E' }}>{f.name || `Founder ${idx + 1}`}</span>
                        </div>
                        <ContextMenu id={`fn-${idx}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={itemMenu('founders', idx, (settings.founders||[]).length, f.enabled !== false)} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div><div style={adminStyles.fieldLabel}>Initials</div><input style={adminStyles.input} value={f.initials} onChange={e => { const a = [...settings.founders]; a[idx] = { ...a[idx], initials: e.target.value }; setSettings(s => ({ ...s, founders: a })) }} /></div>
                        <div><div style={adminStyles.fieldLabel}>Full Name</div><input style={adminStyles.input} value={f.name} onChange={e => { const a = [...settings.founders]; a[idx] = { ...a[idx], name: e.target.value }; setSettings(s => ({ ...s, founders: a })) }} /></div>
                        <div><div style={adminStyles.fieldLabel}>Role / Title</div><input style={adminStyles.input} value={f.role} onChange={e => { const a = [...settings.founders]; a[idx] = { ...a[idx], role: e.target.value }; setSettings(s => ({ ...s, founders: a })) }} /></div>
                      </div>
                      <div style={{ marginBottom: '0.5rem' }}><div style={adminStyles.fieldLabel}>Bio</div><textarea style={{ ...adminStyles.input, minHeight: '65px', resize: 'vertical' }} value={f.bio} onChange={e => { const a = [...settings.founders]; a[idx] = { ...a[idx], bio: e.target.value }; setSettings(s => ({ ...s, founders: a })) }} /></div>
                      <div style={{ marginBottom: '0.5rem' }}><div style={adminStyles.fieldLabel}>Skills / Tags (comma separated)</div><input style={adminStyles.input} value={(f.tags || []).join(', ')} onChange={e => { const a = [...settings.founders]; a[idx] = { ...a[idx], tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }; setSettings(s => ({ ...s, founders: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>LinkedIn URL</div><input style={adminStyles.input} placeholder="https://linkedin.com/..." value={f.linkedin} onChange={e => { const a = [...settings.founders]; a[idx] = { ...a[idx], linkedin: e.target.value }; setSettings(s => ({ ...s, founders: a })) }} /></div>
                    </div>
                  ))}
                </div>

                {/* ── Job Openings ── */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <SectionHeader icon="💼" label="Job Openings" secKey="careers" sec={sec} onAdd={() => setSettings(s => ({ ...s, jobOpenings: [...(s.jobOpenings || []), { title: '', type: 'Full-Time', location: 'Remote', dept: '', enabled: true }] }))} />
                  {(settings.jobOpenings || []).map((job, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'auto 2fr 1fr 1fr 1fr auto', gap: '0.75rem', background: job.enabled !== false ? '#F7F6F2' : '#fdf2f2', padding: '0.75rem', borderRadius: '10px', marginBottom: '0.75rem', alignItems: 'end', opacity: job.enabled !== false ? 1 : 0.55 }}>
                      <div style={{ paddingBottom: '4px' }}><Toggle checked={job.enabled !== false} onChange={v => toggleItem('jobOpenings', idx, v)} label /></div>
                      <div><div style={adminStyles.fieldLabel}>Job Title</div><input style={adminStyles.input} value={job.title} onChange={e => { const a = [...settings.jobOpenings]; a[idx] = { ...a[idx], title: e.target.value }; setSettings(s => ({ ...s, jobOpenings: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>Dept</div><input style={adminStyles.input} value={job.dept} onChange={e => { const a = [...settings.jobOpenings]; a[idx] = { ...a[idx], dept: e.target.value }; setSettings(s => ({ ...s, jobOpenings: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>Type</div><input style={adminStyles.input} value={job.type} onChange={e => { const a = [...settings.jobOpenings]; a[idx] = { ...a[idx], type: e.target.value }; setSettings(s => ({ ...s, jobOpenings: a })) }} /></div>
                      <div><div style={adminStyles.fieldLabel}>Location</div><input style={adminStyles.input} value={job.location} onChange={e => { const a = [...settings.jobOpenings]; a[idx] = { ...a[idx], location: e.target.value }; setSettings(s => ({ ...s, jobOpenings: a })) }} /></div>
                      <button type="button" onClick={() => setSettings(s => ({ ...s, jobOpenings: s.jobOpenings.filter((_, i) => i !== idx) }))} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#dc2626', borderRadius: '6px', padding: '0.5rem 0.6rem', cursor: 'pointer', marginBottom: '2px' }}>✕</button>
                    </div>
                  ))}
                </div>

                {/* ── Brand Quotes ── */}
                <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid #EDECE8', paddingBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ ...adminStyles.detailTitle, fontSize: '1.1rem', margin: 0 }}>💬 Brand Quotes</div>
                  </div>
                  <p style={{ ...adminStyles.inqService, marginBottom: '1.2rem' }}>These quotes appear across the site — Hero, About, Footer, Contact, and Social links.</p>

                  {[
                    { key: 'hero',          label: '🚀 Hero Section Quote',     hint: 'Shows below the hero headline' },
                    { key: 'about',         label: '👤 About Page Quote',        hint: 'Blockquote inside the About section' },
                    { key: 'footer',        label: '🏷️ Footer Tagline',          hint: 'Gold uppercase text in the footer' },
                    { key: 'businessCard',  label: '🪪 Business Card Tagline',   hint: 'Gold card shown in the Contact section' },
                    { key: 'emailSignature',label: '✍️ Email Signature',          hint: 'Italic line below contact info' },
                    { key: 'socialMedia',   label: '📱 Social Media Bio',        hint: 'Italic quote in the footer above nav links' }
                  ].map(({ key, label, hint }) => (
                    <div key={key} style={{ marginBottom: '1rem', background: '#F7F6F2', padding: '0.9rem 1rem', borderRadius: '10px' }}>
                      <div style={{ ...adminStyles.fieldLabel, marginBottom: '0.2rem' }}>{label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9A9990', marginBottom: '0.5rem', fontStyle: 'italic' }}>{hint}</div>
                      <input
                        style={adminStyles.input}
                        value={(settings.quotes || {})[key] || ''}
                        onChange={e => setSettings(s => ({ ...s, quotes: { ...(s.quotes || {}), [key]: e.target.value } }))}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #EDECE8', paddingTop: '1.5rem' }}>
                  <button type="submit" style={{ ...adminStyles.loginBtn, width: 'auto', padding: '0.8rem 2.5rem' }}>💾 Save All Settings</button>
                </div>
              </form>
            </div>
          </div>
        )
      })()}


      {tab === 'security' && (
        <div style={{ ...adminStyles.mainArea, paddingTop: '2rem', display: 'block' }}>
          <div style={{ ...adminStyles.detail, maxWidth: '500px', margin: '0 auto', alignSelf: 'auto' }}>
            <div style={adminStyles.detailTitle}>🔐 Admin Security</div>
            <p style={{ ...adminStyles.inqService, marginBottom: '2rem' }}>Update your login credentials. Changes take effect immediately.</p>
            
            <form onSubmit={handleSecurityUpdate}>
              <div style={adminStyles.fieldLabel}>New Username</div>
              <input 
                style={adminStyles.input} 
                placeholder="Enter new username"
                value={securityForm.username} 
                onChange={e => setSecurityForm(f => ({ ...f, username: e.target.value }))} 
              />
              
              <div style={adminStyles.fieldLabel}>New Password</div>
              <input 
                type="password"
                style={adminStyles.input} 
                placeholder="Enter new password"
                value={securityForm.newPassword} 
                onChange={e => setSecurityForm(f => ({ ...f, newPassword: e.target.value }))} 
              />

              <div style={{ margin: '1.5rem 0', borderTop: '1px solid #EDECE8', paddingTop: '1.5rem' }}>
                <div style={{ ...adminStyles.fieldLabel, color: '#0D1B3E', fontWeight: 700 }}>Confirm Current Password</div>
                <p style={{ fontSize: '0.72rem', color: '#6B6A66', marginBottom: '0.8rem' }}>Required to authorize changes.</p>
                <input 
                  type="password"
                  required
                  style={adminStyles.input} 
                  placeholder="Current password"
                  value={securityForm.password} 
                  onChange={e => setSecurityForm(f => ({ ...f, password: e.target.value }))} 
                />
              </div>

              {securityMsg.text && (
                <div style={{ 
                  padding: '0.8rem 1rem', 
                  borderRadius: '10px', 
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  background: securityMsg.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  color: securityMsg.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${securityMsg.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
                }}>
                  {securityMsg.type === 'success' ? '✅' : '⚠️'} {securityMsg.text}
                </div>
              )}

              <button type="submit" style={adminStyles.loginBtn}>Update Credentials →</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'insights' && (
        <div style={{ ...adminStyles.mainArea, paddingTop: '2rem' }}>
          <div style={adminStyles.list}>
            <div style={adminStyles.listHeader}>
              <div style={adminStyles.listTitle}>Blog / Insights</div>
              <button style={adminStyles.refreshBtn} onClick={fetchInsights}>↻ Refresh</button>
            </div>
            {insights.length === 0 && <div style={adminStyles.empty}>No insights added yet.</div>}
            {insights.map(i => (
              <div key={i._id} style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #EDECE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: i.enabled === false ? 0.6 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ContextMenu id={`ins-${i._id}`} openMenu={openMenu} setOpenMenu={setOpenMenu} actions={[
                    { icon: i.enabled === false ? '🟢' : '🔴', label: i.enabled === false ? 'Enable Insight' : 'Disable Insight', tag: i.enabled === false ? 'OFF' : 'ON', onClick: () => toggleVisibility('insights', i._id) },
                    { divider: true },
                    { icon: '🗑', label: 'Delete', danger: true, onClick: () => deleteInsight(i._id) }
                  ]} />
                  <Toggle checked={i.enabled !== false} onChange={() => toggleVisibility('insights', i._id)} label />
                  <div>
                    <div style={adminStyles.inqName}>{i.title}</div>
                    <div style={adminStyles.inqService}>{i.category} · {i.date}</div>
                  </div>
                </div>
                <div>
                  <button style={{ ...adminStyles.replyBtn, padding: '0.4rem 0.8rem', textDecoration: 'none' }} onClick={() => startEditInsight(i)}>Edit</button>
                </div>
              </div>
            ))}
          </div>

          <div style={adminStyles.detail}>
            <div style={adminStyles.detailTitle}>{editingInsight ? 'Edit Insight' : 'Add New Insight'}</div>
            <p style={{ ...adminStyles.inqService, marginBottom: '1.5rem' }}>{editingInsight ? 'Update insight details below.' : 'Share news, thoughts, or tutorials via the insights block.'}</p>
            <form onSubmit={saveInsight}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={adminStyles.fieldLabel}>Domain/Category</div>
                  <input style={adminStyles.input} required value={insightForm.category} onChange={e => setInsightForm(f => ({ ...f, category: e.target.value }))} />
                </div>
                <div>
                  <div style={adminStyles.fieldLabel}>Title / News</div>
                  <input style={adminStyles.input} required value={insightForm.title} onChange={e => setInsightForm(f => ({ ...f, title: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={adminStyles.fieldLabel}>Thoughts / Description</div>
                <textarea style={{ ...adminStyles.input, minHeight: '80px', resize: 'vertical' }} required value={insightForm.excerpt} onChange={e => setInsightForm(f => ({ ...f, excerpt: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <div style={adminStyles.fieldLabel}>Date (e.g. Apr 10, 2025)</div>
                  <input style={adminStyles.input} required value={insightForm.date} onChange={e => setInsightForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <div style={adminStyles.fieldLabel}>Read Time (e.g. 5 min read)</div>
                  <input style={adminStyles.input} required value={insightForm.readTime} onChange={e => setInsightForm(f => ({ ...f, readTime: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                <div>
                  <div style={adminStyles.fieldLabel}>Emoji</div>
                  <input style={adminStyles.input} value={insightForm.icon} onChange={e => setInsightForm(f => ({ ...f, icon: e.target.value }))} />
                </div>
                <div>
                  <div style={adminStyles.fieldLabel}>Background Color/Gradient</div>
                  <input style={adminStyles.input} placeholder="linear-gradient(135deg, #0D3B2E, #1A5C46)" value={insightForm.bg} onChange={e => setInsightForm(f => ({ ...f, bg: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={adminStyles.fieldLabel}>Custom Image (optional)</div>
                <p style={{ fontSize: '0.7rem', color: '#9A9990', marginBottom: '8px' }}>Overrides emoji presentation.</p>
                {insightForm.image && <div style={{marginBottom: '0.5rem'}}><img src={insightForm.image} style={{height: 48, borderRadius: 4, objectFit: 'cover'}} alt="preview" /></div>}
                <input type="file" accept="image/*" style={{ ...adminStyles.input, padding: '0.4rem' }} onChange={handleInsightImageUpload} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" style={{ ...adminStyles.loginBtn, width: 'auto', padding: '0.8rem 2rem' }}>{editingInsight ? 'Save Changes' : '+ Create Insight'}</button>
                {editingInsight && <button type="button" onClick={cancelEditInsight} style={{ ...adminStyles.loginBtn, background: '#EDECE8', color: '#0D1B3E', width: 'auto', padding: '0.8rem 2rem' }}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      )}
      {tab === 'hero' && (
        <div style={{ ...adminStyles.mainArea, paddingTop: '2rem' }}>
          <div style={adminStyles.list}>
            <div style={adminStyles.listHeader}>
              <div style={adminStyles.listTitle}>Floating Hero Images</div>
              <button style={adminStyles.refreshBtn} onClick={fetchHeroImages}>↻ Refresh</button>
            </div>
            {heroImages.length === 0 && <div style={adminStyles.empty}>No hero images uploaded yet.</div>}
            {heroImages.map(i => (
              <div key={i._id} style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #EDECE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={i.image} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} alt={i.title} />
                  <div>
                    <div style={adminStyles.inqName}>{i.title}</div>
                    <div style={adminStyles.inqService}>Pos: {i.xPos}%, {i.yPos}% | Scale: {i.scale}</div>
                  </div>
                </div>
                <div>
                  <button style={{ ...adminStyles.deleteBtn, padding: '0.4rem 0.8rem' }} onClick={() => deleteHeroImage(i._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div style={adminStyles.detail}>
            <div style={adminStyles.detailTitle}>Add Hero Image</div>
            <p style={{ ...adminStyles.inqService, marginBottom: '1.5rem' }}>Upload images that will float in the background of the Hero section.</p>
            <form onSubmit={saveHeroImage}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={adminStyles.fieldLabel}>Image Title (internal reference)</div>
                <input style={adminStyles.input} required value={heroImageForm.title} onChange={e => setHeroImageForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={adminStyles.fieldLabel}>X Pos (0-100%)</div>
                  <input type="number" style={adminStyles.input} required value={heroImageForm.xPos} onChange={e => setHeroImageForm(f => ({ ...f, xPos: e.target.value }))} />
                </div>
                <div>
                  <div style={adminStyles.fieldLabel}>Y Pos (0-100%)</div>
                  <input type="number" style={adminStyles.input} required value={heroImageForm.yPos} onChange={e => setHeroImageForm(f => ({ ...f, yPos: e.target.value }))} />
                </div>
                <div>
                  <div style={adminStyles.fieldLabel}>Scale (0.5 to 2)</div>
                  <input type="number" step="0.1" style={adminStyles.input} required value={heroImageForm.scale} onChange={e => setHeroImageForm(f => ({ ...f, scale: e.target.value }))} />
                </div>
              </div>
              
              <div style={{ marginTop: '0.5rem' }}>
                <div style={adminStyles.fieldLabel}>Upload Image</div>
                {heroImageForm.image && <div style={{marginBottom: '0.5rem'}}><img src={heroImageForm.image} style={{height: 72, borderRadius: 4, objectFit: 'cover'}} alt="preview" /></div>}
                <input type="file" accept="image/*" style={{ ...adminStyles.input, padding: '0.4rem' }} onChange={handleHeroImageUpload} required />
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                <button type="submit" style={{ ...adminStyles.loginBtn, width: 'auto', padding: '0.8rem 2rem' }}>+ Upload Hero Image</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
