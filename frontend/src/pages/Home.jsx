import { useEffect, useState } from 'react'
import api from '../utils/api.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import ContactSection from '../components/ContactSection.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { marqueeItems } from '../utils/site.js'

const isEnabled = (item) => item?.enabled !== false

export default function Home() {
  const [projectsList, setProjectsList] = useState([])
  const [insights, setInsights] = useState([])
  const [servicesList, setServicesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useReveal([projectsList, insights, servicesList])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [p, i, s] = await Promise.all([
          api.get('/projects'),
          api.get('/insights'),
          api.get('/services')
        ])

        setProjectsList(p.data.projects || [])
        setInsights(i.data.insights || [])
        setServicesList(s.data.services || [])

      } catch (err) {
        console.error(err)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const services = servicesList.filter(isEnabled)
  const projects = projectsList.filter(isEnabled)
  const blogInsights = insights.filter(isEnabled)

  if (loading) {
    return <div style={{padding:"100px",textAlign:"center"}}>Loading...</div>
  }

  if (error) {
    return <div style={{padding:"100px",textAlign:"center",color:"red"}}>{error}</div>
  }

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

      {/* SERVICES */}
      <section id="services">
        <h2>Services</h2>
        <div className="services-grid">
          {services.map((s) => (
            <div key={s._id} className="service-card">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ENGINEERING SECTION (FIXED JSX) */}
      <section className="eng-section">
        <h2>Engineering Excellence</h2>

        <div className="eng-terminal">
          <div><span>&gt; stack</span> Vault + Keycloak + Snyk</div>
          <div><span>&gt; approach</span> Zero-trust architecture</div>
          <div><span>&gt; audit</span> OWASP hardened</div>
        </div>

        <div className="eng-terminal">
          <div><span>&gt; primary</span> PostgreSQL / MongoDB</div>
          <div><span>&gt; caching</span> Redis</div>
          <div><span>&gt; scaling</span> Horizontal scaling</div>
        </div>

        <div className="eng-terminal">
          <div><span>&gt; infra</span> AWS / Kubernetes</div>
          <div><span>&gt; pipeline</span> CI/CD</div>
          <div><span>&gt; deploy</span> Zero downtime</div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <h2>Projects</h2>
        <div className="projects-grid">
          {projects.map((p) => (
            <div key={p._id} className="project-card">
              <h3>{p.name}</h3>
              <p>{p.useCase}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section id="blog">
        <h2>Insights</h2>
        <div className="blog-grid">
          {blogInsights.map((post) => (
            <div key={post._id} className="blog-card">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactSection />
      <Footer />
    </>
  )
} 