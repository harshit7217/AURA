# AURA Backend

The backend is an Express API backed by MongoDB and Mongoose. It provides junior-candidate registration and login, with JWT middleware for protected routes. It serves the junior MCQ assessment, scores submissions on the server, and stores each candidate's question-level marks and attempt history. CORS and JSON request parsing are enabled in the server.

## Requirements

- Node.js and npm
- A MongoDB connection URI

## Setup

From this directory, install dependencies:

```powershell
npm install
```

Copy `.env.example` to `.env` in `backend` and set your MongoDB and JWT values. Configure the Outlook mailbox used to send approval notifications:

```env
MONGO_URI=<your MongoDB connection URI>
SECRET_PORT=5000
JWT_SECRET=<a unique, random secret>
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=auraacademy.team@outlook.com
SMTP_PASS=<your Outlook app password>
SMTP_FROM=auraacademy.team@outlook.com
ADMIN_APPROVAL_EMAIL=auraacademy.team@outlook.com
FRONTEND_BASE_URL=http://localhost:5173
```

Generate a random JWT secret with Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep `.env` private; it is ignored by Git. Use an Outlook app password or SMTP credential for `SMTP_PASS`; do not commit or share it. The approval recipient defaults to `auraacademy.team@outlook.com`, the Outlook SMTP host and port have defaults, and review links expire after 48 hours.

## Run

```powershell
npm run dev
```

`npm start` runs the server through Nodemon.

## API

All routes use the `/api/junior-candidates` prefix and accept JSON.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/register` | Submit a registration request with `name`, `email`, and `password`. Passwords must be at least six characters. The request remains pending until approved. |
| `POST` | `/login` | Log in with `email` and `password`. Only approved candidates receive a JWT. |
| `POST` | `/registration-approval` | Review a request with `{ "token": "<email token>", "decision": "approve" \| "reject" }`. The link is one-time and expires after 48 hours. |
| `GET` | `/me` | Protected route; send the token in `Authorization: Bearer <token>`. |
| `GET` | `/assessment` | Protected route; returns assessment questions without answer keys. |
| `POST` | `/assessment-results` | Protected route; submits `{ "answers": { "<questionId>": "<selected option>" } }`. The server calculates marks and stores one result for every MCQ. |
| `GET` | `/assessment-results` | Protected route; returns the signed-in candidate's saved attempts for the dashboard. |

Registration emails a review link to the approval inbox. The email link opens a confirmation page where the reviewer chooses Approve or Reject. Approved candidates can log in; rejected candidates can submit a new request using the same email address. If SMTP delivery fails, the request remains pending and submitting the form again sends a fresh review link.

Common error statuses include `400` for missing or invalid input, `401` for invalid login credentials or an invalid/missing token, `403` for a pending or rejected candidate, `409` when the email is already approved, and `503` when an approval email cannot be sent.
