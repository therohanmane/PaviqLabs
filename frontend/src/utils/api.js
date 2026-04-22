import axios from 'axios'
import { getApiPrefix } from './apiConfig.js'

export const API_UNAVAILABLE = 'API_UNAVAILABLE'

const api = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const base = getApiPrefix()
    if (!base) {
      const err = new Error('API not configured: set VITE_API_URL to your backend origin (e.g. https://api.example.com)')
      err.code = API_UNAVAILABLE
      return Promise.reject(err)
    }
    config.baseURL = base

    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (import.meta.env.DEV) {
      console.log('➡️ API Request:', config.method?.toUpperCase(), config.baseURL + (config.url || ''))
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.config.url)
    }
    return response
  },
  (error) => {
    if (error?.code === API_UNAVAILABLE) {
      console.warn('⚠️', error.message)
      return Promise.reject(error)
    }

    if (!error.response) {
      console.error('🚨 Network Error:', error.message)
      return Promise.reject(error)
    }

    const { status, data } = error.response

    if (status === 401) {
      const reqUrl = error.config?.url || ''
      if (!reqUrl.includes('/admin/login')) {
        localStorage.removeItem('admin_token')
        window.location.href = '/admin'
      }
    }

    if (status === 404) {
      console.error('❌ API 404:', error.config?.url)
    }

    console.error('🔥 API Error:', status, data?.message || error.message)

    return Promise.reject(error)
  }
)

/**
 * Same URL shape as fetch(`${import.meta.env.VITE_API_URL}/api/...`) using shared resolution.
 * Returns parsed JSON or throws (including when API is not configured).
 */
export async function apiFetchJson(path, options = {}) {
  const { method = 'GET', body, headers: extraHeaders = {} } = options
  const base = getApiPrefix()
  if (!base) {
    const err = new Error('API not configured')
    err.code = API_UNAVAILABLE
    throw err
  }
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const headers = { 'Content-Type': 'application/json', ...extraHeaders }
  const token = localStorage.getItem('admin_token')
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export default api
