# StepWise

A career management platform that keeps your applications, resumes, and interview practice in one place, and uses AI to show where you stand and what to do next.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS v4, React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon) with Prisma ORM v6
- **File storage:** Cloudinary
- **AI:** Google Gemini API

## Features
- Profile with education, experience, projects, and certifications
- Resume upload with AI feedback (PDF)
- Job application tracker with a status pipeline
- Job description analyzer and profile match scoring
- Interview question practice with AI feedback
- Dashboard with pipeline, skill demand, and skill gaps

## Setup
```bash
# server
cd server
npm install
# copy .env.example to .env and fill in real values
npx prisma migrate dev
npm run dev

# client (in a second terminal)
cd client
npm install
npm run dev
```
The client runs at http://localhost:5173 and expects the API at http://localhost:5000.

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register, /login | Account creation, login |
| GET | /api/auth/me | Current user (protected) |
| GET/PUT | /api/profile | View/update profile |
| POST/PUT/DELETE | /api/education, /experience, /projects, /certifications | Profile sections |
| POST/GET/DELETE | /api/resumes | Upload/list/delete resumes |
| PUT | /api/resumes/:id/activate | Mark a resume active |
| POST | /api/resumes/:id/analyze | AI resume analysis |
| POST/GET/PUT/DELETE | /api/applications | Job application tracker |
| POST/GET/DELETE | /api/job-descriptions | AI-parsed job descriptions |
| POST | /api/job-descriptions/:id/analyze | AI job match scoring |
| POST | /api/interview/generate | Generate interview questions |
| PUT | /api/interview/:id/answer | Submit answer, get AI feedback |
| GET | /api/dashboard | Career metrics summary |

All routes except register, login, and health require `Authorization: Bearer <token>`.

## Status
In active development.