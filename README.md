# BOCRA Citizen Portal — Status200

An integrated digital services platform for the **Botswana Communications Regulatory Authority (BOCRA)**, enabling citizens and organisations to interact with the regulator through a unified, secure web portal.

---

## Overview

Status200 is a full-stack web application that streamlines regulatory processes including licence applications, type approval submissions, tender management, QoS reporting, domain registry, and cyber incident reporting. An admin dashboard gives BOCRA staff real-time visibility into applications, complaints, and user activity.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Radix UI, Firebase Hosting |
| Backend | Node.js, TypeScript, Express |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| AI Assistant | Google Generative AI (Gemini) |

---

## Project Structure

```
status200/
├── frontend/          # React single-page application
│   └── src/
│       ├── pages/     # Route-level page components
│       ├── components/# Reusable UI components & admin views
│       ├── context/   # Auth & theme context providers
│       └── services/  # API client & user service layer
└── backend/           # Express REST API
    └── src/
        ├── routes/    # API route handlers
        ├── middleware/ # Authentication middleware
        └── utils/     # Activity logger & password validator
```

---

## Features

- **Citizen Dashboard** — Track submitted applications, complaints, and documents
- **Licence Applications** — Submit and monitor telecommunications licence requests
- **Type Approval** — Apply for device type approval and track review status
- **Tenders** — Browse active tender postings and submit proposals
- **QoS Reporting & Live Monitoring** — Quality of service report submission and real-time monitoring
- **Domain Registry** — Register and manage `.bw` domain names
- **Cyber Incident Reporting** — Report cybersecurity incidents to BOCRA
- **Complaints** — Lodge and track regulatory complaints
- **Admin Dashboard** — Staff interface for managing users, applications, and system settings
- **AI Chatbot** — Integrated assistant powered by Google Gemini

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- npm

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/status200
PORT=3001
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=http://localhost:3000
```

Run migrations and seed the database:

```bash
npm run prisma:migrate:dev
npm run prisma:seed
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`.

---

## Backend Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production build with migrations |
| `npm run prisma:migrate:dev` | Create and apply schema migrations |
| `npm run prisma:migrate:deploy` | Apply migrations in production |
| `npm run prisma:seed` | Seed database with initial data |
| `npm run prisma:studio` | Open Prisma Studio |

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `POST` | `/api/auth/login` | User authentication |
| `POST` | `/api/auth/register` | User registration |
| `GET` | `/api/citizen/*` | Citizen-facing data routes |
| `GET` | `/api/admin/*` | Admin-protected routes |
| `GET/POST` | `/api/typeApproval/*` | Type approval endpoints |

---

## Deployment

The frontend is configured for **Firebase Hosting**. The backend is configured for deployment via the included `Procfile` (compatible with Heroku-style platforms).

```bash
# Frontend
cd frontend && npm run build
firebase deploy

# Backend
cd backend && npm run deploy
```

---

## License

This project is proprietary software developed for the Botswana Communications Regulatory Authority by the Status 200 Team. All rights reserved.

