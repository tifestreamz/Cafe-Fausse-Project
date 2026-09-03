# Café Fausse

Fine Italian dining website for Café Fausse in Washington, DC — built per the project SRS
(`project/uploads/MSEE_Web_Application_and_Interface_Design_Cafe_Fausse_SRS.pdf`) from the
Claude Design mockup in `project/Cafe Fausse.dc.html`.

- **Frontend:** React + Vite, React Router, plain CSS (Flexbox/Grid)
- **Backend:** Flask REST API
- **Database:** PostgreSQL

## Project layout

```
backend/    Flask API, SQLAlchemy models, reservation/newsletter logic
frontend/   React app (Home, Menu, Reservations, About Us, Gallery)
project/    Original Claude Design mockup and uploaded assets (reference only)
chats/      Design conversation transcript (reference only)
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

## Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

createdb cafe_fausse          # or: psql -c "CREATE DATABASE cafe_fausse;"
cp .env.example .env          # adjust DATABASE_URL / FRONTEND_ORIGIN if needed

python run.py                 # runs on http://localhost:5000, creates tables on first boot
```

Environment variables (`backend/.env`, loaded via `python-dotenv` if you `export $(cat .env)`
or wire your own process manager):

| Variable          | Default                                                   | Purpose                          |
| ----------------- | ---------------------------------------------------------- | --------------------------------- |
| `DATABASE_URL`    | `postgresql://postgres:postgres@localhost:5432/cafe_fausse` | PostgreSQL connection string      |
| `FRONTEND_ORIGIN` | `*`                                                         | CORS origin allowed for `/api/*`  |

### API

- `POST /api/reservations` — `{ name, email, phone?, date, hour, guests }` → assigns a random
  free table (1–30) for that date/time slot, or `409` if all 30 are already booked for that
  slot. Upserts a `customers` row and inserts a `reservations` row.
- `POST /api/newsletter` — `{ email }` → validates the email format and marks the customer as
  subscribed (creates the customer record if it doesn't exist yet).

## Frontend setup

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_BASE should point at the backend
npm run dev                   # runs on http://localhost:5173
```

`npm run build` produces a static production bundle in `frontend/dist/` that can be served by
any static host or reverse-proxied by the Flask app / nginx.

## Deploying for free (Neon + Render + Vercel)

This is the combo the repo is pre-configured for: a free managed Postgres on **Neon**, the
Flask API on **Render**, and the React build on **Vercel**. All three have no-credit-card free
tiers as of this writing.

### 1. Push this repo to GitHub

Render and Vercel both deploy by connecting to a git repo, so create an empty GitHub repo and
push this project to it first.

### 2. Database — Neon

1. Sign up at [neon.tech](https://neon.tech) and create a project (free tier).
2. Copy the connection string it gives you (starts with `postgresql://...`, includes
   `?sslmode=require`). You'll paste this into Render as `DATABASE_URL`.

(Supabase's free Postgres works the same way if you'd rather use that.)

### 3. Backend — Render

The repo includes `render.yaml` at the root, so Render can set most of this up automatically:

1. Sign up at [render.com](https://render.com), choose **New → Blueprint**, and point it at
   your GitHub repo. Render reads `render.yaml` (which builds from `backend/` with
   `pip install -r requirements.txt` and runs `gunicorn run:app`).
2. When prompted for the env vars it left blank, set:
   - `DATABASE_URL` — the Neon connection string from step 2.
   - `FRONTEND_ORIGIN` — leave as `*` for now; you'll come back and set it to your Vercel URL
     once you have it (step 4), so the API only accepts requests from your actual site.
3. Deploy. Render gives you a URL like `https://cafe-fausse-api.onrender.com`. Confirm it works:
   `curl -X POST https://cafe-fausse-api.onrender.com/api/newsletter -H "Content-Type: application/json" -d '{"email":"test@example.com"}'`

   Note: on Render's free tier the service spins down after inactivity, so the first request
   after a while takes ~30-50s to wake back up — that's expected, not a bug.

### 4. Frontend — Vercel

1. Sign up at [vercel.com](https://vercel.com), **Add New → Project**, import the same repo.
2. Set **Root Directory** to `frontend` (Vercel auto-detects the Vite build command/output).
3. Add an environment variable: `VITE_API_BASE` = your Render URL from step 3
   (e.g. `https://cafe-fausse-api.onrender.com`).
4. Deploy. Vercel gives you a link like `https://cafe-fausse.vercel.app` — that's the one to
   share for viewing/testing.
5. Go back to Render and set `FRONTEND_ORIGIN` to that exact Vercel URL, then redeploy the
   backend so CORS only allows your real frontend.

### Notes

- `render.yaml`, `backend/Procfile`, and `frontend/vercel.json` (SPA routing rewrite) are
  already in the repo for this — no extra config files needed.
- Any redeploy on Render/Vercel just needs a new `git push` to the connected branch.

## Notes on images

The four real photos supplied with the design (`home-hero`, and the gallery's interior, ribeye,
and event photos) are wired in under `frontend/src/assets/images`. The remaining image slots
(menu/about/reservations hero banners, founder portraits, and several gallery shots) render as
styled placeholder panels — this environment's network policy blocks every stock-photo host
(Unsplash, Pexels, Pixabay, Wikimedia, etc.), so those photos couldn't be fetched here. Drop
real photos into `frontend/src/assets/images` and reference them from
`frontend/src/data/content.js` (`src` instead of `placeholder`) when they're available.
