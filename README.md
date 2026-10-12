# Future Builders Refugee Organization (FBRO) Website

Static, high-performance, accessible website for Future Builders Refugee Organization (FBRO) in Kakuma Refugee Camp & Kalobeyei Settlement, Turkana County, Kenya.

Pages:
- `index.html` (Homepage with hero, program overview, photo mosaic, and summary FAQ)
- `about.html` (Background, vision, mission, objectives, and community approach)
- `programs.html` (Detailed view of all seven program areas)
- `gallery.html` (Categorized activity photo gallery with accessible lightbox)
- `get-involved.html` (Partnership inquiry form and comprehensive FAQ accordion)
- `contact.html` (Direct leadership contacts, location details, and message form)
- `privacy.html` (Static privacy policy placeholder marked `TODO` for client review)
- `404.html` (Custom error page with popular navigation links)

Shared Assets:
- `styles.css` (Unified design system tokens, WCAG 2.2 AA compliant light & dark mode)
- `script.js` (Modular vanilla JavaScript under 26 KB unminified, zero tracking cookies)
- `assets/fonts/` (Self-hosted WOFF2 font files for Bricolage Grotesque and Source Serif 4)
- `assets/img/` (Responsive WebP photography, 800px and 1600px)

---

## Configuration Block (`script.js`)

At the very top of `script.js`, organizational constants are isolated in a single configuration block:

```javascript
var CONFIG = {
  // TODO: Confirm FBRO WhatsApp contact number with client (international format, digits only)
  WHATSAPP_NUMBER: '254703957274',

  // TODO: Confirm Netlify forms handler name for footer newsletter
  NEWSLETTER_FORM_NAME: 'newsletter',

  // UTM parameters for outgoing links (lowercase, hyphenated)
  UTM: {
    whatsapp: {
      utm_source: 'website',
      utm_medium: 'whatsapp-button',
      utm_campaign: 'site-chat'
    },
    partner: {
      utm_source: 'website',
      utm_medium: 'partner-link',
      utm_campaign: 'partner-outreach'
    }
  }
};
```

To update the WhatsApp receiving number or form handlers, edit this object directly.


---

## Local Font Vendoring

Fonts are 100% self-hosted to comply with the zero-CDN constraint and ensure fast loading on mobile connections. If fonts ever need re-fetching:

```bash
node scripts/vendor-fonts.js
```

---

## Previewing and Deployment

- **Preview**: Open any HTML file in a modern browser or serve with a local static HTTP server (e.g. `npx serve .` or Python `python -m http.server 8000`).
- **Deploy**: Drag this folder directly onto Netlify or Cloudflare Pages.
  - Forms use Netlify Forms (`data-netlify="true"`, `netlify-honeypot="bot-field"`).
  - Outgoing campaign conventions and UTM preservation are documented in `UTM-GUIDE.md`.
  - Deferred domain-dependent items (sitemap, canonical URLs, OG social tags) are documented in `DEFERRED.md`.
