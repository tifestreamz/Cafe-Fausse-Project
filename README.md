# Café Fausse — Fine Italian Dining Web Application

An interactive, responsive web application for **Café Fausse**, an award-winning fine dining Italian restaurant in Washington, DC. Built to 100% compliance with the Quantic Software Requirements Specification (SRS) (`project/uploads/MSEE_Web_Application_and_Interface_Design_Cafe_Fausse_SRS.pdf`).

- **Live Staging URL (Vercel):** [https://cafe-fausse-project-mauve.vercel.app/](https://cafe-fausse-project-mauve.vercel.app/)
- **Manager Admin Portal:** [https://cafe-fausse-project-mauve.vercel.app/admin](https://cafe-fausse-project-mauve.vercel.app/admin) (Passcode: `fausse2026`)
- **Backend API (Render):** `https://cafe-fausse-api.onrender.com` (or local `http://localhost:5001`)
- **Collaborator Access:** `quantic-grader` invited via repository settings.

---

## 1. Project Architecture & Solution Overview

The system is structured as a decoupled, full-stack architecture:

```
├── backend/                  # Flask REST API & Database Layer
│   ├── app/
│   │   ├── __init__.py       # Application factory, CORS, and DB initialization
│   │   ├── extensions.py     # SQLAlchemy instance
│   │   ├── models.py         # Customer and Reservation database models
│   │   ├── routes.py         # API endpoints (Reservations, Availability, Admin, Newsletter)
│   │   ├── seeds.py          # Demo seed data (initial bookings & subscribers)
│   │   └── run.py            # Alternate runner for production deployment
│   ├── cafe_fausse.db        # Automatic local SQLite database fallback
│   ├── requirements.txt      # Python dependencies (Flask, SQLAlchemy, Gunicorn, psycopg2)
│   └── run.py                # Local server entry point (Port 5001)
├── frontend/                 # React 19 Single Page Application (SPA)
│   ├── src/
│   │   ├── components/       # Reusable components (Navbar, Footer, PageHero, Media/Slot)
│   │   ├── data/             # Static content, menus, reviews, awards, and asset mapping
│   │   ├── pages/            # View pages (Home, Menu, Reservations, About, Gallery, Admin)
│   │   │   ├── Home.jsx      # Hero section, chef intro, awards banner, reviews carousel
│   │   │   ├── Menu.jsx      # Interactive categorized menu with detail modals
│   │   │   ├── Reservations.jsx # Calendar booking, FR-7 availability & slot prompts
│   │   │   ├── About.jsx     # Restaurant story, chef profiles, culinary philosophy
│   │   │   ├── Gallery.jsx   # Photo gallery with interactive full-screen lightbox
│   │   │   └── Admin.jsx     # Passcode gate, 30-table floor plan visualizer & ledger
│   │   ├── api.js            # API client with dual-layer PostgreSQL/localStorage sync
│   │   ├── App.jsx           # Client-side router configuration
│   │   └── main.jsx          # React DOM entry point
│   ├── package.json          # Node dependencies (React 19, Lucide icons, Vite)
│   └── vite.config.js        # Vite build and development configuration
├── project/                  # Original SRS specification PDF and Claude design reference
├── ai-tooling.md             # Summary of AI tools used, workflows, successes & learnings
├── staging.md                # Staging environment links and verification instructions
└── render.yaml               # Render Infrastructure-as-Code blueprint
```

### Core Technologies
- **Frontend:** React 19, Vite, React Router DOM 7, Lucide Icons (`lucide-react`), Modern Vanilla CSS (CSS Grid, Flexbox, custom CSS custom properties / design tokens, glassmorphism).
- **Backend:** Python 3.12, Flask 3, Flask-SQLAlchemy, Flask-CORS, Gunicorn.
- **Database:** Dual-mode persistence:
  - **Local Development:** Zero-configuration SQLite (`backend/cafe_fausse.db`) created automatically on first run.
  - **Production:** PostgreSQL on Render/Neon via standard `DATABASE_URL`.
- **Iconography:** 100% clean vector line/solid icons from `lucide-react` (no raw emojis).

---

## 2. Key Features & SRS Compliance

### Interactive Menu with Detail Modals (SRS §2.2 / §3.1)
- 5 comprehensive Italian culinary categories: Antipasti, Primi, Secondi, Dolci, and Bevande.
- Interactive click-to-inspect modal for every dish, featuring:
  - High-resolution food photography.
  - Full ingredient breakdowns with dietary indicators (Gluten-Free, Vegetarian, Dairy-Free).
  - Sommelier Pairing Notes with recommended Italian wines (e.g. Barolo, Franciacorta, Chianti Classico).
  - One-click navigation to book a table for that dish.

### Interactive Reservation Engine & Real-Time Availability (SRS FR-1 through FR-7)
- **Interactive Monthly Calendar:** Visual month-by-month date picker enforcing valid dining days and 60-day advance booking windows.
- **Dynamic Capacity Validation (FR-7):** Querying `GET /api/availability?date=...` computes available slots across the restaurant's 30 tables.
- **Visual Capacity Badges:** Seating buttons dynamically indicate `Available`, `Few Left` (e.g., *3 Left*), or `Sold Out`.
- **Alternative Slot Recommendations:** When a requested slot is booked to capacity, the UI displays an alert banner with direct one-click alternatives (e.g., `Switch to 18:00 →`).
- **Sommelier Wine Pairing Upgrade:** Optional dining package upgrade ($145/guest) integrated into the booking calculation.
- **Immediate Confirmation Card:** Displays guest name, booking date, time, party size, and assigned table number (Tables 1–30).

### Administrator & Manager Portal (`/admin`) (SRS §2.3)
- **Passcode Protected:** Access restricted by administrative passcode (`fausse2026`) with session persistence.
- **30-Table Dining Room Floor Plan:** Live grid visualizer showing all 30 restaurant tables for any chosen date and dinner service time. Tables are color-coded (Available vs. Occupied).
- **Table Inspection Modal:** Clicking any occupied table reveals the seated guest's name, contact details, party size, and a one-click **Cancel & Free Table** action.
- **Reservation Roster & Search:** Multi-date ledger supporting toggle between *All Reservations* and *Selected Date*, with live search across guest name, email, phone, and table number.
- **Quick Jump to Floor Plan:** One-click button on each ledger row that switches the floor plan date/time and inspects that specific table.
- **Newsletter Mailing List:** Subscriber roster with instant client-side **Export CSV** download (`cafe_fausse_subscribers_YYYY-MM-DD.csv`).

### High-Fidelity Design & Brand Identity
- Luxurious Italian culinary palette: Deep Charcoal (`#0c0a08`), Rich Antique Gold (`#c8a97e`), Warm Amber (`#d9824c`), and Parchment (`#f0ece4`).
- Typography: Cormorant Garamond, Cinzel, and Outfit loaded via Google Fonts.
- Responsive across all viewports (Mobile, Tablet, Desktop).

---

## 3. Step-by-Step Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (`node -v`)
- **Python**: v3.11 or v3.12 (`python3 --version`)
- **Git**: (`git --version`)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/tifestreamz/Cafe-Fausse-Project.git
cd Cafe-Fausse-Project
```

---

### Step 2: Backend Setup (Flask & SQLite / PostgreSQL)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # On macOS / Linux:
   python3 -m venv .venv
   source .venv/bin/activate

   # On Windows:
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python run.py
   ```
   *The backend starts on `http://localhost:5001`. If no `DATABASE_URL` is set, it automatically creates and initializes `cafe_fausse.db` (SQLite) with demo reservation seeds and subscribers.*

---

### Step 3: Frontend Setup (React & Vite)

1. In a new terminal window, navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend starts at `http://localhost:5173` (or run `npm run build && npm run preview -- --port 4173` for production preview).*

4. Open `http://localhost:5173` in your browser.
   - Access the main dining pages: `/`, `/menu`, `/reservations`, `/about`, `/gallery`.
   - Access the Manager Portal: `/admin` (Passcode: `fausse2026`).

---

## 4. API Reference

| Method | Endpoint | Description | Request Body / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/availability` | Check remaining seats per slot | `?date=YYYY-MM-DD` |
| `POST` | `/api/reservations` | Create a new reservation & assign table | `{ name, email, phone, date, hour, guests, wine_pairing? }` |
| `POST` | `/api/newsletter` | Subscribe to private journal | `{ email }` |
| `POST` | `/api/admin/login` | Authenticate administrative staff | `{ passcode }` |
| `GET` | `/api/admin/tables` | 30-table occupancy for given slot | `?date=YYYY-MM-DD&hour=HH:MM` |
| `GET` | `/api/admin/reservations` | Retrieve reservations ledger | `?date=YYYY-MM-DD` (optional date filter) |
| `DELETE` | `/api/admin/reservations/<id>` | Cancel reservation & free table | Path variable `id` |
| `GET` | `/api/admin/subscribers` | Retrieve newsletter subscriber list | None |

---

## 5. Database Schema

The database uses SQLAlchemy ORM models defined in [`backend/app/models.py`](backend/app/models.py):

### Table: `customers`
- `id` (Integer, Primary Key)
- `name` (String 255, Nullable)
- `email` (String 255, Unique, Indexed, Not Null)
- `phone` (String 50, Nullable)
- `newsletter_signup` (Boolean, Default: False)
- `created_at` (DateTime, Default: UTC Now)

### Table: `reservations`
- `id` (Integer, Primary Key)
- `customer_id` (Integer, Foreign Key $\rightarrow$ `customers.id`, Not Null)
- `time_slot` (DateTime, Indexed, Not Null)
- `guests` (Integer, Not Null)
- `table_number` (Integer, 1–30, Not Null)
- `created_at` (DateTime, Default: UTC Now)
- *Unique Constraint:* `("time_slot", "table_number")` prevents double-booking a single table for the same seating slot.

---

## 6. Testing & Quality Verification

- **Frontend Linter:** Checked with `oxlint` — 0 errors, 0 warnings across all files.
- **Production Build:** `npm run build` compiles clean production bundle in `<250ms`.
- **End-to-End Verification:** Automated headless browser sessions verified the entire customer journey from menu exploration to booking, slot validation, table assignment, and admin ledger inspection.
