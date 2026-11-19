# AURA Frontend

The frontend is a React single-page application built with Vite. Its current entry page provides a Login/Register toggle, uses React Router, and is styled with Tailwind CSS.

## Requirements

- Node.js and npm

## Setup

From this directory, install dependencies:

```powershell
npm install
```

## Development

Set the backend URL in `.env` or `.env.local` in the frontend directory (optional; defaults to `http://localhost:5000`):

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the backend separately, then run:

```powershell
npm run dev
```

The frontend connects directly to the backend using the shared `src/services/api.js` helper. Restart the Vite server after changing the environment variable.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Create a production build in `dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Current implementation

- The application renders the authentication page at `/`; successful login opens `/junior-dashboard`.
- The protected dashboard loads saved assessment attempts from the backend and charts score history and section marks.
- Candidates can take the protected MCQ assessment at `/junior-assessment`; results are scored by the backend and persisted to MongoDB.
