import { useState } from "react";
import type { CrawlResult, LinkResult } from "../App";

const CATEGORY_CONFIG = {
  dead: { emoji: "⚰️", label: "Dead", color: "var(--red-bright)", bg: "rgba(192,57,43,0.12)", border: "rgba(192,57,43,0.4)" },
  bot_blocked: { emoji: "🚫", label: "Bot Blocked", color: "var(--purple)", bg: "rgba(142,68,173,0.12)", border: "rgba(142,68,173,0.4)" },
  timeout: { emoji: "⏱️", label: "Timeout", color: "var(--amber)", bg: "rgba(243,156,18,0.10)", border: "rgba(243,156,18,0.3)" },
  blocked: { emoji: "🔒", label: "Rate Limited", color: "var(--amber)", bg: "rgba(243,156,18,0.10)", border: "rgba(243,156,18,0.3)" },
  unknown: { emoji: "👻", label: "Unknown", color: "var(--gray)", bg: "rgba(90,90,122,0.1)", border: "rgba(90,90,122,0.3)" },
  alive: { emoji: "💚", label: "Alive", color: "var(--green)", bg: "rgba(46,204,113,0.08)", border: "rgba(46,204,113,0.25)" },
};

type Filter = "all" | "dead" | "alive" | "other";

function StatCard({ value, label, emoji, delay }: { value: number; label: string; emoji: string; delay: number }) {
  return (
    <div className="animate-rise" style={{
      animationDelay: `${delay}ms`,
      opacity: 0,
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "1rem",
      textAlign: "center",
      flex: 1,
      minWidth: 100,
    }}>
      <div style={{ fontSize: 26, marginBottom: 4 }}>{emoji}</div>
      <div style={{
        fontFamily: "var(--font-horror)",
        fontSize: 28,
        color: "var(--text)",
        lineHeight: 1,
        marginBottom: 4,
        animation: "count-up 0.4s ease both",
        animationDelay: `${delay + 200}ms`,
      }}>
        {value}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </div>
    </div>
  );
}

function TombstoneCard({ link, index }: { link: LinkResult; index: number }) {
  const cfg = CATEGORY_CONFIG[link.category];
  const short = link.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div
      className="tombstone"
      style={{
        animationDelay: `${Math.min(index * 60, 800)}ms`,
        opacity: 0,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 10,
        padding: "0.85rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 4px 20px ${cfg.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0 }}>{cfg.emoji}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          color: "var(--text)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: 3,
        }} title={link.url}>
          {short}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: cfg.color,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: 4,
            padding: "1px 6px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            {link.status ? `${link.status} ${cfg.label}` : cfg.label}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
            {link.responseTime}ms
          </span>
        </div>
      </div>

      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "var(--text-dim)",
          fontSize: 14,
          flexShrink: 0,
          padding: 4,
          borderRadius: 4,
          textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
        title="Open link"
        onClick={e => e.stopPropagation()}
      >
        ↗
      </a>
    </div>
  );
}

export default function Graveyard({ result, onReset }: { result: CrawlResult; onReset: () => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const dead = result.links.filter(l => l.category === "dead");
  const alive = result.links.filter(l => l.category === "alive");
  const other = result.links.filter(l => !["dead", "alive"].includes(l.category));

  const filtered = result.links.filter(l => {
    const matchFilter =
      filter === "all" ||
      (filter === "dead" && l.category === "dead") ||
      (filter === "alive" && l.category === "alive") ||
      (filter === "other" && !["dead", "alive"].includes(l.category));
    const matchSearch = !search || l.url.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // Sort: dead first, then other, then alive
  const sorted = [...filtered].sort((a, b) => {
    const order = { dead: 0, bot_blocked: 1, timeout: 2, blocked: 3, unknown: 4, alive: 5 };
    return (order[a.category] ?? 5) - (order[b.category] ?? 5);
  });

  const filterBtn = (f: Filter, label: string, count: number) => (
    <button
      onClick={() => setFilter(f)}
      style={{
        background: filter === f ? "var(--red)" : "transparent",
        border: `1px solid ${filter === f ? "var(--red)" : "var(--border)"}`,
        borderRadius: 8,
        padding: "0.4rem 1rem",
        color: filter === f ? "#fff" : "var(--text-dim)",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {label}
      <span style={{
        background: filter === f ? "rgba(255,255,255,0.2)" : "var(--surface)",
        borderRadius: 99,
        padding: "1px 7px",
        fontSize: 11,
      }}>{count}</span>
    </button>
  );

  return (
    <div>
      {/* Page title */}
      <div className="animate-fall" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Excavated from
        </p>
        <h2 style={{
          fontFamily: "var(--font-title)",
          fontSize: "clamp(1rem, 3vw, 1.4rem)",
          color: "var(--text)",
          fontWeight: 400,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {result.pageTitle}
        </h2>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "2rem" }}>
        <StatCard value={result.links.length} label="Checked" emoji="🔍" delay={0} />
        <StatCard value={dead.length} label="Dead" emoji="⚰️" delay={100} />
        <StatCard value={other.length} label="Suspicious" emoji="👻" delay={200} />
        <StatCard value={alive.length} label="Alive" emoji="💚" delay={300} />
      </div>

      {/* Filters + search */}
      <div className="animate-fall" style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        {filterBtn("all", "All", result.links.length)}
        {filterBtn("dead", "Dead", dead.length)}
        {filterBtn("other", "Suspicious", other.length)}
        {filterBtn("alive", "Alive", alive.length)}

        <input
          placeholder="Filter URLs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            marginLeft: "auto",
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "0.4rem 0.9rem",
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            outline: "none",
            minWidth: 160,
          }}
          onFocus={e => { e.target.style.borderColor = "var(--red)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
        />
      </div>

      {/* Results list */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          No links match your filter.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((link, i) => (
            <TombstoneCard key={link.url} link={link} index={i} />
          ))}
        </div>
      )}

      {/* Reset button */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <button
          onClick={onReset}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "0.65rem 2rem",
            color: "var(--text-dim)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            cursor: "pointer",
            letterSpacing: "0.08em",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red-bright)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}
        >
          🕷️ Crawl another site
        </button>
      </div>
    </div>
  );
}
