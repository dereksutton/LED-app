# LED Custom Painting & More website

Marketing site and quote-request API for [ledcustompainting.com](https://ledcustompainting.com).

## What's here

| Path | What it is |
| --- | --- |
| `app/`, `src/` | Next.js 16 site, exported as static HTML (`out/`) |
| `src/data/site.js` | Business details and trust claims (years, reviews, warranty). Change them here, not on individual pages |
| `src/data/services.js` | Service pages content |
| `server/` | Express API that receives quote requests, emails the owner through Resend and saves to MongoDB |
| `server/admin/` | API behind the `/admin` business dashboard and the customer document pages |
| `app/admin/`, `src/admin/` | The `/admin` dashboard: leads, customers, quotes, invoices, contracts, settings |
| `app/d/` | The page customers open from an emailed link to accept an estimate, sign a contract or pay an invoice |
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

## Business dashboard (`/admin`)

The owner signs in at `/admin` with email, password and a 6-digit code from an authenticator app. It needs `MONGO_URI` on the API.

Create a login (on Render: the led-app-api Shell tab; locally: in `server/`):

```
npm run create-admin -- --email owner@example.com --name "Efrain"
```

It asks for a password (12+ characters). At the first sign-in the dashboard shows a QR code to scan with Google Authenticator, Microsoft Authenticator or 1Password. To reset a forgotten password or a lost phone, run the same command with `--reset`.

What's in it:
- Leads from the website form (and ones added by hand), with statuses and notes
- Customers, each with their quotes, invoices and contracts
- Quotes with line items, tax, discount and deposit. Emailed with a link and PDF; the customer accepts online
- Invoices from a quote (deposit, final) or from scratch, with payments recorded by hand
- Contracts filled from a template in Settings and signed online (typed name, drawn signature, time, IP and a SHA-256 fingerprint of the text)
- Email to the owner when a customer accepts, signs or pays

Card payments are off until `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are set. The webhook goes to `https://led-app-api.onrender.com/api/stripe/webhook` and listens for `checkout.session.completed`.

The contract template is a starting point, not legal advice.

To run the dashboard locally, start a MongoDB (for example `docker run -p 27017:27017 mongo:7`), set `MONGO_URI=mongodb://127.0.0.1:27017/led` and `SITE_URL=http://localhost:3000` in `server/.env`, and use `NEXT_PUBLIC_API_URL=http://localhost:3001` as above.

## Checks

```
npm run lint
npm run build
cd server && npm test
```

The dashboard tests need a MongoDB at `TEST_MONGO_URI` (default `mongodb://127.0.0.1:27017`) and are skipped without one. GitHub Actions runs all three on every push and pull request, with a MongoDB for the API tests.

## Deploying

Both Render services have auto-deploy off. After merging into `master`, open each service in Render and choose Manual Deploy: `led-app-api` first when the API changed, then `led-app-frontend`.

## Settings

Site build settings are in `.env.example` (Google Ads and Meta Pixel IDs, all optional). API settings are in `server/.env.example`. Leads go to `LEAD_NOTIFY_EMAIL`.
