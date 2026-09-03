import { useState } from "react";
import PageHero from "../components/PageHero";
import { CONTACT } from "../data/content";
import { createReservation } from "../api";

const fieldStyle = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--gold-border-strong)",
  color: "#e8e3da",
  padding: "10px 2px",
  fontSize: "14px",
  width: "100%",
};

const initialForm = { date: "", hour: "", guests: "2", name: "", email: "", phone: "" };

export default function Reservations() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [assignedTable, setAssignedTable] = useState(null);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.date || !form.hour) {
      setStatus("error");
      setErrorMsg("Please fill in your name, email, date, and time to book a table.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const result = await createReservation(form);
      setAssignedTable(result.table_number);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <div>
      <PageHero title="Reservations" height={300} />

      <div
        className="container"
        style={{ padding: "90px 24px 120px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "70px" }}
      >
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "30px", color: "var(--text-heading)", margin: "0 0 8px", fontWeight: 500 }}>
            Book a Table
          </h2>
          <div style={{ color: "var(--text-mutedest)", fontSize: "14px", marginBottom: "32px" }}>
            Tables are assigned automatically from our 30 available. You'll see confirmation right away.
          </div>

          {status === "success" ? (
            <div style={{ padding: "20px", border: "1px solid var(--gold-border-strong)", color: "var(--gold)", fontSize: "14px", lineHeight: 1.6 }}>
              Reservation confirmed — you've been assigned Table {assignedTable}. A confirmation has been sent to{" "}
              {form.email}.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {status === "error" && (
                <div style={{ padding: "14px 16px", border: "1px solid var(--error-border)", color: "var(--error)", fontSize: "13px" }}>
                  {errorMsg}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <input type="date" value={form.date} onChange={setField("date")} style={fieldStyle} />
                <input type="time" value={form.hour} onChange={setField("hour")} style={fieldStyle} />
              </div>
              <select value={form.guests} onChange={setField("guests")} style={fieldStyle}>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
                <option value="8">8+ Guests</option>
              </select>
              <input value={form.name} onChange={setField("name")} placeholder="Customer Name" style={fieldStyle} />
              <input type="email" value={form.email} onChange={setField("email")} placeholder="Email Address" style={fieldStyle} />
              <input value={form.phone} onChange={setField("phone")} placeholder="Phone Number (optional)" style={fieldStyle} />
              <button type="submit" disabled={status === "submitting"} className="btn btn-solid" style={{ marginTop: "6px", padding: "15px 0" }}>
                {status === "submitting" ? "BOOKING…" : "BOOK A TABLE"}
              </button>
            </form>
          )}
        </div>

        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "30px", color: "var(--text-heading)", margin: "0 0 32px", fontWeight: 500 }}>
            Visit Us
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
            <div>
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "var(--gold)", marginBottom: "6px" }}>PHONE</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--text-heading)" }}>{CONTACT.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "var(--gold)", marginBottom: "6px" }}>ADDRESS</div>
              <div style={{ fontSize: "15px", color: "var(--text-body)", lineHeight: 1.6 }}>{CONTACT.address}</div>
            </div>
            <div>
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "var(--gold)", marginBottom: "6px" }}>HOURS</div>
              <div style={{ fontSize: "15px", color: "var(--text-body)", lineHeight: 1.6 }}>
                {CONTACT.hoursLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
