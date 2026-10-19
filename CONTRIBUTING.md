# Contributing to Future Builders Refugee Organization (FBRO) Website

Thank you for your interest in contributing to the **Future Builders Refugee Organization (FBRO)** website! This website is an open, zero-build static site designed to represent and support refugee communities in Kakuma Refugee Camp and Kalobeyei Integrated Settlement, Kenya.

---

## 1. Architecture Overview

The site uses a zero-build static architecture:
- **HTML5**: Semantic, accessible markup across all pages.
- **CSS3**: Vanilla CSS in [`styles.css`](styles.css) with CSS custom properties and light/dark theme support.
- **JavaScript**: Progressive vanilla JavaScript in [`script.js`](script.js).
- **Images**: Responsive, modern WebP formats in [`assets/img/`](assets/img/).
- **Fonts**: Self-hosted WOFF2 files in [`assets/fonts/`](assets/fonts/) (no CDN dependencies).

No build step or bundler (Webpack, Vite, etc.) is required to run or edit this site.

---

## 2. Local Setup & Preview

### Prerequisites
- Node.js (version 18 or newer recommended), or Python 3.

### Running Locally
You can preview the site using the built-in Node static server:

```bash
# Using npm
npm start

# Or directly with node
node scripts/serve.js
```

The site will be available at `http://127.0.0.1:8080/`.

Alternatively, with Python:
```bash
python -m http.server 8000
```

---

## 3. Branch Naming Conventions

Always create a new branch from `main` before starting work:

- Bug fixes: `fix/description` (e.g., `fix/forms-ci-and-accessibility`, `fix/navbar-contrast`)
- Features/Enhancements: `feat/feature-name` (e.g., `feat/gallery-filter`, `feat/impact-stats`)
- Documentation: `docs/topic` (e.g., `docs/emailjs-setup`, `docs/contributing`)
- Performance/Hygiene: `perf/asset-optimization` or `chore/ci-workflow`

---

## 4. Commit Message Style

We adhere to clear, conventional commit messages:

- `fix: correct handleSuccess feedback container reference in script.js`
- `feat: add leadership profile cards for administration team`
- `docs: document custom domain DNS records and EmailJS fallback`
- `ci: add static site checks and link validation workflow`
- `style: refine form-feedback alert contrast in light theme`

Keep messages concise, imperative ("add", "fix", "update"), and descriptive.

---

## 5. Form Testing (Web3Forms & Brevo)

The website includes three interactive forms:
1. **General Contact Form** on [`contact.html`](contact.html) (Web3Forms)
2. **Partnership Proposal Form** on [`get-involved.html`](get-involved.html) (Web3Forms)
3. **Newsletter Subscription Form** in page footers (Brevo)

### Testing Forms
- Web3Forms handles contact and partnership submissions directly in client-side code via Fetch API with public access key.
- Brevo manages newsletter subscriptions via its official hosted opt-in subscription form.
- **Honeypot protection**: Ensure the invisible `input[name="bot-field"]` prevents submission if filled.
- **Input preservation**: If network submission fails, user input is preserved in the form fields.
- **DO NOT commit private API secrets or SMTP credentials to git.**

---

## 6. Automated Smoke Testing & CI

Before submitting a pull request, run the local smoke test suite:

```bash
# Run automated static site checks
npm test
```

This script validates:
- CNAME, `robots.txt`, and `sitemap.xml` domain verification
- All 8 HTML files and critical structural anchors
- Form elements, honeypots, and accessible labels
- Resolution of all 250+ internal image and page links
- JavaScript syntax and form fallback behaviors

---

## 7. Submitting a Pull Request

1. Push your branch to GitHub.
2. Open a Pull Request targeting `main`.
3. Fill out all sections of the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
4. Verify that the GitHub Actions `Static Site Checks & Quality Assurance` workflow passes cleanly.
