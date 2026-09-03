import { Slot } from "./Media";

export default function PageHero({ src, placeholder, eyebrow, title, height = 360 }) {
  return (
    <div style={{ position: "relative", height, overflow: "hidden" }}>
      <Slot
        src={src}
        placeholder={placeholder}
        alt={title}
        bare
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,9,8,0.7)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "46px",
            color: "var(--text-hero)",
            margin: eyebrow ? "16px 0 0" : 0,
            fontWeight: 500,
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
