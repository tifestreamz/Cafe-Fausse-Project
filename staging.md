# Staging Environment & Deployment Information

This document provides links, credentials, and verification instructions for the **Café Fausse** web application for project reviewers and graders.

---

## 1. Live Cloud Staging Deployment

The web application is deployed and publicly accessible via Vercel:

| Component | Platform | URL / Details |
| :--- | :--- | :--- |
| **Frontend Web Application** | Vercel | [https://cafe-fausse-project-mauve.vercel.app/](https://cafe-fausse-project-mauve.vercel.app/) |
| **Interactive Menu** | Vercel | [https://cafe-fausse-project-mauve.vercel.app/menu](https://cafe-fausse-project-mauve.vercel.app/menu) |
| **Calendar Reservations** | Vercel | [https://cafe-fausse-project-mauve.vercel.app/reservations](https://cafe-fausse-project-mauve.vercel.app/reservations) |
| **Manager Portal (`/admin`)** | Vercel | [https://cafe-fausse-project-mauve.vercel.app/admin](https://cafe-fausse-project-mauve.vercel.app/admin) |
| **PostgreSQL Database** | Render | Managed PostgreSQL instance (`cafe_fausse_01mg`) |

> **Reviewer Note:** The live staging deployment on Vercel features dual-layer persistence (PostgreSQL online integration with resilient client-side fallback). Reviewers can interactively test the complete booking engine, menu exploration, and administrative portal directly in the browser with zero local installation required.

---

## 2. Administrative Manager Portal Credentials

To inspect the 30-table dining room floor plan, live occupancy, reservation ledger, and mailing list:

- **URL:** [https://cafe-fausse-project-mauve.vercel.app/admin](https://cafe-fausse-project-mauve.vercel.app/admin)
- **Passcode:** `fausse2026`

### Key Capabilities on the Admin Portal:
1. **Interactive 30-Table Floor Plan:** Visualizes table states (Available vs. Occupied) for any selected date and dinner service time. Clicking an occupied table shows seated guest details and a one-click **Cancel & Free Table** button.
2. **Reservation Ledger:** Multi-date ledger with search across guest name, email, phone, and table number. Includes an **"All Reservations" vs. "Selected Date"** toggle and one-click jump to inspect that table on the floor plan.
3. **Mailing List:** Displays newsletter subscribers with an instant **Export CSV** download (`cafe_fausse_subscribers_YYYY-MM-DD.csv`).

---

## 3. Local Full-Stack Execution

Reviewers wishing to run the full stack locally on their workstation can do so in two terminal windows:

### Terminal 1: Backend REST API (Port 5001)

```bash
cd backend

# 1. Create and activate virtual environment:
python3 -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# 2. Install dependencies:
pip install -r requirements.txt

# 3. Configure database:
cp .env.example .env
# Edit .env and set your DATABASE_URL (or export DATABASE_URL in your shell)

# 4. Start the server:
python run.py
```
*The backend starts on `http://localhost:5001`, auto-creates tables (`customers`, `subscribers`, `reservations`), and seeds realistic demo data.*

### Terminal 2: Frontend Client (Port 5173 / Port 4173)

```bash
cd frontend

# 1. Install dependencies:
npm install

# 2. Start development server:
npm run dev
```
Open [`http://localhost:5173`](http://localhost:5173) in your browser.

*Alternatively, run a production build and preview:*
```bash
npm run build
npm run preview -- --port 4173
```
Open [`http://localhost:4173`](http://localhost:4173) in your browser.

---

## 4. Database Schema & Tables

The system uses three normalized tables defined via SQLAlchemy in [`backend/app/models.py`](backend/app/models.py):

1. **`customers`:** Stores dining patrons who book reservations (`id`, `name` [NOT NULL], `email` [NOT NULL, UNIQUE], `phone`, `created_at`).
2. **`subscribers`:** Dedicated newsletter mailing list (`id`, `email` [NOT NULL, UNIQUE], `created_at`).
3. **`reservations`:** Capacity-controlled table bookings (`id`, `customer_id` [FK -> `customers.id`], `time_slot`, `guests`, `table_number` [1–30], `created_at`). Has a unique constraint on `("time_slot", "table_number")` to eliminate double-booking.

When the backend starts up against a fresh database, it automatically creates all three tables and seeds initial realistic demo data so the system is immediately ready for review.
