// Environment config: which e-Sahamati deployment the demo talks to, QuickLend demo org.
//
// Set ENVIRONMENT to one of the deployments below. Both hold the same organisation
// (org-quicklend-001) and the same consent profiles, including loan-application-consent
// for the two-consent-screen journey:
//   "staging"     admin: https://admin.staging.datarakshaq.com  (values from
//                 https://demo.staging.datarakshaq.com/config.js)
//   "production"  admin: https://admin.e-sahamati.com           (values from
//                 https://demo.e-sahamati.com/config.js)
//
// Staging's API accepts calls from GitHub Pages and localhost:8000; production's
// accepts localhost:8000 only (its server allow-list does not include github.io).
//
// For a local e-Sahamati stack see config/env.example.js; do not commit that change.
(function () {
  var ENVIRONMENT = "staging";

  var ENVIRONMENTS = {
    staging: {
      API_BASE: "https://api.staging.datarakshaq.com/api/v1",
      CONSENT_UI: "https://consent.staging.datarakshaq.com",
    },
    production: {
      API_BASE: "https://api.e-sahamati.com/api/v1",
      CONSENT_UI: "https://consent.e-sahamati.com",
    },
  };

  if (!Object.prototype.hasOwnProperty.call(ENVIRONMENTS, ENVIRONMENT)) {
    throw new Error('config/env.js: unknown ENVIRONMENT "' + ENVIRONMENT + '"; use one of: ' +
      Object.keys(ENVIRONMENTS).join(", "));
  }

  window.DEMO_CONFIG = {
    ENVIRONMENT: ENVIRONMENT,
    ORG_ID: "org-quicklend-001",
    API_BASE: ENVIRONMENTS[ENVIRONMENT].API_BASE,
    CONSENT_UI: ENVIRONMENTS[ENVIRONMENT].CONSENT_UI,

    // Empty: load the version-pinned bundles the consent UI serves under /sdk/
    // ({CONSENT_UI}/sdk/esahamati.0.4.1.min.js and cookie-banner.0.2.8.min.js; both
    // live on staging and production).
    SDK_URL: "",
    COOKIE_BANNER_URL: "",

    // Same journey either way; this only sets how many consent screens it opens.
    // "combined": two (registration notice before sign-up, then
    // loan-application-consent on the KYC step). "full": seven, one per step, as
    // on the deployed QuickLend demo.
    JOURNEY: "combined",

    PROFILE_CODES: {},
    DEMO_ACCOUNTS: null,
  };
})();
