# PAVIQLABS - Official Full-Stack Website

PAVIQLABS is a high-performance, enterprise-grade website built for a technology startup focusing on Cybersecurity, DevOps, and Full-Stack development. This repository contains the complete frontend and backend implementation.

---

## 🏗️ Project Architecture

The project is structured as a monorepo for ease of development:

```text
paviqlabs/
├── frontend/                 # React 18 + Vite (Client Side)
│   ├── src/
│   │   ├── components/       # Reusable UI components (Hero, Navbar, etc.)
│   │   ├── pages/            # Main views (Home, Admin Dashboard)
│   │   ├── hooks/            # Custom React hooks (Reveal animations)
│   │   └── index.css         # Global styling & Responsive design
├── backend/                  # Node.js + Express (API & Server)
│   ├── models/               # MongoDB Schemas (Service, Project, Insight, etc.)
│   ├── routes/               # API Endpoints (Admin, Contact, Services)
│   ├── utils/                # Helper utilities (Email delivery)
│   └── server.js             # Main server entry point
├── package.json              # Root configuration & scripts
└── README.md                 # Project documentation
```

---

## ⚡ Key Features

- **Dynamic CMS**: Admin dashboard to manage services, projects, team members, and testimonials in real-time.
- **Responsive Design**: Fully optimized for all resolutions (Desktop, Tablet, Mobile) with fluid typography and adaptive grids.
- **Enterprise Aesthetics**: High-contrast SVG animations, terminal-style status logs, and "Engineering Excellence" visuals.
- **Secure Architecture**: JWT-based admin authentication, rate-limiting on contact forms, and security-hardened headers.
- **Interactive UX**: Custom cursor, scroll-reveal animations, typewriter effects, and a breathing global wireframe hero.

---

## 🚀 Installation & Setup Guide

Follow these steps exactly to run the project without errors.

### 1. Prerequisites
- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas account)

### 2. Clone and Install
First, install dependencies for the root, frontend, and backend simultaneously:

```bash
npm run install:all
```

### 3. Environment Configuration
The backend requires a `.env` file to function. Create one by copying the example:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update the following variables:
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure random string for authentication.
- `ADMIN_USERNAME` & `ADMIN_PASSWORD`: Your login credentials for the dashboard.
- `SMTP_USER` & `SMTP_PASS`: For email notifications (if using Gmail, use an [App Password](https://myaccount.google.com/apppasswords)).

### 4. Running the Application

To start both the frontend and backend in development mode:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🛠️ Maintenance & Production

### Building for Production
To build the frontend for deployment:

```bash
npm run build
```
This generates a `dist` folder inside `frontend/`.

### Starting the Production Server
```bash
npm start
```

### Common Troubleshooting
- **CORS Errors**: Ensure the `backend/server.js` allows requests from your frontend origin (default is localhost:3000).
- **MongoDB Connection**: If using Atlas, ensure your IP address is whitelisted in the MongoDB Network Access settings.
- **Port Conflicts**: If port 3000 or 5000 is in use, you can change them in the respective `package.json` or `.env` files.

---

## 📞 Contact & Support

- **Official Website**: [paviqlabs.in](https://paviqlabs.in)
- **Email**: info@paviqlabs.in
- **Location**: Kothrud, Pune, Maharashtra, India

---

*Built with precision by the PaviqLabs Engineering Team.*
