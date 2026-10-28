// Resolves the brand (config/brand.js, then the organisation's branding from
// e-Sahamati, then the QuickLend defaults) and applies it to the page.
//
// Load in <head> after config/env.js and config/brand.js. It sets CSS custom
// properties on <html> straight away and exposes window.NbfcBrand for the page
// scripts. Pages read colours through var(--brand-*, <QuickLend value>), so a page
// still renders as QuickLend if this script never runs.
//
// Markup hooks, refreshed whenever the brand changes (the org fetch is async):
//   data-brand-text="shortName|fullName|tagline"   text content
//   data-brand-logo="<img class>"                   logo image or letter tile
//   <title data-brand-title="{shortName} — ...">    document title template
// A "nbfc:brand" event fires on window after each change.
(function () {
  var DEFAULTS = {
    shortName: "QuickLend",
    fullName: "QuickLend Finance",
    tagline: "Your Personal Loan, Simplified",
    pageTitle: "",
    logoUrl: "",
    logoMonogram: "",
    faviconUrl: "",
    primaryColor: "#2563EB",
    secondaryColor: "#1A2B5F",
    accentColor: "#0EA5E9"
  };
  var PRODUCT_DEFAULTS = {
    name: "Personal Loan",
    amount: 250000,
    minAmount: 50000,
    maxAmount: 1000000,
    amountStep: 10000,
    tenureMonths: 24,
    interestRate: 11.5,
    emi: null,
    payoutTime: "2 hours",
    loanPurposes: ["Medical emergency", "Home renovation", "Education", "Wedding", "Travel", "Debt consolidation", "Other"],
    tenureOptions: [6, 12, 24, 36],
    processingFeePercent: 2,
    incomeMultiple: 10,
    insurancePlans: [
      { name: "Basic Protection", monthlyPrice: 99, features: ["Loss of income coverage", "Disability coverage"] },
      {
        name: "Comprehensive",
        monthlyPrice: 199,
        features: ["All benefits of Basic", "Critical illness coverage", "Accidental death benefit"]
      }
    ]
  };
  // How long the first render waits for the org's branding before giving up.
  var ORG_FETCH_TIMEOUT_MS = 3000;

  var env = window.DEMO_CONFIG || {};
  var local = window.NBFC_BRAND || {};
  var org = {};
  var brand = resolve();
  var product = resolveProduct(local.product || {});

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function text(value) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
  }

  function first() {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i]) return arguments[i];
    }
    return "";
  }

  // "#abc" / "#AABBCC" -> "#aabbcc"; anything else -> "".
  function hex(value) {
    var v = text(value).toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(v)) v = "#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
    return /^#[0-9a-f]{6}$/.test(v) ? v : "";
  }

  // Relative paths and http(s) URLs only: no javascript:, data: or other schemes.
  function safeUrl(value) {
    var v = text(value);
    if (!v) return "";
    try {
      var url = new URL(v, window.location.href);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch (err) {
      return "";
    }
  }

  function stripLegalSuffix(name) {
    return name.replace(/[\s,]+(private limited|pvt\.? ?ltd\.?|limited|ltd\.?)$/i, "").trim();
  }

  function resolve() {
    var orgName = text(org.name);
    var shortName = first(text(local.shortName), orgName && stripLegalSuffix(orgName), DEFAULTS.shortName);
    var primary = first(hex(local.primaryColor), hex(org.primaryColor), hex(DEFAULTS.primaryColor));
    // QuickLend pairs its blue with a teal accent; any other primary is its own accent.
    var accent = first(
      hex(local.accentColor),
      primary === hex(DEFAULTS.primaryColor) ? hex(DEFAULTS.accentColor) : primary
    );
    var logoUrl = first(safeUrl(local.logoUrl), safeUrl(org.logoUrl));
    return Object.freeze({
      shortName: shortName,
      fullName: first(text(local.fullName), orgName, DEFAULTS.fullName),
      tagline: first(text(local.tagline), DEFAULTS.tagline),
      pageTitle: text(local.pageTitle),
      logoUrl: logoUrl,
      logoMonogram: first(text(local.logoMonogram), shortName.charAt(0).toUpperCase()),
      faviconUrl: first(safeUrl(local.faviconUrl), logoUrl),
      primaryColor: primary,
      secondaryColor: first(hex(local.secondaryColor), hex(org.secondaryColor), hex(DEFAULTS.secondaryColor)),
      accentColor: accent
    });
  }

  // ---- loan product --------------------------------------------------------
  function positive(value, fallback) {
    var n = Number(value);
    return isFinite(n) && n > 0 ? n : fallback;
  }

  function resolveProduct(p) {
    var d = PRODUCT_DEFAULTS;
    var minAmount = positive(p.minAmount, d.minAmount);
    var maxAmount = Math.max(minAmount, positive(p.maxAmount, d.maxAmount));
    var amount = Math.min(maxAmount, Math.max(minAmount, positive(p.amount, d.amount)));
    var plans = Array.isArray(p.insurancePlans) ? p.insurancePlans : d.insurancePlans;
    return Object.freeze({
      name: first(text(p.name), d.name),
      amount: amount,
      minAmount: minAmount,
      maxAmount: maxAmount,
      amountStep: positive(p.amountStep, d.amountStep),
      tenureMonths: Math.round(positive(p.tenureMonths, d.tenureMonths)),
      interestRate: positive(p.interestRate, d.interestRate),
      emi: positive(p.emi, null),
      payoutTime: first(text(p.payoutTime), d.payoutTime),
      loanPurposes: Object.freeze((Array.isArray(p.loanPurposes) && p.loanPurposes.length ? p.loanPurposes : d.loanPurposes)
        .map(text).filter(Boolean)),
      tenureOptions: Object.freeze((Array.isArray(p.tenureOptions) && p.tenureOptions.length ? p.tenureOptions : d.tenureOptions)
        .map(function (n) { return Math.round(positive(n, 0)); }).filter(Boolean)),
      processingFeePercent: p.processingFeePercent === 0 ? 0 : positive(p.processingFeePercent, d.processingFeePercent),
      incomeMultiple: positive(p.incomeMultiple, d.incomeMultiple),
      insurancePlans: Object.freeze(plans.filter(function (plan) { return plan && text(plan.name); }).map(function (plan) {
        return Object.freeze({
          name: text(plan.name),
          monthlyPrice: positive(plan.monthlyPrice, 0),
          features: Object.freeze((Array.isArray(plan.features) ? plan.features : []).map(text).filter(Boolean))
        });
      }))
    });
  }

  // Standard reducing-balance EMI, or the configured figure when one is set.
  function emiFor(amount, tenureMonths) {
    var n = Math.round(positive(tenureMonths, product.tenureMonths));
    if (product.emi && amount === product.amount && n === product.tenureMonths) return product.emi;
    var r = product.interestRate / 12 / 100;
    var factor = Math.pow(1 + r, n);
    return Math.round((amount * r * factor) / (factor - 1));
  }

  function formatInr(amount) {
    return "₹ " + Math.round(amount).toLocaleString("en-IN");
  }

  // 50000 -> "₹50K", 1000000 -> "₹10L", 20000000 -> "₹2Cr"
  function formatInrShort(amount) {
    var units = [[1e7, "Cr"], [1e5, "L"], [1e3, "K"]];
    for (var i = 0; i < units.length; i++) {
      if (amount >= units[i][0]) {
        return "₹" + (Math.round((amount / units[i][0]) * 10) / 10) + units[i][1];
      }
    }
    return "₹" + amount;
  }

  // ---- colour maths --------------------------------------------------------
  function rgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  }

  function toHex(c) {
    return "#" + c.map(function (n) {
      var s = Math.round(Math.min(255, Math.max(0, n))).toString(16);
      return s.length === 1 ? "0" + s : s;
    }).join("");
  }

  // Mix colour h with white (amount > 0) or black (amount < 0).
  function mix(h, amount) {
    var target = amount > 0 ? 255 : 0;
    var t = Math.abs(amount);
    return toHex(rgb(h).map(function (n) { return n + (target - n) * t; }));
  }

  function applyColours() {
    var s = document.documentElement.style;
    var p = brand.primaryColor;
    var sec = brand.secondaryColor;
    s.setProperty("--brand-primary", p);
    s.setProperty("--brand-primary-hover", mix(p, -0.15));
    s.setProperty("--brand-primary-rgb", rgb(p).join(", "));
    s.setProperty("--brand-secondary", sec);
    s.setProperty("--brand-secondary-deep", mix(sec, -0.42));
    s.setProperty("--brand-secondary-ring", mix(sec, 0.06));
    s.setProperty("--brand-accent", brand.accentColor);
    s.setProperty("--brand-accent-rgb", rgb(brand.accentColor).join(", "));
    s.setProperty("--brand-tint-bg", mix(p, 0.94));
    s.setProperty("--brand-tint-border", mix(p, 0.86));
    s.setProperty("--brand-tint-page", mix(p, 0.97));
  }

  // ---- markup --------------------------------------------------------------
  function logoHtml(className) {
    var cls = escapeHtml(className || "");
    if (brand.logoUrl) {
      return '<img class="' + cls + ' brand-logo-img" src="' + escapeHtml(brand.logoUrl) +
        '" alt="' + escapeHtml(brand.shortName) + ' logo">';
    }
    return '<svg class="' + cls + '" viewBox="0 0 48 48" role="img" aria-label="' +
      escapeHtml(brand.shortName) + '" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="48" height="48" rx="8" style="fill: var(--brand-primary, #2563EB)"/>' +
      '<text x="24" y="32" font-size="' + (brand.logoMonogram.length > 1 ? 18 : 24) +
      '" font-weight="700" fill="white" text-anchor="middle" font-family="system-ui, sans-serif">' +
      escapeHtml(brand.logoMonogram) + "</text></svg>";
  }

  function fillTemplate(template) {
    return template
      .replace(/\{shortName\}/g, brand.shortName)
      .replace(/\{fullName\}/g, brand.fullName)
      .replace(/\{productName\}/g, product.name);
  }

  function applyFavicon() {
    var href = brand.faviconUrl;
    if (!href) {
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
        '<rect width="48" height="48" rx="10" fill="' + brand.primaryColor + '"/>' +
        '<text x="24" y="33" font-size="26" font-weight="700" fill="white" text-anchor="middle" ' +
        'font-family="system-ui, sans-serif">' + escapeHtml(brand.logoMonogram.charAt(0)) + "</text></svg>";
      href = "data:image/svg+xml," + encodeURIComponent(svg);
    }
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = href;
  }

  function applyMarkup() {
    var titleEl = document.querySelector("title[data-brand-title]");
    if (titleEl) {
      document.title = fillTemplate(
        brand.pageTitle && titleEl.hasAttribute("data-brand-title-configurable")
          ? brand.pageTitle
          : titleEl.getAttribute("data-brand-title")
      );
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-brand-text]"), function (el) {
      var key = el.getAttribute("data-brand-text");
      if (Object.prototype.hasOwnProperty.call(brand, key)) el.textContent = brand[key];
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-brand-logo]"), function (el) {
      el.innerHTML = logoHtml(el.getAttribute("data-brand-logo"));
      el.classList.toggle("has-logo-image", Boolean(brand.logoUrl));
    });
    applyFavicon();
  }

  function applyAll() {
    applyColours();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyMarkup, { once: true });
    } else {
      applyMarkup();
    }
    window.dispatchEvent(new CustomEvent("nbfc:brand", { detail: brand }));
  }

  // ---- org branding --------------------------------------------------------
  function fetchOrgBranding() {
    if (local.useOrgBranding === false) return Promise.resolve();
    var apiBase = (env.API_BASE || "http://localhost:4000/api/v1").replace(/\/+$/, "");
    var orgId = env.ORG_ID || "org-quicklend-001";
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, ORG_FETCH_TIMEOUT_MS);
    return fetch(apiBase + "/org/" + encodeURIComponent(orgId) + "/config", {
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (body) {
        var o = body && body.data && body.data.org;
        if (!o) throw new Error("no org in response");
        org = {
          name: o.name,
          logoUrl: o.logoUrl,
          primaryColor: o.primaryColor,
          secondaryColor: o.secondaryColor
        };
        brand = resolve();
        applyAll();
      })
      .catch(function (err) {
        console.warn("[demo] organisation branding not loaded, using config/brand.js and defaults:", err.message || err);
      })
      .finally(function () { clearTimeout(timer); });
  }

  window.NbfcBrand = {
    get: function () { return brand; },
    product: function () { return product; },
    emiFor: emiFor,
    formatInr: formatInr,
    formatInrShort: formatInrShort,
    escape: escapeHtml,
    logoHtml: logoHtml,
    // Resolves once the org's branding has been applied (or has failed / timed out).
    ready: null
  };

  applyAll();
  window.NbfcBrand.ready = fetchOrgBranding().then(function () { return brand; });
})();
