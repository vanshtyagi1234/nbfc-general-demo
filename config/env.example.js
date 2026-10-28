// Environment config: which e-Sahamati deployment and organisation the demo talks to.
//
// Copy to config/env.js and edit for your environment. config/env.js is gitignored;
// every page loads it before its own script. If it is missing, the demo falls back to
// the local dev stack (backend on localhost:4000, consent-ui on localhost:3000) and
// the QuickLend demo org.
//
// Branding (name, logo, colours, loan figures) lives in config/brand.js, not here.

window.DEMO_CONFIG = {
  // The organisation every consent, OTP and data-rights call is made against.
  // Its name, logo and colours are read from e-Sahamati at page load (see brand.js).
  ORG_ID: "org-quicklend-001",

  // Backend API base, including the /api/v1 suffix.
  //   dev:   "http://localhost:4000/api/v1"
  //   prod:  "https://api.esahamati.com/api/v1"
  API_BASE: "http://localhost:4000/api/v1",

  // Consent UI origin, no trailing slash. The consent pop-up iframe and the
  // data-rights links open {CONSENT_UI}/{ORG_ID}/{page}.
  //   dev:   "http://localhost:3000"
  //   prod:  "https://consent.esahamati.com"
  CONSENT_UI: "http://localhost:3000",

  // SDK bundles. Leave empty to load the version-pinned bundles the consent UI
  // serves: {CONSENT_UI}/sdk/esahamati.0.4.1.min.js and
  // {CONSENT_UI}/sdk/cookie-banner.0.2.8.min.js. Set a full URL to pin another copy.
  SDK_URL: "",
  COOKIE_BANNER_URL: "",

  // Optional. Consent profile codes per journey step, for an organisation whose
  // profiles are named differently from QuickLend's. Only the keys you set change.
  //   registration, kyc, bureau, aa, loan, insurance, marketing  (index.html)
  //   credit                                                   (dpo.html)
  PROFILE_CODES: {},

  // Optional. Demo accounts shown on the sign-up screen. They must exist as data
  // principals in ORG_ID. Leave null for QuickLend's seeded accounts.
  //   [{ name: "Priya Sharma", phone: "+919876543210", dob: "1990-08-22" }, ...]
  DEMO_ACCOUNTS: null,
};
