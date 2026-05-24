import { useState } from "react";

export default function WarningBanner({ warnings }: { warnings: string[] }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="animate-fall" style={{
      background: "rgba(243,156,18,0.08)",
      border: "1px solid rgba(243,156,18,0.4)",
      borderRadius: 10,
      padding: "1rem 1.25rem",
      marginBottom: "1.5rem",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        {warnings.map((w, i) => (
          <p key={i} style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--amber)",
            lineHeight: 1.6,
            marginBottom: i < warnings.length - 1 ? "0.25rem" : 0,
          }}>{w}</p>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none",
          border: "none",
          color: "var(--amber)",
          cursor: "pointer",
          fontSize: 16,
          padding: "0 4px",
          flexShrink: 0,
          opacity: 0.7,
        }}
        aria-label="Dismiss"
      >✕</button>
    </div>
  );
}
