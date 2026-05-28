import { useState, useRef, useEffect } from "react";
import Graveyard from "./components/Graveyard";
import CrawlProgress from "./components/CrawlProgress";
import Header from "./components/Header";
import WarningBanner from "./components/WarningBanner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export interface LinkResult {
  url: string;
  status: number | null;
  category: "dead" | "blocked" | "timeout" | "bot_blocked" | "alive" | "unknown";
  label: string;
  responseTime: number;
}

export interface CrawlResult {
  links: LinkResult[];
  pageTitle: string;
  totalFound: number;
  warnings: string[];
}

type State = "idle" | "crawling" | "done" | "error";

export default function App() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>("idle");
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [error, setError] = useState("");
  const [shakeInput, setShakeInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleCrawl() {
    const trimmed = url.trim();
    if (!trimmed) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 600);
      return;
    }

    let finalUrl = trimmed;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    setState("crawling");
    setResult(null);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/crawl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Crawl failed.");
      }

      setResult(data);
      setState("done");
    } catch (err: any) {
      setError(err.message || "Something went wrong in the shadows...");
      setState("error");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleCrawl();
  }

  function handleReset() {
    setState("idle");
    setResult(null);
    setError("");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <main style={{ flex: 1, padding: "2rem 1rem", maxWidth: 900, margin: "0 auto", width: "100%" }}>

        {/* Search bar */}
        {state !== "crawling" && (
          <div className="animate-fall" style={{ marginBottom: "2.5rem" }}>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "1.5rem",
              boxShadow: "0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}>
              <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: "1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                ⚰️ Enter URL to excavate
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <input
                  ref={inputRef}
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://example.com"
                  className={shakeInput ? "animate-shake" : ""}
                  style={{
                    flex: 1,
                    minWidth: 200,
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "0.75rem 1rem",
                    color: "var(--text)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 15,
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = "var(--red)"; e.target.style.boxShadow = "0 0 0 3px var(--red-glow)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  onClick={handleCrawl}
                  className="animate-pulse-red"
                  style={{
                    background: "var(--red)",
                    border: "none",
                    borderRadius: 8,
                    padding: "0.75rem 1.75rem",
                    color: "#fff",
                    fontFamily: "var(--font-title)",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    transition: "background 0.2s, transform 0.1s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#a93226")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--red)")}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  🕷️ Crawl
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Crawling state */}
        {state === "crawling" && <CrawlProgress url={url} />}

        {/* Error state */}
        {state === "error" && (
          <div className="animate-rise" style={{
            background: "rgba(192,57,43,0.1)",
            border: "1px solid var(--red)",
            borderRadius: 12,
            padding: "1.5rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: "0.75rem" }}>💀</div>
            <div style={{ fontFamily: "var(--font-horror)", fontSize: 22, color: "var(--red-bright)", marginBottom: "0.5rem" }}>
              Blocked by this site so lets look up something else unless u wanna land us both in trouble
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: 14, marginBottom: "1.25rem" }}>{error}</div>
            <button
              onClick={handleReset}
              style={{
                background: "transparent",
                border: "1px solid var(--red)",
                borderRadius: 8,
                padding: "0.5rem 1.25rem",
                color: "var(--red-bright)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {state === "done" && result && (
          <>
            {result.warnings.length > 0 && <WarningBanner warnings={result.warnings} />}
            <Graveyard result={result} onReset={handleReset} />
          </>
        )}
      </main>

      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "1.25rem",
        textAlign: "center",
        color: "var(--text-dim)",
        fontSize: 12,
        fontFamily: "var(--font-mono)",
        letterSpacing: "0.08em",
      }}>
        XRAWLER — unearthing dead links since {new Date().getFullYear()} 🕷️
      </footer>
    </div>
  );
}
