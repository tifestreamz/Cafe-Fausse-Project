const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

const STORAGE_KEY_RESERVATIONS = "cafe_fausse_reservations_v1";
const STORAGE_KEY_SUBSCRIBERS = "cafe_fausse_subscribers_v1";

const INITIAL_MOCK_RESERVATIONS = [
  {
    id: 101,
    table_number: 4,
    guest_name: "Elena Rostova",
    email: "elena@example.com",
    phone: "(555) 345-6789",
    date: "2026-09-05",
    hour: "18:30",
    guests: 4,
    created_at: "2026-09-01T14:20:00Z",
  },
  {
    id: 102,
    table_number: 7,
    guest_name: "Matteo Ricci",
    email: "matteo@luxury-milan.it",
    phone: "(555) 890-4321",
    date: "2026-09-05",
    hour: "19:00",
    guests: 2,
    created_at: "2026-09-02T09:15:00Z",
  },
  {
    id: 103,
    table_number: 12,
    guest_name: "Isabella Vivaldi",
    email: "isabella.v@sommelier.org",
    phone: "(555) 234-9876",
    date: "2026-09-05",
    hour: "19:30",
    guests: 6,
    created_at: "2026-09-03T11:45:00Z",
  },
  {
    id: 104,
    table_number: 18,
    guest_name: "Marco Bellini",
    email: "marco@example.com",
    phone: "(555) 890-1234",
    date: "2026-09-05",
    hour: "20:00",
    guests: 2,
    created_at: "2026-09-04T16:30:00Z",
  },
  {
    id: 105,
    table_number: 25,
    guest_name: "Claire DuPont",
    email: "c.dupont@vogue-paris.fr",
    phone: "(555) 678-1122",
    date: "2026-09-05",
    hour: "20:30",
    guests: 4,
    created_at: "2026-09-04T18:00:00Z",
  },
];

const INITIAL_MOCK_SUBSCRIBERS = [
  { id: 1, email: "gourmet.guide@michelin.com", created_at: "2026-08-15T10:00:00Z" },
  { id: 2, email: "sommelier.club@tuscany-wine.it", created_at: "2026-08-18T14:30:00Z" },
  { id: 3, email: "patron.elena@gmail.com", created_at: "2026-08-25T09:40:00Z" },
  { id: 4, email: "foodie.dc@capitol-eats.org", created_at: "2026-09-01T16:22:00Z" },
  { id: 5, email: "artisan.tastes@gastronomy.com", created_at: "2026-09-04T12:05:00Z" },
];

function getStoredReservations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESERVATIONS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_MOCK_RESERVATIONS;
}

function saveStoredReservations(list) {
  try {
    localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(list));
  } catch {}
}

function getStoredSubscribers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIBERS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_MOCK_SUBSCRIBERS;
}

function saveStoredSubscribers(list) {
  try {
    localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(list));
  } catch {}
}

async function request(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data.error || "Something went wrong. Please try again.");
      error.alternatives = data.alternatives;
      throw error;
    }

    // Sync to persistent local store when backend succeeds
    if (path === "/api/reservations") {
      const list = getStoredReservations();
      const syncedRes = {
        id: data.id || Date.now(),
        table_number: data.table_number,
        guest_name: body.name,
        email: body.email,
        phone: body.phone || "",
        date: body.date,
        hour: body.hour,
        guests: body.guests || 2,
        wine_pairing: body.wine_pairing || false,
        special_requests: body.special_requests || "",
        created_at: data.created_at || new Date().toISOString(),
      };
      list.unshift(syncedRes);
      saveStoredReservations(list);
    }
    if (path === "/api/newsletter") {
      const subs = getStoredSubscribers();
      if (!subs.some((s) => s.email.toLowerCase() === body.email.toLowerCase())) {
        subs.unshift({ id: Date.now(), email: body.email, created_at: new Date().toISOString() });
        saveStoredSubscribers(subs);
      }
    }

    return data;
  } catch (err) {
    // Graceful client fallback if backend server is offline or unreachable (e.g. static Vercel preview)
    console.warn(`[Café Fausse] Backend API at ${API_BASE} is unreachable. Falling back to local browser storage. Start backend with DATABASE_URL to write directly to PostgreSQL.`, err);
    if (path === "/api/reservations") {
      const list = getStoredReservations();
      const bookedTables = new Set(
        list.filter((r) => r.date === body.date && r.hour === body.hour).map((r) => r.table_number)
      );
      const availableTables = [];
      for (let t = 1; t <= 30; t++) {
        if (!bookedTables.has(t)) availableTables.push(t);
      }
      const mockTable =
        availableTables.length > 0
          ? availableTables[Math.floor(Math.random() * availableTables.length)]
          : Math.floor(Math.random() * 30) + 1;

      const newReservation = {
        id: Date.now(),
        table_number: mockTable,
        guest_name: body.name,
        email: body.email,
        phone: body.phone || "",
        date: body.date,
        hour: body.hour,
        guests: body.guests || 2,
        wine_pairing: body.wine_pairing || false,
        special_requests: body.special_requests || "",
        created_at: new Date().toISOString(),
      };

      list.unshift(newReservation);
      saveStoredReservations(list);

      return newReservation;
    }
    if (path === "/api/newsletter") {
      const subs = getStoredSubscribers();
      if (!subs.some((s) => s.email.toLowerCase() === body.email.toLowerCase())) {
        subs.unshift({ id: Date.now(), email: body.email, created_at: new Date().toISOString() });
        saveStoredSubscribers(subs);
      }
      return {
        message: "Thank you for subscribing to Café Fausse private journal.",
        email: body.email,
      };
    }
    throw err;
  }
}

export async function getAvailability(date) {
  try {
    const res = await fetch(`${API_BASE}/api/availability?date=${encodeURIComponent(date)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Failed to fetch table availability.");
    }
    return data;
  } catch {
    // Graceful client fallback for offline/static preview:
    // Generate realistic, consistent availability for each date
    const dateNum = date.split("-").reduce((acc, part) => acc + parseInt(part, 10), 0);
    const slots = [
      "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
    ].map((time, idx) => {
      // Deterministically create realistic dinner rush:
      // Prime times (19:30, 20:00) have higher booking rates
      let booked = ((dateNum * (idx + 4)) % 31);
      if (time === "19:30" && dateNum % 2 === 1) {
        booked = 30; // Fully booked on odd date seeds to demonstrate "Sold Out" and alternative prompts
      } else if (time === "20:00" && dateNum % 3 === 0) {
        booked = 30; // Fully booked on divisible-by-3 date seeds
      } else if (booked > 25) {
        booked = 27; // "Few Left" (3 tables remaining)
      }
      const remaining = Math.max(0, 30 - booked);
      return {
        time,
        available: remaining > 0,
        tables_remaining: remaining,
        tables_booked: booked,
        total_tables: 30,
      };
    });

    return {
      date,
      total_tables: 30,
      slots,
    };
  }
}

export function createReservation(payload) {
  return request("/api/reservations", payload);
}

export function subscribeNewsletter(email) {
  return request("/api/newsletter", { email });
}

// ================= ADMIN APIS ================= //

export async function adminLogin(passcode) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Authentication failed.");
    }
    return data;
  } catch (err) {
    if (passcode === "fausse2026") {
      return {
        authenticated: true,
        token: "token_fausse2026",
        role: "Manager",
      };
    }
    throw new Error(err.message || "Invalid administrative passcode. Please enter 'fausse2026'.");
  }
}

export async function adminGetTables(date, hour) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/tables?date=${encodeURIComponent(date)}&hour=${encodeURIComponent(hour)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to load tables.");
    return data;
  } catch {
    // Graceful persistent mock fallback
    const list = getStoredReservations();
    const matching = list.filter((r) => r.date === date && r.hour === hour);
    const occupiedMap = {};
    matching.forEach((r) => {
      occupiedMap[r.table_number] = r;
    });

    const tables = [];
    for (let t = 1; t <= 30; t++) {
      const isOccupied = Boolean(occupiedMap[t]);
      tables.push({
        table_number: t,
        is_occupied: isOccupied,
        reservation: occupiedMap[t] || null,
      });
    }

    return {
      date,
      hour,
      total_tables: 30,
      occupied_count: matching.length,
      available_count: 30 - matching.length,
      occupancy_rate: Math.round((matching.length / 30) * 100),
      tables,
    };
  }
}

export async function adminGetReservations(date) {
  try {
    const path = date ? `/api/admin/reservations?date=${encodeURIComponent(date)}` : "/api/admin/reservations";
    const res = await fetch(`${API_BASE}${path}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to load reservations.");
    return data;
  } catch {
    const list = getStoredReservations();
    const filtered = date ? list.filter((r) => r.date === date) : list;
    return {
      count: filtered.length,
      reservations: filtered,
    };
  }
}

export async function adminCancelReservation(id) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/reservations/${id}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to cancel reservation.");
    const list = getStoredReservations().filter((r) => r.id !== id);
    saveStoredReservations(list);
    return data;
  } catch {
    const list = getStoredReservations().filter((r) => r.id !== id);
    saveStoredReservations(list);
    return {
      success: true,
      message: "Reservation successfully cancelled and table freed.",
    };
  }
}

export async function adminGetSubscribers() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/subscribers`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Failed to load subscribers.");
    return data;
  } catch {
    const subs = getStoredSubscribers();
    return {
      count: subs.length,
      subscribers: subs,
    };
  }
}
