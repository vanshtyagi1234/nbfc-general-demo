// Environment config: which e-Sahamati deployment and organisation the demo talks to.
//
// Reference for config/env.js, which every page loads before its own script. The
// committed config/env.js points at production; copy this file over it to run against
// the local dev stack (backend on localhost:4000, consent-ui on localhost:3000), and
// do not commit that. If config/env.js is missing, the pages fall back to these values.
//
// Branding (name, logo, colours, loan figures) lives in config/brand.js, not here.

window.DEMO_CONFIG = {
  // The organisation every consent, OTP and data-rights call is made against.
  // Its name, logo and colours are read from e-Sahamati at page load (see brand.js).
  ORG_ID: "org-quicklend-001",

  // Backend API base, including the /api/v1 suffix.
  //   dev:   "http://localhost:4000/api/v1"
  //   prod:  "https://api.e-sahamati.com/api/v1"
  API_BASE: "http://localhost:4000/api/v1",

  // Consent UI origin, no trailing slash. The consent pop-up iframe and the
  // data-rights links open {CONSENT_UI}/{ORG_ID}/{page}.
  //   dev:   "http://localhost:3000"
  //   prod:  "https://consent.e-sahamati.com"
  CONSENT_UI: "http://localhost:3000",

  // SDK bundles. Leave empty to load the version-pinned bundles the consent UI
  // serves: {CONSENT_UI}/sdk/esahamati.0.4.1.min.js and
  // {CONSENT_UI}/sdk/cookie-banner.0.2.8.min.js. Set a full URL to pin another copy.
  SDK_URL: "",
  COOKIE_BANNER_URL: "",

  // Consent screens on index.html. The journey's steps are the same either way.
  //   "combined" (default): two. The registration notice before sign-up, then ONE
  //              screen on the KYC step (PROFILE_CODES.combined) carrying every
  //              after-sign-up purpose; the later steps just move on.
  //   "full":    seven, one per step, as on the deployed QuickLend demo.
  JOURNEY: "combined",

  // Optional. Consent profile codes per journey step, for an organisation whose
  // profiles are named differently from QuickLend's. Only the keys you set change.
  //   registration, combined                                   (index.html, combined)
  //   registration, kyc, bureau, aa, loan, insurance, marketing  (index.html, full)
  //   kyc, credit, loan, insurance, marketing                  (dpo.html)
  PROFILE_CODES: {},

  // Optional. Demo accounts shown on the sign-up screen. They must exist as data
  // principals in ORG_ID. Leave null for QuickLend's seeded accounts.
  //   [{ name: "Priya Sharma", phone: "+919876543210", dob: "1990-08-22" }, ...]
  DEMO_ACCOUNTS: null,
};
