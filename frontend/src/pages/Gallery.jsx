import { useState } from "react";
import { Slot } from "../components/Media";
import PageHero from "../components/PageHero";
import { AWARDS, GALLERY_IMAGES, IMAGES, REVIEWS } from "../data/content";

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const lightboxImg = lightboxIdx != null ? GALLERY_IMAGES[lightboxIdx] : null;

  const shift = (dir) =>
    setLightboxIdx((i) => (i + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);

  return (
    <div>
      <PageHero src={IMAGES.galleryInterior} title="Gallery" height={360} />

      <div className="container" style={{ padding: "90px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {GALLERY_IMAGES.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIdx(idx)}
              style={{ cursor: "pointer", position: "relative", height: "220px", overflow: "hidden" }}
            >
              <Slot src={img.src} placeholder={img.placeholder} alt={img.caption} style={{ width: "100%", height: "100%" }} />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "10px 14px",
                  background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.75))",
                  fontSize: "12px",
                  color: "#e8e3da",
                  pointerEvents: "none",
                }}
              >
                {img.caption}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="container"
        style={{ padding: "70px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "70px" }}
      >
        <div>
          <div className="eyebrow">RECOGNITION</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "30px", color: "var(--text-heading)", margin: "16px 0 28px", fontWeight: 500 }}>
            Awards
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {AWARDS.map((award) => (
              <div
                key={award.name}
                style={{ display: "flex", gap: "14px", alignItems: "baseline", borderBottom: "1px solid var(--gold-border-soft)", paddingBottom: "16px" }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--gold)", flexShrink: 0, transform: "translateY(-4px)" }} />
                <div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "17px", color: "var(--text-heading)" }}>{award.name}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-mutedest)", marginTop: "4px" }}>{award.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="eyebrow">TESTIMONIALS</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "30px", color: "var(--text-heading)", margin: "16px 0 28px", fontWeight: 500 }}>
            Guest Reviews
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {REVIEWS.map((review) => (
              <div key={review.source}>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "18px", color: "#e8e3da", lineHeight: 1.6 }}>
                  "{review.quote}"
                </div>
                <div style={{ fontSize: "13px", color: "var(--gold)", marginTop: "8px", letterSpacing: "1px" }}>— {review.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {lightboxImg && (
        <div
          onClick={() => setLightboxIdx(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(5,4,3,0.92)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <span
            onClick={() => setLightboxIdx(null)}
            style={{ position: "absolute", top: "28px", right: "40px", color: "#e8e3da", fontSize: "28px", cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              shift(-1);
            }}
            style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", color: "#e8e3da", fontSize: "36px", cursor: "pointer", padding: "12px" }}
          >
            ‹
          </span>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(900px, 80vw)", height: "min(600px, 70vh)" }}>
            <Slot src={lightboxImg.src} placeholder={lightboxImg.placeholder} alt={lightboxImg.caption} style={{ width: "100%", height: "100%" }} />
          </div>
          <span
            onClick={(e) => {
              e.stopPropagation();
              shift(1);
            }}
            style={{ position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)", color: "#e8e3da", fontSize: "36px", cursor: "pointer", padding: "12px" }}
          >
            ›
          </span>
        </div>
      )}
    </div>
  );
}
