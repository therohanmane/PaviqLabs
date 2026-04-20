import { useEffect, useRef, useState } from 'react'
import api from '../utils/api.js'

function animCount(el, target, suffix = '') {
  let start = 0
  const dur = 1800
  const step = ts => {
    if (!start) start = ts
    const prog = Math.min((ts - start) / dur, 1)
    const ease = 1 - Math.pow(1 - prog, 3)
    el.innerHTML = Math.floor(ease * target) + '<span>' + suffix + '</span>'
    if (prog < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function Hero() {
  const statsRef = useRef(null)
  const counted = useRef(false)

  const [stats, setStats] = useState([])
  const [heroImages, setHeroImages] = useState([])
  const [positions, setPositions] = useState({})
  const [heroQuote, setHeroQuote] = useState('Speed without security is a gamble. Security without speed is a cage. We give you both.')

  useEffect(() => {
    api.get('/settings').then(res => {
      const s = res.data.settings
      if (s?.heroStats?.length > 0) setStats(s.heroStats.filter(x => x.enabled !== false))
      if (s?.quotes?.hero) setHeroQuote(s.quotes.hero)
    }).catch(() => {})

    api.get('/hero-images').then(res => {
      if (res.data.images) setHeroImages(res.data.images)
    }).catch(err => {})
  }, [])

  // Drifting Randomizer & Repulsion Engine
  useEffect(() => {
    if (!heroImages.length) return

    const repelAndClamp = (arr) => {
      let next = [...arr.map(p => ({ ...p }))]
      for (let s = 0; s < 4; s++) { // iterative relaxation
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            let dx = next[j].x - next[i].x
            let dy = next[j].y - next[i].y
            let dist = Math.sqrt(dx * dx + dy * dy) || 1
            if (dist < 18) { // they must be 18% apart minimum
              let force = (18 - dist) / 2
              let pX = (dx / dist) * force
              let pY = (dy / dist) * force
              next[i].x -= pX; next[i].y -= pY
              next[j].x += pX; next[j].y += pY
            }
          }
        }
      }
      next.forEach(p => {
        p.x = Math.max(15, Math.min(85, p.x))
        p.y = Math.max(15, Math.min(85, p.y))
      })
      return next
    }

    // Initialize
    let curState = heroImages.map((img) => {
      let x = img.xPos
      let y = img.yPos
      if (x === 50 && y === 50) {
        x = 15 + Math.random() * 70
        y = 15 + Math.random() * 70
      }
      return { id: img._id, x, y }
    })
    
    curState = repelAndClamp(curState)
    const newPosObj = {}
    curState.forEach(p => newPosObj[p.id] = { x: p.x, y: p.y })
    setPositions(newPosObj)

    // Drift loop
    const interval = setInterval(() => {
      curState = curState.map(p => ({
        id: p.id,
        x: p.x + (Math.random() - 0.5) * 15,
        y: p.y + (Math.random() - 0.5) * 15
      }))
      curState = repelAndClamp(curState)
      
      const updateObj = {}
      curState.forEach(p => updateObj[p.id] = { x: p.x, y: p.y })
      setPositions(updateObj)
    }, 4500)

    return () => clearInterval(interval)
  }, [heroImages])

  useEffect(() => {
    if (!statsRef.current || stats.length === 0) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && !counted.current) {
            counted.current = true
            const nums = e.target.querySelectorAll('.hero-stat-num')
            nums.forEach(num => {
              const val = parseFloat(num.dataset.val)
              if (!isNaN(val)) animCount(num, val, num.dataset.suffix)
            })
          }
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [stats])

  return (
    <>
      <section id="hero">
        <div className="hero-fluid-bg">
          <div className="fluid-orb fluid-orb-1" />
          <div className="fluid-orb fluid-orb-2" />
          <div className="fluid-orb fluid-orb-3" />
        </div>

        {/* ─── GLOBAL TRUST & DEVELOPMENT ANIMATION ─── */}
        <div className="hero-global-visual">
          <svg viewBox="0 0 1000 1000" className="hero-globe-svg">
            <defs>
              <radialGradient id="trust-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{stopColor:'var(--gold)', stopOpacity:0.25}} />
                <stop offset="100%" style={{stopColor:'var(--gold)', stopOpacity:0}} />
              </radialGradient>
            </defs>

            {/* Background Globe Wireframe */}
            <g className="globe-wireframe">
              {[...Array(12)].map((_, i) => (
                <ellipse key={`lat-${i}`} cx="500" cy="500" rx="400" ry={400 * Math.sin((i + 1) * Math.PI / 13)} fill="none" strokeWidth="0.5" />
              ))}
              {[...Array(12)].map((_, i) => (
                <ellipse key={`lon-${i}`} cx="500" cy="500" rx={400 * Math.sin((i + 1) * Math.PI / 13)} ry="400" fill="none" strokeWidth="0.5" />
              ))}
              <circle cx="500" cy="500" r="400" fill="none" strokeWidth="1" />
            </g>

            {/* Trust Pulse Rings */}
            <circle cx="500" cy="500" r="100" className="trust-pulse-ring" fill="none" />
            <circle cx="500" cy="500" r="100" className="trust-pulse-ring" fill="none" style={{animationDelay: '2s'}} />
            <circle cx="500" cy="500" r="100" className="trust-pulse-ring" fill="none" style={{animationDelay: '4s'}} />

            {/* Connecting Global Nodes */}
            <g className="global-connections">
              {[
                {x: 300, y: 350}, {x: 700, y: 400}, {x: 400, y: 700}, 
                {x: 600, y: 250}, {x: 250, y: 600}, {x: 750, y: 650}
              ].map((node, i) => (
                <g key={`node-group-${i}`}>
                  <line x1="500" y1="500" x2={node.x} y2={node.y} className="connection-line" strokeWidth="0.5" />
                  <circle cx={node.x} cy={node.y} r="4" className="connection-node" style={{animationDelay: `${i * 0.5}s`}} />
                </g>
              ))}
            </g>

            {/* Speed Streaks */}
            {[...Array(5)].map((_, i) => (
              <line key={`streak-${i}`} x1="0" y1={200 + i * 150} x2="300" y2={200 + i * 150} className="hero-speed-streak" style={{animationDelay: `${i * 0.7}s`}} />
            ))}
          </svg>
        </div>

        {heroImages.map((img) => {
          const pos = positions[img._id] || { x: img.xPos, y: img.yPos }
          const depth = img.scale || 1
          return (
            <img
              key={img._id}
              src={img.image}
              alt={img.title}
              className="hero-floating-img"
              style={{
                top: `${pos.y}%`,
                left: `${pos.x}%`,
                width: `${160 * depth}px`,
                height: `${220 * depth}px`
              }}
            />
          )
        })}

        <div className="hero-content">
          <h1 className="hero-headline">
            <div className="hero-line">
              {"Build something".split(" ").map((word, i) => (
                <span key={i} className="hero-word-wrapper">
                  <span className="hero-word" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                    {word}
                  </span>
                  <span>&nbsp;</span>
                </span>
              ))}
            </div>
            <div className="hero-line">
              {"to be proud of.".split(" ").map((word, i) => (
                <span key={i} className="hero-word-wrapper">
                  <span className="hero-word" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                    {word}
                  </span>
                  {i < 3 ? <span>&nbsp;</span> : null}
                </span>
              ))}
            </div>
          </h1>
          <p className="hero-sub-quote">
            &ldquo;{heroQuote}&rdquo;
          </p>
        </div>

        {stats.length > 0 && (
          <div className="hero-stats" ref={statsRef}>
            {stats.map((s, idx) => {
              const isEmoji = isNaN(parseFloat(s.value))
              return (
                <div key={idx} className="hero-stat-card">
                  <div 
                    className="hero-stat-num" 
                    data-val={s.value} 
                    data-suffix={s.suffix} 
                    style={isEmoji ? { fontSize: '2.5rem', lineHeight: 1.2 } : {}}
                  >
                    {s.value}<span>{s.suffix}</span>
                  </div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
