# 🛡️ DeskGuard — Smart Library Seat Management System

A polished, production-quality web application that solves library seat hoarding through QR-based seat management, real-time occupancy tracking, automated seat recovery, waitlist management, and library analytics.

---

## 🚀 Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🔐 Login Credentials

### Student Login
- Roll Number: `23BCS045` (or any alphanumeric value)
- Name: `Aurora` (or any name)
- Profiles are created automatically on first login.

### Admin Login
- URL: http://localhost:5173/admin  (or click **Admin Panel** on landing page)
- Username: `admin`
- Password: `deskguard2024`

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **QR Check-In** | Real QR codes per seat linking to `/seat/A1` etc. |
| **Live Library Map** | SVG map with 30 seats across 3 zones, real-time color updates |
| **Away Mode** | 20-min timer (20 seconds in Demo Mode) |
| **Still Here System** | Prompt every 2 hours (60 seconds in Demo Mode), auto-releases if ignored |
| **Auto-Release** | Seats returned automatically on timer expiry |
| **Waitlist** | FCFS queue with automatic seat assignment on release |
| **Heatmap** | Usage intensity overlay on the library map |
| **Analytics** | Occupancy trends, zone utilization, top seats, waitlist demand, forecasting |
| **Demo Mode** | Toggle to accelerate all timers for demo presentations |
| **Admin Dashboard** | Full monitoring: release seats, view logs, QR generation, analytics |

---

## 🗺️ Library Layout

| Zone | Seats | Location |
|------|-------|----------|
| Zone A | A1–A10 | Window Area |
| Zone B | B1–B10 | Central Area |
| Zone C | C1–C10 | Quiet Area |

---

## 🎮 Demo Flow (under 2 minutes)

1. Open http://localhost:5173 — see live landing page with stats
2. Enable **Demo Mode** (navbar toggle) to accelerate timers
3. Login as Student: `23BCS045` / `Aurora`
4. Navigate to `/seat/A1` (or click a green seat on the map)
5. Click **Check In** → seat turns red
6. Click **I'm Away** → seat turns yellow, 20-second timer starts
7. Wait → seat auto-releases back to green
8. Go to `/admin` (admin / deskguard2024)
9. View the **Activity Feed** showing all events
10. Click **Live Map** tab → toggle **Heatmap View**
11. Click **Analytics** tab → see charts and forecast
12. Click seats in the grid → **Release Seat** to trigger waitlist assignment
13. On **Map** tab, click a seat → **QR Code** to generate and download

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Charts**: Recharts
- **QR Codes**: qrcode.react
- **Icons**: Lucide React
- **Storage**: PostgreSQL via Supabase + Real-time WebSockets

---

## 🗄️ Supabase Setup

To set up the live PostgreSQL backend:

1. Create a project at [supabase.com](https://supabase.com)
2. Run the `supabase_schema.sql` code in the Supabase SQL Editor and click **Run without RLS**.
3. Copy `.env.example` to `.env.local` and fill in your values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=deskguard2024
```

4. Restart the dev server

---

## 📦 Build for Production

```bash
npm run build
```

Output is in the `dist/` folder — deploy to Vercel, Netlify, or any static host.

---

## 📁 Project Structure

```
src/
├── types/          # Shared TypeScript types
├── lib/
│   ├── db.ts           # Supabase client and database operations
│   └── supabase.ts     # Supabase initialization
├── contexts/
│   ├── DemoContext.tsx   # Demo mode timer acceleration
│   ├── AuthContext.tsx   # Student + Admin authentication
│   └── SeatContext.tsx   # Real-time seat state management
├── components/
│   ├── LibraryMap.tsx         # SVG map with heatmap support
│   ├── AnalyticsDashboard.tsx # Recharts analytics
│   ├── LiveActivityFeed.tsx   # Real-time event log
│   ├── StillHerePrompt.tsx    # Countdown modal
│   ├── QRCodeModal.tsx        # QR code generator
│   ├── WaitlistPanel.tsx      # Queue management
│   └── Navbar.tsx             # Navigation bar
├── pages/
│   ├── LandingPage.tsx       # Marketing / home page
│   ├── LoginPage.tsx         # Student + Admin login
│   ├── SeatPage.tsx          # QR scan target page
│   ├── StudentDashboard.tsx  # Student session view
│   └── AdminDashboard.tsx    # Admin control panel
└── App.tsx                   # Router + providers
supabase/
└── schema.sql    # PostgreSQL schema for Supabase
```
