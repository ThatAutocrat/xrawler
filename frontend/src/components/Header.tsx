export default function Header() {
  return (
    <header style={{
      borderBottom: "1px solid var(--border)",
      padding: "2rem 1rem 1.5rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Drip effect top corners */}
      <div style={{ position: "absolute", top: 0, left: "10%", width: 3, background: "var(--red)", animation: "drip 3s ease-in 1s infinite", borderRadius: "0 0 4px 4px" }} />
      <div style={{ position: "absolute", top: 0, left: "30%", width: 2, background: "var(--red)", animation: "drip 4s ease-in 0.5s infinite", borderRadius: "0 0 4px 4px" }} />
      <div style={{ position: "absolute", top: 0, right: "20%", width: 3, background: "var(--red)", animation: "drip 3.5s ease-in 2s infinite", borderRadius: "0 0 4px 4px" }} />
      <div style={{ position: "absolute", top: 0, right: "40%", width: 2, background: "var(--red)", animation: "drip 5s ease-in 0.8s infinite", borderRadius: "0 0 4px 4px" }} />

      {/* Spider hanging */}
      <div className="animate-float" style={{
        fontSize: 28,
        marginBottom: "0.5rem",
        display: "block",
        filter: "drop-shadow(0 0 8px var(--red-glow))",
      }}>
        🕷️
      </div>

      <h1 className="animate-flicker" style={{
        fontFamily: "var(--font-title)",
        fontSize: "clamp(2.5rem, 8vw, 5rem)",
        fontWeight: 700,
        letterSpacing: "0.15em",
        color: "#fff",
        textShadow: "0 0 20px var(--red-glow), 0 0 60px rgba(192,57,43,0.3), 2px 2px 0 var(--red)",
        marginBottom: "0.25rem",
        lineHeight: 1,
      }}>
        XRAWLER
      </h1>

      <p style={{
        fontFamily: "var(--font-mono)",
        color: "var(--text-dim)",
        fontSize: 13,
        letterSpacing: "0.25em",
        textTransform: "uppercase",
      }}>
        dead link excavator
      </p>
    </header>
  );
}
