import nodemailer from 'nodemailer'

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Send notification to PaviqLabs team
export const sendAdminNotification = async (inquiry) => {
  if (!process.env.SMTP_USER) return // skip if email not configured

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"${process.env.CONTACT_FROM_NAME || 'PaviqLabs Website'}" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO_EMAIL || 'info@paviqlabs.in',
    subject: `New Inquiry from ${inquiry.firstName} ${inquiry.lastName} — ${inquiry.service || 'General'}`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0D1B3E; padding: 2rem; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 1.4rem;">New Website Inquiry</h1>
          <p style="color: rgba(255,255,255,0.5); margin: 0.5rem 0 0; font-size: 0.875rem;">PaviqLabs Contact Form</p>
        </div>
        <div style="background: #F7F6F2; padding: 2rem; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 0.6rem 0; color: #6B6A66; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em; width: 140px;">Name</td><td style="padding: 0.6rem 0; color: #0D1B3E; font-weight: 600;">${inquiry.firstName} ${inquiry.lastName}</td></tr>
            <tr><td style="padding: 0.6rem 0; color: #6B6A66; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em;">Email</td><td style="padding: 0.6rem 0; color: #C9A84C;"><a href="mailto:${inquiry.email}" style="color: #C9A84C;">${inquiry.email}</a></td></tr>
            <tr><td style="padding: 0.6rem 0; color: #6B6A66; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em;">Company</td><td style="padding: 0.6rem 0; color: #0D1B3E;">${inquiry.company || '—'}</td></tr>
            <tr><td style="padding: 0.6rem 0; color: #6B6A66; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.08em;">Service</td><td style="padding: 0.6rem 0; color: #0D1B3E;">${inquiry.service || '—'}</td></tr>
          </table>
          <div style="margin-top: 1.5rem; background: white; border-radius: 10px; padding: 1.2rem; border-left: 3px solid #C9A84C;">
            <div style="color: #6B6A66; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;">Message</div>
            <div style="color: #0D1B3E; line-height: 1.7;">${inquiry.message}</div>
          </div>
          <div style="margin-top: 1.5rem; text-align: center;">
            <a href="mailto:${inquiry.email}?subject=Re: Your inquiry to PaviqLabs" style="background: #0D1B3E; color: white; padding: 0.8rem 1.8rem; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Reply to ${inquiry.firstName} →</a>
          </div>
          <div style="margin-top: 1.5rem; text-align: center; color: #9A9990; font-size: 0.75rem;">Received: ${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</div>
        </div>
      </div>
    `,
  })
}

// Auto-reply to the person who submitted
export const sendAutoReply = async (inquiry) => {
  if (!process.env.SMTP_USER) return

  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"PaviqLabs" <${process.env.SMTP_USER}>`,
    to: inquiry.email,
    subject: `We received your message, ${inquiry.firstName}! — PaviqLabs`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0D1B3E; padding: 2.5rem 2rem; border-radius: 12px 12px 0 0; text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 800; color: white; letter-spacing: -0.02em;">Paviq<span style="color: #C9A84C;">Labs</span></div>
          <div style="color: rgba(255,255,255,0.4); font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 0.5rem;">Innovation · Technology · Solutions</div>
        </div>
        <div style="background: white; padding: 2.5rem 2rem;">
          <h2 style="color: #0D1B3E; font-size: 1.4rem; margin: 0 0 1rem;">Hi ${inquiry.firstName}, we got your message! 👋</h2>
          <p style="color: #6B6A66; line-height: 1.7; margin: 0 0 1.2rem;">
            Thank you for reaching out to PaviqLabs. We've received your inquiry and our team will get back to you within <strong style="color: #0D1B3E;">24 hours</strong>.
          </p>
          ${inquiry.service ? `<p style="color: #6B6A66; line-height: 1.7; margin: 0 0 1.2rem;">You expressed interest in: <strong style="color: #C9A84C;">${inquiry.service}</strong> — great choice.</p>` : ''}
          <div style="background: #F7F6F2; border-radius: 12px; padding: 1.2rem; margin: 1.5rem 0;">
            <div style="color: #9A9990; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem;">Your message</div>
            <div style="color: #0D1B3E; font-size: 0.9rem; line-height: 1.7; font-style: italic;">"${inquiry.message}"</div>
          </div>
          <p style="color: #6B6A66; line-height: 1.7; margin: 1.2rem 0;">
            In the meantime, feel free to connect with us on LinkedIn or WhatsApp if you have urgent questions.
          </p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="https://www.linkedin.com/company/paviqlabs" style="display: inline-block; background: #0D1B3E; color: white; padding: 0.8rem 2rem; border-radius: 100px; text-decoration: none; font-weight: 600;">Connect on LinkedIn →</a>
          </div>
        </div>
        <div style="background: #060E21; padding: 1.5rem 2rem; border-radius: 0 0 12px 12px; text-align: center;">
          <div style="color: rgba(255,255,255,0.3); font-size: 0.78rem;">
            © ${new Date().getFullYear()} PaviqLabs · <a href="mailto:info@paviqlabs.in" style="color: #C9A84C; text-decoration: none;">info@paviqlabs.in</a> · <a href="tel:+919405980596" style="color: rgba(255,255,255,0.3); text-decoration: none;">+91 9405 980 596</a>
          </div>
        </div>
      </div>
    `,
  })
}
