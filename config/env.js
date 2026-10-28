// Environment config: production e-Sahamati, QuickLend demo org.
//
// Values taken from the live QuickLend demo's config.js at
// https://demo.e-sahamati.com/config.js. For local development point these at
// localhost (see config/env.example.js for every key) and do not commit that change.

window.DEMO_CONFIG = {
  ORG_ID: "org-quicklend-001",
  API_BASE: "https://api.e-sahamati.com/api/v1",
  CONSENT_UI: "https://consent.e-sahamati.com",

  // Empty: load the version-pinned bundles the consent UI serves under /sdk/
  // (https://consent.e-sahamati.com/sdk/esahamati.0.4.1.min.js and
  // cookie-banner.0.2.8.min.js, both live).
  SDK_URL: "",
  COOKIE_BANNER_URL: "",

  PROFILE_CODES: {},
  DEMO_ACCOUNTS: null,
};
