import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import PageLoader from './components/PageLoader.jsx'
import Cursor from './components/Cursor.jsx'
import BackToTop from './components/BackToTop.jsx'
import WhatsAppBtn from './components/WhatsAppBtn.jsx'
import Chatbot from './components/Chatbot.jsx'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1900)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Router>
      <PageLoader hidden={!loading} />
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <BackToTop />
      <WhatsAppBtn />
      <Chatbot />
    </Router>
  )
}
