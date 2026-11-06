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

The owner signs in at `/admin` with email and password, then a 6-digit code that's emailed (or texted, once Twilio is set up and they've added a cell in Settings). It needs `MONGO_URI` on the API, and `RESEND_API_KEY` to email the codes.

Create a login (on Render: the led-app-api Shell tab; locally: in `server/`):

```
npm run create-admin -- --email owner@example.com --name "Jane Smith" --phone "(904) 555-0123"
```

It asks for a password (12+ characters). `--phone` is optional. Codes last 10 minutes, five wrong codes throw one away, and five wrong tries lock the login for 15 minutes. To reset a forgotten password or unlock a login, run the same command with `--reset`.

Texting codes is off until `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` and `TWILIO_FROM_NUMBER` are set on the API. Running locally without `RESEND_API_KEY`, codes print in the API's terminal instead of being emailed.

What's in it:
- Leads from the website form (and ones added by hand), with statuses and notes. Leads can't be deleted; junk goes to a Spam folder and can be moved back. Form messages that read like sales pitches (SEO, web design, loans, several links) go there on their own, are still emailed with "Likely spam" in the subject, and get no text alert or auto-reply. Spam stays out of Home and the source numbers
- Home shows open quotes (sent, not answered), accepted quotes not yet invoiced, unpaid invoices and payments this month
- Where each lead heard about LED (required on the form), plus ad clicks and UTM tags the site picks up on its own, with leads and wins by source on Home
- Customers, each with their quotes, invoices and contracts
- Quotes with line items, tax, discount and deposit. Emailed with a link and PDF; the customer accepts online. The PDFs carry the logo (a dark-ink copy in `server/admin/assets/` so it prints on white)
- Invoices from a quote (deposit, final) or from scratch, with payments recorded by hand
- Contracts filled from a template in Settings and signed online (typed name, drawn signature, time, IP and a SHA-256 fingerprint of the text)
- Email to the owner when a customer accepts, signs or pays
- Built for phones too: a bottom menu (Home, Leads, Quotes, Invoices, More) and dropdown filters, so nothing scrolls sideways

### Lead tracking

Every lead is tagged with how it came in (form, call, text or added by hand) and whether it counts as organic Google: Google Search, the Google Business Profile, or neither. The tag comes from what the site saw (ad click IDs, UTM tags, the referring site) and, failing that, the visitor's "How did you hear" answer. Paid clicks never count as organic. The owner can override the tag on a lead, and every change to a lead's status, source, credit or job amount lands in its change history.

- **Text us and call taps:** the site's Text us link prefills a message with a short ref code, and taps on Call or Text are recorded (`POST /api/contact-intent`). When the owner adds a lead by hand from a call or text, the dashboard shows recent taps to match, so the lead keeps its Google credit.
- **Service area:** the owner decides. A lead can be marked out of the service area from its page in the dashboard; that only marks the lead and never sends the customer anything. The site's list of towns (for search engines and the service pages) is in `src/data/serviceArea.js`.
- **Mark won:** records the job amount and the date won. Accepting a quote online marks its lead won with the quote total. Every new quote is tied to a lead, or says why there isn't one (referral, repeat customer, walk-in, other).

### Monthly commission report

A read-only script builds the month's statement of jobs won from organic Google leads, a CSV of the same jobs and a draft invoice. It only reads the database, writes three files on the computer it runs on and sends nothing.

```
cd server
npm run commission-report -- --month 2026-11
```

Options: `--base job` (default, job amounts of jobs won that month) or `--base collected` (money received that month on credited jobs), `--rate 10`, `--window 365` (days from first lead to win that still count), `--out <folder>`, and `--from`, `--to`, `--number` for the invoice draft. With no `--month` it does last month. Files land in `commission-reports/<month>/`, which git ignores. Leads won before won dates were recorded are listed, not counted, until someone uses Mark won on them.

### Google Analytics and Business Profile

- Link the Google Business Profile website button to `https://ledcustompainting.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` so those visits are credited to the profile.
- In GA4, mark `generate_lead`, `click_to_call` and `click_to_text` as key events. Both forms land on `/thank-you/`, which search engines are told not to index.

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

Both Render services have auto-deploy off. After merging into `master`, open each service in Render and choose Manual Deploy: `led-app-frontend` first, then `led-app-api`. The new quote form still sends the one-line `address` the older API needs, but the newer API needs the split address and lead source that only the new form sends, so the site goes first.

The lead-tracking release is the other way round: deploy `led-app-api` first, since the site's call and text tap tracking calls a route only the new API has, and the quote form it accepts is unchanged. To send visitors the "we got your request" email, set `CUSTOMER_AUTOREPLY=true` on the API.

## Settings

Site build settings are in `.env.example` (Google Ads and Meta Pixel IDs, all optional). API settings are in `server/.env.example`. Leads go to `LEAD_NOTIFY_EMAIL`.
