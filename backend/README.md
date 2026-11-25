# AURA Backend

The backend is an Express API backed by MongoDB and Mongoose. It provides candidate registration and login, protected assessment APIs, and persistent assessment results. Assessment JSON files are stored in `backend/data/junior-assessment`; the API discovers the available files and serves question data without exposing answer keys.

## Requirements

- Node.js and npm
- A MongoDB connection URI

## Setup

From this directory, install dependencies:

```powershell
npm install
```

Create a `.env` file in `backend` and set your MongoDB and JWT values:

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

Keep `.env` private; it is ignored by Git. Never commit or share credentials.

## Run

```powershell
npm run dev
```

`npm start` runs the server through Nodemon.

## API

All routes use the `/api/junior-candidates` prefix and accept JSON.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/register` | Create an account with `name`, `email`, and `password`; returns a JWT and candidate profile. Passwords must be at least six characters. |
| `POST` | `/login` | Log in with `email` and `password`; returns a JWT and candidate profile. |
| `GET` | `/me` | Protected route; send the token in `Authorization: Bearer <token>`. |
| `GET` | `/assessments` | Protected route; lists the JSON assessments in `data/junior-assessment`. |
| `GET` | `/assessments/:assessmentId` | Protected route; returns assessment questions and instructions without answer keys. |
| `POST` | `/assessments/:assessmentId/submit` | Protected route; submit `{ "answers": { "<questionId>": "<option>" } }`. The backend scores and saves the result. |
| `GET` | `/results` | Protected route; returns the signed-in candidate's assessment history. |

Common error statuses include `400` for missing or invalid input, `401` for invalid login credentials or an invalid/missing token, `404` for an unknown assessment, and `409` when an email is already registered. Add new `.json` assessment files to `data/junior-assessment`; each file should follow the existing assessment format with `assessment_title`, `total_marks`, `duration_minutes`, `instructions`, and `sections`.
