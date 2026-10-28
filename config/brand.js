// Brand config for this deployment: one NBFC per deployment.
//
// Every value is optional. For each field the demo uses, in order:
//   1. the value set here,
//   2. the organisation's own branding from e-Sahamati (admin console ->
//      Settings -> Branding / General), when useOrgBranding is true,
//   3. the built-in QuickLend default.
//
// The name and colour fields below are currently pinned to the deployed QuickLend
// demo (https://demo.e-sahamati.com), because the production org's own branding
// differs (name "QuickLend Finance Ltd.", secondary colour #1D4ED8). Clear them to
// let the organisation drive the demo again.
//
// The usual way to rebrand before a demo is to change the organisation in the
// admin console and leave these fields empty. The same change then shows up in the
// consent pop-up, the privacy notice, the cookie banner and the consent-ui pages,
// which e-Sahamati renders from the organisation itself. Set a field here only to
// make the demo pages differ from the organisation.

window.NBFC_BRAND = {
  // Read name, logo and colours from GET {API_BASE}/org/{ORG_ID}/config.
  useOrgBranding: true,

  // Short name: app bar, welcome heading, page title. Default: the organisation's
  // name without a trailing "Ltd." / "Limited" / "Pvt. Ltd.".
  shortName: "QuickLend",

  // Full name: the header on dpo.html. Default: the organisation's name.
  fullName: "QuickLend Finance",

  // Line under the name on the welcome screen.
  tagline: "",

  // Browser tab title for index.html. {shortName}, {fullName} and {productName}
  // are replaced.
  pageTitle: "",

  // Logo image: an https URL or a path relative to this site (e.g. "assets/logo.png").
  // Shown in a square, scaled to fit. Default: the organisation's logo, else a
  // letter tile in the primary colour.
  logoUrl: "",

  // Letter(s) on the tile shown when there is no logo. Default: first letter of
  // shortName.
  logoMonogram: "",

  // Browser tab icon. Default: logoUrl, else a letter tile.
  faviconUrl: "",

  // Colours as #RRGGBB. Hover states, tints, glows and the background gradient
  // are derived from these, so two or three values restyle the whole demo.
  primaryColor: "#2563EB",    // buttons, logo tile, active step
  secondaryColor: "#1A2B5F",  // headings, amounts, background gradient, phone frame
  accentColor: "#0EA5E9",     // focus rings, step glow, scrollbar. Default: primary

  // Loan product shown in the journey. Leave a field out to keep the default.
  product: {
    name: "Personal Loan",
    amount: 250000,        // starting amount on the welcome slider, in rupees
    minAmount: 50000,
    maxAmount: 1000000,
    amountStep: 10000,
    tenureMonths: 24,
    interestRate: 11.5,    // % per annum
    emi: null,             // monthly EMI in rupees; null = calculated from the above
    payoutTime: "2 hours", // "Funds to arrive in ..."
    // Step 1 "Loan purpose" choices, Step 2 tenure chips (months), processing fee
    // (% of the approved amount) and the eligibility cap (monthly income x this).
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
  }
};
