import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { CONTACT, IMAGES } from "../data/content";
import { createReservation } from "../api";

const MONTH_NAMES = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const TIME_SLOTS = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

function formatDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function Reservations() {
  const today = useMemo(() => new Date(), []);
  
  // Set default date to today or tomorrow
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(() => {
    return formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  });

  const [guests, setGuests] = useState("2");
  const [selectedTime, setSelectedTime] = useState("18:30");
  const [winePairing, setWinePairing] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [assignedTable, setAssignedTable] = useState(null);

  // Month navigation
  function prevMonth() {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  }

  // Calendar calculations
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay();

  // Days array for calendar grid
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = formatDateKey(selectedYear, selectedMonth, d);
      const dateObj = new Date(selectedYear, selectedMonth, d, 23, 59, 59);
      const isPast = dateObj < today;
      // Max 60 days in advance
      const diffDays = Math.ceil((dateObj - today) / (1000 * 60 * 60 * 24));
      const isTooFar = diffDays > 60;
      days.push({
        day: d,
        dateKey,
        disabled: isPast || isTooFar,
        key: dateKey,
      });
    }
    return days;
  }, [selectedYear, selectedMonth, daysInMonth, firstDayIndex, today]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !selectedDate || !selectedTime) {
      setStatus("error");
      setErrorMsg("Please provide your name, email, date, and preferred time to reserve.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        date: selectedDate,
        hour: selectedTime,
        guests: parseInt(guests, 10) || 2,
        special_requests: specialRequests.trim() || undefined,
        wine_pairing: winePairing,
      };

      const result = await createReservation(payload);
      setAssignedTable(result.table_number);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to complete reservation. Please try another time.");
    }
  }

  function resetForm() {
    setStatus("idle");
    setAssignedTable(null);
    setErrorMsg("");
  }

  return (
    <div>
      <PageHero src={IMAGES.reservationsHero} eyebrow="TABLE BOOKINGS" title="Reservations" height={320} />

      <div className="container" style={{ padding: "80px 24px 120px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "60px",
            alignItems: "start",
          }}
        >
          {/* Left Column: Experience Details */}
          <div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "44px",
                color: "var(--text-heading)",
                margin: "0 0 16px",
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              Reserve Your Experience
            </h1>
            <p style={{ color: "var(--text-body)", fontSize: "16px", lineHeight: 1.7, marginBottom: "36px" }}>
              Join us for an unforgettable culinary journey. Reservations are available up to 60 days in advance.
            </p>

            {/* Ambient Feature Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--gold-border)",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "40px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ height: "240px", position: "relative" }}>
                <img
                  src={IMAGES.galleryInterior}
                  alt="The Dining Room at Café Fausse"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 40%, rgba(10,9,8,0.9) 100%)",
                  }}
                />
                <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "2px",
                      color: "var(--gold)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    THE DINING ROOM
                  </span>
                  <div style={{ color: "#f0ece4", fontSize: "14px", fontWeight: 400 }}>
                    Experience our signature tasting menu in an intimate setting.
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Us Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--gold)", marginBottom: "4px" }}>PHONE</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--text-heading)" }}>{CONTACT.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--gold)", marginBottom: "4px" }}>ADDRESS</div>
                <div style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: 1.6 }}>{CONTACT.address}</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "var(--gold)", marginBottom: "4px" }}>SERVICE HOURS</div>
                <div style={{ fontSize: "14px", color: "var(--text-body)", lineHeight: 1.6 }}>
                  {CONTACT.hoursLines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Interactive Card */}
          <div
            style={{
              background: "#13100c",
              border: "1px solid rgba(200, 169, 126, 0.3)",
              borderRadius: "16px",
              padding: "36px 32px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.7)",
            }}
          >
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(200, 169, 126, 0.15)",
                    border: "2px solid var(--gold)",
                    color: "var(--gold)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    margin: "0 auto 20px",
                  }}
                >
                  ✓
                </div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--text-heading)", margin: "0 0 12px" }}>
                  Reservation Confirmed
                </h2>
                <p style={{ color: "var(--text-body)", fontSize: "15px", lineHeight: 1.7, marginBottom: "28px" }}>
                  We are delighted to welcome you, <strong style={{ color: "#fff" }}>{name}</strong>. A formal confirmation has been dispatched to <strong style={{ color: "var(--gold)" }}>{email}</strong>.
                </p>

                <div
                  style={{
                    background: "#1a1612",
                    border: "1px solid var(--gold-border)",
                    borderRadius: "10px",
                    padding: "20px",
                    marginBottom: "32px",
                    textAlign: "left",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase" }}>Table Number</div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--gold)", marginTop: "2px" }}>
                      Table #{assignedTable}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase" }}>Party Size</div>
                    <div style={{ fontSize: "16px", color: "#f0ece4", marginTop: "4px" }}>
                      {guests} Guests
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase" }}>Date</div>
                    <div style={{ fontSize: "16px", color: "#f0ece4", marginTop: "4px" }}>
                      {selectedDate}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase" }}>Time Slot</div>
                    <div style={{ fontSize: "16px", color: "#f0ece4", marginTop: "4px" }}>
                      {selectedTime}
                    </div>
                  </div>
                  {winePairing && (
                    <div style={{ gridColumn: "span 2", borderTop: "1px solid rgba(200,169,126,0.15)", paddingTop: "12px" }}>
                      <span style={{ fontSize: "13px", color: "var(--gold)" }}>
                        🍷 Sommelier Wine Pairing included (+${145 * parseInt(guests, 10)})
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
                  <button type="button" onClick={resetForm} className="btn btn-outline" style={{ padding: "12px 24px" }}>
                    BOOK ANOTHER TABLE
                  </button>
                  <Link to="/menu" className="btn btn-solid" style={{ padding: "12px 24px" }}>
                    EXPLORE MENU
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {status === "error" && (
                  <div
                    style={{
                      padding: "14px 18px",
                      border: "1px solid var(--error-border)",
                      background: "rgba(200, 80, 80, 0.1)",
                      color: "var(--error)",
                      fontSize: "14px",
                      borderRadius: "6px",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {/* 1. Party Size */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--text-heading)", margin: "0 0 14px", fontWeight: 500 }}>
                    Party Size
                  </h3>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {["1", "2", "3", "4", "5", "6"].map((num) => {
                      const isSelected = guests === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "8px",
                            border: isSelected ? "1px solid var(--gold)" : "1px solid rgba(200, 169, 126, 0.2)",
                            background: isSelected ? "var(--gold)" : "#1a1612",
                            color: isSelected ? "#0a0908" : "#cfc9c0",
                            fontSize: "15px",
                            fontWeight: isSelected ? 700 : 400,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-faint)", marginTop: "10px" }}>
                    For parties larger than 6, please contact us directly.
                  </div>
                </div>

                {/* 2. Interactive Date Picker */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--text-heading)", margin: 0, fontWeight: 500 }}>
                      Date
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <button
                        type="button"
                        onClick={prevMonth}
                        aria-label="Previous month"
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--gold)",
                          fontSize: "18px",
                          cursor: "pointer",
                          padding: "4px 8px",
                        }}
                      >
                        ‹
                      </button>
                      <span style={{ fontSize: "13px", letterSpacing: "1.5px", color: "#f0ece4", fontWeight: 600 }}>
                        {MONTH_NAMES[selectedMonth]} {selectedYear}
                      </span>
                      <button
                        type="button"
                        onClick={nextMonth}
                        aria-label="Next month"
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--gold)",
                          fontSize: "18px",
                          cursor: "pointer",
                          padding: "4px 8px",
                        }}
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div
                    style={{
                      background: "#181410",
                      border: "1px solid rgba(200, 169, 126, 0.2)",
                      borderRadius: "10px",
                      padding: "16px 12px",
                    }}
                  >
                    {/* Weekday labels */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", marginBottom: "8px" }}>
                      {WEEKDAYS.map((w, idx) => (
                        <span key={idx} style={{ fontSize: "11px", color: "var(--gold)", fontWeight: 600, letterSpacing: "1px" }}>
                          {w}
                        </span>
                      ))}
                    </div>

                    {/* Day numbers */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center" }}>
                      {calendarDays.map((item) => {
                        if (item.empty) {
                          return <div key={item.key} style={{ height: "38px" }} />;
                        }
                        const isSelected = selectedDate === item.dateKey;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            disabled={item.disabled}
                            onClick={() => setSelectedDate(item.dateKey)}
                            className={`cal-day-btn ${isSelected ? "selected" : ""}`}
                          >
                            {item.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Time Slots */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--text-heading)", margin: "0 0 14px", fontWeight: 500 }}>
                    Time
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(78px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          style={{
                            padding: "10px 4px",
                            borderRadius: "8px",
                            border: isSelected ? "1px solid var(--gold)" : "1px solid rgba(200, 169, 126, 0.2)",
                            background: isSelected ? "var(--gold)" : "#181410",
                            color: isSelected ? "#0a0908" : "#e0dbd1",
                            fontSize: "13px",
                            fontWeight: isSelected ? 700 : 500,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Sommelier Wine Pairing Upgrade */}
                <div
                  style={{
                    background: "rgba(200, 169, 126, 0.05)",
                    border: "1px solid rgba(200, 169, 126, 0.25)",
                    borderRadius: "10px",
                    padding: "20px",
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "24px" }}>🍷</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--text-heading)", marginBottom: "4px" }}>
                      Sommelier Wine Pairing
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.6, margin: "0 0 14px" }}>
                      Elevate your tasting menu with a curated selection of rare and vintage wines, perfectly matched to each course.
                    </p>
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "12px",
                        letterSpacing: "1px",
                        fontWeight: 600,
                        color: "var(--gold)",
                        cursor: "pointer",
                        textTransform: "uppercase",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={winePairing}
                        onChange={(e) => setWinePairing(e.target.checked)}
                        style={{ accentColor: "var(--gold)", width: "16px", height: "16px" }}
                      />
                      ADD PAIRING (+${145}/PERSON)
                    </label>
                  </div>
                </div>

                {/* 5. Special Requests */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      letterSpacing: "2px",
                      color: "var(--gold)",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      fontWeight: 600,
                    }}
                  >
                    SPECIAL REQUESTS
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Dietary restrictions, special occasions, or seating preferences..."
                    style={{
                      width: "100%",
                      background: "#181410",
                      border: "1px solid rgba(200, 169, 126, 0.25)",
                      borderRadius: "8px",
                      color: "#e8e3da",
                      padding: "12px 14px",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* 6. Guest Contact Information */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      letterSpacing: "2px",
                      color: "var(--gold)",
                      textTransform: "uppercase",
                      marginBottom: "14px",
                      fontWeight: 600,
                    }}
                  >
                    GUEST CONTACT DETAILS
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name *"
                      style={{
                        background: "#181410",
                        border: "1px solid rgba(200, 169, 126, 0.25)",
                        borderRadius: "8px",
                        color: "#e8e3da",
                        padding: "12px 14px",
                        fontSize: "14px",
                      }}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address *"
                      style={{
                        background: "#181410",
                        border: "1px solid rgba(200, 169, 126, 0.25)",
                        borderRadius: "8px",
                        color: "#e8e3da",
                        padding: "12px 14px",
                        fontSize: "14px",
                      }}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number (optional)"
                      style={{
                        background: "#181410",
                        border: "1px solid rgba(200, 169, 126, 0.25)",
                        borderRadius: "8px",
                        color: "#e8e3da",
                        padding: "12px 14px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn btn-solid"
                  style={{
                    padding: "16px 24px",
                    fontSize: "13px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    borderRadius: "8px",
                  }}
                >
                  {status === "submitting" ? "PROCESSING RESERVATION…" : "CONFIRM RESERVATION →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
