# FBRO UTM Parameter Guide

This guide establishes the inbound campaign tracking and outbound link tagging conventions for Future Builders Refugee Organization (FBRO).

---

## 1. Principles & Hard Constraints
- **Zero Privacy Invasiveness**: FBRO uses NO analytics trackers, behavioral cookies, or third-party profiling scripts.
- **Form Origin Preservation**: Inbound UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) are stored exclusively in the visitor's local `sessionStorage` (wrapped in try/catch).
- **Submissions Attribution**: When a visitor submits a contact or partnership inquiry or signs up for the newsletter, stored UTM parameters are automatically attached as hidden fields so staff know which partner channel or campaign referred them.
- **Strict Scope**: Never attach UTM parameters to internal site links, `mailto:` links, or `tel:` links.

---

## 2. Naming Conventions
All UTM parameter values must adhere strictly to these rules:
1. **Lowercase only**: Always use lowercase letters (`newsletter`, not `Newsletter`).
2. **Hyphenated words**: Use hyphens (`-`) instead of underscores, pluses, or spaces (`refugee-week`, not `refugee_week`).
3. **Concise and Descriptive**: Keep terms short, predictable, and clean.

### Core Parameters
- `utm_source`: The referring platform, partner, or publisher (e.g., `whatsapp`, `partner-unhcr`, `linkedin`, `email-digest`).
- `utm_medium`: The marketing medium or channel type (e.g., `whatsapp-button`, `social-post`, `partner-referral`, `email-link`, `event-qr`).
- `utm_campaign`: The specific campaign, program, or initiative (e.g., `site-chat`, `annual-fundraiser`, `kakuma-cleanups`, `youth-football-cup`).
- `utm_content` *(optional)*: Differentiates variants or links (e.g., `hero-button`, `footer-link`, `sidebar-banner`).

---

## 3. Five Example Campaign Links (with `<site-url>` Placeholder)

Here are five canonical examples demonstrating outbound links, partner referrals, and campaign links:

### Example 1: WhatsApp Contact CTA
```
https://wa.me/254703957274?text=Hello%20FBRO%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20programs&utm_source=website&utm_medium=whatsapp-button&utm_campaign=site-chat
```
*Purpose:* Applied directly to the floating WhatsApp CTA button so WhatsApp chats identify inquiries originating from the website.

### Example 2: Partner Organization Referral (e.g. UNHCR Kakuma newsletter)
```
<site-url>/get-involved.html?utm_source=unhcr-kakuma&utm_medium=partner-referral&utm_campaign=refugee-led-partnerships
```
*Purpose:* Distributed to humanitarian partners directing prospective donors and collaborators to the Get Involved form.

### Example 3: Social Media Awareness Campaign (LinkedIn announcement)
```
<site-url>/programs.html?utm_source=linkedin&utm_medium=social-post&utm_campaign=livelihoods-launch
```
*Purpose:* Used on professional networks when announcing the poultry and farming programs.

### Example 4: Field Event QR Code (Kakuma Youth Sports Day flyer)
```
<site-url>/about.html?utm_source=sports-flyer&utm_medium=event-qr&utm_campaign=peacebuilding-tournament
```
*Purpose:* Printed on event programs and banners in Kakuma for mobile phone scanners.

### Example 5: Quarterly Community Email Digest
```
<site-url>/gallery.html?utm_source=email-digest&utm_medium=email-link&utm_campaign=q1-community-cleanups&utm_content=photo-gallery
```
*Purpose:* Used in direct partner updates linking to recent community action photos.
