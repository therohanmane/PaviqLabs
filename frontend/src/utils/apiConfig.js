/**
 * VITE_API_URL must be the API **origin** only (no path), e.g.
 *   https://paviqlabs.onrender.com
 * Requests are built as: `${origin}/api${path}`  (same as fetch(`${origin}/api/...`))
 *
 * Legacy env values ending in `/api` are normalized automatically.
 */
export function getApiOrigin() {
  const raw = (import.meta.env.VITE_API_URL || '').trim()
  if (!raw) return null

  let u = raw.replace(/\/+$/, '')
  if (u.toLowerCase().endsWith('/api')) {
    u = u.slice(0, -4).replace(/\/+$/, '')
  }
  if (!/^https?:\/\//i.test(u)) {
    u = `https://${u}`
  }
  try {
    const parsed = new URL(u)
    return parsed.origin
  } catch {
    return null
  }
}

/** Full base for axios paths like `/settings` → `.../api/settings` */
export function getApiPrefix() {
  const o = getApiOrigin()
  if (o) return `${o}/api`
  // Dev: same-origin `/api` so Vite `server.proxy` can reach the backend (no hardcoded host in bundle).
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return `${window.location.origin}/api`
  }
  return null
}

export function isApiConfigured() {
  return import.meta.env.PROD ? Boolean(getApiOrigin()) : Boolean(getApiPrefix())
}

/**
 * Build absolute URL for fetch (path must start with /, e.g. `/settings`).
 * Returns null if API is not configured — caller should skip or handle.
 */
export function buildApiUrl(path) {
  const prefix = getApiPrefix()
  if (!prefix) return null
  const p = path.startsWith('/') ? path : `/${path}`
  return `${prefix}${p}`
}
