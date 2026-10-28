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
| `index.html` | The main demo: a login-first loan application with **two consent screens**. Welcome → consent 1 (`account-registration`) → sign in (pick a demo customer, OTP `123456`) → consent 2 (`loan-application-consent`, covers everything after) → Step 1 of 3 "Tell us about yourself" → Step 2 eligibility checks and loan offer → Step 3 application submitted, with consent certificates and data-rights links |
| `classic.html` | The earlier QuickLend-style journey (age check, notice, sign-up, OTP, KYC, credit bureau, AA, loan, insurance, approval, rights, marketing). `JOURNEY: "combined"` opens two consent screens, `"full"` seven, as on demo.e-sahamati.com |
| `dpo.html` | The journey on the left with a live DPO compliance monitor on the right (consent ledger, data-rights shortcuts, S.6 checklist) |
| `cookie-banner-demo.html` | The cookie banner on its own, with tag gating and an event log |

## Run it

The committed `config/env.js` targets a deployed e-Sahamati, chosen by its `ENVIRONMENT`
setting (org `org-quicklend-001` in both):

| `ENVIRONMENT` | API / consent UI | Admin console | Accepts calls from |
|---|---|---|---|
| `"staging"` (default) | `api.staging.datarakshaq.com` / `consent.staging.datarakshaq.com` | https://admin.staging.datarakshaq.com | GitHub Pages and `localhost:8000` |
| `"production"` | `api.e-sahamati.com` / `consent.e-sahamati.com` | https://admin.e-sahamati.com | `localhost:8000` only |

The values are the ones each deployment's own QuickLend demo uses
(demo.staging.datarakshaq.com / demo.e-sahamati.com). So the demo works with nothing
running locally:

```bash
npm start      # serves on http://localhost:8000 and opens index.html
```

`npm run start:dpo` opens `dpo.html`. Use port 8000: e-Sahamati's CORS allow-list
includes `http://localhost:8000`. The GitHub Pages copy
(https://vanshtyagi1234.github.io/nbfc-general-demo/) works with `"staging"` only:
production's API refuses the sign-in calls from github.io (see "Deploying").

Do not open the HTML files directly from disk (`file://`). The consent UI refuses to
be framed by a `file://` page and the API rejects its `null` origin, so the consent
pop-up never appears; the page shows a red banner saying so.

To run against a local e-Sahamati instead (`npm run dev` in the e-sahamati repo: API on
`localhost:4000`, consent UI on `localhost:3000`), copy `config/env.example.js` over
`config/env.js` and do not commit that change.

Demo sign-in: pick a demo customer on the sign-in screen, OTP `123456`.

### Which mobile numbers can sign in

Only numbers that are already data principals of `org-quicklend-001`. The static code
`123456` is accepted for every principal of a demo-allowlisted org, but for an unknown
number the API answers "sent" without storing a code (so nobody can probe which numbers
are customers), and the OTP then fails; the page says to use a demo customer. A static
page cannot create principals (that needs an admin login or a token exchange signed by
the lender's own backend), so:

- the sign-in screen lists the seeded customers (Priya, Rahul, Anjali; `DEMO_ACCOUNTS` in
  `config/env.js` replaces them);
- any other number works once an admin adds it as a data principal in that
  environment's admin console (Principals), e.g. a presenter's own number;
- open sign-up for any number would need a small backend acting as the lender's server.

The Step 1 and Step 2 answers stay in the page: e-Sahamati records consents, not loan
applications, so nothing from the form is sent.

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
| Allowed origins (hosted demo only) | Settings → Integration → Allowed Origins | The cookie banner and pending-consent calls from the demo's domain. Sign-in also needs the API server's own allow-list (see "Deploying") |

Then reload the demo. The logo must be a public `https://` URL, because it is served to
every visitor.

**Currently pinned:** `config/brand.js` sets `shortName`, `fullName` and the three
colours to the deployed QuickLend demo's values, because the production org's own
branding differs from it. Values in `brand.js` win over the org, so clear those
fields before relying on the admin console to rebrand the demo pages.

## The combined consent profile

The second consent screen (`index.html`, and `classic.html` in `combined` mode) opens the
consent profile `loan-application-consent` on
`org-quicklend-001`, created 2026-10-28 through the admin API in BOTH environments and
linked to the org's notice `notice-001`. Its purposes differ by one, because the two
pre-sign-up profiles (`account-registration`) differ:

| Environment | `loan-application-consent` purposes | Why |
|---|---|---|
| staging | `kyc`, `credit_scoring`, `account_aggregator`, `loan_processing`, `third_party_sharing`, `marketing`, `analytics` | Staging's `account-registration` (v2) does not ask for `account_aggregator` |
| production | `kyc`, `credit_scoring`, `loan_processing`, `third_party_sharing`, `marketing`, `analytics` | Production's `account-registration` (v5) already asks for `account_aggregator` |

It is a separate profile, so each deployment's own QuickLend demo, which uses the seven
per-step profiles, is not affected. Do not edit those seven profiles or publish a new
version of `notice-001` for this demo: both change what the deployed demos show. To
change the combined screen, edit `loan-application-consent` in that environment's admin
console (Consent Profiles).

### Every consent goes through Pending, then Linked

The demo never hands its signed-in token to the consent pop-up. Every consent screen,
before or after sign-up, records an anonymous pending consent, and the demo links it to
the person straight away (`/consent/pending/link`): in the admin console it shows under
Consent → Pending Consent, moving from Pending to Linked. The after-sign-up screens
therefore say "You are not signed in" and ask for the 18+ tick, like the notice.

Why: the consent UI stores any token it is given in its own browser storage for up to
24 hours and restores it on every later open. After one signed-in step, the next run's
privacy notice was recorded directly for the previous person (`/consent/grant`) and never
appeared under Pending or Linked. A browser that ran an older version of this demo may
still hold such a session: clear site data for the consent UI's site
(consent.staging.datarakshaq.com or consent.e-sahamati.com), or use a private window,
once.

## Configuration

Two files, both plain JavaScript loaded before the page scripts.

### `config/env.js`: which deployment and organisation

Committed. Set `ENVIRONMENT` at the top to `"staging"` or `"production"`; the file fills
`API_BASE` and `CONSENT_UI` from it. `config/env.example.js` lists every key with the
local-dev values; the pages fall back to those if `config/env.js` is missing.

| Key | Default | Purpose |
|---|---|---|
| `ENVIRONMENT` | `"staging"` | Which deployment: `"staging"` or `"production"` (an unknown name stops the page with an error naming the valid ones) |
| `ORG_ID` | `org-quicklend-001` | The organisation every call is made against |
| `API_BASE` | `http://localhost:4000/api/v1` | e-Sahamati API, including `/api/v1` |
| `CONSENT_UI` | `http://localhost:3000` | Consent UI origin, no trailing slash |
| `SDK_URL` | `{CONSENT_UI}/sdk/esahamati.0.4.1.min.js` | Consent SDK bundle |
| `COOKIE_BANNER_URL` | `{CONSENT_UI}/sdk/cookie-banner.0.2.8.min.js` | Cookie banner bundle |
| `JOURNEY` | `combined` | `classic.html` only (`index.html` always uses two consent screens). `combined`: two (notice, then one on KYC). `full`: seven, as on demo.e-sahamati.com |
| `PROFILE_CODES` | QuickLend's profiles | Consent profile per step (`registration`, `combined`, `kyc`, `bureau`, `aa`, `loan`, `insurance`, `marketing`, and `credit` on `dpo.html`). Set only the ones that differ |
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
| `product.payoutTime` | `2 hours` | Welcome and Step 3 screens |
| `product.loanPurposes` | Medical emergency, Home renovation, … | Step 1 "Loan purpose" choices |
| `product.tenureOptions` | 6 / 12 / 24 / 36 | Step 2 tenure chips (months) |
| `product.processingFeePercent` | 2 | Step 2 fee and "amount credited" |
| `product.incomeMultiple` | 10 | Step 2 offer cap: monthly income × this (and never above `maxAmount`) |
| `product.insurancePlans` | Basic Protection (₹99), Comprehensive (₹199) | Insurance screen: `[{ name, monthlyPrice, features: [] }]` |

Colours are `#RRGGBB`. Hover, tint, glow and gradient shades are derived from them.
Org values are escaped before display, and only relative or `http(s)` logo URLs are
used.

## Deploying

Any static host works (nginx, S3 with CloudFront, Netlify, ...):

1. Upload the repo contents (`config/env.example.js` is not needed).
2. Set `ENVIRONMENT` in `config/env.js` (`"staging"` or `"production"`).
3. Make sure that environment's API accepts the demo's origin. Sign-in
   (`/auth/otp/send`, `/auth/otp/verify`) and certificate download are only opened by
   the API server's own allow-list (`ALLOWED_ORIGINS` in its environment, a change for
   whoever runs that server). An organisation's Allowed Origins (Settings → Integration)
   opens only the cookie-banner and pending-consent routes, so it is not enough on its
   own. Staging already accepts `https://vanshtyagi1234.github.io`; production does not.

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
