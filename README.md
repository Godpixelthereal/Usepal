# PAL — Your AI Business Partner

PAL is not just another business app. It is your AI Co‑Founder — a partner that learns your business, understands your goals, and helps you handle the day‑to‑day execution that keeps your company moving.

PAL works with you to:
- Plan projects
- Assign tasks to your team
- Track progress and deadlines
- Manage finances and decisions
- Guide business strategy through conversation

Think of it as having a COO that never sleeps.

---

## Core Features

### 1) Business Setup & Onboarding
PAL learns your business model, operations, products, and structure — adapting responses and decisions to your context.

### 2) Project & Team Coordination (Project Manager)
Create projects, define goals, assign roles, and let PAL:
- Break down tasks
- Delegate to the right team member
- Monitor progress and deadlines
- Keep everyone aligned

Role‑aware communication:
- Designers receive design‑ready briefs
- Developers get structured technical task statements
- Managers receive clear oversight summaries

### 3) Conversational AI Workspace
Talk to PAL like you talk to a co‑founder:
- Brainstorm plans
- Solve business challenges
- Validate decisions
- Request reports and insights

### 4) Wallet & Web3 (Planned)
Integrates with Base ecosystem to:
- Enable seamless payments
- Interact with decentralized business tools
- Support on‑chain business identity

---

## Tech Stack

- Frontend: Next.js (React)
- Styling: TailwindCSS
- Charts: Chart.js via react‑chartjs‑2
- Backend: Next.js API routes (extensible)
- Optional Local API: Flask microservice (`server/chat_api.py`) serving `http://localhost:8012`
- Data: Local persistence and mock JSON (`data/`), prepared for future DB

---

## Getting Started (Local Development)

```bash
# Clone the repository
git clone <your-repo-url>
cd pal-ai-business-partner

# Install dependencies
npm install

# Start Next.js dev server
npm run dev
```

Visit: `http://localhost:3000`

Optional: start the local Flask API used by some public pages (e.g., `public/pal.html`):
```bash
pip3 install flask flask-cors
python3 server/chat_api.py  # serves http://localhost:8012
```

---

## Project Structure

```
components/      UI elements & layout
pages/           Next.js routes & views
ai/              PAL logic helpers
data/            Mock data
public/          Static assets and HTML previews
server/          Optional Flask API for chat
styles/          Global styles (Tailwind)
next.config.js   Next.js configuration
tailwind.config.js Tailwind configuration
```

---

## Roadmap (High‑Level)

- Multi‑user team collaboration
- Autonomous task follow‑up & performance reports
- Full Web3 business identity wallet
- AI business pulse dashboards
- On‑chain business credit scoring

---

## License

Proprietary. All rights reserved.