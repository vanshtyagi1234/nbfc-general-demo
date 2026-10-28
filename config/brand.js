// Brand config for this deployment: one NBFC per deployment.
//
// Every value is optional. For each field the demo uses, in order:
//   1. the value set here,
//   2. the organisation's own branding from e-Sahamati (admin console ->
//      Settings -> Branding / General), when useOrgBranding is true,
//   3. the built-in QuickLend default.
//
// So the usual way to rebrand before a demo is to change the organisation in the
// admin console and leave these fields empty. The same change then shows up in the
// consent pop-up, the privacy notice, the cookie banner and the consent-ui pages,
// which e-Sahamati renders from the organisation itself. Set a field here only to
// make the demo pages differ from the organisation.

window.NBFC_BRAND = {
  // Read name, logo and colours from GET {API_BASE}/org/{ORG_ID}/config.
  useOrgBranding: true,

  // Short name: app bar, welcome heading, page title. Default: the organisation's
  // name without a trailing "Ltd." / "Limited" / "Pvt. Ltd.".
  shortName: "",

  // Full name: the header on dpo.html. Default: the organisation's name.
  fullName: "",

  // Line under the name on the welcome screen.
  tagline: "",

  // Browser tab title for index.html. {shortName} and {fullName} are replaced.
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
  primaryColor: "",    // buttons, logo tile, active step
  secondaryColor: "",  // headings, amounts, background gradient, phone frame
  accentColor: "",     // focus rings, step glow, scrollbar. Default: primary
};
