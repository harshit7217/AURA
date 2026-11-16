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

```powershell
npm run dev
```

The Vite development server proxies `/api` requests to `http://localhost:5000`. Start the backend separately for API requests.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run build` | Create a production build in `dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Current implementation

- The application renders the authentication page at `/`.
- The Login and Register forms validate input and submit to the backend through the Vite `/api` proxy.
- The current UI shows success and error messages after submission, but it does not yet route a user into a protected dashboard.
