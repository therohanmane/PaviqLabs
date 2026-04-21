import axios from 'axios'

// ✅ Ensure API URL always works
const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── REQUEST INTERCEPTOR ───
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // ✅ Debug log (very useful)
    console.log('➡️ API Request:', config.method?.toUpperCase(), config.url)

    return config
  },
  (error) => Promise.reject(error)
)

// ─── RESPONSE INTERCEPTOR ───
api.interceptors.response.use(
  (response) => {
    // ✅ Optional debug
    console.log('✅ API Response:', response.config.url)
    return response
  },
  (error) => {
    // 🔴 Network error (backend down / CORS / wrong URL)
    if (!error.response) {
      console.error('🚨 Network Error:', error.message)
      alert('Server not reachable. Please try again later.')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // 🔐 Unauthorized
    if (status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin'
    }

    // ❌ Not found (wrong API route)
    if (status === 404) {
      console.error('❌ API 404:', error.config.url)
    }

    // ⚠️ Other errors
    console.error('🔥 API Error:', status, data?.message || error.message)

    return Promise.reject(error)
  }
)

export default api