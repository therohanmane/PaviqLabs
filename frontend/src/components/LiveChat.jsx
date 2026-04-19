import { useState, useRef, useEffect } from 'react'

const SYSTEM_PROMPT = `You are PaviqBot, the AI assistant for PaviqLabs — a premium tech company based in India specializing in Web Development, Mobile Apps, Cybersecurity, Cloud Solutions, AI & Automation, and UI/UX Design.

Key facts:
- Founded by Rohan Mane (Co-Founder, Engineering) and Kaushal Singh (Co-Founder, Cybersecurity)
- Email: info@paviqlabs.in | Phone: +91 9405 980 596
- Serving clients globally from India
- LinkedIn: https://www.linkedin.com/company/paviqlabs

Be warm, professional, and concise. Help visitors understand PaviqLabs' services, guide them to the contact form, and answer questions about the company. If asked about pricing, say it depends on project scope and invite them to get in touch. Keep responses under 80 words.`

export default function LiveChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! 👋 I\'m PaviqBot. How can I help you today? Ask me anything about our services, team, or how to get started.' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const send = async () => {
    const text = input.trim()
    if (!text || typing) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setTyping(true)

    try {
      // Build conversation history for API
      const history = messages
        .filter(m => m.role !== 'bot' || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }))
      history.push({ role: 'user', content: text })

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Sorry, I had trouble connecting. Please email us at info@paviqlabs.in'
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection error. Please reach us at info@paviqlabs.in or call +91 9405 980 596.' }])
    } finally {
      setTyping(false)
    }
  }

  const onKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <>
      <button className="chat-trigger" onClick={() => setOpen(o => !o)} aria-label="Open chat" title="Chat with PaviqBot">
        {open ? '✕' : '💬'}
      </button>

      <div className={`chat-window${open ? ' open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-avatar">PB</div>
          <div className="chat-header-info">
            <div className="chat-header-name">PaviqBot</div>
            <div className="chat-header-status">
              <div className="chat-status-dot" />
              Online · PaviqLabs AI
            </div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              <div className="chat-bubble">{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="chat-msg bot">
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
          />
          <button className="chat-send" onClick={send} disabled={typing || !input.trim()}>→</button>
        </div>
      </div>
    </>
  )
}
