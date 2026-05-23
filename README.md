# SmartCRM

SmartCRM is a full-stack MERN CRM and workflow platform for a manufacturing company's BDA team. It includes JWT authentication, role-based access, lead CRUD, kanban workflow, task management, analytics charts, activity timeline, and an AI-inspired lead score predictor.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, React Hot Toast
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Deployment targets: Vercel frontend, Render backend, MongoDB Atlas database

## Local Setup

```bash
cd server
cp .env.example .env
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
VITE_API_URL=https://your-render-service.onrender.com/api
```

## Architecture

- `server/models` contains User, Lead, Task, and Activity schemas.
- `server/controllers` contains route handlers for auth, leads, tasks, users, and analytics.
- `server/middleware` contains JWT protection, role authorization, and error handling.
- `client/src/layouts` contains the dashboard shell.
- `client/src/pages` contains route-level screens.
- `client/src/components` contains reusable UI and feature components.
