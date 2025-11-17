# Job Application Portal

A full‑stack job portal where applicants can search and apply for jobs with a PDF resume, and employers can post jobs, review candidates, view resumes in‑browser, accept/reject via email, and export candidates to CSV.

## Table of Contents
- Features
- Tech Stack
- Project Structure
- Setup & Run
- API Overview
- File Uploads & CSV Export
- Environment Variables

---

## Features

- Job search and listing view
- Apply to jobs with PDF resume upload (max 5MB)
- View submitted applications (My Applications) and withdraw
- Employers: create jobs, see candidate list, inline resume viewer
- Employers: accept (opens email client) and reject (delete) applications
- Export all candidates to CSV
- Login/Signup flow
- Responsive UI with toast notifications

---

## Tech Stack

- Frontend: React 19, Vite, React Router v6, Bootstrap 5, React Hot Toast
- Backend: Flask 3, SQLite, flask_cors, Werkzeug (file uploads)
- Environment: Node.js 18+, Python 3.10+, Git

---

## Project Structure

```
Job app/
├── backend/
│   ├── app.py                  # Flask API (endpoints, file handling)
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   └── job-app/
│       ├── src/
│       │   ├── App.jsx
│       │   ├── App.css
│       │   ├── main.jsx
│       │   ├── utils/
│       │   │   └── api.js     # Centralized API layer
│       │   └── templates/
│       │       ├── Apply.jsx
│       │       ├── CandidateList.jsx
│       │       ├── Createjob.jsx
│       │       ├── Dashboard.jsx
│       │       ├── JobForm.jsx
│       │       ├── JobSearch.jsx
│       │       ├── LoginSignup.jsx
│       │       ├── MyApplications.jsx
│       │       ├── Navbar.jsx
│       │       └── YourJobs.jsx
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
└── README.md
```

---

## Setup & Run

### Backend (Windows PowerShell)
```powershell
cd "D:\projects\Job app\backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Backend runs at `http://127.0.0.1:5000`.

### Frontend
```powershell
cd "D:\projects\Job app\frontend\job-app"
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## API Overview

Base URL: `http://127.0.0.1:5000`

- `GET /jobs` — List jobs
- `POST /addjob` — Create job (JSON body)
- `GET /showemployerjobs/<emp_id>` — Jobs posted by an employer
- `GET /applications/<employer_id>` — Applications for employer’s jobs
- `POST /apply` — Submit application (supports `multipart/form-data` with PDF resume)
- `PUT /applications/<id>` — Update status (e.g., accept/reject)
- `DELETE /applications/<id>` — Withdraw/delete application
- `GET /resumes/<application_id>` — View resume PDF inline
- `GET /export-candidates/<employer_id>` — Download CSV of candidates

Note: On reject, the backend deletes the application record.

---

## File Uploads & CSV Export

- Resume uploads: PDF only, up to 5MB
- Upload field name: typically `resume` in `multipart/form-data`
- Stored under: `backend/venv/uploads/resumes/` (served inline via `/resumes/<application_id>`) 
- CSV export: one‑click download from employer dashboard; endpoint returns a timestamped file

---

## Environment Variables

Create `frontend/job-app/.env`:
```env
VITE_API_URL=http://127.0.0.1:5000
```

Python dependencies live in `backend/requirements.txt`.

---

## Author

Sanjay Parivallal

---

Last updated: November 2025
