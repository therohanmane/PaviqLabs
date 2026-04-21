import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api.js'
import '../styles/chatbot.css'

const WELCOME =
  'Hey 👋 Welcome to PaviqLabs. How can I help you today? Would you like to start a project or talk to our team?'

const QUICK_ACTIONS = [
  { label: '🚀 Start a Project', text: 'I want to build a product with my startup idea' },
  { label: '💰 Pricing', text: 'What is your pricing and budget options?' },
  { label: '🛠 Services', text: 'What services do you offer?' },
  { label: '📞 Contact', text: 'I want to contact your team', scroll: 'contact' },
  { label: '📄 Portfolio', text: 'Show me your portfolio and past work', scroll: 'projects' },
]

function typingDelayMs() {
  return 500 + Math.floor(Math.random() * 501)
}

export default function Chatbot() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, open, scrollToBottom])

  const goToSection = useCallback(
    id => {
      const run = () => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(run, 350)
      } else {
        run()
      }
    },
    [location.pathname, navigate]
  )

  const sendMessage = useCallback(
    async (rawText, options = {}) => {
      const text = String(rawText || '').trim()
      if (!text || loading) return

      if (options.scroll) {
        goToSection(options.scroll)
      }

      setMessages(prev => [...prev, { role: 'user', text }])
      setInput('')
      setLoading(true)

      try {
        const { data } = await api.post('/chat', { message: text })
        await new Promise(r => setTimeout(r, typingDelayMs()))
        const reply = data?.reply || 'Something went wrong. Please try again.'
        setMessages(prev => [...prev, { role: 'bot', text: reply }])
      } catch {
        await new Promise(r => setTimeout(r, typingDelayMs()))
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            text:
              'We could not reach the assistant right now. Please use the contact form or email info@paviqlabs.in.',
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [loading, goToSection]
  )

  const onSend = () => sendMessage(input)

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  if (location.pathname === '/admin') return null

  return (
    <div className="paviq-chat-root" aria-live="polite">
      <button
        type="button"
        className="paviq-chat-fab"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="paviq-chat-panel"
        title={open ? 'Close chat' : 'Open PaviqLabs chat'}
      >
        {open ? '✕' : '💬'}
      </button>

      <div
        id="paviq-chat-panel"
        className="paviq-chat-panel"
        data-open={open}
        role="dialog"
        aria-label="PaviqLabs assistant"
        aria-hidden={!open}
      >
        <header className="paviq-chat-header">
          <div className="paviq-chat-header-avatar">PL</div>
          <div className="paviq-chat-header-text">
            <div className="paviq-chat-header-title">PaviqLabs</div>
            <div className="paviq-chat-header-sub">Assistant · rule-based</div>
          </div>
          <button type="button" className="paviq-chat-close" onClick={() => setOpen(false)} aria-label="Close">
            ×
          </button>
        </header>

        <div className="paviq-chat-chips">
          {QUICK_ACTIONS.map(a => (
            <button
              key={a.label}
              type="button"
              className="paviq-chat-chip"
              disabled={loading}
              onClick={() => sendMessage(a.text, { scroll: a.scroll })}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="paviq-chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`paviq-chat-row paviq-chat-row--${m.role}`}>
              <div className="paviq-chat-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="paviq-chat-typing-wrap">
              <div className="paviq-chat-typing-label">Bot is typing...</div>
              <div className="paviq-chat-typing" aria-hidden>
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <footer className="paviq-chat-footer">
          <div className="paviq-chat-input-row">
            <input
              className="paviq-chat-input"
              placeholder="Ask about services, pricing, tech stack…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              maxLength={2000}
            />
            <button type="button" className="paviq-chat-send" onClick={onSend} disabled={loading || !input.trim()}>
              →
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
