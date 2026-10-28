# NBFC General Demo

A loan-journey demo for any NBFC, built on the e-Sahamati consent platform. It is the
QuickLend demo (`apps/demo-lender` in the e-sahamati repo) made configurable: same
pages, same consent flows, same e-Sahamati APIs, but the lender's name, logo,
colours and loan product come from configuration and from the organisation in
e-Sahamati.

It is static HTML and JavaScript. There is no build step and no backend of its own;
every consent, OTP and data-rights call goes to e-Sahamati.

| Page | What it shows |
|---|---|
| `index.html` | The main demo: a phone-style loan journey (age check, privacy notice, sign-up, OTP, KYC, credit bureau, account aggregator, loan, insurance, approval, data rights, marketing, consent certificates) |
| `dpo.html` | The same journey on the left with a live DPO compliance monitor on the right (consent ledger, data-rights shortcuts, S.6 checklist) |
| `cookie-banner-demo.html` | The cookie banner on its own, with tag gating and an event log |

## Run it

The committed `config/env.js` points at production e-Sahamati
(`api.e-sahamati.com` / `consent.e-sahamati.com`, org `org-quicklend-001`, the same
values as the live QuickLend demo at demo.e-sahamati.com). So the demo works with
nothing running locally:

```bash
npm start      # serves on http://localhost:8000 and opens index.html
```

`npm run start:dpo` opens `dpo.html`. Use port 8000: e-Sahamati's CORS allow-list
includes `http://localhost:8000`.

To run against a local e-Sahamati instead (`npm run dev` in the e-sahamati repo: API on
`localhost:4000`, consent UI on `localhost:3000`), copy `config/env.example.js` over
`config/env.js` and do not commit that change.

Demo sign-in: pick a demo account on the sign-up screen, OTP `123456`.

## Before each demo

The consent pop-up, the privacy notice, the cookie banner, the consent certificates and
the consent-ui pages (data access, grievance, nominee, ...) are rendered by e-Sahamati
from the **organisation**, not by this repo. To rebrand everything at once, change the
organisation in the e-Sahamati admin console (signed in as an owner or admin of that
org). The demo pages read the same values at load time.

| What | Where in the admin console | Reaches |
|---|---|---|
| Organisation name | Settings → General → Organization Name | Demo pages, consent pop-up, receipts |
| Logo, primary and secondary colour | Settings → Branding | Demo pages, consent pop-up, cookie banner (primary colour) |
| Grievance Officer and DPO contacts | Employees → Officers | Consent pop-up, notice, grievance page |
| Privacy notice text | Notices: edit, then publish a new version | Consent pop-up, data-access page. The seeded QuickLend notice names "QuickLend Finance Ltd." and its grievance officer in the text itself |
| Allowed origins (hosted demo only) | Settings → Integration → Allowed Origins | Lets a browser on the demo's domain call the API |

Then reload the demo. The logo must be a public `https://` URL, because it is served to
every visitor.

## Configuration

Two files, both plain JavaScript loaded before the page scripts.

### `config/env.js`: which deployment and organisation

Committed with the production values. `config/env.example.js` lists every key with the
local-dev values; the pages fall back to those if `config/env.js` is missing.

| Key | Default | Purpose |
|---|---|---|
| `ORG_ID` | `org-quicklend-001` | The organisation every call is made against |
| `API_BASE` | `http://localhost:4000/api/v1` | e-Sahamati API, including `/api/v1` |
| `CONSENT_UI` | `http://localhost:3000` | Consent UI origin, no trailing slash |
| `SDK_URL` | `{CONSENT_UI}/sdk/esahamati.0.4.1.min.js` | Consent SDK bundle |
| `COOKIE_BANNER_URL` | `{CONSENT_UI}/sdk/cookie-banner.0.2.8.min.js` | Cookie banner bundle |
| `PROFILE_CODES` | QuickLend's profiles | Consent profile per step (`registration`, `kyc`, `bureau`, `aa`, `loan`, `insurance`, `marketing`, and `credit` on `dpo.html`). Set only the ones that differ |
| `DEMO_ACCOUNTS` | QuickLend's seeded principals | `[{ name, phone, dob }]` shown on the sign-up screen. They must exist in `ORG_ID` |

To point the demo at a different organisation, change `ORG_ID`. If that org's consent
profiles have other codes, or its demo principals differ, set `PROFILE_CODES` and
`DEMO_ACCOUNTS` too.

### `config/brand.js`: how the demo looks

Committed, one brand per deployment. **Every field is optional**, and each one resolves
in this order:

1. the value in `config/brand.js`,
2. the organisation's branding from `GET {API_BASE}/org/{ORG_ID}/config` (name, logo,
   primary and secondary colour), when `useOrgBranding` is `true`,
3. the QuickLend default.

Leave a field empty to follow the organisation. Set it only when the demo pages
should differ from what e-Sahamati shows.

| Field | Default | Used for |
|---|---|---|
| `useOrgBranding` | `true` | Read the org's branding at load. `false` uses only this file and the defaults |
| `shortName` | Org name without "Ltd." / "Limited" / "Pvt. Ltd.", else `QuickLend` | App bar, welcome heading, tab title |
| `fullName` | Org name, else `QuickLend Finance` | `dpo.html` header and tab title |
| `tagline` | `Your Personal Loan, Simplified` | Welcome screen |
| `pageTitle` | `{shortName} — Privacy-First {productName}` | `index.html` tab title |
| `logoUrl` | Org logo, else a letter tile | Welcome screen, `dpo.html` header. `https://` or a path in this repo |
| `logoMonogram` | First letter of `shortName` | Letter tile when there is no logo |
| `faviconUrl` | `logoUrl`, else a letter tile | Browser tab icon |
| `primaryColor` | Org primary, else `#2563EB` | Buttons, logo tile, active step, slider |
| `secondaryColor` | Org secondary, else `#1A2B5F` | Headings, amounts, background gradient, phone frame |
| `accentColor` | Primary (QuickLend: `#0EA5E9`) | Focus rings, step glow, scrollbar |
| `product.name` | `Personal Loan` | Tab title, `dpo.html` |
| `product.amount`, `minAmount`, `maxAmount`, `amountStep` | 2,50,000 / 50,000 / 10,00,000 / 10,000 | Welcome slider; the chosen amount carries through the journey |
| `product.tenureMonths`, `interestRate` | 24 / 11.5 | Loan details screen |
| `product.emi` | Calculated | Fix the EMI shown for the starting amount |
| `product.payoutTime` | `2 hours` | Approval screen |
| `product.insurancePlans` | Basic Protection (₹99), Comprehensive (₹199) | Insurance screen: `[{ name, monthlyPrice, features: [] }]` |

Colours are `#RRGGBB`. Hover, tint, glow and gradient shades are derived from them.
Org values are escaped before display, and only relative or `http(s)` logo URLs are
used.

## Deploying

Any static host works (nginx, S3 with CloudFront, Netlify, ...):

1. Upload the repo contents (`config/env.example.js` is not needed).
2. `config/env.js` already targets production e-Sahamati; edit it only for another
   environment.
3. Add the demo's origin (e.g. `https://nbfc-demo.example.com`) to the organisation's
   allowed origins (Settings → Integration), or to `ALLOWED_ORIGINS` on the e-Sahamati
   API. Without it, the browser blocks every API call.

`robots.txt` and the pages' `noindex` meta keep the demo out of search engines.

## How it is put together

| File | Role |
|---|---|
| `config/env.js` | Deployment and org (see above) |
| `config/brand.js` | Brand and loan product (see above) |
| `js/brand.js` | Resolves the brand, sets `--brand-*` CSS variables, fills `data-brand-*` elements, exposes `window.NbfcBrand` |
| `js/sdk-loader.js` | Loads the consent SDK and cookie banner bundles from the consent UI |

The page scripts are the QuickLend demo's, changed only where they showed brand
text, colours or loan figures. The first commit in this repo is the untouched
QuickLend copy, so `git diff 6d76225 -- index.html` shows exactly what changed
(`index.html` was `user.html` there; `dpo.html` was `index.html`).

### Taking later changes from the QuickLend demo

When `apps/demo-lender/user.html` or `index.html` changes in e-sahamati:

```bash
cd ../e-sahamati
git log --oneline -- apps/demo-lender/
git diff <last-synced-commit> HEAD -- apps/demo-lender/user.html   # apply to index.html here
git diff <last-synced-commit> HEAD -- apps/demo-lender/index.html  # apply to dpo.html here
```

Apply the logic changes by hand and keep the brand hooks (`NbfcBrand.*`,
`data-brand-*`, `var(--brand-*)`). If e-sahamati bumps the SDK version, update the
two file names at the top of `js/sdk-loader.js`.

## Not configurable here

- The journey's steps and wording, apart from the fields above.
- What the consent pop-up, notice and consent-ui pages say. They come from the
  organisation's purposes, notices and consent profiles in e-Sahamati.
- OTP `123456`. It works only where e-Sahamati runs in demo OTP mode for that org.
