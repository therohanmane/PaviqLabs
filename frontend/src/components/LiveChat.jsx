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
    { role: 'bot', text: "Hi! 👋 I'm PaviqBot. How can I help you today? You can ask about our services, how to contact the owner, or what domains we work in." }
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

    const botResponses = {
      'contact': 'You can connect with the owners/team directly via:\n\n📧 Official Email: info@paviqlabs.in\n📞 Contact: +91 9405 980 596\n\nFeel free to reach out anytime!',
      'domain': 'We specialize in several domains including:\n\n✅ Web & Mobile Development\n✅ Cybersecurity & VAPT\n✅ Cloud Infrastructure (AWS/GCP)\n✅ AI & Automation\n✅ UI/UX Design\n\nFor more specific info, please contact our team!'
    }

    // Basic logic for Q&A
    setTimeout(() => {
      const lowerText = text.toLowerCase()
      let reply = ''

      if (lowerText.includes('contact') || lowerText.includes('owner') || lowerText.includes('connect') || lowerText.includes('email') || lowerText.includes('phone')) {
        reply = botResponses['contact']
      } else if (lowerText.includes('domain') || lowerText.includes('work') || lowerText.includes('service') || lowerText.includes('type')) {
        reply = botResponses['domain']
      } else {
        reply = "I'm not sure about that. Please contact our team at info@paviqlabs.in or +91 9405 980 596 for more information!"
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply }])
      setTyping(false)
    }, 800)
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
