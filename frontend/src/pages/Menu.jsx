import { Link } from "react-router-dom";
import { Slot } from "../components/Media";
import PageHero from "../components/PageHero";
import { IMAGES, MENU_CATEGORIES } from "../data/content";

export default function Menu() {
  return (
    <div>
      <PageHero src={IMAGES.menuHero} eyebrow="LA CUCINA" title="Our Menu" height={360} />

      {MENU_CATEGORIES.map((cat) => (
        <div key={cat.key} id={cat.key} className="container" style={{ padding: "80px 24px 20px", textAlign: "center" }}>
          <div className="eyebrow">{cat.label}</div>
          <div className="divider">
            <span className="line" />
            <span className="dot" />
            <span className="line" />
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "38px", color: "var(--text-heading)", margin: "8px 0 50px", fontWeight: 500 }}>
            {cat.title}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "0 60px",
              textAlign: "left",
            }}
          >
            {cat.items.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  gap: "18px",
                  alignItems: "flex-start",
                  padding: "18px 0",
                  borderBottom: "1px solid var(--gold-border-soft)",
                }}
              >
                <Slot src={item.src} placeholder="dish photo" shape="circle" style={{ width: "72px", height: "72px", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "19px", color: "var(--text-heading)" }}>{item.name}</div>
                    <div style={{ fontSize: "15px", color: "var(--gold)", whiteSpace: "nowrap" }}>{item.price}</div>
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-mutedest)", marginTop: "6px", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: "center", padding: "60px 24px 100px" }}>
        <Link to="/reservations" className="btn btn-solid">
          RESERVE A TABLE
        </Link>
      </div>
    </div>
  );
}
