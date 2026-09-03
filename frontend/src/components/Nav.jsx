import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "../data/content";

export default function Nav() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 48px",
        borderBottom: "1px solid var(--gold-border)",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <Link
        to="/"
        style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
      >
        <span
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "1px solid var(--gold)",
            color: "var(--gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-serif)",
            fontSize: "15px",
          }}
        >
          CF
        </span>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "23px", letterSpacing: "0.5px", color: "var(--text-heading)" }}>
          Café Fausse
        </span>
      </Link>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center" }}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            style={({ isActive }) => ({
              cursor: "pointer",
              fontSize: "12px",
              letterSpacing: "1.5px",
              color: isActive ? "var(--gold)" : "var(--text-body)",
              borderBottom: isActive ? "1px solid var(--gold)" : "1px solid transparent",
              paddingBottom: "4px",
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <Link to="/reservations" className="btn btn-outline">
        RESERVE A TABLE
      </Link>
    </div>
  );
}
