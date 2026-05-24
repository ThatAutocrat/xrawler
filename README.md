# 🕷️ XRAWLER — Dead Link Excavator

A dark, dramatic dead link checker. Paste a URL, XRAWLER crawls it, finds every link, and tells you what's alive — and what's been dead all along.

---

## Stack

- **Backend** — Hono on Node.js → deployed on Render
- **Frontend** — React + Vite → deployed on Vercel / Netlify

---

## Local Development

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

Vite proxies `/api` → `localhost:3001` automatically during dev.

---

## Deployment

### Backend → Render

1. Push the `backend/` folder to a GitHub repo (or the whole monorepo)
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Set:
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm start`
   - **Environment**: Node
5. Deploy — note your URL e.g. `https://xrawler-backend.onrender.com`

> ⚠️ Free tier spins down after inactivity — first request may take ~30s to wake up.

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variable:
   - `VITE_BACKEND_URL` = your Render backend URL (e.g. `https://xrawler-backend.onrender.com`)
4. Deploy

---

## How it works

1. User pastes a URL
2. Backend fetches the page HTML (spoofing a real browser user-agent)
3. Extracts all `<a href>` links
4. Checks each link with `HEAD` (falls back to `GET`)
5. Categorises results:
   - ⚰️ **Dead** — 404 or 5xx
   - 🚫 **Bot Blocked** — 401/403
   - ⏱️ **Timeout** — no response in 7s
   - 🔒 **Rate Limited** — 429
   - 👻 **Unknown** — other status
   - 💚 **Alive** — 2xx

### Limitations
- JS-heavy SPAs may show no links (links are rendered by JS, not in HTML)
- Some sites aggressively block crawlers regardless of user-agent spoofing
- Max 150 links per crawl to stay within limits

---

## Project Structure

```
xrawler/
├── backend/
│   ├── src/
│   │   ├── index.ts       # Hono server + routes
│   │   └── crawler.ts     # Link extraction + checking
│   ├── render.yaml        # Render deploy config
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── index.css
    │   └── components/
    │       ├── Header.tsx
    │       ├── CrawlProgress.tsx
    │       ├── Graveyard.tsx
    │       └── WarningBanner.tsx
    ├── public/
    │   └── favicon.svg    # Spider favicon
    └── package.json
```

---

Built with 🕷️ and too much darkness.
