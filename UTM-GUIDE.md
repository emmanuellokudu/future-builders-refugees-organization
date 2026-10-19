# FBRO UTM Parameter Guide

This guide establishes the inbound campaign tracking and communication attribution conventions for Future Builders Refugee Organization (FBRO).

---

## 1. Principles & Hard Constraints

- **Zero Privacy Invasiveness**: FBRO uses NO analytics trackers, behavioral cookies, or third-party profiling scripts.
- **Session First-Touch Attribution**: Inbound UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) are captured upon initial landing and stored exclusively in the visitor's local `sessionStorage` (wrapped in `try ... catch`). Once captured, the original referring partner or campaign is preserved for the entire duration of the browser session and will not be overwritten by subsequent parameter navigation.
- **Form Submissions Attribution (Web3Forms)**: When a visitor submits a contact inquiry ([`contact.html`](contact.html)) or a partnership proposal ([`get-involved.html`](get-involved.html)), stored UTM parameters are automatically attached as hidden fields and included in the Web3Forms notification email delivered directly to `futurebuildersrefugeeorganizat@gmail.com`.
- **Newsletter Attribution Limitation (Brevo)**: Newsletter subscriptions are processed via Brevo's official hosted double-opt-in subscription page. Because Brevo's hosted form (`sibforms.com/serve/...`) operates on an external standalone domain and does not ingest URL query parameters into subscriber contact attributes, newsletter campaign attribution is currently unsupported on the hosted form without a dedicated backend serverless proxy. The site does not append unused query parameters or visitor email addresses to the Brevo hosted URL.
- **Strict Link Scope**: Never attach UTM query parameters to internal site links, `mailto:` links, `tel:` links, or `wa.me` links.

---

## 2. Naming Conventions

All UTM parameter values must adhere strictly to these rules:
1. **Lowercase only**: Always use lowercase letters (`newsletter`, not `Newsletter`).
2. **Hyphenated words**: Use hyphens (`-`) instead of underscores, pluses, or spaces (`refugee-week`, not `refugee_week`).
3. **Concise and Descriptive**: Keep terms short, predictable, and clean.

### Core Parameters
- `utm_source`: The referring platform, partner, or publisher (e.g., `whatsapp`, `partner-unhcr`, `linkedin`, `email-digest`).
- `utm_medium`: The marketing medium or channel type (e.g., `whatsapp-button`, `social-post`, `partner-referral`, `email-link`, `event-qr`).
- `utm_campaign`: The specific campaign, program, or initiative (e.g., `refugee-led-partnerships`, `annual-fundraiser`, `kakuma-cleanups`, `youth-football-cup`).
- `utm_term` *(optional)*: Identifies search terms or specific focus themes (e.g., `peacebuilding`, `poultry-farming`).
- `utm_content` *(optional)*: Differentiates variants or links (e.g., `hero-button`, `footer-link`, `sidebar-banner`).

---

## 3. WhatsApp Campaign Attribution

WhatsApp mobile applications and WhatsApp Web strip and discard all URL query parameters (`utm_source`, `utm_medium`, etc.) from `wa.me` links. To provide actionable attribution without invading visitor privacy, the FBRO website attaches a human-readable campaign tag directly within the prefilled chat message text.

### Reference Tag Format
- **Baseline (No active campaign stored)**:
  > `"Hello Future Builders Refugee Organization (FBRO), I would like to learn more about your community programs in Kakuma. [Ref: Website]"`
- **Active Campaign Referral (When a valid `utm_campaign` exists)**:
  > `"Hello Future Builders Refugee Organization (FBRO), I would like to learn more about your community programs in Kakuma. [Ref: Web / refugee-led-partnerships]"`

### How Staff Identify Campaign References
When an inquiry arrives on the official FBRO WhatsApp (`+254 703 957 274`):
1. FBRO leadership can immediately read the `[Ref: ...]` tag at the end of the message greeting.
2. If `[Ref: Website]` appears, the visitor originated from general browsing on the website.
3. If `[Ref: Web / <campaign>]` appears, the visitor originally entered the website via that specific partner referral, social post, or event QR code.
4. The tag contains no personal data (no email, IP, or tracking identifiers).

---

## 4. Five Canonical Campaign Link Examples (with `<site-url>` Placeholder)

Here are five canonical examples demonstrating inbound partner referrals, event materials, and outreach links:

### Example 1: Inbound WhatsApp Share CTA Link (Distributed in Community Chats)
```text
<site-url>/index.html?utm_source=whatsapp&utm_medium=social-post&utm_campaign=community-updates
```
*Purpose:* Shared in community WhatsApp groups directing readers to the FBRO homepage.

### Example 2: Partner Organization Referral (e.g. UNHCR Kakuma newsletter)
```text
<site-url>/get-involved.html?utm_source=unhcr-kakuma&utm_medium=partner-referral&utm_campaign=refugee-led-partnerships
```
*Purpose:* Distributed to humanitarian partners directing prospective collaborators to the partnership proposal form.

### Example 3: Social Media Awareness Campaign (LinkedIn announcement)
```text
<site-url>/programs.html?utm_source=linkedin&utm_medium=social-post&utm_campaign=livelihoods-launch
```
*Purpose:* Used on professional networks when announcing poultry farming and vocational training programs.

### Example 4: Field Event QR Code (Kakuma Youth Sports Day flyer)
```text
<site-url>/about.html?utm_source=sports-flyer&utm_medium=event-qr&utm_campaign=peacebuilding-tournament
```
*Purpose:* Printed on event programs, flyers, and banners in Kakuma for mobile phone scanners.

### Example 5: Quarterly Community Email Digest
```text
<site-url>/gallery.html?utm_source=email-digest&utm_medium=email-link&utm_campaign=q1-community-cleanups&utm_content=photo-gallery
```
*Purpose:* Used in direct partner updates linking to recent community action photos.
