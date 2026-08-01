# 🥐 Curry Puff Counter

> **Mobile-First Full-Stack Web Application for Tracking Handmade Curry Puff Vendor Shipments & RM Revenue.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748?logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📸 Overview

**Curry Puff Counter** is an artisanal bakery and delivery fleet management system engineered to track daily curry puff deliveries, calculate vendor-specific Ringgit Malaysia (RM) revenue earnings, and provide real-time volume analytics on mobile devices and desktop workstations.

---

## ✨ Key Features

- 📱 **Mobile-First UX**:
  - Sticky mobile bottom navigation bar (`Dashboard`, `Vendors`, `Deliveries`).
  - One-tap **Delivery Counter** positioned at the top on mobile viewports for delivery drivers on-the-go.
  - Large touch targets (48px+ button heights) and numeric keypad triggers (`inputMode="numeric"`).
  - Quick-preset increment buttons (`+5`, `+10`, `+25`, `+50`).

- 💰 **Per-Vendor Unit Pricing (RM)**:
  - Configure individual unit prices per vendor location (e.g. *Uncle Ali's Cafe* @ RM 1.50, *Downtown Kiosk* @ RM 1.60, *Night Market Stall #4* @ RM 1.80, *Premium Cafe* @ RM 2.20).
  - Selecting a vendor automatically loads that vendor's set rate and calculates live subtotal revenue (`Quantity × Rate = RM Subtotal`).
  - Detailed financial analytics on Summary Cards and Recharts 7-Day Bar Charts.

- 📊 **Dashboard & Analytics**:
  - Summary Cards: **Total Delivered Today**, **Total Active Vendors**, and **Total Delivered This Week**.
  - Interactive **Recharts 7-Day Bar Chart** breaking down daily puff shipments and RM earnings.
  - Real-time search and filterable delivery logs.

- 🔐 **Authentication & Data Isolation**:
  - Secure JWT authentication stored in HttpOnly cookies with `bcryptjs` password hashing.
  - Strict user-level data isolation so each logged-in user only views their own vendors and delivery history.

- ⚡ **Production Server Configured**:
  - Custom HTTP server (`server.js`) listening on **Port 6000**.

---

## 🛠️ Systemd Linux Service Setup (`systemctl`)

### 1. Automatic One-Line Systemd Installer
Run the included installer script with `sudo` to automatically configure, enable, and start the systemd service on Linux:

```bash
chmod +x ./scripts/setup-systemd.sh
sudo ./scripts/setup-systemd.sh install
```

### 2. Manual Systemd Configuration
You can also manually copy `currypuffcounter.service` into `/etc/systemd/system/`:

```bash
# 1. Copy service configuration file
sudo cp currypuffcounter.service /etc/systemd/system/

# 2. Reload systemd daemon
sudo systemctl daemon-reload

# 3. Enable service on system boot
sudo systemctl enable currypuffcounter

# 4. Start the service
sudo systemctl start currypuffcounter
```

### 3. Service Management Commands

```bash
# Check service status
sudo systemctl status currypuffcounter

# Start service
sudo systemctl start currypuffcounter

# Stop service
sudo systemctl stop currypuffcounter

# Restart service
sudo systemctl restart currypuffcounter

# View live application logs
sudo journalctl -u currypuffcounter -f
```

---

## 📁 Repository File Structure

```
currypuffcounter/
├── app/
│   ├── layout.jsx            # Root layout with mobile viewport & BottomNav
│   ├── globals.css           # Custom glassmorphism & Tailwind styles
│   ├── page.jsx              # Auth redirector
│   ├── login/page.jsx        # Login view with Handmade Curry Puff logo
│   ├── register/page.jsx     # User signup view
│   ├── dashboard/page.jsx    # Mobile-first Dashboard with Recharts & Counter
│   ├── vendors/page.jsx      # Vendor management & unit price settings
│   ├── deliveries/page.jsx   # Delivery logs history with vendor filter
│   └── api/
│       ├── auth/             # Login, register, logout, me routes
│       ├── vendors/          # Vendor CRUD API with RM unit pricing
│       └── deliveries/       # Delivery logging & aggregated stats API
├── components/
│   ├── BottomNav.jsx         # Mobile bottom navigation bar
│   ├── Navbar.jsx            # Desktop top navigation header
│   ├── SummaryCards.jsx      # Metrics cards (Count + RM Revenue)
│   ├── DeliveryChart.jsx     # Recharts 7-day volume chart
│   ├── QuickCounterForm.jsx  # Mobile-friendly delivery counter
│   ├── VendorList.jsx        # Vendor management list
│   └── RecentDeliveriesTable.jsx # Delivery logs history table
├── scripts/
│   └── setup-systemd.sh      # Automated Linux systemd installer script
├── prisma/
│   ├── schema.prisma         # Prisma schema (User, Vendor, Delivery models)
│   ├── seed.js               # Clean database seed configuration
│   └── clean.js              # Database cleanup script
├── public/
│   └── logo.png              # Handmade Curry Puff mascot logo
├── currypuffcounter.service  # Linux systemd service unit file
├── server.js                 # Custom HTTP server on port 6000
├── package.json              # Project configuration & npm scripts
├── tailwind.config.js        # Theme tokens
└── next.config.js            # Next.js server options
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `18.x` or later
- npm `9.x` or later

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/boonpin1975/currypuffcounter.git
cd currypuffcounter

# Install dependencies
npm install

# Push database schema
npx prisma db push
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=6000
NODE_ENV=production
JWT_SECRET=curry-puff-secret-key-super-secure-2026
DATABASE_URL="file:./dev.db"
```

### 4. Running the Production Server

```bash
# Build the production application
npm run build

# Start the server on Port 6000
npm start
```

Access the app in your browser at `http://localhost:6000`.

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
