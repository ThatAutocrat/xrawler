import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { crawl } from "./crawler.js";

const app = new Hono();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type"],
}));

app.get("/", (c) => c.json({ status: "XRAWLER backend alive 🕷️" }));

app.post("/api/crawl", async (c) => {
  let body: { url?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body." }, 400);
  }

  const { url } = body;
  if (!url) return c.json({ error: "Missing url field." }, 400);

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
  } catch {
    return c.json({ error: "Invalid URL. Must start with http:// or https://" }, 400);
  }

  try {
    const result = await crawl(parsedUrl.href);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message || "Crawl failed." }, 500);
  }
});

const port = parseInt(process.env.PORT || "3001");
console.log(`🕷️ XRAWLER backend running on port ${port}`);

serve({ fetch: app.fetch, port });
