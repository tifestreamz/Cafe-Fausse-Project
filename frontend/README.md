# Café Fausse — Frontend Client Application

The client-side single-page web application (SPA) for **Café Fausse**, built with React 19 and Vite.

---

## Architecture & Technology Stack

- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool & Dev Server:** Vite 6
- **Routing:** React Router DOM 7 (`react-router-dom`)
- **Iconography:** Lucide Icons (`lucide-react`) — 100% accessible SVG vector icons
- **Styling:** Vanilla CSS with custom properties / design tokens, CSS Grid, Flexbox, glassmorphism, and responsive breakpoints (Mobile, Tablet, Desktop)
- **State & Storage:** React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) with client-side caching via `localStorage`

---

## Directory Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx     # Navigation bar with responsive drawer and active link states
│   │   ├── Footer.jsx     # Footer with hours, contacts, map link, and newsletter signup
│   │   ├── PageHero.jsx   # Standardized luxury page hero banner with gold accents
│   │   └── Layout.jsx     # Global page wrapper containing Navbar and Footer
│   ├── pages/             # Route-level view components
│   │   ├── Home.jsx       # Hero section, chef intro, awards banner, reviews carousel
│   │   ├── Menu.jsx       # 5-category menu with interactive dish inspection modal
│   │   ├── Reservations.jsx # Calendar booking, FR-7 real-time availability & slot prompts
│   │   ├── About.jsx      # Restaurant history, founder biographies, culinary philosophy
│   │   ├── Gallery.jsx    # Photo gallery with interactive full-screen lightbox
│   │   └── Admin.jsx      # Passcode gate, 30-table floor plan visualizer & ledger
│   ├── data/              # Static datasets (dishes, wines, awards, reviews, assets)
│   ├── api.js             # API client with PostgreSQL integration & offline fallback
│   ├── App.jsx            # Router switch configuration
│   ├── main.jsx           # React DOM application mount point
│   └── index.css          # Design tokens, typography, and luxury Italian styling
├── public/                # Static public assets and favicon
├── package.json           # Node project manifest and dependencies
└── vite.config.js         # Vite configuration
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
By default, the frontend sends requests to `http://localhost:5001`. To point to a different backend:
```bash
# Create a .env file if targeting a remote API:
echo "VITE_API_BASE=http://localhost:5001" > .env
```

### 3. Start Local Development Server
```bash
npm run dev
```
Open [`http://localhost:5173`](http://localhost:5173) in your browser.

### 4. Build for Production & Preview
```bash
npm run build
npm run preview -- --port 4173
```
Open [`http://localhost:4173`](http://localhost:4173) in your browser.

---

## Key Features

1. **Interactive Menu Modals (`/menu`):** Click any dish across Antipasti, Primi, Secondi, Dolci, or Bevande to inspect ingredients, dietary tags, and sommelier wine pairings.
2. **Interactive Calendar Booking (`/reservations`):** Month-by-month calendar enforcing valid dining service days, 60-day booking horizons, real-time table capacity badges (`Few Left`, `Sold Out`), and alternative slot recommendations.
3. **Manager Floor Plan & Ledger (`/admin`):** Passcode-protected (`fausse2026`) portal featuring an interactive 30-table floor plan, reservation ledger with cancellation actions, and newsletter subscriber export to CSV.
4. **Resilient Data Layer:** Dual-layer architecture automatically synchronizes with the PostgreSQL backend when online, and gracefully preserves state locally if offline.
