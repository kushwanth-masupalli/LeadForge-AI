# LeadForge AI — Build Plan

## What We're Building

An open-source AI-powered lead generation and digital presence analyzer. You search for a business niche + city, it finds real businesses via OpenStreetMap/Overpass API, analyzes each one's website (SEO, HTTPS, mobile-friendliness, social links, performance), scores their digital presence, and uses an AI model (Gemini or OpenRouter) to generate personalized cold outreach.

---

## Tech Stack (Final Decisions)

### Frontend
| Tool | Why |
|---|---|
| React 18 + Vite | Fast dev experience, great ecosystem |
| Tailwind CSS v3 | Utility-first, dark theme friendly |
| Shadcn/UI | Pre-built accessible components |
| Framer Motion | Animations and page transitions |
| Recharts | Charts for analytics dashboard |
| React Router v6 | Client-side routing |
| Axios | HTTP client for API calls |
| React Query (TanStack) | Server state, caching, loading states |

### Backend
| Tool | Why |
|---|---|
| Python 3.11+ | Core language |
| FastAPI | Async, fast, auto-docs (Swagger) |
| MongoDB Atlas | Cloud-hosted MongoDB — free 512MB tier, no file-system dependency, deploy-ready |
| Motor | Official async MongoDB driver for Python — pairs perfectly with FastAPI async |
| Beanie | ODM on top of Motor — Pydantic-native MongoDB models, replaces SQLAlchemy entirely |
| Playwright | Headless browser for deep site analysis |
| BeautifulSoup4 | HTML parsing for SEO tag extraction |
| httpx | Async HTTP requests |
| Lighthouse CLI | SEO/performance scoring (via subprocess) |
| python-dotenv | Env var management |
| Pydantic v2 | Data validation and schemas |

### AI (Dual Provider Support)
| Provider | How |
|---|---|
| Gemini (Google) | `google-generativeai` Python SDK — free tier is generous |
| OpenRouter | Single API key, routes to Llama3, Mistral, Gemma, etc. — free models available |

The user picks which provider in `.env` — both use the same internal interface so swapping is seamless.

### Business Data
| Tool | Why |
|---|---|
| Overpass API (OpenStreetMap) | 100% free, no key needed, returns real businesses with names, addresses, websites, phones |

---

## Project Structure

```
leadforge-ai/
│
├── frontend/                        # React app
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                  # Shadcn base components
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Topbar.jsx
│   │   │   │   └── PageWrapper.jsx
│   │   │   ├── leads/
│   │   │   │   ├── LeadTable.jsx
│   │   │   │   ├── LeadCard.jsx
│   │   │   │   └── LeadDrawer.jsx   # Side panel with full details
│   │   │   ├── search/
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── charts/
│   │   │   │   ├── ScoreChart.jsx
│   │   │   │   └── ActivityChart.jsx
│   │   │   └── outreach/
│   │   │       └── OutreachCard.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Public landing page
│   │   │   ├── Dashboard.jsx        # Main overview
│   │   │   ├── Search.jsx           # Search + results
│   │   │   ├── SavedLeads.jsx       # Bookmarked leads
│   │   │   ├── Analytics.jsx        # Charts and history
│   │   │   └── Settings.jsx         # API keys config
│   │   ├── services/
│   │   │   └── api.js               # All axios calls to backend
│   │   ├── hooks/
│   │   │   ├── useLeads.js
│   │   │   └── useSearch.js
│   │   ├── store/
│   │   │   └── appStore.js          # Zustand global state
│   │   ├── utils/
│   │   │   └── scoreColor.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                         # Python FastAPI app
│   ├── main.py                      # FastAPI app entry point
│   ├── config.py                    # Settings from .env
│   ├── database.py                  # Motor client + Beanie init
│   ├── models/
│   │   ├── lead.py                  # Beanie Document model (Lead)
│   │   └── search_history.py        # Beanie Document model (SearchHistory)
│   ├── schemas/
│   │   ├── lead.py                  # Pydantic schemas
│   │   └── search.py
│   ├── api/
│   │   ├── routes/
│   │   │   ├── search.py            # POST /search
│   │   │   ├── leads.py             # GET/POST/DELETE /leads
│   │   │   ├── analyze.py           # POST /analyze
│   │   │   ├── outreach.py          # POST /outreach
│   │   │   └── export.py            # GET /export/csv
│   │   └── __init__.py
│   ├── services/
│   │   ├── overpass.py              # Fetch businesses from OSM
│   │   ├── analyzer.py              # Website analysis engine
│   │   ├── scorer.py                # Digital score calculator
│   │   ├── lighthouse.py            # Lighthouse CLI wrapper
│   │   ├── outreach.py              # AI outreach generator
│   │   └── ai/
│   │       ├── base.py              # Abstract AI provider interface
│   │       ├── gemini.py            # Gemini implementation
│   │       └── openrouter.py        # OpenRouter implementation
│   ├── utils/
│   │   └── export.py                # CSV generation
│   └── requirements.txt
│
├── .env.example                     # Template for API keys
├── .gitignore
└── README.md
```

---

## Database — MongoDB Atlas

### Why Atlas over SQLite
| SQLite | MongoDB Atlas |
|---|---|
| File on disk — breaks in serverless/cloud deploys | Cloud-hosted — works everywhere |
| JSON stored as serialized strings | Native arrays and objects — no serialization |
| Migrations needed for schema changes | Schemaless — add fields freely |
| Single writer at a time | Scales horizontally |
| Free tier: local only | Free tier: 512MB, always available |

### ODM: Beanie
Beanie is a Pydantic-native ODM (Object Document Mapper) built on Motor. Models are defined as Python classes that extend `Document` — no separate schema + model files needed.

### `leads` collection — Document shape

```json
{
  "_id": "ObjectId (auto)",
  "company_name": "Cafe XYZ",
  "website": "https://cafexyz.in",
  "email": "contact@cafexyz.in",
  "phone": "+91-9876543210",
  "address": "Banjara Hills, Hyderabad",
  "city": "Hyderabad",
  "niche": "restaurant",
  "score": 74,
  "https": true,
  "mobile_friendly": false,
  "has_seo_tags": true,
  "social_links": ["https://instagram.com/cafexyz", "https://facebook.com/cafexyz"],
  "weaknesses": ["No mobile viewport meta", "Missing meta description", "No sitemap"],
  "outreach_email": "Hi, I noticed your site doesn't load well on mobile...",
  "outreach_dm": "Hey! Loved your cafe — noticed a quick fix that could double your Google traffic...",
  "is_saved": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### `search_history` collection — Document shape

```json
{
  "_id": "ObjectId (auto)",
  "query": "restaurants in Hyderabad",
  "city": "Hyderabad",
  "niche": "restaurant",
  "total_results": 42,
  "created_at": "2024-01-15T10:28:00Z"
}
```

### Beanie model example (Python)

```python
from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Optional

class Lead(Document):
    company_name: str
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: str
    niche: str
    score: int = 0
    https: bool = False
    mobile_friendly: bool = False
    has_seo_tags: bool = False
    social_links: list[str] = []
    weaknesses: list[str] = []
    outreach_email: Optional[str] = None
    outreach_dm: Optional[str] = None
    is_saved: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "leads"  # MongoDB collection name
```

---

## API Endpoints

| Method | Path | What it does |
|---|---|---|
| POST | `/api/search` | Search OSM for businesses by niche + city |
| POST | `/api/analyze/{lead_id}` | Run full website analysis on a lead |
| POST | `/api/analyze/bulk` | Analyze all leads from a search |
| POST | `/api/outreach/{lead_id}` | Generate AI outreach for a lead |
| GET | `/api/leads` | Get all leads (with filters) |
| GET | `/api/leads/{id}` | Get single lead |
| PATCH | `/api/leads/{id}/save` | Toggle saved status |
| DELETE | `/api/leads/{id}` | Delete lead |
| GET | `/api/export/csv` | Export leads as CSV |
| GET | `/api/history` | Get search history |
| GET | `/api/analytics` | Dashboard stats |
| GET | `/api/health` | Health check |

---

## How the Core Flow Works

```
User types: "restaurants in Hyderabad"
        ↓
1. SEARCH — Overpass API query
   → Returns: name, lat/lng, phone, website, address
        ↓
2. ANALYZER — For each business with a website:
   a. httpx: check if site loads, HTTPS, response time
   b. BeautifulSoup: extract title, meta description, h1, og tags, social links
   c. Playwright (optional deep scan): check viewport meta (mobile), render time
   d. Lighthouse CLI: SEO score, accessibility, performance (runs in subprocess)
        ↓
3. SCORER — Weighted formula:
   - HTTPS: 20pts
   - Has website: 15pts
   - Mobile responsive: 15pts
   - SEO tags present: 20pts
   - Lighthouse SEO score: 20pts
   - Social links present: 10pts
   Final: 0–100 "Digital Score"
        ↓
4. OUTREACH — Send business data to AI:
   - Gemini 1.5 Flash (free tier) OR
   - OpenRouter free model (Llama3, Mistral)
   - Generates: cold email, LinkedIn DM, website pitch
        ↓
5. RESULTS — Saved to MongoDB Atlas, shown in dashboard
   - Filter by score
   - Sort by weakness
   - Export to CSV
```

---

## AI Provider Setup

### Gemini
- Free tier: 15 requests/min, 1M tokens/day
- Model: `gemini-1.5-flash`
- Key: Get from [aistudio.google.com](https://aistudio.google.com) — free, no card

### OpenRouter
- Free models available: `meta-llama/llama-3-8b-instruct:free`, `mistralai/mistral-7b-instruct:free`
- Key: Get from [openrouter.ai](https://openrouter.ai) — free tier available
- Same REST API format as OpenAI

Both providers share the same internal `generate_outreach(business_data)` interface. User sets `AI_PROVIDER=gemini` or `AI_PROVIDER=openrouter` in `.env`.

---

## Development Roadmap

### Week 1 — Foundation
- [ ] Init repo, folder structure
- [ ] FastAPI skeleton + CORS + health check
- [ ] MongoDB Atlas cluster setup + Motor/Beanie connection
- [ ] Beanie document models (Lead, SearchHistory)
- [ ] Overpass API integration (search endpoint)
- [ ] React + Vite + Tailwind + Shadcn setup
- [ ] Landing page (dark theme, hero, CTA)
- [ ] Dashboard layout (sidebar, topbar, routing)

### Week 2 — Core Engine
- [ ] Website analyzer service (httpx + BeautifulSoup)
- [ ] Playwright deep scan (mobile check, render)
- [ ] Lighthouse CLI integration
- [ ] Scorer service (weighted formula)
- [ ] Search page UI + results table
- [ ] Lead detail drawer/panel

### Week 3 — AI + Data
- [ ] Gemini provider implementation
- [ ] OpenRouter provider implementation
- [ ] Outreach generation endpoint + UI
- [ ] Saved leads (toggle + page)
- [ ] CSV export (backend + frontend download)

### Week 4 — Polish + Shipping
- [ ] Analytics dashboard (charts, history)
- [ ] Settings page (API key config UI)
- [ ] Error handling, loading states, toasts
- [ ] README + setup guide
- [ ] Docker Compose (optional but nice)

---

## What We Build First (Session 1)

1. Full folder structure scaffolded
2. FastAPI backend running with `/health` and `/api/search` using Overpass
3. React frontend with routing, sidebar layout, and the Search page working end-to-end
4. Real business data from OpenStreetMap showing in a table

This gives us a working vertical slice immediately — real data, real UI, real API.

---

## Known Limitations & Decisions

| Topic | Decision |
|---|---|
| Lighthouse | Requires Node.js installed locally. We'll make it optional — scorer works without it, adds bonus points if available |
| Playwright | Heavy dependency. Used only for deep scan mode — basic analysis works with just httpx + BS4 |
| Email extraction | We scrape the business website's contact page — no guaranteed results, always best-effort |
| Rate limits | Overpass API has fair-use limits. We add 1s delay between bulk requests |
| CORS | Frontend runs on `:5173`, backend on `:8000` — configured in FastAPI |
| MongoDB Atlas free tier | 512MB storage, 100 max connections — plenty for leads data. Connection string goes in `.env`, never committed to git |
| Auth | No auth for now — this is a local/self-hosted tool |

---

## Environment Variables (`.env`)

```env
# AI Provider: "gemini" or "openrouter"
AI_PROVIDER=gemini

# Gemini
GEMINI_API_KEY=your_key_here

# OpenRouter
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=meta-llama/llama-3-8b-instruct:free

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/leadforge?retryWrites=true&w=majority
MONGODB_DB_NAME=leadforge

# App
BACKEND_PORT=8000
```
