# H+ Human Potential Studio — Website v5

Bilingual Persian/English static website for H+ with the Creative Compass, idea frontier, Opportunity Architect form, books/publications placeholder and SilvaGlow commerce section.

## v5 changes
- Adds an optional assets/access field to the Opportunity Architect brief.
- Adds a live AI execution panel that remains disabled until a secure backend URL is configured.
- Adds `agent-config.js`; only the public API endpoint URL belongs here. Never place an API key or private access code in browser JavaScript.
- Preserves the local prompt-copy/download mode as a fallback.

## Static GitHub Pages
Upload these seven files to the repository root:
`index.html`, `styles.css`, `script.js`, `agent-config.js`, `favicon.svg`, `robots.txt`, `README.md`.

## Live AI mode
The separate `HPLUS_live_agent_starter` package contains a Vercel serverless endpoint. Deploy it first, configure server-side environment variables, then set `agentApiUrl` in `agent-config.js` to the deployed endpoint. Until this is done, the live mode stays disabled and the prompt builder continues to work locally.

The OpenAI API is billed separately from a ChatGPT subscription. Use a private beta first. The included shared beta code and in-memory rate limit are preliminary safeguards, not production-grade authentication or rate limiting.
