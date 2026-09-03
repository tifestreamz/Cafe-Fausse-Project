import { CONTACT } from "../data/content";

export default function TopBar() {
  return (
    <div
      style={{
        background: "var(--bg-bar)",
        padding: "9px 48px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: "8px",
        fontSize: "12px",
        color: "#a98a5c",
        borderBottom: "1px solid var(--gold-border-soft)",
      }}
    >
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <span>{CONTACT.address}</span>
        <span style={{ color: "var(--text-faint)" }}>•</span>
        <span>{CONTACT.hours}</span>
      </div>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <span>{CONTACT.phone}</span>
        <span style={{ color: "var(--text-faint)" }}>•</span>
        <span>{CONTACT.email}</span>
      </div>
    </div>
  );
}
