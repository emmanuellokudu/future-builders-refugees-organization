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
- `privacy.html` (Review-ready privacy policy covering EmailJS and data protection)
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

### EmailJS Setup & Form Configuration

By default, all EmailJS values in `CONFIG` are left blank, and the website operates with 100% functionality using the accessible `mailto:` fallback.

To enable direct email delivery via [EmailJS](https://www.emailjs.com/):

1. **Required Configuration Values** in `script.js`:
   - `EMAILJS_USER_ID`: Public Key / Account User ID (EmailJS Dashboard &rarr; Account &rarr; API Keys)
   - `EMAILJS_SERVICE_ID`: Service ID linked to your email provider (e.g. `service_gmail`)
   - `EMAILJS_CONTACT_TEMPLATE_ID`: Template ID for general contact inquiries
   - `EMAILJS_NEWSLETTER_TEMPLATE_ID`: Template ID for newsletter subscriptions
   - `EMAILJS_PARTNERSHIP_TEMPLATE_ID`: Template ID for partnership proposals

2. **Security & Credentials**:
   - Only public client keys belong in `script.js`.
   - **Never commit private API keys or personal access tokens.**
   - All forms include an invisible bot honeypot (`bot-field`) to reject automated spam.

3. **Local Testing & Graceful Fallback**:
   - If EmailJS keys are blank or if the network request fails, forms automatically fall back to opening the visitor's default email client (`mailto:futurebuildersrefugeeorganizat@gmail.com`) with pre-filled subject and body.
   - **URL Length Protection**: If an inquiry exceeds 1,900 characters, the script prevents browser mailto failures and displays a clear message directing the user to email directly.

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

