import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Slot } from "../components/Media";
import PageHero from "../components/PageHero";
import { IMAGES, MENU_CATEGORIES } from "../data/content";

export default function Menu() {
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setSelectedDish(null);
    }
    if (selectedDish) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedDish]);

  return (
    <div>
      <PageHero src={IMAGES.menuHero} eyebrow="LA CUCINA" title="Our Menu" height={360} />

      <div style={{ textAlign: "center", paddingTop: "36px" }}>
        <span
          style={{
            fontSize: "12px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            color: "var(--gold)",
            background: "rgba(200,169,126,0.08)",
            border: "1px solid rgba(200,169,126,0.25)",
            padding: "6px 18px",
            borderRadius: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✻</span> Click any item to explore ingredients &amp; sommelier pairings
        </span>
      </div>

      {MENU_CATEGORIES.map((cat) => (
        <div key={cat.key} id={cat.key} className="container" style={{ padding: "60px 24px 20px", textAlign: "center" }}>
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
              gap: "16px 50px",
              textAlign: "left",
            }}
          >
            {cat.items.map((item) => (
              <div
                key={item.name}
                onClick={() => setSelectedDish(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedDish(item);
                }}
                className="menu-item-interactive"
                style={{
                  display: "flex",
                  gap: "18px",
                  alignItems: "flex-start",
                  padding: "16px 14px",
                  borderRadius: "8px",
                  borderBottom: "1px solid var(--gold-border-soft)",
                  cursor: "pointer",
                  transition: "background 0.2s ease, transform 0.2s ease",
                }}
              >
                <Slot src={item.src} placeholder="dish photo" shape="circle" style={{ width: "72px", height: "72px", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: "19px", color: "var(--text-heading)" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "15px", color: "var(--gold)", whiteSpace: "nowrap" }}>{item.price}</div>
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-mutedest)", marginTop: "6px", lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                  <div style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "1px", color: "var(--gold)", textTransform: "uppercase" }}>
                      View details →
                    </span>
                  </div>
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

      {/* Dish Detail Modal */}
      {selectedDish && (
        <div
          onClick={() => setSelectedDish(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(6, 5, 4, 0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#110e0b",
              border: "1px solid rgba(200, 169, 126, 0.35)",
              borderRadius: "12px",
              boxShadow: "0 24px 70px rgba(0, 0, 0, 0.9)",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDish(null)}
              aria-label="Close dialog"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "rgba(20, 16, 12, 0.8)",
                border: "1px solid rgba(200,169,126,0.4)",
                color: "var(--gold)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "18px",
                zIndex: 10,
                transition: "all 0.2s ease",
              }}
            >
              ✕
            </button>

            {/* Dish Hero Image */}
            <div style={{ position: "relative", height: "280px", width: "100%", overflow: "hidden" }}>
              <Slot
                src={selectedDish.src}
                alt={selectedDish.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(17,14,11,0.2) 0%, rgba(17,14,11,0.95) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "28px",
                  right: "28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "2px",
                      color: "var(--gold)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    {selectedDish.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "30px",
                      color: "var(--text-heading)",
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {selectedDish.name}
                  </h3>
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "26px", color: "var(--gold)" }}>
                  {selectedDish.price}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "28px 28px 34px", display: "flex", flexDirection: "column", gap: "22px" }}>
              {/* Dietary Badges */}
              {selectedDish.dietary && selectedDish.dietary.length > 0 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {selectedDish.dietary.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "11px",
                        letterSpacing: "1px",
                        color: "var(--gold)",
                        border: "1px solid rgba(200,169,126,0.3)",
                        background: "rgba(200,169,126,0.06)",
                        padding: "4px 12px",
                        borderRadius: "14px",
                        textTransform: "uppercase",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Extended Details */}
              <div>
                <div style={{ fontSize: "12px", letterSpacing: "1.5px", color: "var(--gold)", marginBottom: "8px", textTransform: "uppercase" }}>
                  The Preparation
                </div>
                <div style={{ color: "#d5d0c7", fontSize: "15px", lineHeight: 1.8 }}>
                  {selectedDish.details}
                </div>
              </div>

              {/* Ingredients */}
              {selectedDish.ingredients && selectedDish.ingredients.length > 0 && (
                <div>
                  <div style={{ fontSize: "12px", letterSpacing: "1.5px", color: "var(--gold)", marginBottom: "10px", textTransform: "uppercase" }}>
                    Key Ingredients
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedDish.ingredients.map((ing) => (
                      <span
                        key={ing}
                        style={{
                          background: "#191510",
                          border: "1px solid rgba(200,169,126,0.15)",
                          color: "#c0bbb2",
                          fontSize: "13px",
                          padding: "5px 12px",
                          borderRadius: "6px",
                        }}
                      >
                        • {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Wine Pairing */}
              {selectedDish.pairing && (
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(200,169,126,0.1) 0%, rgba(30,24,18,0.6) 100%)",
                    border: "1px solid rgba(200,169,126,0.25)",
                    borderRadius: "8px",
                    padding: "16px 18px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>🍷</span>
                  <div>
                    <div style={{ fontSize: "12px", letterSpacing: "1.5px", color: "var(--gold)", fontWeight: 600, textTransform: "uppercase" }}>
                      Sommelier Pairing Note
                    </div>
                    <div style={{ fontSize: "14px", color: "#e8e3da", marginTop: "4px", lineHeight: 1.5 }}>
                      {selectedDish.pairing}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: "flex", gap: "14px", marginTop: "10px", flexWrap: "wrap" }}>
                <Link
                  to="/reservations"
                  className="btn btn-solid"
                  style={{ flex: 1, textAlign: "center", padding: "14px 20px" }}
                  onClick={() => setSelectedDish(null)}
                >
                  RESERVE A TABLE TO TASTE
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedDish(null)}
                  className="btn btn-outline"
                  style={{ padding: "14px 24px" }}
                >
                  BACK TO MENU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
