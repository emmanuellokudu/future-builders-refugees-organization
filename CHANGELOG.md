# Changelog: FBRO Website UI, UX, Accessibility & SEO Upgrade

All notable changes made during the modernization and accessibility upgrade of the Future Builders Refugee Organization (FBRO) static website.

## [1.2.0] - Verified Domain Migration, Location-Based SEO & Leadership Directory Expansion (2026-10-15)

### Verified Custom Domain Rollout
- **Domain Migration**: Replaced previous domain references with verified canonical production domain `https://futurebuildersrefugeeorganization.com/` across all 8 HTML files, root `CNAME`, `robots.txt`, `sitemap.xml`, and documentation.
- **Social Graph & Asset Resolution**: Updated Open Graph (`og:url`, `og:image`), Twitter Cards, canonical links, and Schema.org breadcrumbs to the verified domain.
- **Discovery Directives**: Refreshed `robots.txt` and `sitemap.xml` with updated `<lastmod>` (2026-10-15) for all 7 indexable pages.

### Location-Based & Activity-Based Search Engine Optimization (SEO)
- **Geographic Meta Directives**: Added standardized geo tags (`geo.region: KE-43`, `geo.placename: Kakuma, Turkana County, Kenya`, `geo.position: 3.714;34.862`, `ICBM: 3.714, 34.862`) across all pages for enhanced local search and map indexing.
- **Dual Entity Classification**: Upgraded Schema.org JSON-LD structured data to dual type `["NGO", "NonprofitOrganization"]` with alternate names `["FBRO", "FBRO CBO", "Future Builders Refugee Organization (FBRO)"]`.
- **Core Activity Taxonomy**: Embedded `knowsAbout` taxonomy covering peacebuilding & social cohesion, sustainable livelihoods, youth empowerment & digital literacy, environmental conservation & tree planting, education & child safeguarding, and community health.
- **Precise Location Schema**: Integrated geo coordinates (`3.714`, `34.862`) and full postal address (Kakuma 1, Turkana West Sub-County, Turkana County, Kenya) in all organization schemas.

### Verified Contact & Leadership Team Updates
- **Primary Organization Email**: Standardized official contact email to `futurebuildersrefugeeorganizat@gmail.com` across topbars, footer forms, `script.js` form fallbacks/handlers, privacy policy, and schema markup.
- **Operations Manager**: Updated Elisha Itongelo's direct contact email to `elishaitongelo8@gmail.com` (`+254 703 957 274`).
- **Leadership Expansion**: Added Administrator **Issa Mkumu Atanga** (`issamkumu19@gmail.com`, `+254 713 909 469`) to the official leadership directory on `about.html`, `contact.html`, and `get-involved.html`.
- **Schema Member Integration**: Added all three leadership members (Prosper Undji Etongano, Elisha Itongelo, Issa Mkumu Atanga) to `member` and `founder` structures in Schema.org metadata across all site pages.
- **UI & Layout Enhancement**: Added `.people-card` and `.team-grid` CSS rules in `styles.css` with responsive 3-column card layouts, click-to-call, click-to-email, and clipboard copy buttons.

---

## [1.1.0] - Production Custom Domain & Local SEO Rollout (2026-10-12)

### Canonical Domain & Discovery
- **Custom Domain Setup**: Configured live canonical domain `https://fbrocbo.com/` across all pages.
- **GitHub Pages Deployment**: Added root `CNAME` for `fbrocbo.com` and documented GitHub Pages DNS setup (A & CNAME records).
- **XML Sitemap**: Created `sitemap.xml` listing all 7 indexable pages with `https://fbrocbo.com/` URLs and `<lastmod>` timestamps.
- **Robots Directive**: Created `robots.txt` granting crawl access and referencing `https://fbrocbo.com/sitemap.xml`.

### Local Search Engine Optimization (SEO)
- **Local Keyword Targeting**: Enriched metadata, page titles, descriptions, and headings with localized search phrases: "Kakuma Refugee Camp", "Kalobeyei Settlement", "Turkana County", "Kenya", "refugee-led CBO", "humanitarian support", "peacebuilding", "livelihoods", and "youth empowerment".
- **Social Graph Sharing**: Added complete Open Graph (`og:*`) and Twitter Card (`twitter:*`) tags to all pages pointing to live production images (`https://fbrocbo.com/assets/img/community-group-1600.webp`).
- **Structured Data (JSON-LD)**:
  - Enhanced `NGO` schema with live domain `url`, `logo`, `image`, `areaServed`, `knowsAbout`, phone numbers, and official emails.
  - Upgraded inner-page `BreadcrumbList` schema to fully-qualified production URLs.
  - Refined `FAQPage` schema on homepage and Get Involved page.

### Form Handling & Privacy Policy
- **EmailJS Integration**: Enhanced `script.js` with `EMAILJS_PARTNERSHIP_TEMPLATE_ID`, anti-spam honeypot verification, and progressive `mailto:` fallback across contact, partnership, and newsletter forms.
- **Privacy Policy**: Upgraded `privacy.html` with review-ready clauses covering EmailJS processing, data retention, zero commercial sale of data, and user access/deletion rights.

---

## [1.0.0] - Upgrade Release

### Design System & Architecture (Step 1)
- **CSS Custom Properties**: Created unified tokens in `styles.css` for color palettes (light and dark), fluid clamp type scale, 4/8-point spacing scale (`--space-1` to `--space-24`), border radii, layered shadows, and 150ms/200ms transitions.
- **Button System**: Unified buttons into `.btn` with semantic variants (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-sm`, `.btn-lg`), guaranteed 44px touch targets, `:active` press effects, and `@media (hover: hover)` encapsulation.
- **Card & Form Standardization**: Restructured `.card` and unified all inputs, textareas, and selects with consistent focus rings and validation states.
- **Brand Identity**: Preserved FBRO brand navy (`#0b1f4a`), blue (`#0870c8`), and green (`#367f19`) while removing generic inline styles and hardcoded RGBAs.

### Features Implemented (Step 2)
1. **Dark Mode Toggle**:
   - Built tri-state system defaulting to `prefers-color-scheme`, overridable via toggle button.
   - Saved in `localStorage` wrapped in try/catch.
   - Inline script in `<head>` sets `data-theme` before first paint (eliminates FOUC).
   - Brand logo wrapped in `.brand-logo-frame` to maintain crisp legibility in dark mode. Photos not inverted.
2. **Sticky Header**:
   - Header smoothly transitions with subtle elevation shadow and compact height past 40px scroll.
   - Dynamic `scroll-padding-top` ensures anchor jumps never land hidden beneath the header.
3. **Mobile Menu Drawer**:
   - Replaced plain text toggle with an animated 3-line hamburger morphing into a close 'X'.
   - Synchronized `aria-expanded` and `aria-controls`.
   - Full-width mobile panel with focus trap, body scroll lock, Esc key close, outside click close, and focus return to toggle button.
4. **Hover, Focus, and Active States**:
   - Scoped all hover transitions within `@media (hover: hover)` to eliminate sticky touch states.
   - High-contrast `:focus-visible` rings with offset.
   - Distinct `:active` states on all interactive elements.
5. **Scroll Progress Bar**:
   - Fixed 3px viewport top progress bar updated via `requestAnimationFrame` (`aria-hidden="true"`).
   - Color adapts automatically: Brand green on light mode, sky blue on dark mode.
6. **Scroll Back to Top**:
   - Floating button appears after 600px scroll with smooth scroll (instant under `prefers-reduced-motion`).
   - Returns focus to skip link or body.
   - Stacks safely above WhatsApp floating button with viewport safe-area insets.
7. **Loading Animations & Progressive Enhancement**:
   - Added `html.js` progressive gating so content remains 100% visible if JavaScript is disabled.
   - Implemented subtle reveal-on-scroll using `IntersectionObserver`.
   - Added shimmer skeleton effect on lazy-loaded images that gracefully fades out on load.
   - Full bypass under `prefers-reduced-motion`.
8. **Skip to Content Link**:
   - Accessible first tab stop on every page, jumping directly to `<main id="main" tabindex="-1">`.
9. **Full-Site Client Search**:
   - *(Removed)*: Feature removed completely across all pages, styles, scripts, and build tools per request.
10. **Floating WhatsApp CTA**:
    - 56px brand-green circular floating button with inline SVG icon, accessible label, and safe-area insets.
    - Configured with `WHATSAPP_NUMBER` and automatic UTM parameter appending. Hidden in print.
11. **Expandable FAQ Section & Schema**:
    - Built accessible accordion using `<details>/<summary>` on `get-involved.html` (7 items) and `index.html` (4 items).
    - Content based strictly on existing organizational facts.
    - Added matching `FAQPage` JSON-LD structured data on both pages.
12. **Newsletter Signup & Privacy Page**:
    - Added Netlify-compatible newsletter form in footer on all pages with email validation and honeypot.
    - Asynchronous `fetch` submission with loading state, success banner (`role="status"`), and fallback error message.
    - Created placeholder `privacy.html` marked `TODO` for client review.
13. **Clean 404 Error Page**:
    - Created `404.html` with root-absolute asset paths, `<meta name="robots" content="noindex">`, warm headline, and primary navigation links.
14. **UTM Link Tagging & Inbound Capture**:
    - Added zero-tracking sessionStorage capture for inbound UTM parameters, automatically injected into all form submissions.
    - Added outgoing UTM configuration for WhatsApp and partners.
    - Authored `UTM-GUIDE.md` with conventions and 5 representative link examples.
15. **Copy-to-Clipboard Buttons**:
    - Added 44px min-touch-target copy buttons next to all email addresses and phone numbers.
    - Uses `navigator.clipboard.writeText` with `execCommand` fallback.
    - Shows "Copied" with check icon for 2 seconds and announces through `aria-live="polite"`.
16. **SEO & Performance**:
    - Self-hosted WOFF2 font files locally in `assets/fonts/` (zero CDN dependencies).
    - Preloaded primary heading and body fonts.
    - Explicit `width` and `height` attributes on all images. `fetchpriority="high"` on hero images.
    - Full favicon set: `favicon.svg`, `apple-touch-icon.png`, `site.webmanifest`, `favicon.png`.
    - NGO `Organization` and `BreadcrumbList` JSON-LD schemas across pages.
    - Unique `<title>` (<60 chars) and meta descriptions (<160 chars) on all pages.
