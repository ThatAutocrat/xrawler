import { parse } from "node-html-parser";

export interface LinkResult {
  url: string;
  status: number | null;
  category: "dead" | "blocked" | "timeout" | "bot_blocked" | "alive" | "unknown";
  label: string;
  responseTime: number;
}

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
};

async function checkLink(url: string): Promise<LinkResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    let res: Response;
    try {
      res = await fetch(url, {
        method: "HEAD",
        headers: BROWSER_HEADERS,
        signal: controller.signal,
        redirect: "follow",
      });
    } catch {
      res = await fetch(url, {
        method: "GET",
        headers: BROWSER_HEADERS,
        signal: controller.signal,
        redirect: "follow",
      });
    } finally {
      clearTimeout(timeout);
    }

    const responseTime = Date.now() - start;
    const status = res.status;

    if (status >= 200 && status < 300) {
      return { url, status, category: "alive", label: "Alive", responseTime };
    } else if (status === 403 || status === 401) {
      return { url, status, category: "bot_blocked", label: "Bot Blocked", responseTime };
    } else if (status === 404) {
      return { url, status, category: "dead", label: "Dead", responseTime };
    } else if (status === 429) {
      return { url, status, category: "blocked", label: "Rate Limited", responseTime };
    } else if (status >= 500) {
      return { url, status, category: "dead", label: "Server Error", responseTime };
    } else {
      return { url, status, category: "unknown", label: `HTTP ${status}`, responseTime };
    }
  } catch (err: any) {
    const responseTime = Date.now() - start;
    if (err?.name === "AbortError") {
      return { url, status: null, category: "timeout", label: "Timeout", responseTime };
    }
    return { url, status: null, category: "unknown", label: "Unreachable", responseTime };
  }
}

function extractLinks(html: string, baseUrl: string): string[] {
  const root = parse(html);
  const base = new URL(baseUrl);
  const links = new Set<string>();

  root.querySelectorAll("a[href]").forEach((el) => {
    const href = el.getAttribute("href");
    if (!href) return;
    try {
      const url = new URL(href, base);
      if (url.protocol === "http:" || url.protocol === "https:") {
        links.add(url.href);
      }
    } catch {}
  });

  return Array.from(links);
}

async function checkInBatches(links: string[], batchSize = 10): Promise<LinkResult[]> {
  const results: LinkResult[] = [];
  for (let i = 0; i < links.length; i += batchSize) {
    const batch = links.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkLink));
    results.push(...batchResults);
  }
  return results;
}

export async function crawl(targetUrl: string): Promise<{
  links: LinkResult[];
  pageTitle: string;
  totalFound: number;
  warnings: string[];
}> {
  const warnings: string[] = [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let html: string;
  let pageTitle = targetUrl;

  try {
    const res = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Failed to fetch page: HTTP ${res.status}`);
    }

    html = await res.text();
    const root = parse(html);
    pageTitle = root.querySelector("title")?.text?.trim() || targetUrl;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      warnings.push("Page may not be HTML — link extraction could be incomplete.");
    }
  } catch (err: any) {
    clearTimeout(timeout);
    if (err?.name === "AbortError") {
      throw new Error("Target page timed out. Is the URL correct?");
    }
    throw new Error(err.message || "Could not reach the target URL.");
  }

  const links = extractLinks(html, targetUrl);

  if (links.length === 0) {
    warnings.push("No links found. The page may be JavaScript-rendered (SPA).");
  }

  if (links.length > 150) {
    warnings.push(`Found ${links.length} links — checking first 150 to stay within limits.`);
  }

  const toCheck = links.slice(0, 150);
  const results = await checkInBatches(toCheck, 12);

  return {
    links: results,
    pageTitle,
    totalFound: links.length,
    warnings,
  };
}
