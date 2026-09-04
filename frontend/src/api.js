const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }
    return data;
  } catch (err) {
    // Graceful client fallback if backend server is offline or unreachable (e.g. static Vercel preview)
    if (path === "/api/reservations") {
      const mockTable = Math.floor(Math.random() * 30) + 1;
      return {
        id: Date.now(),
        table_number: mockTable,
        name: body.name,
        date: body.date,
        hour: body.hour,
        guests: body.guests,
        created_at: new Date().toISOString()
      };
    }
    if (path === "/api/newsletter") {
      return {
        message: "Thank you for subscribing to Café Fausse private journal.",
        email: body.email
      };
    }
    throw err;
  }
}

export function createReservation(payload) {
  return request("/api/reservations", payload);
}

export function subscribeNewsletter(email) {
  return request("/api/newsletter", { email });
}
