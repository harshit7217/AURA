# AURA Backend

The backend is an Express API backed by MongoDB and Mongoose. It provides junior-candidate registration and login, with JWT middleware for protected routes. CORS and JSON request parsing are enabled in the server.

## Requirements

- Node.js and npm
- A MongoDB connection URI

## Setup

From this directory, install dependencies:

```powershell
npm install
```

Create a local `.env` file in `backend` with:

```env
MONGO_URI=<your MongoDB connection URI>
SECRET_PORT=5000
JWT_SECRET=<a unique, random secret>
JWT_EXPIRES_IN=7d
```

Generate a random JWT secret with Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep `.env` private; it is ignored by Git. `JWT_EXPIRES_IN` is optional and defaults to `7d`.

## Run

```powershell
npm run dev
```

`npm start` runs the server through Nodemon.

## API

All routes use the `/api/junior-candidates` prefix and accept JSON.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/register` | Register with `name`, `email`, and `password`. Passwords must be at least six characters. |
| `POST` | `/login` | Log in with `email` and `password`. A successful response includes a JWT and candidate details. |
| `GET` | `/me` | Protected route; send the token in `Authorization: Bearer <token>`. |

Registration returns the new candidate's `id`, `name`, and `email`. It does not currently return a JWT; log in after registering to obtain one.

Common error statuses include `400` for missing or invalid input, `401` for invalid login credentials or an invalid/missing token, and `409` when the email is already registered.
