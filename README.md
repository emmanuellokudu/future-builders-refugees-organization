# Future Builders Refugee Organization (FBRO) Website

Static, high-performance, accessible website for Future Builders Refugee Organization (FBRO) in Kakuma Refugee Camp & Kalobeyei Settlement, Turkana County, Kenya.

Live Production URL: **[https://futurebuildersrefugeeorganization.com/](https://futurebuildersrefugeeorganization.com/)**

## Pages Overview

- `index.html` (Homepage with hero, program highlights, field photo mosaic, and summary FAQ)
- `about.html` (Background, vision, mission, objectives, leadership team, and community approach)
- `programs.html` (Comprehensive view of all seven core program areas)
- `gallery.html` (Categorized activity photo gallery with accessible modal lightbox)
- `get-involved.html` (Partnership inquiry form, volunteer details, and comprehensive FAQ accordion)
- `contact.html` (Direct leadership contacts, location details, and message form)
- `privacy.html` (Review-ready privacy policy covering Web3Forms, Brevo, and data protection)
- `404.html` (Custom error page with popular navigation links)

## Shared Assets

- `styles.css` (Unified design system tokens, WCAG 2.2 AA compliant light & dark mode)
- `script.js` (Modular vanilla JavaScript under 26 KB unminified, zero tracking cookies)
- `assets/fonts/` (Self-hosted WOFF2 font files for Bricolage Grotesque and Source Serif 4)
- `assets/img/` (Responsive WebP photography, 800px and 1600px variants)
- `CNAME` (Configured for custom domain `futurebuildersrefugeeorganization.com`)
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

  // Web3Forms configuration (contact & partnership forms)
  WEB3FORMS_ACCESS_KEY: 'c8421d87-d76a-496c-bf3e-a60385e70881',
  WEB3FORMS_ENDPOINT: 'https://api.web3forms.com/submit',

  // Brevo configuration (newsletter subscriptions)
  BREVO_NEWSLETTER_URL: 'https://0a3fdcfa.sibforms.com/serve/MUIFADJVhckhQbR-QhxlJzhPzoXlGx81-AMSRfgj150SUtSuEMrK_KiYrdAVD7kLg2jTCYRG9aHBFPE_6f287QOmQyUghdHbNpCuAYhSRdUjTk2qll05TWyxtHNVDfRmnu-3SZuMj9RUWPLpdmYgVV_5LCoPMbLX5HccKY0xRifn4b1V2Is4_Wb7yuar0QaSbATM8QxZ-ztwPkNmlA==',

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

### Form & Newsletter Integrations

1. **Web3Forms Integration (Contact & Partnership Forms)**:
   - Powered by [Web3Forms](https://web3forms.com/) via client-side Fetch API.
   - Dispatches submissions asynchronously to the official organizational inboxes (`futurebuildersrefugeeorganizat@gmail.com`).
   - Includes anti-spam honeypot detection (`bot-field` / `botcheck`), field trimming, email format validation, and campaign attribution (`utm_*` parameters).
   - Dynamic button loading states prevent duplicate submissions (`disabled` attribute and `aria-busy="true"`).
   - On confirmed success, form inputs are cleanly reset and a polite status confirmation is announced.
   - On failure, user inputs are strictly preserved and an accessible alert directs the user to retry or email directly.

2. **Brevo Newsletter Subscription**:
   - Manages subscriber lists through [Brevo](https://www.brevo.com/) via the official hosted subscription form.
   - Validates the visitor's email on the site and safely directs them to the official Brevo form in a new tab to complete double opt-in confirmation.
   - Provides clear in-page feedback and a fallback direct link without misleading claims of premature subscription success.

3. **Security & Credentials**:
   - Only public client keys belong in `script.js`.
   - **Never commit private API secrets or SMTP credentials.**
   - All forms include bot honeypot protection to reject automated spam.

---

## Leadership & Contact Directory

- **Organization Primary Email**: `futurebuildersrefugeeorganizat@gmail.com`
- **Location**: Kakuma Refugee Camp &amp; Kalobeyei Integrated Settlement, Turkana West Sub-County, Turkana County, Kenya
- **Executive Director**: Prosper Undji Etongano &mdash; `+254 718 390 124` | `Prosperun@gmail.com`
- **Operations Manager**: Elisha Itongelo &mdash; `+254 703 957 274` | `elishaitongelo8@gmail.com`
- **Administrator**: Issa Mkumu Atanga &mdash; `+254 713 909 469` | `issamkumu19@gmail.com`

---

## GitHub Pages & Custom Domain Deployment

This repository is designed for zero-build deployment on **GitHub Pages**.

### Custom Domain Setup (`futurebuildersrefugeeorganization.com`)

1. **CNAME File**: The root `CNAME` file contains `futurebuildersrefugeeorganization.com`.
2. **DNS Records** (at your domain registrar or DNS manager):
   - **Apex / Root Domain (`futurebuildersrefugeeorganization.com`)**: Create 4 `A` records pointing to GitHub Pages IP addresses:
     ```text
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **Subdomain (`www.futurebuildersrefugeeorganization.com`)**: Create a `CNAME` record pointing to:
     ```text
     emmanuellokudu.github.io
     ```
3. **Repository Settings**:
   - In GitHub repository: `Settings` &rarr; `Pages`.
   - Source: Deploy from branch `main` / `(root)`.
   - Custom domain: `futurebuildersrefugeeorganization.com`.
   - Check **Enforce HTTPS** once DNS propagation completes and the TLS certificate is issued.

---

## Local Development, Testing & Quality Assurance

### Local Preview
Run a static HTTP server from the root directory:

```bash
# Using npm
npm start

# Or directly with Node
node scripts/serve.js

# Or using Python
python -m http.server 8000
```
Visit `http://127.0.0.1:8080/`.

### Automated Smoke Tests & Link Validation
Run the built-in smoke test before committing:

```bash
npm test
```
The test suite validates:
- CNAME, `robots.txt`, and `sitemap.xml` domain verification
- All 8 HTML files and critical structural anchors
- Form elements, honeypots, and accessible labels
- Resolution of all 250+ internal image and page links (0 broken links)
- JavaScript syntax and form fallback behaviors

### Image Optimization (`scripts/optimize-images.js`)
To re-encode WebP images in `assets/img/` with a custom quality target (70–80):

```bash
# 1. Install optional devDependency
npm install -D sharp

# 2. Run image optimization (target quality 75)
npm run optimize-images

# Or specify custom quality
node scripts/optimize-images.js --quality=80
```
This utility is non-destructive, never renames files, and only overwrites if the optimized buffer is smaller than the original.

---

## Local SEO & Keyword Optimization

The site is targeted for local search queries originating from and relating to **Kakuma Refugee Camp, Kalobeyei Integrated Settlement, Turkana County, and Kenya**:

- **Target Keywords**: refugee, refugees, refugee-led organization, RLO, CBO, community-based organization, NGO, humanitarian, peacebuilding, livelihoods, youth empowerment, vocational training, tree planting, environmental conservation, Kakuma, Kalobeyei, Turkana County, Kenya.
- **Canonical URLs**: Every page contains a `<link rel="canonical" href="https://futurebuildersrefugeeorganization.com/...">` pointing to the live production URL.
- **Social Sharing**: Open Graph (`og:*`) and Twitter Card (`twitter:*`) tags are configured with absolute production URLs (`https://futurebuildersrefugeeorganization.com/assets/img/community-group-1600.webp`).
- **Structured Data (JSON-LD)**:
  - `["NGO", "NonprofitOrganization"]` schema with official name, address, contact points, member leadership directory, service areas, and knowledge domains.
  - `BreadcrumbList` schema with fully qualified canonical URLs.
  - `FAQPage` schema on homepage and Get Involved page for Google Rich Results.
- **Discovery**: `robots.txt` and `sitemap.xml` are located in the web root.

---

## Local Font Vendoring

Fonts are 100% self-hosted to comply with zero-CDN constraints and ensure fast loading on low-bandwidth mobile connections. If fonts ever need re-fetching:

```bash
node scripts/vendor-fonts.js
```

