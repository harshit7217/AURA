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

The Vite development server proxies `/api` requests to `http://localhost:5000`.

## Current status

The frontend currently renders a Login/Register page, but those components are placeholders and do not yet send authentication requests. The backend exposes junior-candidate registration, login, and a JWT-protected `/me` route under `/api/junior-candidates`; see the [backend API guide](./backend/README.md).
