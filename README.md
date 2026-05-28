# MindClash 

MindClash is a real-time, AI-powered debate platform where users can engage in intellectual battles, spectate matches, and earn XP. It features an integrated OpenAI moderator to evaluate arguments objectively and score debates live.

## 🚀 Features

### Real-Time Debate System
- Supports **1v1, 2v2, and 3v3** debate formats
- Turn-based debate flow with fixed team rotation
- Anonymous player aliases for unbiased discussions
- Live communication using Socket.io

### AI-Powered Debate Evaluation
- Integrated with **OpenAI GPT-4o-mini**
- AI-generated winner selection and verdict explanation
- Debate transcript analysis after all rounds complete
- Smart fallback heuristic scoring when AI is unavailable

### Rich AI Scorecard
- AI Judge verdict with reasoning
- Fact-checking of debate claims
- PRO vs CON strengths & weaknesses analysis
- Debate highlights and standout moments
- Moderation and toxicity flagging

### Reliability & Moderation
- Reporting system for toxic behavior or broken debates
- Smart fallback scoring system
- Secure CORS and Socket handling for production deployment

### Performance Optimizations
- Batched AI evaluation to reduce token usage
- Optimized deployment pipeline
- SPA routing support for React Router
- Production-ready Render & Vercel configurations

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Socket.io Client
- React Router

### Backend
- Node.js
- Express.js
- Socket.io
- OpenAI API

### Database
- MongoDB
- Mongoose

### Deployment
- Vercel (Frontend)
- Render (Backend)

