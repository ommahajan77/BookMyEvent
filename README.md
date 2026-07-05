# BookMyEvent 🎟️

A full-stack event booking platform built with the MERN stack — browse events, pick seats visually, pay online, and get an instant QR e-ticket you can download as a PDF. Includes a complete admin panel with analytics.

## Tech Stack
- **Frontend:** React + Vite, React Router, Axios, Tailwind CSS, Recharts
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Images:** Multer + Cloudinary
- **Payments:** Razorpay
- **QR Tickets:** `qrcode` npm package
- **PDF Tickets:** `pdfkit`
- **Email:** Nodemailer

## Project Structure
```
BookMyEvent/
├── client/     # React + Vite frontend
└── server/     # Express + MongoDB backend
```

## Getting Started

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env   # fill in your MongoDB URI, JWT secret, Cloudinary & Razorpay keys, email creds
npm run dev             # starts on http://localhost:5000
```

Optionally seed an admin user + sample events:
```bash
node seed.js
```
Default admin login (from `.env` `ADMIN_EMAIL` / `ADMIN_PASSWORD`): `admin@bookmyevent.com` / `Admin@123`

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env    # set VITE_API_URL to your backend URL
npm run dev              # starts on http://localhost:5173
```

## Environment Variables

### server/.env
See `server/.env.example` for the full list: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `RAZORPAY_*`, `EMAIL_*`.

### client/.env
```
VITE_API_URL=http://localhost:5000/api
```

## Core Features

**User:** Register/Login (JWT), browse & search/filter events, visual seat picker, Razorpay checkout, QR e-ticket generation, downloadable PDF ticket, booking history & cancellation, profile + avatar upload, change password, forgot/reset password via email.

**Admin:** Dashboard with revenue/booking charts (Recharts), CRUD for events with poster upload (Cloudinary), manage all bookings, manage users, analytics summary.

## API Overview
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/change-password
POST   /api/auth/forgot-password
PUT    /api/auth/reset-password/:token

GET    /api/events
GET    /api/events/:id

POST   /api/bookings
GET    /api/bookings/my
GET    /api/bookings/:id
PUT    /api/bookings/:id/cancel
GET    /api/bookings/:id/ticket

POST   /api/payment/create-order
POST   /api/payment/verify

GET    /api/admin/analytics
GET    /api/admin/events
POST   /api/admin/events
PUT    /api/admin/events/:id
DELETE /api/admin/events/:id
GET    /api/admin/bookings
GET    /api/admin/users
DELETE /api/admin/users/:id
```

## Deployment
- **Frontend:** Deploy `client/` to Vercel. Set `VITE_API_URL` to your deployed backend URL.
- **Backend:** Deploy `server/` to Render (or Railway). Set all env vars from `.env.example` in the dashboard, and set `CLIENT_URL` to your deployed frontend URL for CORS.

## Notes
- Seat maps are auto-generated (8 seats per row, labelled A1, A2... ) based on each event's `totalSeats`.
- Payments use Razorpay test mode by default — add your test keys to try the full checkout flow.
- Add real Cloudinary and SMTP credentials to enable poster uploads and forgot-password emails.
