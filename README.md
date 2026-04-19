# PaviqLabs — Official Website
### Full-Stack Production Build · React + Node.js + MongoDB

---

## 🏗️ Project Structure

```
paviqlabs/
├── frontend/                 # React 18 + Vite
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx        # Sticky nav, mobile menu, active section
│       │   ├── Hero.jsx          # Animated hero with counters
│       │   ├── Footer.jsx        # Footer links
│       │   ├── PageLoader.jsx    # Loading animation
│       │   ├── Cursor.jsx        # Custom cursor (desktop)
│       │   ├── BackToTop.jsx     # Back-to-top button
│       │   ├── WhatsAppBtn.jsx   # WhatsApp click-to-chat
│       │   ├── LiveChat.jsx      # AI chatbot (Claude-powered)
│       │   └── ContactSection.jsx # Contact form with API
│       ├── pages/
│       │   ├── Home.jsx          # All sections assembled
│       │   └── Admin.jsx         # CRM dashboard
│       ├── utils/
│       │   ├── site.js           # All site content/data
│       │   └── api.js            # Axios instance
│       └── hooks/
│           └── useReveal.js      # Scroll reveal hook
├── backend/                  # Node.js + Express
│   ├── models/
│   │   └── Inquiry.js        # MongoDB schema
│   ├── routes/
│   │   ├── contact.js        # POST /api/contact
│   │   └── admin.js          # Admin CRUD + auth
│   ├── utils/
│   │   └── email.js          # Nodemailer (auto-reply + notification)
│   ├── server.js             # Main Express app
│   └── .env.example          # Environment variables template
└── package.json              # Root scripts
```

---

## ✨ Features

### Frontend
- ✅ **Exact design match** — all original styling preserved and enhanced
- ✅ **Custom cursor** with hover effects (desktop only)
- ✅ **Page loader** animation
- ✅ **Sticky navbar** with scroll-aware active section highlighting
- ✅ **Mobile hamburger menu** with full-screen overlay
- ✅ **Hero** with animated stat counters (IntersectionObserver)
- ✅ **Marquee** services ticker
- ✅ **About, Services, Process, Projects** sections
- ✅ **Testimonials** — new social proof section
- ✅ **Blog/Insights** — new content section
- ✅ **Trusted By** logos
- ✅ **Founders** profiles
- ✅ **Careers/Jobs** page with apply links
- ✅ **Contact form** — connected to real backend API
- ✅ **Back-to-top** button
- ✅ **WhatsApp** click-to-chat button
- ✅ **AI Live Chat** — powered by Claude (Anthropic API)
- ✅ **Scroll reveal** animations on all sections
- ✅ **SEO meta tags** — OG, description, keywords
- ✅ **Fully responsive** — mobile, tablet, desktop

### Backend
- ✅ **Contact form API** — saves to MongoDB
- ✅ **Email to team** — HTML notification email via Nodemailer
- ✅ **Auto-reply** — beautiful branded email to submitter
- ✅ **Rate limiting** — 5 contact submissions per 15 min
- ✅ **Security headers** — Helmet.js
- ✅ **Input validation** — express-validator
- ✅ **JWT admin auth** — secure token-based login
- ✅ **Admin CRM dashboard** — view, mark read, delete inquiries
- ✅ **Health check** endpoint

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

### 3. Run Development
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Admin: http://localhost:3000/admin

---

## 🔐 Admin Panel

URL: `/admin`

Default credentials (change in `.env`):
- Username: `admin`
- Password: `PaviqLabs@2025`

---

## 📧 Email Setup (Gmail)

1. Enable 2-Step Verification on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate an app password for "Mail"
4. Set in `.env`:
   ```
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

---

## 🗄️ Database Setup (MongoDB Atlas - Free)

1. Go to https://cloud.mongodb.com and create a free cluster
2. Create a database user
3. Get the connection string and set:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/paviqlabs
   ```

---

## 🤖 AI Chat Setup

The live chat uses the Anthropic API directly from the browser.
To enable it in production, you need to configure a backend proxy (recommended for security) or use the Anthropic API with appropriate CORS settings.

For development, the chat widget works out of the box in the Claude.ai environment.

---

## 📦 Production Deployment

### Build
```bash
npm run build          # Builds frontend to backend/public/
cd backend && npm start
```

### Deploy on Railway / Render / Heroku
1. Set all `.env` variables in the platform dashboard
2. Set `NODE_ENV=production`
3. Build command: `npm run install:all && npm run build`
4. Start command: `cd backend && npm start`

### Deploy Frontend on Vercel + Backend on Railway
- Frontend: `cd frontend && vercel`
- Backend: Deploy `backend/` folder, set env vars

---

## 📞 Contact

- Email: info@paviqlabs.in
- Phone: +91 9405 980 596
- LinkedIn: https://www.linkedin.com/company/paviqlabs
