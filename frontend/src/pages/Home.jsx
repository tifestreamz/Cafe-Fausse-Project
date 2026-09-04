import { Link } from "react-router-dom";
import { Slot } from "../components/Media";
import { FEATURED_DISHES, IMAGES } from "../data/content";

export default function Home() {
  return (
    <div>
      <div style={{ position: "relative", height: 640, overflow: "hidden" }}>
        <Slot
          src={IMAGES.homeHero}
          alt="Café Fausse dining room"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.35) 40%, rgba(10,9,8,0.92) 100%)",
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
          <div className="eyebrow">FINE ITALIAN DINING IN WASHINGTON, DC</div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "58px",
              color: "var(--text-hero)",
              margin: "18px 0",
              fontWeight: 500,
              maxWidth: "780px",
            }}
          >
            Café Fausse
          </h1>
          <div style={{ color: "var(--text-body)", fontSize: "16px", maxWidth: "540px", lineHeight: 1.7, marginBottom: "32px" }}>
            Traditional Italian flavors, modern culinary craft, and a room built for evenings worth remembering.
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/reservations" className="btn btn-solid">
              RESERVE A TABLE
            </Link>
            <Link to="/menu" className="btn btn-outline">
              VIEW MENU
            </Link>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{
          padding: "110px 24px 90px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "60px",
          alignItems: "center",
        }}
      >
        <Slot src={IMAGES.storyChefPlating} alt="Chef plating dish" style={{ width: "100%", height: "440px" }} />
        <div>
          <div className="eyebrow">OUR STORY</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", color: "var(--text-heading)", margin: "16px 0 20px", fontWeight: 500 }}>
            Founded in 2010, Rooted in Tradition
          </h2>
          <div style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.8, marginBottom: "28px" }}>
            Founded in 2010 by Chef Antonio Rossi and restaurateur Maria Lopez, Café Fausse blends traditional Italian
            flavors with modern culinary innovation. Our mission is to provide an unforgettable dining experience that
            reflects both quality and creativity.
          </div>
          <Link
            to="/about"
            style={{ fontSize: "13px", letterSpacing: "2px", color: "var(--gold)", borderBottom: "1px solid var(--gold)", paddingBottom: "4px" }}
          >
            READ OUR STORY
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: "0 24px 110px", textAlign: "center" }}>
        <div className="eyebrow">FROM THE KITCHEN</div>
        <div className="divider">
          <span className="line" />
          <span className="dot" />
          <span className="line" />
        </div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", color: "var(--text-heading)", margin: "8px 0 56px", fontWeight: 500 }}>
          A Few House Favorites
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "44px" }}>
          {FEATURED_DISHES.map((dish) => (
            <div key={dish.name}>
              <Slot
                src={dish.src}
                placeholder={dish.placeholder}
                shape="circle"
                style={{ width: "120px", height: "120px", margin: "0 auto 20px" }}
              />
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "20px", color: "var(--text-heading)" }}>{dish.name}</div>
              <div style={{ color: "var(--gold)", fontSize: "14px", marginTop: "4px" }}>{dish.price}</div>
              <div style={{ color: "var(--text-mutedest)", fontSize: "13px", marginTop: "8px", lineHeight: 1.6 }}>{dish.desc}</div>
            </div>
          ))}
        </div>
        <Link to="/menu" className="btn btn-outline" style={{ marginTop: "56px", display: "inline-block" }}>
          VIEW FULL MENU
        </Link>
      </div>

      <div
        className="container"
        style={{
          margin: "0 auto 110px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "4px",
        }}
      >
        <Slot src={IMAGES.galleryEvent} alt="Special event" style={{ width: "100%", minHeight: "340px" }} />
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--gold-border-strong)",
            padding: "48px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "14px",
          }}
        >
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "28px", color: "var(--text-heading)" }}>Awards &amp; Recognition</div>
          <div style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.8 }}>
            Culinary Excellence Award (2022), Restaurant of the Year (2023), and Best Fine Dining Experience — Foodie
            Magazine (2023).
          </div>
          <Link
            to="/gallery"
            style={{
              marginTop: "6px",
              fontSize: "13px",
              letterSpacing: "2px",
              color: "var(--gold)",
              borderBottom: "1px solid var(--gold)",
              paddingBottom: "4px",
              alignSelf: "flex-start",
            }}
          >
            SEE GALLERY &amp; REVIEWS
          </Link>
        </div>
      </div>
    </div>
  );
}
