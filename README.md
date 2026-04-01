# World Explorer

A full-stack web application for exploring countries of the world, featuring:

- **Country Browser** — search and filter all countries with detailed information
- **Flag Quiz** — identify countries by their flags in a multiple-choice quiz
- **Continent Challenge** — name every country in a continent from memory

## Stack

- **Backend:** FastAPI · SQLite (SQLAlchemy) · httpx
- **Frontend:** React · TypeScript · Vite · Tailwind CSS
- **Data:** [REST Countries API](https://restcountries.com)

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Project Structure

```
World Explorer/
├── backend/          # FastAPI application
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── models.py
│       ├── schemas.py
│       ├── routers/  # countries, quiz, challenge
│       └── services/ # countries cache, quiz generator
└── frontend/         # React + TypeScript + Vite
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── types/
```
