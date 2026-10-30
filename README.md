# LED Custom Painting & More website

Marketing site and quote-request API for [ledcustompainting.com](https://ledcustompainting.com).

## What's here

| Path | What it is |
| --- | --- |
| `app/`, `src/` | Next.js 16 site, exported as static HTML (`out/`) |
| `src/data/site.js` | Business details and trust claims (years, reviews, warranty). Change them here, not on individual pages |
| `src/data/services.js` | Service pages content |
| `server/` | Express API that receives quote requests, emails the owner through Resend and saves to MongoDB |
| `render.yaml` | Render Blueprint for both services |

## Run it locally

```
npm install
npm run dev            # site on http://localhost:3000
```

```
cd server
cp .env.example .env   # fill in MONGO_URI and RESEND_API_KEY
npm install
npm start              # API on http://localhost:3001
```

Set `NEXT_PUBLIC_API_URL=http://localhost:3001` in `.env.local` so the local site posts to the local API. In production it is left empty and Render rewrites `/send-quote` to the API.

## Checks

```
npm run lint
npm run build
cd server && npm test
```

GitHub Actions runs all three on every push and pull request.

## Deploying

Both Render services have auto-deploy off. After merging into `master`, open each service in Render and choose Manual Deploy: `led-app-api` first when the API changed, then `led-app-frontend`.

## Settings

Site build settings are in `.env.example` (Google Ads and Meta Pixel IDs, all optional). API settings are in `server/.env.example`. Leads go to `LEAD_NOTIFY_EMAIL`.
