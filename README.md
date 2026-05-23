# SmartBDA

SmartBDA is a full-stack MERN CRM and workflow platform for a manufacturing company's BDA team. It includes JWT authentication, role-based access, lead CRUD, kanban workflow, task management, analytics charts, activity timeline, and an AI-inspired lead score predictor.

## Live Demo

- Frontend (Vercel): `https://business-development-associate-bda-team-module-for-kmnlner9z.vercel.app`
- Backend (Render): `https://business-development-associate-bda-team.onrender.com`
- Health check: `https://business-development-associate-bda-team.onrender.com/`

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, React Hot Toast
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Deployment targets: Vercel frontend, Render backend, MongoDB Atlas database

## Features

- JWT Authentication with protected routes and role-based access (`Admin`, `Team Lead`, `Employee`)
- Dashboard analytics: revenue, conversion rate, monthly trends, team performance
- Lead management: create, edit, delete, assign, filter, sort, export CSV
- Kanban workflow board with drag and drop across lead stages
- Task management with due dates, statuses, and progress tracking
- Activity timeline and toast-based UX feedback states
- AI-inspired lead scoring (`Hot`, `Warm`, `Cold`) based on budget and interest level

## Local Setup

```bash
cd server
npm install
npm run seed
npm run dev
```

```bash
cd client
npm install
npm run dev
```

Default seeded login:

- `admin@smartcrm.dev`
- `password123`

## Deployment

1. Deploy backend on Render:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
2. Set Render environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=https://your-app.vercel.app`
3. Deploy frontend on Vercel:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set Vercel variable:
   - `VITE_API_URL=https://your-api.onrender.com/api`

## Environment

Server `.env`:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartcrm
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Client `.env` for deployed backend:

```bash
VITE_API_URL=https://business-development-associate-bda-team-module-for-bc2whlrxl.vercel.app
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/leads` / `POST /api/leads`
- `PUT /api/leads/:id` / `DELETE /api/leads/:id`
- `GET /api/tasks` / `POST /api/tasks`
- `PUT /api/tasks/:id` / `DELETE /api/tasks/:id`
- `GET /api/analytics/dashboard`

## Architecture

- `server/models` contains User, Lead, Task, and Activity schemas.
- `server/controllers` contains route handlers for auth, leads, tasks, users, and analytics.
- `server/middleware` contains JWT protection, role authorization, and error handling.
- `client/src/layouts` contains the dashboard shell.
- `client/src/pages` contains route-level screens.
- `client/src/components` contains reusable UI and feature components.

## Notes

- Do not commit real secrets or production URLs in `.env` files.
- Rotate MongoDB credentials before final submission if exposed during setup/testing.
