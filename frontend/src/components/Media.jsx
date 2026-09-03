const shapeStyle = (shape) =>
  shape === "circle" ? { borderRadius: "50%", overflow: "hidden" } : { overflow: "hidden" };

export function Photo({ src, alt, shape = "rect", style }) {
  return (
    <div style={{ ...shapeStyle(shape), ...style }}>
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

export function ImagePlaceholder({ label, shape = "rect", style, bare = false }) {
  return (
    <div
      style={{
        ...shapeStyle(shape),
        ...style,
        position: "relative",
        background: "linear-gradient(135deg, #14100c 0%, #1c1712 55%, #100d0a 100%)",
        border: "1px solid rgba(200,169,126,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "16px",
      }}
    >
      {!bare && (
        <div>
          <div
            style={{
              width: "34px",
              height: "34px",
              margin: "0 auto 10px",
              borderRadius: "50%",
              border: "1px solid rgba(200,169,126,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--gold)",
              fontSize: "15px",
            }}
          >
            ✻
          </div>
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "1.5px",
              color: "var(--text-faint)",
              textTransform: "uppercase",
              lineHeight: 1.6,
            }}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

export function Slot({ src, alt, placeholder, shape = "rect", style, bare = false }) {
  return src ? (
    <Photo src={src} alt={alt} shape={shape} style={style} />
  ) : (
    <ImagePlaceholder label={placeholder} shape={shape} style={style} bare={bare} />
  );
}
