# ThibitiFare PWA

A real, installable app version of ThibitiFare — same two flows (request a
payment via STK Push, verify a fare code) as the Claude artifact, but as a
proper Progressive Web App you can install on a phone's home screen.

## 1. Install dependencies

```bash
npm install
```

## 2. Try it on your phone over Wi-Fi (fastest way to test)

```bash
npm run dev
```

This prints a "Network" URL like `http://192.168.x.x:5173`. Open that on your
**phone's browser**, as long as the phone is on the same Wi-Fi as your
computer. You can set the backend URL (your ngrok URL) right in the app's
"API" settings — no need to rebuild anything.

Note: the dev server itself isn't installable as an app — that only works
once it's built and served over HTTPS (step 3). Use this step just to check
everything looks right on a real phone screen first.

## 3. Build and deploy for real installability

Browsers only offer "Install app" / "Add to Home Screen" as a proper PWA
install (with offline support and an app icon) when the site is served over
**HTTPS from a real domain** — not a raw IP over plain HTTP.

Build it:

```bash
npm run build
```

This creates a `dist/` folder — that's your entire deployable app.

Easiest free deploy options (pick one):

- **Netlify Drop** — go to [app.netlify.com/drop](https://app.netlify.com/drop)
  and drag the `dist` folder in. You get an HTTPS URL in seconds, no account
  strictly required for a one-off drop (an account lets you update it later).
- **Vercel** — `npx vercel deploy dist` (needs a free account, one-time login).
- **GitHub Pages** — push this repo to GitHub, enable Pages, point it at the
  `dist` output (needs a small `vite.config.js` `base` tweak if not deploying
  to the repo root — ask if you want this set up).

## 4. Install it on your phone

1. Open the deployed HTTPS URL in your phone's browser (Chrome on Android,
   Safari on iOS).
2. Android/Chrome: tap the **⋮ menu → "Install app"** (or you'll see an
   automatic install banner).
   iPhone/Safari: tap the **Share icon → "Add to Home Screen"**.
3. ThibitiFare now has its own icon on your home screen and opens full-screen,
   like a native app.
4. First time you open it, tap **API** and paste in your backend URL (your
   ngrok URL for now, or a permanently deployed backend later).

## About the backend URL

This app is a frontend only — it still needs your FastAPI backend
(from the `fareguard-backend` project) running and reachable somewhere:

- **For a demo**: keep `uvicorn` + `ngrok` running on your laptop during
  judging, and paste that ngrok URL into the app's API settings. Simple, but
  the backend goes offline the moment your laptop does.
- **For something more permanent**: deploy `fareguard-backend` itself to a
  free host (Render, Railway, Fly.io all have free tiers for small FastAPI
  apps) and use that URL instead — then the phone app works independent of
  your laptop. Happy to help set this up if you want it before judging.

You can optionally pre-fill the backend URL at build time instead of typing
it in-app: copy `.env.example` to `.env`, set `VITE_API_BASE=`, and rebuild.
