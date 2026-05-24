# Neşve Elazığ

Gamified cafe loyalty app — rewards, games, tickets, and member dashboard.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and adjust variables as needed.

## Build

```bash
npm run build
npm run preview
```

## Deploy on Netlify

1. Push this repo to GitHub.
2. In [Netlify](https://app.netlify.com), **Add new site** → **Import from Git** → select this repository.
3. Build settings are read from `netlify.toml` automatically:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy.

### Environment variables (Netlify → Site settings → Environment variables)

| Variable | Demo (default) | Production |
|----------|----------------|------------|
| `VITE_LOCAL_MODE` | `true` | `false` |
| `VITE_FIREBASE_*` | not needed | your Firebase config |

Demo mode works without Firebase (local storage demo data). For production, set `VITE_LOCAL_MODE=false` and add all `VITE_FIREBASE_*` keys from `.env.example`.

## Demo login

- Use **Demo Admin** on the login page for the admin panel, or register a normal account in local mode.

## Repository

https://github.com/a3masri/nesveelazig
