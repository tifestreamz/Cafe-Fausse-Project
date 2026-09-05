import { useState, useEffect, useMemo, useCallback } from "react";
import PageHero from "../components/PageHero";
import { IMAGES } from "../data/content";
import {
  adminLogin,
  adminGetTables,
  adminGetReservations,
  adminCancelReservation,
  adminGetSubscribers,
} from "../api";
import {
  Lock,
  KeyRound,
  Landmark,
  RefreshCw,
  LogOut,
  Check,
  LayoutGrid,
  ClipboardList,
  Mail,
  Utensils,
  Wine,
  Download,
  X,
  Search,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

const SERVICE_SLOTS = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
];

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Admin() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("cafe_fausse_admin_auth") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState("floor"); // 'floor' | 'ledger' | 'subscribers'
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedHour, setSelectedHour] = useState("19:00");
  const [searchQuery, setSearchQuery] = useState("");

  // Data states
  const [tableData, setTableData] = useState(null);
  const [allReservations, setAllReservations] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [ledgerViewMode, setLedgerViewMode] = useState("all"); // 'all' | 'selected'

  // Selected table inspection modal
  const [inspectTable, setInspectTable] = useState(null);

  // Handle Login
  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);
    try {
      await adminLogin(passcode.trim());
      sessionStorage.setItem("cafe_fausse_admin_auth", "true");
      setIsAuthenticated(true);
    } catch (err) {
      setAuthError(err.message || "Invalid administrative passcode.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("cafe_fausse_admin_auth");
    setIsAuthenticated(false);
    setPasscode("");
  }

  // Fetch data
  const loadDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [tablesRes, resRes, subsRes] = await Promise.all([
        adminGetTables(selectedDate, selectedHour),
        adminGetReservations(), // Always retrieve all reservations so none are hidden
        adminGetSubscribers(),
      ]);
      setTableData(tablesRes);
      setAllReservations(resRes.reservations || []);
      setSubscribers(subsRes.subscribers || []);
    } catch {
      // Handled inside api.js fallbacks
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedDate, selectedHour]);

  useEffect(() => {
    let isMounted = true;
    if (!isAuthenticated) return;

    Promise.all([
      adminGetTables(selectedDate, selectedHour),
      adminGetReservations(),
      adminGetSubscribers(),
    ])
      .then(([tablesRes, resRes, subsRes]) => {
        if (!isMounted) return;
        setTableData(tablesRes);
        setAllReservations(resRes.reservations || []);
        setSubscribers(subsRes.subscribers || []);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, selectedDate, selectedHour]);

  // Cancel reservation
  async function handleCancel(reservationId, tableNum) {
    if (!window.confirm(`Are you sure you want to cancel the reservation for Table #${tableNum}?`)) {
      return;
    }
    try {
      await adminCancelReservation(reservationId);
      setActionMsg(`Table #${tableNum} reservation has been cancelled.`);
      setInspectTable(null);
      await loadDashboardData();
      setTimeout(() => setActionMsg(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to cancel reservation.");
    }
  }

  // Selected date reservations for floor plan & day stats
  const selectedDateReservations = useMemo(() => {
    return allReservations.filter((r) => r.date === selectedDate);
  }, [allReservations, selectedDate]);

  // Filtered reservations ledger
  const displayedReservations = useMemo(() => {
    const baseList = ledgerViewMode === "selected" ? selectedDateReservations : allReservations;
    if (!searchQuery.trim()) return baseList;
    const q = searchQuery.toLowerCase();
    return baseList.filter((r) => {
      const name = (r.guest_name || "").toLowerCase();
      const email = (r.email || "").toLowerCase();
      const phone = (r.phone || "").toLowerCase();
      const table = String(r.table_number || "");
      const date = String(r.date || "").toLowerCase();
      const hour = String(r.hour || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        table.includes(q) ||
        date.includes(q) ||
        hour.includes(q)
      );
    });
  }, [ledgerViewMode, selectedDateReservations, allReservations, searchQuery]);

  function jumpToFloorPlan(res) {
    if (res.date) setSelectedDate(res.date);
    if (res.hour) setSelectedHour(res.hour);
    setActiveTab("floor");
    setInspectTable({
      table_number: res.table_number,
      is_occupied: true,
      reservation: res,
    });
  }

  // Export subscribers to CSV
  function handleExportCSV() {
    if (!subscribers.length) {
      alert("No subscribers to export.");
      return;
    }
    const headers = ["ID", "Email", "Subscribed At"];
    const rows = subscribers.map((s) => [s.id, s.email, s.created_at || ""]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cafe_fausse_subscribers_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ================= 1. LOGIN SCREEN ================= //
  if (!isAuthenticated) {
    return (
      <div>
        <PageHero src={IMAGES.reservationsHero} eyebrow="STAFF & MANAGEMENT" title="Manager Portal" height={280} />
        <div className="container" style={{ padding: "80px 24px 120px", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#13100c",
              border: "1px solid rgba(200, 169, 126, 0.3)",
              borderRadius: "16px",
              padding: "40px 32px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(200, 169, 126, 0.12)",
                border: "1px solid var(--gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                color: "var(--gold)",
              }}
            >
              <Lock size={24} color="var(--gold)" />
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "var(--text-heading)", margin: "0 0 8px" }}>
              Manager Access
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", lineHeight: 1.6, marginBottom: "28px" }}>
              Enter the administrative security passcode to view live table occupancy, reservations, and mailing lists.
            </p>

            {authError && (
              <div
                style={{
                  background: "rgba(220, 60, 60, 0.12)",
                  border: "1px solid rgba(220, 60, 60, 0.4)",
                  color: "#ff8b8b",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "20px",
                }}
              >
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Manager Passcode (e.g. fausse2026)"
                style={{
                  background: "#1b1612",
                  border: "1px solid rgba(200, 169, 126, 0.3)",
                  borderRadius: "8px",
                  color: "#f0ece4",
                  padding: "14px 16px",
                  fontSize: "14px",
                  textAlign: "center",
                  letterSpacing: "2px",
                }}
              />
              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn btn-solid"
                style={{
                  padding: "14px",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  borderRadius: "8px",
                }}
              >
                {isLoggingIn ? "VERIFYING PASSCODE…" : "ENTER MANAGER PORTAL →"}
              </button>
            </form>

            <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(200, 169, 126, 0.15)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--gold)", letterSpacing: "0.5px" }}>
                <KeyRound size={13} style={{ flexShrink: 0 }} /> Default test passcode: <strong>fausse2026</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. MANAGER DASHBOARD ================= //
  const occupiedCount = tableData?.occupied_count ?? 0;
  const totalTables = tableData?.total_tables ?? 30;
  const occupancyRate = tableData?.occupancy_rate ?? 0;
  const totalCovers = selectedDateReservations.reduce((acc, r) => acc + (parseInt(r.guests, 10) || 0), 0);

  return (
    <div>
      <PageHero src={IMAGES.reservationsHero} eyebrow="EXECUTIVE OVERSIGHT" title="Manager Portal" height={260} />

      <div className="container" style={{ padding: "60px 24px 120px" }}>
        {/* Top Control Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "36px",
            paddingBottom: "24px",
            borderBottom: "1px solid var(--gold-border)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Landmark size={24} color="var(--gold)" />
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--text-heading)", margin: 0 }}>
                Dining Room Operations
              </h1>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "6px 0 0" }}>
              Real-time table occupancy, reservation management, and subscriber database.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={loadDashboardData}
              className="btn btn-outline"
              style={{ padding: "8px 16px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <RefreshCw size={13} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ padding: "8px 16px", fontSize: "12px", color: "#e88080", borderColor: "rgba(220, 80, 80, 0.4)", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <LogOut size={13} />
              Log Out
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {actionMsg && (
          <div
            style={{
              background: "rgba(200, 169, 126, 0.15)",
              border: "1px solid var(--gold)",
              color: "var(--gold)",
              padding: "12px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Check size={16} color="var(--gold)" /> {actionMsg}
          </div>
        )}

        {/* Filters Bar: Date & Service Hour */}
        <div
          style={{
            background: "#14110e",
            border: "1px solid rgba(200, 169, 126, 0.2)",
            borderRadius: "12px",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "36px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", letterSpacing: "1px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "6px" }}>
                <Calendar size={12} /> Service Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  background: "#1c1814",
                  border: "1px solid rgba(200, 169, 126, 0.3)",
                  borderRadius: "6px",
                  color: "#e8e3da",
                  padding: "8px 12px",
                  fontSize: "13px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", letterSpacing: "1px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "6px" }}>
                <Clock size={12} /> Seating Time Slot
              </label>
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                style={{
                  background: "#1c1814",
                  border: "1px solid rgba(200, 169, 126, 0.3)",
                  borderRadius: "6px",
                  color: "#e8e3da",
                  padding: "8px 12px",
                  fontSize: "13px",
                }}
              >
                {SERVICE_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot} Dinner Service
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ color: "var(--gold)", fontSize: "13px", fontWeight: 500 }}>
            Showing: <strong style={{ color: "#fff" }}>{selectedDate}</strong> at <strong style={{ color: "#fff" }}>{selectedHour}</strong>
          </div>
        </div>

        {/* Executive KPI Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div style={{ background: "#15120e", border: "1px solid var(--gold-border)", borderRadius: "10px", padding: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase" }}>
              Tables Occupied
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--gold)", margin: "6px 0 2px" }}>
              {occupiedCount} <span style={{ fontSize: "18px", color: "var(--text-muted)" }}>/ {totalTables}</span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {totalTables - occupiedCount} tables currently open
            </div>
          </div>

          <div style={{ background: "#15120e", border: "1px solid var(--gold-border)", borderRadius: "10px", padding: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase" }}>
              Occupancy Rate
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: occupancyRate > 80 ? "#e59866" : "var(--gold)", margin: "6px 0 2px" }}>
              {occupancyRate}%
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {occupancyRate >= 100 ? "Fully Booked" : "Seating Available"}
            </div>
          </div>

          <div style={{ background: "#15120e", border: "1px solid var(--gold-border)", borderRadius: "10px", padding: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase" }}>
              Expected Covers (Guests)
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "#f0ece4", margin: "6px 0 2px" }}>
              {totalCovers}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Across {selectedDateReservations.length} reservations for this date
            </div>
          </div>

          <div style={{ background: "#15120e", border: "1px solid var(--gold-border)", borderRadius: "10px", padding: "20px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", textTransform: "uppercase" }}>
              Newsletter Subscribers
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--gold)", margin: "6px 0 2px" }}>
              {subscribers.length}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Direct marketing reach
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid var(--gold-border)", marginBottom: "32px", overflowX: "auto" }}>
          {[
            { id: "floor", icon: LayoutGrid, label: "Floor Plan (30 Tables)" },
            { id: "ledger", icon: ClipboardList, label: `Reservation Ledger (${allReservations.length})` },
            { id: "subscribers", icon: Mail, label: `Mailing List (${subscribers.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? "2px solid var(--gold)" : "2px solid transparent",
                  padding: "12px 20px",
                  color: isActive ? "var(--gold)" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: 30-TABLE FLOOR PLAN VISUALIZER */}
        {activeTab === "floor" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--text-heading)", margin: 0 }}>
                Main Dining Room Floor Plan
              </h2>
              <div style={{ display: "flex", gap: "20px", fontSize: "12px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#1c1814", border: "1px solid rgba(200, 169, 126, 0.4)" }} />
                  <span style={{ color: "var(--text-muted)" }}>Available</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(200, 120, 60, 0.25)", border: "1px solid #d9824c" }} />
                  <span style={{ color: "#d9824c" }}>Occupied / Seated</span>
                </span>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: "60px", textAlign: "center", color: "var(--gold)" }}>
                Loading floor layout…
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "14px",
                  background: "#110e0b",
                  border: "1px solid rgba(200, 169, 126, 0.2)",
                  borderRadius: "14px",
                  padding: "24px",
                }}
              >
                {(tableData?.tables || []).map((t) => {
                  const isOcc = t.is_occupied;
                  const res = t.reservation;
                  return (
                    <div
                      key={t.table_number}
                      onClick={() => setInspectTable(t)}
                      style={{
                        background: isOcc ? "rgba(180, 80, 40, 0.18)" : "#181410",
                        border: isOcc ? "1px solid rgba(220, 120, 60, 0.6)" : "1px solid rgba(200, 169, 126, 0.25)",
                        borderRadius: "10px",
                        padding: "16px 12px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          letterSpacing: "1px",
                          color: isOcc ? "#e28743" : "var(--gold)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Table #{t.table_number}
                      </div>

                      <div
                        style={{
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "6px 0",
                        }}
                      >
                        {isOcc ? (
                          <Wine size={20} color="#e28743" />
                        ) : (
                          <Utensils size={18} color="var(--gold)" style={{ opacity: 0.6 }} />
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: isOcc ? "#ffb080" : "var(--text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isOcc ? res?.guest_name || "Seated" : "Available"}
                      </div>

                      {isOcc && (
                        <div style={{ fontSize: "10px", color: "var(--text-faint)", marginTop: "2px" }}>
                          {res?.guests} Guests
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESERVATIONS LEDGER */}
        {activeTab === "ledger" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--text-heading)", margin: 0 }}>
                  Reservation Roster
                </h2>
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setLedgerViewMode("all")}
                    style={{
                      background: ledgerViewMode === "all" ? "var(--gold)" : "rgba(200, 169, 126, 0.08)",
                      color: ledgerViewMode === "all" ? "#120e0b" : "var(--gold)",
                      border: "1px solid var(--gold)",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    All Reservations ({allReservations.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLedgerViewMode("selected")}
                    style={{
                      background: ledgerViewMode === "selected" ? "var(--gold)" : "rgba(200, 169, 126, 0.08)",
                      color: ledgerViewMode === "selected" ? "#120e0b" : "var(--gold)",
                      border: "1px solid var(--gold)",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Selected Date: {selectedDate} ({selectedDateReservations.length})
                  </button>
                </div>
              </div>

              <div style={{ position: "relative", minWidth: "280px" }}>
                <Search size={14} color="var(--gold)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guest, email, date, table #..."
                  style={{
                    background: "#181410",
                    border: "1px solid rgba(200, 169, 126, 0.3)",
                    borderRadius: "6px",
                    color: "#e8e3da",
                    padding: "9px 14px 9px 34px",
                    fontSize: "13px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                background: "#14110e",
                border: "1px solid rgba(200, 169, 126, 0.2)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#1c1813", borderBottom: "1px solid var(--gold-border)", color: "var(--gold)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 600 }}>TABLE</th>
                    <th style={{ padding: "14px 18px", fontWeight: 600 }}>GUEST</th>
                    <th style={{ padding: "14px 18px", fontWeight: 600 }}>DATE &amp; TIME</th>
                    <th style={{ padding: "14px 18px", fontWeight: 600 }}>COVERS</th>
                    <th style={{ padding: "14px 18px", fontWeight: 600 }}>CONTACT</th>
                    <th style={{ padding: "14px 18px", fontWeight: 600, textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedReservations.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)" }}>
                        No reservations found matching this query {ledgerViewMode === "selected" ? `for ${selectedDate}` : ""}.
                      </td>
                    </tr>
                  ) : (
                    displayedReservations.map((r) => (
                      <tr
                        key={r.id}
                        style={{ borderBottom: "1px solid rgba(200, 169, 126, 0.1)", color: "#e8e3da" }}
                      >
                        <td style={{ padding: "14px 18px" }}>
                          <span
                            style={{
                              background: "rgba(200, 169, 126, 0.15)",
                              border: "1px solid var(--gold)",
                              color: "var(--gold)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontWeight: 700,
                              fontSize: "12px",
                            }}
                          >
                            #{r.table_number}
                          </span>
                        </td>
                        <td style={{ padding: "14px 18px", fontWeight: 600, color: "#fff" }}>
                          {r.guest_name}
                        </td>
                        <td style={{ padding: "14px 18px", color: "var(--gold)" }}>
                          <div style={{ fontWeight: 600 }}>{r.date}</div>
                          <div style={{ fontSize: "12px", color: "#e8e3da", marginTop: "2px" }}>{r.hour || "19:00"} Service</div>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <div>{r.guests} Guests</div>
                          {r.wine_pairing && (
                            <span style={{ fontSize: "10px", color: "var(--gold)", display: "inline-flex", alignItems: "center", gap: "3px", marginTop: "2px" }}>
                              <Wine size={11} /> Wine Pairing
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 18px", color: "var(--text-muted)", fontSize: "12px" }}>
                          <div>{r.email}</div>
                          {r.phone && <div>{r.phone}</div>}
                        </td>
                        <td style={{ padding: "14px 18px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => jumpToFloorPlan(r)}
                              style={{
                                background: "rgba(200, 169, 126, 0.12)",
                                border: "1px solid var(--gold-border)",
                                color: "var(--gold)",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                cursor: "pointer",
                                fontWeight: 600,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              Floor Plan <ArrowRight size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCancel(r.id, r.table_number)}
                              style={{
                                background: "rgba(220, 80, 80, 0.15)",
                                border: "1px solid rgba(220, 80, 80, 0.4)",
                                color: "#ff8b8b",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              Cancel &amp; Free
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
        {activeTab === "subscribers" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--text-heading)", margin: 0 }}>
                  Private Journal Subscribers
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0" }}>
                  Guests subscribed to receive seasonal tasting menus and private dining announcements.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                className="btn btn-solid"
                style={{ padding: "10px 18px", fontSize: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            <div
              style={{
                background: "#14110e",
                border: "1px solid rgba(200, 169, 126, 0.2)",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "#1c1813", borderBottom: "1px solid var(--gold-border)", color: "var(--gold)" }}>
                    <th style={{ padding: "14px 18px", fontWeight: 600 }}>#</th>
                    <th style={{ padding: "14px 18px", fontWeight: 600 }}>SUBSCRIBER EMAIL</th>
                    <th style={{ padding: "14px 18px", fontWeight: 600 }}>JOIN DATE</th>
                    <th style={{ padding: "14px 18px", fontWeight: 600, textAlign: "right" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: "36px", textAlign: "center", color: "var(--text-muted)" }}>
                        No newsletter subscribers found.
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((s, idx) => (
                      <tr
                        key={s.id || idx}
                        style={{ borderBottom: "1px solid rgba(200, 169, 126, 0.1)", color: "#e8e3da" }}
                      >
                        <td style={{ padding: "14px 18px", color: "var(--text-faint)" }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "14px 18px", fontWeight: 600, color: "#fff" }}>
                          {s.email}
                        </td>
                        <td style={{ padding: "14px 18px", color: "var(--text-muted)" }}>
                          {s.created_at ? new Date(s.created_at).toLocaleDateString() : "Recent"}
                        </td>
                        <td style={{ padding: "14px 18px", textAlign: "right" }}>
                          <span
                            style={{
                              background: "rgba(100, 200, 120, 0.15)",
                              border: "1px solid rgba(100, 200, 120, 0.4)",
                              color: "#7ce396",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TABLE INSPECTION MODAL */}
        {inspectTable && (
          <div
            onClick={() => setInspectTable(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#16130f",
                border: "1px solid var(--gold)",
                borderRadius: "16px",
                padding: "32px",
                maxWidth: "460px",
                width: "100%",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.9)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <span
                  style={{
                    background: "rgba(200, 169, 126, 0.15)",
                    border: "1px solid var(--gold)",
                    color: "var(--gold)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  TABLE #{inspectTable.table_number}
                </span>
                <button
                  type="button"
                  onClick={() => setInspectTable(null)}
                  aria-label="Close table inspection"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "var(--text-heading)", margin: "0 0 16px" }}>
                {inspectTable.is_occupied ? "Occupied Table Details" : "Table Available"}
              </h3>

              {inspectTable.is_occupied && inspectTable.reservation ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px", fontSize: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(200,169,126,0.1)", paddingBottom: "8px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Guest:</span>
                    <strong style={{ color: "#fff" }}>{inspectTable.reservation.guest_name}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(200,169,126,0.1)", paddingBottom: "8px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Party Size:</span>
                    <span style={{ color: "var(--gold)" }}>{inspectTable.reservation.guests} Guests</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(200,169,126,0.1)", paddingBottom: "8px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Time:</span>
                    <span style={{ color: "#e8e3da" }}>{inspectTable.reservation.hour || selectedHour}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(200,169,126,0.1)", paddingBottom: "8px" }}>
                    <span style={{ color: "var(--text-muted)" }}>Email:</span>
                    <span style={{ color: "#e8e3da" }}>{inspectTable.reservation.email}</span>
                  </div>
                  {inspectTable.reservation.phone && (
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(200,169,126,0.1)", paddingBottom: "8px" }}>
                      <span style={{ color: "var(--text-muted)" }}>Phone:</span>
                      <span style={{ color: "#e8e3da" }}>{inspectTable.reservation.phone}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCancel(inspectTable.reservation.id, inspectTable.table_number)}
                    style={{
                      marginTop: "16px",
                      background: "rgba(220, 80, 80, 0.15)",
                      border: "1px solid rgba(220, 80, 80, 0.5)",
                      color: "#ff8b8b",
                      padding: "12px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Cancel Reservation &amp; Free Table #{inspectTable.table_number}
                  </button>
                </div>
              ) : (
                <div style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
                  This table is currently free for {selectedDate} at {selectedHour}. Walk-in guests can be seated here.
                </div>
              )}

              <button
                type="button"
                onClick={() => setInspectTable(null)}
                className="btn btn-outline"
                style={{ width: "100%", padding: "10px", fontSize: "12px" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
