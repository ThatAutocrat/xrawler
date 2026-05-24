# 🕷️ XRAWLER — Dead Link Excavator
### *Because someone has to do the dirty work of confirming your website is, in fact, falling apart.*

---

> You built a website. You linked to things. Those things died. You never checked. XRAWLER knows. XRAWLER *always* knows. 🪦

---

## 🤔 What Even Is This?

Paste a URL. XRAWLER crawls it like a spider with abandonment issues, rips out every single link, and stares each one dead in the eye until it confesses whether it's alive or just vibing in the void.

Results are served with dramatic flair, because a plain `404` deserves *ceremony*.

---

## 🧟 What Will XRAWLER Find?

| Status | Meaning |
|--------|---------|
| ⚰️ **Dead** | 404 or 5xx — gone, deceased, kaput |
| 🚫 **Bot Blocked** | 401/403 — they know what you are |
| ⏱️ **Timeout** | 7 whole seconds and nothing. *Ghosted.* |
| 🔒 **Rate Limited** | 429 — slow down, you maniac |
| 👻 **Unknown** | Some other status. Spooky. |
| 💚 **Alive** | 2xx — a miracle. Cherish it. |

---

## ⚙️ How It Works
*(in case you care about the boring stuff)*

1. You paste a URL like a responsible adult 🙂
2. The backend fetches the page while *pretending* to be a real browser (sneaky 🕵️)
3. Every `<a href>` gets yanked out and interrogated
4. Each link gets a `HEAD` request — falls back to `GET` if it's being dramatic
5. Results come back categorised, judged, and labelled for your viewing grief

---

## 🚀 Running It Locally
*(yes, it actually works on your machine, we're just as surprised)*

### Backend
```bash
cd backend
npm install
npm run dev
```
Starts crying on `http://localhost:3001`

### Frontend
```bash
cd frontend
cp .env.example .env   # don't skip this, you'll ask why it's broken in 20 minutes
npm install
npm run dev
```
Opens its eyes on `http://localhost:5173`

Vite auto-proxies `/api` → `localhost:3001` so you don't have to think. You're welcome. 🤝

---

## ☁️ Deploying to the Cloud
*(so the whole internet can witness your dead links)*

### Backend → Render 🎢
1. Push to GitHub (you have done this before, right?)
2. [render.com](https://render.com) → New Web Service → connect repo
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Hit deploy and wait an eternity
6. Note your URL — you'll need it for the frontend

> ⚠️ **Free tier warning:** Render's free tier hibernates after inactivity. Your first request after a nap takes ~30 seconds. Perfect time to question your life choices. ☕

### Frontend → Vercel ▲
1. Push to GitHub (again, yes)
2. [vercel.com](https://vercel.com) → New Project → import
3. Add env variable: `VITE_BACKEND_URL` = your Render URL from above
4. Click deploy
5. Tell your friends. All two of them.

---

## 🚧 Known Limitations
*(we prefer "character traits")*

- 🤖 **SPAs will laugh at you** — if the site renders links via JavaScript, XRAWLER sees nothing. A blank HTML shell. Very humbling.
- 🛡️ **Some sites hate crawlers** — user-agent spoofing only gets you so far before a site's entire security team personally rejects you
- 📏 **150 links max per crawl** — because we're not *animals*

---

## 🛠️ Stack

| Layer | Tech |
|-------|------|
| Backend | Hono on Node.js → Render |
| Frontend | React + Vite → Vercel/Netlify |

Small. Mean. Efficient. Like a spider. 🕷️

---


## 👤 Who Is This For?

Glad you asked. XRAWLER was made for:

- 🧑‍💻 **Developers** who built a site in 2019 during covid and haven't looked at it since
- 📈 **SEO people** currently having a very bad Monday
- 😬 **People who just inherited someone else's codebase** and need to know how bad it is before the meeting
- 🕵️ **The paranoid** who *know* something is broken but can't prove it yet
- 🫠 **Anyone** whose client just asked "why are half the links on our website broken?"

Not for: people who are not ready for the truth.

---

## 🏆 Why Not Just Use Another Tool?

Great question. Here's an objective, completely unbiased comparison:

| Feature | Other Tools | XRAWLER |
|---------|-------------|---------|
| Finds dead links | ✅ | ✅ |
| Dramatic about it | ❌ | ✅ |
| Has a spider | ❌ probably | ✅ absolutely |
| Judges you silently | ❌ | ✅ loudly |
| Free | 💸 maybe | ✅ |
| Vibes | 📊 corporate | 🕷️ gothic |
| Makes you feel things | ❌ | ✅ grief, mostly |

*The choice is obvious.*

---

## 🪦 Hall of Shame
*A dramatic recreation of a real crawl. The URL has been redacted to protect the embarrassed.*

```
🕷️  XRAWLER  |  Crawling: https://definitelynotabandoned.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍  47 links found. Beginning interrogation...

💚  https://definitelynotabandoned.com/home ............. alive (barely)
⚰️  https://old-partner-site.com/collab ................. 404 (they moved on)
⚰️  https://medium.com/@user/that-blog-post ............. 404 (deleted, like tears in rain)
🚫  https://api.someservice.io/v1/docs .................. 403 (they know)
⏱️  https://cdn.assets.net/logo-final-v3-REAL.png ....... timeout (gone forever)
⚰️  https://twitter.com/user ........................... 404 (account suspended)
⚰️  https://twitter.com/user2 .......................... 404 (same)
⚰️  https://twitter.com/user3 .......................... 404 (you had a type)
👻  https://some-startup.io ............................ 502 (startup'd)
💚  https://google.com .................................. alive (of course it is)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊  Results: 2 alive · 6 dead · 1 blocked · 1 timeout
    Truly, a monument to neglect. We're so sorry.
```

---
## 📜 Changelog — XRAWLER Through the Ages
 
```
v1.0.0  —  shipped. godspeed. 🚀
v0.8.2  —  "production ready" (it was not)
v0.8.0  —  removed error handling (it was getting in the way)
v0.6.0  —  crawler now checks 150 links instead of all of them.
            we saw what "all of them" looked like. we made a choice.
v0.4.1  —  timeouts now actually timeout. previously they just waited. forever.
v0.3.0  —  added categories: Dead, Blocked, Unknown.
            previously everything was just "bad".
v0.2.0  —  it works on more than one website now
v0.1.0  —  it worked on my machine
v0.0.1  —  what if we just fetched a url (we did)
```
 
---
 
## ⭐ Testimonials
 
*Real reviews from real developers. Definitely.*
 
> *"Found 94 dead links on a site I built for my own portfolio. I need a moment."*
> — **@jakedev**, definitely a real person
 
> *"Ran it on a client's site before a meeting. Had to cancel the meeting."*
> — **Sarah T.**, frontend dev & professional apologiser
 
> *"I thought our docs were fine. XRAWLER thought differently. XRAWLER was right."*
> — **anonymous**, now employed elsewhere
 
> *"5 stars. Ruined my afternoon. Would use again."*
> — **Marcus L.**, senior engineer, currently on leave
 
---
 
## 📞 Support
 
Found a bug? [Open an issue.](../../issues) We'll read it. We make no promises beyond that.
 
Need urgent help? Call our 24/7 support hotline:
 
> `https://xrawler-support.io/help` — **404**
 
We're working on it.
 
For everything else: you're a developer. You'll figure it out. 🕷️
*May your status codes be 200 in the next life.* 🌹

---

## ❓ FAQ

**Q: Why are so many of my links dead?**
A: Time. Entropy. Poor maintenance. The usual suspects. 🕰️

**Q: Can XRAWLER fix the dead links?**
A: XRAWLER finds the bodies. It doesn't attend the funerals. 🪦

**Q: It says my whole site has no links. Is that right?**
A: Probably a SPA. Your links are rendered by JavaScript and XRAWLER only sees the raw HTML. So yes — from where XRAWLER stands, your site is an empty room. 🚪

**Q: It's been 30 seconds and nothing happened.**
A: That's Render's free tier waking up. Its asking money which I won't give unless u do. It's fine now. Probably. ☕

**Q: A site I know is up shows as "Dead". Why?**
A: Some servers block `HEAD` requests on principle. It's not personal. Actually, it might be personal. 🛡️

**Q: Can I crawl someone else's website?**
A: Technically yes. Ethically, use your judgment. Legally, not our problem. ⚖️

**Q: I found a bug.**
A: Congratulations. So did the spider. 🕷️

---

*Built with 🕷️ and an unhealthy obsession with things that don't exist anymore.*
