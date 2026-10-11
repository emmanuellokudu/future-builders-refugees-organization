# Deferred Tasks (Pending Live Domain Setup)

The following items are deliberately deferred until FBRO secures a production domain name and deploys to a live URL. They should be implemented in a single pass once the domain (e.g., `https://fbro.org`) is finalized.

---

## 1. Domain-Dependent Meta Tags
- [ ] **Canonical URL Tags**: `<link rel="canonical" href="https://<DOMAIN>/<page>.html">` on each page.
- [ ] **Open Graph URL**: `<meta property="og:url" content="https://<DOMAIN>/<page>.html">`
- [ ] **Open Graph Image**:
  - Produce a 1200x630 px social share image (`assets/img/og-share.jpg`) featuring FBRO community work.
  - Add `<meta property="og:image" content="https://<DOMAIN>/assets/img/og-share.jpg">`.
  - Add `<meta property="og:image:width" content="1200">` and `<meta property="og:image:height" content="630">`.
- [ ] **Twitter Card Tags**:
  - `<meta name="twitter:card" content="summary_large_image">`.
  - `<meta name="twitter:image" content="https://<DOMAIN>/assets/img/og-share.jpg">`.

---

## 2. Search Engine & Discovery Files
- [ ] **Sitemap (`sitemap.xml`)**:
  - Generate a full XML sitemap containing all pages with `<lastmod>` timestamps and `https://<DOMAIN>` absolute URLs.
- [ ] **Robots.txt Directive**:
  - Add the sitemap location directive to `robots.txt`:
    ```
    Sitemap: https://<DOMAIN>/sitemap.xml
    ```

---

## 3. Structured Data (JSON-LD) Domain Fields
- [ ] **Organization / NGO Schema**:
  - Add `"url": "https://<DOMAIN>/"` to the root `NGO` object in JSON-LD.
  - Add `"sameAs"` array pointing to verified official social channels:
    ```json
    "sameAs": [
      "https://facebook.com/<fbro-page>",
      "https://linkedin.com/company/<fbro-page>",
      "https://twitter.com/<fbro-handle>"
    ]
    ```
- [ ] **BreadcrumbList Schema**:
  - Convert breadcrumb item `id` attributes to fully-qualified live domain URLs.

---

## 4. Analytics & Event Tracking (Subject to Future Organization Consent)
- [ ] **Privacy-Preserving Analytics**:
  - If FBRO leadership chooses to monitor traffic volume in the future, integrate a cookieless, GDPR-compliant solution (such as Plausible, Fathom, or Cloudflare Web Analytics).
  - Ensure zero tracking cookies are placed and no personally identifiable visitor data is collected.
