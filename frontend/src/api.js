const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function request(path, body) {
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
}

export function createReservation(payload) {
  return request("/api/reservations", payload);
}

export function subscribeNewsletter(email) {
  return request("/api/newsletter", { email });
}
