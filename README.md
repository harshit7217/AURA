# AURA

AURA is a full-stack academy project for junior candidates. Candidates can create an account, sign in, complete assessments, review their score history, and view their dashboard.

The repository uses a React/Vite frontend and an Express/MongoDB backend with JWT authentication.

## Repository layout

- [`frontend/`](./frontend/) - React 19, Vite, React Router, and Tailwind CSS.
- [`backend/`](./backend/) - Express 5 API, MongoDB/Mongoose, and JWT authentication.
- [`backend/data/junior-assessment/`](./backend/data/junior-assessment/) - Assessment JSON files.

See the [frontend guide](./frontend/README.md) and [backend guide](./backend/README.md) for component-specific details.

## Features

- Candidate registration and login
- JWT-protected routes and protected frontend pages
- Assessment discovery and question delivery
- Automatic assessment scoring
- Persistent assessment result history
- Candidate dashboard with average and recent scores
- Shared React API helper for authenticated requests

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database or connection URI

## Quick start

### Backend

From the repository root:

```powershell
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=<your MongoDB connection URI>
SECRET_PORT=5000
JWT_SECRET=<a unique, random secret>
JWT_EXPIRES_IN=7d
```

Generate a JWT secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep `.env` private. Start the API:

```powershell
npm run dev
```

The API is available at `http://localhost:5000/api/junior-candidates`.

### Frontend

In a second terminal, from the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

The frontend uses `http://localhost:5000` as the API base URL by default. To use another backend URL, create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Restart Vite after changing the environment variable.

## Usage

1. Open `/` and choose **Register**.
2. Enter a name, email, and password of at least six characters.
3. Use **Login** to return to an existing account.
4. Open **Assessments** to choose an available assessment.
5. Submit the assessment to save the result.
6. Open **Dashboard** to review the average score and assessment history.

JWTs are stored in browser `localStorage` and sent automatically by the shared API helper.

## Build and check

Run frontend checks from `frontend/`:

```powershell
npm run build
npm run lint
```
