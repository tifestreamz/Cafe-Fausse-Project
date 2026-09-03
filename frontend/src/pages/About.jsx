import { Link } from "react-router-dom";
import { Slot } from "../components/Media";
import PageHero from "../components/PageHero";
import { ABOUT_STORY, FOUNDERS } from "../data/content";

export default function About() {
  const [antonio, maria] = FOUNDERS;

  return (
    <div>
      <PageHero placeholder="dining room ambience photo" eyebrow="SINCE 2010" title="About Us" height={360} />

      <div className="container" style={{ maxWidth: "900px", padding: "100px 24px 0", textAlign: "center" }}>
        <div className="eyebrow">ABOUT CAFÉ FAUSSE</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "34px", color: "var(--text-heading)", margin: "16px 0 24px", fontWeight: 500 }}>
          A Union of Tradition and Innovation
        </h2>
        <div style={{ color: "var(--text-muted)", fontSize: "16px", lineHeight: 1.9 }}>{ABOUT_STORY}</div>
      </div>

      <div
        className="container"
        style={{ padding: "90px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px", alignItems: "center" }}
      >
        <Slot placeholder={antonio.placeholder} style={{ width: "100%", height: "440px" }} />
        <div>
          <div className="eyebrow">THE FOUNDERS</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--text-heading)", margin: "16px 0 20px", fontWeight: 500 }}>
            {antonio.name}
          </h2>
          <div style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.8 }}>{antonio.bio}</div>
        </div>
      </div>

      <div
        className="container"
        style={{ padding: "0 24px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "60px", alignItems: "center" }}
      >
        <div style={{ order: 1 }}>
          <div className="eyebrow">THE FOUNDERS</div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--text-heading)", margin: "16px 0 20px", fontWeight: 500 }}>
            {maria.name}
          </h2>
          <div style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: 1.8 }}>{maria.bio}</div>
        </div>
        <Slot placeholder={maria.placeholder} style={{ width: "100%", height: "440px", order: 2 }} />
      </div>

      <div style={{ textAlign: "center", paddingBottom: "110px" }}>
        <Link to="/reservations" className="btn btn-solid">
          RESERVE YOUR TABLE
        </Link>
      </div>
    </div>
  );
}
