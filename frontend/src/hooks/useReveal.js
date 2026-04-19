import { useEffect } from 'react'

export function useReveal(dependencies = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    const elements = document.querySelectorAll('.reveal')
    elements.forEach(el => {
      // If already visible, don't observe
      if (!el.classList.contains('visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  }, dependencies)
}
