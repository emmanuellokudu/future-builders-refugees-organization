# Future Builders Refugee Organization (FBRO) Website

Static, high-performance, accessible website for Future Builders Refugee Organization (FBRO) in Kakuma Refugee Camp & Kalobeyei Settlement, Turkana County, Kenya.

Live Production URL: **[https://fbrocbo.com/](https://fbrocbo.com/)**

## Pages Overview

- `index.html` (Homepage with hero, program highlights, field photo mosaic, and summary FAQ)
- `about.html` (Background, vision, mission, objectives, and community approach)
- `programs.html` (Comprehensive view of all seven core program areas)
- `gallery.html` (Categorized activity photo gallery with accessible modal lightbox)
- `get-involved.html` (Partnership inquiry form, volunteer details, and comprehensive FAQ accordion)
- `contact.html` (Direct leadership contacts, location details, and message form)
- `privacy.html` (Review-ready privacy policy covering EmailJS and data protection)
- `404.html` (Custom error page with popular navigation links)

## Shared Assets

- `styles.css` (Unified design system tokens, WCAG 2.2 AA compliant light & dark mode)
- `script.js` (Modular vanilla JavaScript under 26 KB unminified, zero tracking cookies)
- `assets/fonts/` (Self-hosted WOFF2 font files for Bricolage Grotesque and Source Serif 4)
- `assets/img/` (Responsive WebP photography, 800px and 1600px variants)
- `CNAME` (Configured for custom domain `fbrocbo.com`)
- `sitemap.xml` (Full XML sitemap for search engine discovery)
- `robots.txt` (Robots exclusion protocol directive with sitemap reference)

---

## Configuration Block (`script.js`)

At the very top of `script.js`, organizational constants are isolated in a single configuration block:

```javascript
var CONFIG = {
  // WhatsApp contact number (international digits only)
  WHATSAPP_NUMBER: '254703957274',
  WHATSAPP_DISPLAY: '+254 703 957 274',

  // EmailJS configuration (fill these with your EmailJS account values)
  // - EMAILJS_USER_ID: Public User ID / Public Key from EmailJS dashboard (Account > API Keys)
  // - EMAILJS_SERVICE_ID: Email service ID (e.g. 'service_gmail')
  // - EMAILJS_CONTACT_TEMPLATE_ID: Template ID for contact form (e.g. 'template_contact')
  // - EMAILJS_NEWSLETTER_TEMPLATE_ID: Template ID for newsletter subscriptions (e.g. 'template_newsletter')
  // - EMAILJS_PARTNERSHIP_TEMPLATE_ID: Template ID for partnership inquiries (e.g. 'template_partnership')
  EMAILJS_USER_ID: '',
  EMAILJS_SERVICE_ID: '',
  EMAILJS_CONTACT_TEMPLATE_ID: '',
  EMAILJS_NEWSLETTER_TEMPLATE_ID: '',
  EMAILJS_PARTNERSHIP_TEMPLATE_ID: '',

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

### Form Handling on GitHub Pages

1. **EmailJS Integration**: When `EMAILJS_USER_ID` and service/template IDs are provided, form submissions are sent asynchronously via EmailJS without requiring a backend server.
2. **Mailto Fallback**: If EmailJS is not configured or fails, forms automatically fall back to opening the visitor's default email client (`mailto:fbrocbo@gmail.com`) pre-filled with the inquiry subject, name, organization, and message.
3. **Bot Spam Protection**: Forms feature an invisible honeypot (`bot-field`). If filled by a bot, submission is silently ignored.

---

## GitHub Pages & Custom Domain Deployment

This repository is designed for zero-build deployment on **GitHub Pages**.

### Custom Domain Setup (`fbrocbo.com`)

1. **CNAME File**: The root `CNAME` file contains `fbrocbo.com`.
2. **DNS Records** (at domain registrar or DNS manager):
   - **Apex / Root Domain (`fbrocbo.com`)**: Create 4 `A` records pointing to GitHub Pages IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **Subdomain (`www.fbrocbo.com`)**: Create a `CNAME` record pointing to:
     ```
     emmanuellokudu.github.io
     ```
3. **Repository Settings**:
   - In GitHub repository: `Settings` &rarr; `Pages`.
   - Source: Deploy from branch `main` / `(root)`.
   - Custom domain: `fbrocbo.com`.
   - Check **Enforce HTTPS** once DNS propagation completes and the TLS certificate is issued.

---

## Local SEO & Keyword Optimization

The site is targeted for local search queries originating from and relating to **Kakuma Refugee Camp, Kalobeyei Integrated Settlement, Turkana County, and Kenya**:

- **Target Keywords**: refugee, refugees, refugee-led, CBO, community-based organization, humanitarian, peacebuilding, livelihoods, youth empowerment, Kakuma, Kalobeyei, Turkana, Kenya, Kakuma Refugee Camp, Kalobeyei Settlement, Turkana County.
- **Canonical URLs**: Every page contains a `<link rel="canonical" href="https://fbrocbo.com/...">` pointing to the live production URL.
- **Social Sharing**: Open Graph (`og:*`) and Twitter Card (`twitter:*`) tags are configured with absolute production URLs (`https://fbrocbo.com/assets/img/community-group-1600.webp`).
- **Structured Data (JSON-LD)**:
  - `NGO` schema with official name, address, contact points, service areas, and knowledge domains.
  - `BreadcrumbList` schema with fully qualified canonical URLs.
  - `FAQPage` schema on homepage and Get Involved page for Google Rich Results.
- **Discovery**: `robots.txt` and `sitemap.xml` are located in the web root.

---

## Local Font Vendoring

Fonts are 100% self-hosted to comply with zero-CDN constraints and ensure fast loading on low-bandwidth mobile connections. If fonts ever need re-fetching:

```bash
node scripts/vendor-fonts.js
```

## Previewing Locally

Run a lightweight static HTTP server from the root directory:

```bash
# Using Node
node scripts/serve.js

# Or using Python
python -m http.server 8000
```
