# LARP

A UCL student platform that takes students from "I don't know anyone" to "I'm meeting my group on Thursday".
Built for the Claude Campus Hackathon (16 October 2026).

- `backend/`: Python, FastAPI and SQLite (the API, matching and events)
- `frontend/`: React, Vite and Tailwind (the website)
- `docs/`: the build brief, the back-end spec and the step-by-step roadmap

## First-time setup

You need Python 3.11, Node 24 and git.

```bash
# Back end
cd backend
py -3.11 -m venv .venv
.venv\Scripts\activate          # Windows (on Mac or Linux: source .venv/bin/activate)
pip install -r requirements.txt

# Front end
cd ../frontend
npm install

# Settings: copy the example and fill it in
cd ..
copy .env.example .env          # Windows (on Mac or Linux: cp .env.example .env)
```

## Running it (two terminals)

```bash
# Terminal 1: back end on http://localhost:8000 (API docs at /docs)
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload

# Terminal 2: front end on http://localhost:5173
cd frontend
npm run dev
```

Open http://localhost:5173. The page should say **backend: ok**. If it says "offline", the back end is not running.

## Tests

```bash
cd backend
.venv\Scripts\activate
pytest
```
