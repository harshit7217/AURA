# AURA

AURA is an academy project with a React frontend and an Express/MongoDB backend. The current repository history adds an authentication page scaffold and junior-candidate registration/login API with JWT support.

## Repository layout

- [`frontend/`](./frontend/) - React, Vite, React Router, and Tailwind CSS.
- [`backend/`](./backend/) - Express API, MongoDB/Mongoose models, and JWT authentication.

See the [frontend guide](./frontend/README.md) and [backend guide](./backend/README.md) for component-specific details.

## Requirements

- Node.js and npm
- MongoDB, reachable using a connection URI

## Run locally

### Backend

From the repository root:

```powershell
cd backend
npm install
```

Create `backend/.env` with the following settings:

```env
MONGO_URI=<your MongoDB connection URI>
SECRET_PORT=5000
JWT_SECRET=<a unique, random secret>
JWT_EXPIRES_IN=7d
```

Keep `.env` private; it is ignored by Git. Then start the API:

```powershell
npm run dev
```

### Frontend

In a second terminal, from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

The frontend connects directly to the backend at `http://localhost:5000` by default. To use a different backend URL, set `VITE_API_BASE_URL` in `frontend/.env.local`; see the [frontend guide](./frontend/README.md).

## Current status

The frontend renders Login/Register and a JWT-protected junior-candidate dashboard. New candidate registrations require approval through an email review link before login is enabled; rejected candidates can reapply. Candidates can complete an MCQ assessment; the backend calculates and stores question-level marks and attempt history in MongoDB, and the dashboard loads those results into score and section charts. Set `VITE_API_BASE_URL` in `frontend/.env.local` to override the backend URL (defaults to `http://localhost:5000`). See the [backend API guide](./backend/README.md).
