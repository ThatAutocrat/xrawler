import { useState, useEffect } from "react";

const MESSAGES = [
  "Descending into the darkness...",
  "Extracting links from the void...",
  "Sending scouts into the shadows...",
  "Whispering to dead servers...",
  "Cataloguing the fallen...",
  "The graveyard awaits...",
  "Checking for signs of life...",
  "Counting the tombstones...",
];

export default function CrawlProgress({ url }: { url: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex(i => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(msgTimer);
  }, []);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots(d => d.length >= 3 ? "." : d + ".");
    }, 400);
    return () => clearInterval(dotTimer);
  }, []);

  useEffect(() => {
    // Simulate progress — real progress would need SSE/websocket
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 85) return p;
        return p + Math.random() * 4;
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-rise" style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "2.5rem 2rem",
      textAlign: "center",
      boxShadow: "0 0 60px rgba(0,0,0,0.8)",
    }}>
      {/* Spinning spider */}
      <div style={{
        fontSize: 56,
        marginBottom: "1.5rem",
        display: "inline-block",
        animation: "float 1.5s ease-in-out infinite",
        filter: "drop-shadow(0 0 12px var(--red-glow))",
      }}>
        🕸️
      </div>

      {/* Message */}
      <div key={msgIndex} className="animate-fall" style={{
        fontFamily: "var(--font-horror)",
        fontSize: 22,
        color: "var(--red-bright)",
        marginBottom: "0.5rem",
        minHeight: 32,
      }}>
        {MESSAGES[msgIndex]}
      </div>

      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--text-dim)",
        marginBottom: "2rem",
        letterSpacing: "0.1em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "100%",
      }}>
        {url}{dots}
      </div>

      {/* Progress bar */}
      <div style={{
        background: "var(--bg)",
        borderRadius: 99,
        height: 6,
        overflow: "hidden",
        border: "1px solid var(--border)",
        marginBottom: "0.75rem",
      }}>
        <div
          className="progress-bar-fill"
          style={{
            height: "100%",
            width: `${Math.round(progress)}%`,
            background: `linear-gradient(90deg, var(--red) 0%, #ff6b6b 100%)`,
            borderRadius: 99,
            boxShadow: "0 0 10px var(--red-glow)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
        {Math.round(progress)}% complete
      </div>
    </div>
  );
}
