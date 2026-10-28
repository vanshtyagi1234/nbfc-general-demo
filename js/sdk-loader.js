// Loads the e-Sahamati SDK bundles named by config/env.js.
//
// The QuickLend demo loaded them from ../../packages/*/dist, which only exists inside
// the e-sahamati repo. This repo loads the version-pinned bundles the consent UI
// publishes under /sdk/ instead, or the URLs set in SDK_URL / COOKIE_BANNER_URL.
//
// Usage: <script src="./js/sdk-loader.js" data-load="consent cookie-banner"></script>
// Scripts are inserted with async=false so they run in order, before the page's own
// code needs <es-consent-modal> or <es-cookie-banner>.
(function () {
  var SDK_FILE = "esahamati.0.4.1.min.js";
  var COOKIE_BANNER_FILE = "cookie-banner.0.2.8.min.js";

  var cfg = window.DEMO_CONFIG || {};
  var consentUi = (cfg.CONSENT_UI || "http://localhost:3000").replace(/\/+$/, "");
  var wanted = ((document.currentScript && document.currentScript.dataset.load) || "consent").split(/\s+/);

  function isHttpUrl(value) {
    try {
      var url = new URL(value, window.location.href);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch (err) {
      return false;
    }
  }

  function load(configured, fallback) {
    var src = configured || fallback;
    if (!isHttpUrl(src)) {
      console.error("[demo] refusing to load SDK from a non-http(s) URL:", src);
      return;
    }
    var script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onerror = function () {
      console.error("[demo] could not load " + src + " — check CONSENT_UI / SDK_URL in config/env.js");
    };
    document.head.appendChild(script);
  }

  if (wanted.indexOf("consent") !== -1) {
    load(cfg.SDK_URL, consentUi + "/sdk/" + SDK_FILE);
  }
  if (wanted.indexOf("cookie-banner") !== -1) {
    load(cfg.COOKIE_BANNER_URL, consentUi + "/sdk/" + COOKIE_BANNER_FILE);
  }
})();
