# Changelog: FBRO Website UI, UX, Accessibility & SEO Upgrade

All notable changes made during the modernization and accessibility upgrade of the Future Builders Refugee Organization (FBRO) static website.

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
   - Created `scripts/build-search-index.js` extracting relative URLs, titles, headings, and excerpts into `search-index.json`.
   - Accessible search modal dialog opened via header button, `/`, or Ctrl/Cmd+K.
   - Substring matching with weighted ranking (Title > Heading > Body), highlight `<mark>`, live result announcements, and arrow key navigation.
   - Lazy index loading on first modal open.
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
    - Created `404.html` with root-absolute asset paths, `<meta name="robots" content="noindex">`, warm headline, search widget, and primary navigation links.
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
