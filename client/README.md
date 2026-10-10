# CareerForge

A full-stack career management platform — React, Node.js, Express, PostgreSQL, Prisma, and Gemini AI.

## Tech Stack
- **Frontend:** React, Tailwind CSS, React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL + Prisma ORM
- **File storage:** Cloudinary
- **AI:** Google Gemini API

## Setup
```bash
cd server
npm install
# copy .env.example to .env and fill in real values
npx prisma migrate dev
npm run dev
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register, /login | Account creation, login |
| GET | /api/auth/me | Current user (protected) |
| GET/PUT | /api/profile | View/update profile |
| POST/PUT/DELETE | /api/education, /experience, /projects, /certifications | Profile sub-sections |
| POST/GET/DELETE | /api/resumes | Upload/list/delete resumes |
| PUT | /api/resumes/:id/activate | Mark a resume active |
| POST | /api/resumes/:id/analyze | AI resume analysis |
| POST/GET/PUT/DELETE | /api/applications | Job application tracker |
| POST/GET/DELETE | /api/job-descriptions | AI-parsed job descriptions |
| POST | /api/job-descriptions/:id/analyze | AI job match scoring |
| POST | /api/interview/generate | Generate interview questions |
| PUT | /api/interview/:id/answer | Submit answer, get AI feedback |
| GET | /api/dashboard | Career metrics summary |

All routes except register/login/health require `Authorization: Bearer <token>`.

## Status
🚧 Backend complete. Frontend in progress.