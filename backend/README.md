# AURA Backend

The backend is an Express API backed by MongoDB and Mongoose. It provides candidate registration and login, protected assessment endpoints, and persistent assessment results.

Assessment JSON files are stored in [`data/junior-assessment/`](./data/junior-assessment/). The API discovers available files and returns questions without exposing answer keys.

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB connection URI

## Setup

From `backend/`, install dependencies:

```powershell
npm install
```

Create a `.env` file:

```env
MONGO_URI=<your MongoDB connection URI>
SECRET_PORT=5000
JWT_SECRET=<a unique, random secret>
JWT_EXPIRES_IN=7d
```

Generate a random JWT secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Keep `.env` private; it is ignored by Git. Never commit or share credentials.

## Run

```powershell
npm run dev
```

`npm start` runs `index.js` through Nodemon.

Set `SECRET_PORT` to `5000` so the backend matches the frontend's default URL: `http://localhost:5000`.

## Authentication API

The routes below use the `/api/junior-candidates` prefix.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/register` | Create an account with `name`, `email`, and `password`; returns a JWT and candidate profile. Passwords must be at least six characters. |
| `POST` | `/login` | Log in with `email` and `password`; returns a JWT and candidate profile. |
| `GET` | `/me` | Protected route; send the token in `Authorization: Bearer <token>`. |

## Assessment API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/assessments` | Protected route; lists the JSON assessments in `data/junior-assessment`. |
| `GET` | `/assessments/:assessmentId` | Protected route; returns assessment questions and instructions without answer keys. |
| `POST` | `/assessments/:assessmentId/submit` | Protected route; submit `{ "answers": { "<questionId>": "<option>" } }`. The backend scores and saves the result. |
| `GET` | `/results` | Protected route; returns the signed-in candidate's assessment history. |

All protected routes require:

```http
Authorization: Bearer <jwt>
```

Common status codes include `400` for missing or invalid input, `401` for invalid credentials or an invalid/missing token, `404` for an unknown assessment, and `409` for an existing email.

## Adding assessments

Add a `.json` file to `data/junior-assessment/`. Match the structure of the existing files and include:

- `assessment_title`
- `total_marks`
- `duration_minutes`
- `instructions`
- `sections`

The filename becomes the assessment ID used in the API routes. Keep answer keys and scoring data in the server-side fields used by the existing assessment format; do not return them as public question data.
