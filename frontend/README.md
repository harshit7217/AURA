# AURA Frontend

The frontend is a React single-page application built with Vite. It provides candidate authentication, an assessment catalog, assessment-taking pages, and a score dashboard using React Router and Tailwind CSS.

## Requirements

- Node.js 18 or newer
- npm
- The AURA backend running locally or an accessible backend URL

## Setup

From `frontend/`, install dependencies:

```powershell
npm install
```

Set the backend URL in `.env.local` (optional; the default is `http://localhost:5000`):

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the backend separately, then start the frontend:

```powershell
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`. Restart Vite after changing `VITE_API_BASE_URL`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Application pages

| Path | Access | Description |
| --- | --- | --- |
| `/` | Public | Register or log in. |
| `/dashboard` | Protected | View average score and assessment history. |
| `/assessments` | Protected | Browse assessments from the backend. |
| `/junior-assessment/:assessmentId` | Protected | Answer an assessment and submit it for scoring. |

Protected pages redirect to `/` when no JWT is present in `localStorage`. The shared [`api.js`](./src/services/api.js) helper adds the JWT to API requests automatically.

## Frontend structure

- `src/App.jsx` - Route definitions and authentication guard.
- `src/components/Entering/` - Login and registration screens.
- `src/components/Assessments/` - Assessment catalog.
- `src/components/mcqs/` - Assessment questions and submission UI.
- `src/components/Dashboard/` - Candidate dashboard and result history.
- `src/services/api.js` - API base URL and authenticated fetch helper.
