import { useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT, NAV_LINKS } from "../data/content";
import { subscribeNewsletter } from "../api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await subscribeNewsletter(email);
      setSubscribed(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      id="footer"
      style={{
        borderTop: "1px solid var(--gold-border)",
        padding: "80px 24px 0",
        background: "var(--bg-footer)",
      }}
    >
      <div className="container" style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "var(--text-heading)", marginBottom: "18px" }}>
          Café Fausse
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.8 }}>
          {CONTACT.address} &nbsp;·&nbsp; {CONTACT.phone} &nbsp;·&nbsp; {CONTACT.email}
          <br />
          {CONTACT.hours}
        </div>
      </div>

      <div
        className="container"
        style={{
          margin: "56px auto 0",
          paddingTop: "56px",
          borderTop: "1px solid var(--gold-border-soft)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "50px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "22px", justifyContent: "center" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{ cursor: "pointer", fontSize: "12px", letterSpacing: "1.5px", color: "var(--text-muted)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "19px", color: "var(--text-heading)", marginBottom: "12px" }}>
            Get News &amp; Offers
          </div>
          <div style={{ color: "var(--text-mutedest)", fontSize: "13px", marginBottom: "18px" }}>
            Subscribe for seasonal menus and special events.
          </div>

          {subscribed ? (
            <div style={{ color: "var(--gold)", fontSize: "13px" }}>Thanks for subscribing!</div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0, maxWidth: "340px", margin: "0 auto" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid var(--gold-border-strong)",
                  borderRight: "none",
                  color: "#e8e3da",
                  padding: "12px 14px",
                  fontSize: "13px",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 22px",
                  background: "var(--gold)",
                  border: "none",
                  color: "var(--bg)",
                  fontSize: "12px",
                  letterSpacing: "1.5px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                SUBSCRIBE
              </button>
            </form>
          )}
          {error && <div style={{ color: "var(--error)", fontSize: "12px", marginTop: "10px" }}>{error}</div>}
        </div>
      </div>

      <div
        style={{
          marginTop: "56px",
          padding: "22px 24px",
          textAlign: "center",
          borderTop: "1px solid var(--gold-border-soft)",
          color: "var(--text-faint)",
          fontSize: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        <span>© {new Date().getFullYear()} Café Fausse. All rights reserved.</span>
        <span>·</span>
        <Link
          to="/admin"
          style={{
            color: "var(--text-faint)",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = "var(--gold)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--text-faint)")}
        >
          Staff &amp; Manager Portal
        </Link>
      </div>
    </div>
  );
}
