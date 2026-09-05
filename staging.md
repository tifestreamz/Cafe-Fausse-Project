# Staging Environment & Deployment Information

This document provides links and access credentials for the staging environment of **Café Fausse**, as well as instructions for local verification.

---

## 1. Live Staging Deployment

The application is deployed to production-grade staging infrastructure:

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend Web Application** | Vercel | [https://cafe-fausse-project-mauve.vercel.app/](https://cafe-fausse-project-mauve.vercel.app/) |
| **Interactive Menu** | Vercel | [https://cafe-fausse-project-mauve.vercel.app/menu](https://cafe-fausse-project-mauve.vercel.app/menu) |
| **Calendar Reservations** | Vercel | [https://cafe-fausse-project-mauve.vercel.app/reservations](https://cafe-fausse-project-mauve.vercel.app/reservations) |
| **Manager Portal (`/admin`)** | Vercel | [https://cafe-fausse-project-mauve.vercel.app/admin](https://cafe-fausse-project-mauve.vercel.app/admin) |
| **Backend REST API** | Render | `https://cafe-fausse-api.onrender.com` |
| **PostgreSQL Database** | Render | Managed PostgreSQL instance |

---

## 2. Administrative Manager Portal Credentials

To inspect the 30-table dining room floor plan, live occupancy, reservation ledger, and mailing list:

- **URL:** [https://cafe-fausse-project-mauve.vercel.app/admin](https://cafe-fausse-project-mauve.vercel.app/admin)
- **Passcode:** `fausse2026`

### Key Features on Admin:
1. **Interactive 30-Table Floor Plan:** Shows live table states (available vs. occupied) for any selected date and seating time slot.
2. **Reservation Ledger:** Filter by *All Reservations* or *Selected Date*, with live search and table cancellation action.
3. **Mailing List:** Displays subscribers with instant **Export CSV** download.

---

## 3. Local Execution Option

The full stack can also be executed on a local machine:

### Backend (Port 5001)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```
*Note: Ensure your PostgreSQL `DATABASE_URL` environment variable is configured for database access.*

### Frontend (Port 5173 / Port 4173)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to test locally.
