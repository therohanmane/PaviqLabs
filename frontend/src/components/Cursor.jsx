import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const mx = useRef(0), my = useRef(0)
  const rx = useRef(0), ry = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const onMove = e => {
      mx.current = e.clientX
      my.current = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }
    const animate = () => {
      rx.current += (mx.current - rx.current) * 0.12
      ry.current += (my.current - ry.current) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px'
        ringRef.current.style.top = ry.current + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    const addHover = () => {
      document.querySelectorAll('a, button, .service-card, .project-card, .founder-card, .trusted-logo-card, .tag, .testimonial-card, .blog-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'))
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'))
      })
    }
    document.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(animate)
    const t = setTimeout(addHover, 500)
    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      clearTimeout(t)
    }
  }, [])

  // Hide on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  )
}
