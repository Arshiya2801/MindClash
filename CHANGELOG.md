# MindClash Changelog & Improvements

This document summarizes the major architectural improvements, bug fixes, and new features implemented to transition the platform from its initial prototype state to a robust, production-ready application.

## 🚀 1. Major Architectural Upgrades

### AI Migration (Gemini to OpenAI)
- **Swapped AI Providers:** Migrated the entire backend from `@google/genai` to the official `openai` SDK, utilizing `gpt-4o-mini` for faster, smarter, and more reliable responses.
- **Batched Debate Evaluation:** Previously, the AI evaluated every single message sent during a debate. This was heavily token-intensive. We replaced this with a **batched analysis**, where the entire transcript is sent to the AI once at the end. 
- **Smart Fallbacks:** Implemented a non-AI heuristic scoring system (`smartFallbackScore`) that calculates a winner based on vocabulary diversity and argument length in case the OpenAI API goes down or rate-limits.

### Core Debate Mechanics & Multiplayer Engine
- **Anonymous Aliases:** Replaced generic random strings with a smart local alias generator (e.g., `ShadowNinja_422`) to provide a better user experience without wasting AI tokens.
- **Dynamic Round System:** The debate engine now dynamically generates the correct number of rounds based on game mode. 
  - **1v1:** Exactly 5 alternating turns (Opening -> Rebuttal -> Counter -> Rebuttal -> Closing).
  - **2v2 / 3v3:** Team matches feature exactly 6 turns per side (3 rounds where each team member goes).
- **Strict Team Baton-Passing:** Fixed the chaotic team logic. The backend now strictly enforces individual player rotation in 2v2s (e.g., `PRO 1 -> CON 1 -> PRO 2 -> CON 2`). The "Your Turn!" UI is exclusively shown to the exact player whose turn it is.
- **Equal Team XP Payouts:** Rewrote `distributeXP` so that if a team wins a 2v2, the AI's total score is split, and all teammates receive the exact same XP reward.

## 🎨 2. UI / Frontend Enhancements

### Stability & UX Fixes
- **Modal Flickering Fixed:** Resolved a critical React infinite render loop where the 60-second `exitCountdown` state updates were causing the `ResultsModal` to flash aggressively upon match completion.
- **Graceful Reconnects:** Removed the aggressive 60-second auto-draw logic that ruined matches if a single player hit "Refresh" or dropped connection for a moment. Players can now safely reconnect mid-match.
- **Spectator UI Separation:** Spectators have their own dedicated UI (Live Chat, Emojis, Betting Pool) and are fully restricted from seeing or interacting with the Player Argument controls.
- **Dynamic Round Names:** Removed hardcoded round arrays on the frontend. The UI now dynamically extracts and capitalizes the round type (`debate.rounds[currentRound].type`) directly from the backend socket payload.

### Rich AI Scorecard (ResultsModal)
- **AI Judge's Verdict:** A clear, concise explanation of *why* the winning team won.
- **Fact Checks:** A dedicated section that verifies factual claims made during the debate, tagging them as *True*, *Mostly True*, *False*, etc.
- **PRO vs CON Feedback:** Side-by-side (Green/Red) UI cards detailing the specific **strengths** and **weaknesses** of the arguments presented by both sides.
- **Debate Highlights:** Pulls out the 1-2 standout moments from the debate for users to reflect on.

## 🛠️ 3. Backend & Database Changes

### Mongoose Schema Updates
- **Debate Model:** Updated `server/models/Debate.js` to securely persist the new `aiSummary` object (containing `factChecks`, `moderationFlags`, `feedback`, and `highlights`). This ensures historical debates load perfectly for users viewing past replays.

### Missing APIs Added
- **Reporting System:** Wired up and implemented `server/routes/reportRoutes.js` to allow users to report toxic behavior or broken debates.

## 🌍 4. Production Readiness (Vercel & Render)

### Deployment Configurations
- **Render Backend:** Created a `render.yaml` Blueprint file in the `server/` directory. This allows for an instant 1-click infrastructure deployment on Render with all necessary Node environments and start commands pre-configured.
- **Node Engine Strictness:** Added `"engines": { "node": ">=18.0.0" }` to both `client/package.json` and `server/package.json` to prevent hosts from running outdated, incompatible Node versions.
- **Vercel Frontend:** Verified that `client/vercel.json` correctly implements SPA rewrite rules (`/(.*) -> /index.html`) so React Router does not throw 404 errors on page refreshes.
- **Socket & CORS:** Ensured `server/index.js` securely handles cross-origin requests using `CLIENT_URL` and that Socket.io is configured to allow `polling` transport first, bypassing Render's WebSocket load-balancer limitations.
