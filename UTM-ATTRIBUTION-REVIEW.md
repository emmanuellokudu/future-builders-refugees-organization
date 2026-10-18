# FBRO UTM Attribution Review & Resolution Report

**Date**: 2026-10-17  
**Project**: Future Builders Refugee Organization (FBRO) Website  
**Focus Areas**: Brevo Newsletter Attribution, WhatsApp Attribution, and Attribution Consistency  
**Related Documents**: [`UTM-GUIDE.md`](UTM-GUIDE.md), [`UTM-AUDIT-REPORT.md`](UTM-AUDIT-REPORT.md)  
**Primary Source File**: [`script.js`](script.js)  

---

## 1. Executive Summary

This report addresses the three architectural and operational attribution challenges identified during the UTM audit:

1. **Brevo Newsletter Attribution**: Clarifies provider limitations regarding hosted forms (`sibforms.com`), details why frontend-only Brevo API calls are prohibited for security, and outlines the safest immediate static fallback versus a future serverless endpoint.
2. **WhatsApp Attribution**: Explains why `wa.me` URL query parameters produce zero attribution value on WhatsApp, and defines an in-message text reference (`[Ref: Web / <campaign>]`) that gives staff immediate, actionable attribution without compromising visitor privacy.
3. **Attribution Consistency**: Replaces parameter overwriting and unstable merging with a strict **Session First-Touch Attribution Policy**, ensuring that the referring partner or event flyer that introduced a visitor retains credit throughout their session.

---

## 2. Area 1: Brevo Newsletter Attribution

### Current Behavior
- A visitor enters their email address into the footer newsletter form and clicks **Subscribe**.
- The client script validates the email format.
- It opens the hosted Brevo subscription form (`https://0a3fdcfa.sibforms.com/serve/...`) in a new browser window.
- The destination URL is static: it contains **no** query parameters, **no** UTM tags, and **no** email prefill.
- The visitor must manually re-type their email address on the Brevo hosted page and complete the double opt-in confirmation there.

### Technical Limitations
1. **Hosted Form Architecture**: Brevo's hosted form (`sibforms.com/serve/...`) is generated via the Brevo Form Builder and served by Brevo's own client bundle (`main.js`). Inspection of `main.js` confirms that it only renders form inputs configured in the dashboard (currently `EMAIL`, locale, and honeypot). It does **not** read `window.location.search` or automatically ingest URL query parameters into subscriber contact attributes.
2. **Security Constraint (No Frontend API Keys)**: Saving custom contact attributes (such as `UTM_SOURCE` or `UTM_CAMPAIGN`) into Brevo's database requires calling the Brevo REST API (`POST /v3/contacts`). This endpoint requires an authenticated master API key (`xkeysib-...`). Because the FBRO website is hosted as a static site without a backend, placing this private API key into client-side JavaScript would expose full administrative access to FBRO's Brevo account, violating security standards.

### Recommended Solutions

| Tier | Approach | How It Works | Trade-offs |
|---|---|---|---|
| **Tier 1: Static Architecture (Recommended Now)** | Forward parameters on outbound link & align documentation | Append `?EMAIL=` and active `?utm_*` parameters to the outgoing Brevo URL. Update [`UTM-GUIDE.md`](UTM-GUIDE.md) to document that hosted Brevo forms are an external opt-in service and do not populate contact attributes. | Requires zero backend infrastructure; preserves referral context in browser navigation and access logs; 100% secure. |
| **Tier 2: Serverless Backend (Future Enhancement)** | Vercel Serverless Function proxy (`/api/newsletter`) | Form submits asynchronously via `fetch('/api/newsletter')`. A serverless function holds the secret `BREVO_API_KEY` in environment variables and calls `POST https://api.brevo.com/v3/contacts` with attributes, triggering the double opt-in template. | Requires Vercel Serverless Functions and configuring Brevo custom contact attributes (`UTM_SOURCE`, `UTM_CAMPAIGN`). |

### Code Changes Required
- **Tier 1 (Immediate)**: Yes. A small update in `initForms()` in [`script.js`](script.js) to construct a `URL` object and append parameters before calling `window.open()`, plus updating [`UTM-GUIDE.md`](UTM-GUIDE.md).
- **Tier 2**: Requires new backend file `api/newsletter.js` and Vercel environment configuration.

### Verification Plan
1. Submit the newsletter form with a valid email.
2. Confirm the opened URL contains the cleanly encoded query parameters (e.g. `...serve/MUIFA...?EMAIL=test%40example.com&utm_source=...`).
3. Verify the Brevo hosted page loads with HTTP 200 without syntax errors.
4. Verify that no private API keys or tokens exist in source code or network payloads.

---

## 3. Area 2: WhatsApp Attribution (`wa.me` Links)

### Current Behavior
In [`script.js:305-325`](script.js#L305-L325), `initWhatsAppLink()` appends UTM query parameters to all `wa.me` anchors:
```text
https://wa.me/254703957274?text=Hello%20FBRO...&utm_source=website&utm_medium=whatsapp-button&utm_campaign=site-chat
```

### Technical Limitations
1. **WhatsApp Ignores UTM Parameters**: The WhatsApp protocol and mobile applications only read a single query parameter: `text`. All other query parameters (`utm_source`, `utm_medium`, `utm_campaign`) are completely discarded by WhatsApp.
2. **Zero Analytics on Standard WhatsApp**: Standard organizational WhatsApp numbers do not connect to Google Analytics. When a visitor sends a WhatsApp message, the FBRO team sees **only the transmitted message text**. The URL query parameters are completely invisible to staff.

### Recommended Solution
Embed a short, non-invasive campaign attribution code directly within the prefilled WhatsApp message text:

- **Baseline Site Chat**:
  > *"Hello FBRO, I would like to learn more about your community programs in Kakuma. [Ref: Website]"*
- **Active Campaign Referral**:
  > *"Hello FBRO, I would like to learn more about your community programs in Kakuma. [Ref: Web / refugee-led-partnerships]"*

**Key Benefits**:
- Immediate, human-readable attribution visible directly in the WhatsApp chat window for staff.
- Zero visitor profiling: contains no personal data (no email, IP, or tracking cookies).
- Removes redundant query parameters from `wa.me` links, reducing link length and clutter.

### Code Changes Required
Yes. Update `initWhatsAppLink()` in [`script.js`](script.js) to:
1. Retrieve the active campaign name from `sessionStorage` (if present).
2. Append `[Ref: Website]` or `[Ref: Web / <campaign>]` to the prefilled message text.
3. Remove `url.searchParams.set('utm_*')` calls from the `wa.me` handler.

### Verification Plan
1. Click the floating WhatsApp button without campaign parameters:
   - Verify the prefilled message contains `[Ref: Website]`.
2. Load `index.html?utm_campaign=annual-fundraiser` and click the WhatsApp button:
   - Verify the prefilled message contains `[Ref: Web / annual-fundraiser]`.
3. Verify phone display formatting and `target="_blank"` / `rel="noopener noreferrer"` remain functional.

---

## 4. Area 3: Attribution Consistency (Policy Selection)

### Current Behavior
In [`script.js:61`](script.js#L61):
```javascript
if (hasUtm) {
  sessionStorage.setItem('fbro_utm', JSON.stringify(captured));
}
```
If a visitor enters through an official partner campaign (`?utm_source=unhcr-kakuma&utm_campaign=refugee-led-partnerships`) and subsequently clicks an internal link or secondary campaign link with only `?utm_content=footer`, `captured` only contains `{ utm_content: 'footer' }` and **completely overwrites** the stored object. The referring partner and campaign are permanently erased.

### Policy Comparison

| Evaluation Criterion | First-Touch Attribution (Recommended) | Last-Touch Attribution |
|---|---|---|
| **Core Rule** | The first campaign that referred the visitor retains 100% credit for the entire session. Subsequent inbound UTMs are ignored until the session ends. | The most recent campaign link overwrites the stored parameters as an atomic unit (all keys replaced together). |
| **Organizational Alignment** | **Optimal for Non-Profits/NGOs**: Accurately credits referring humanitarian partners, donors, and physical flyers that initiated the visit. | Better suited for commercial e-commerce tracking multi-stage paid retargeting ads. |
| **Data Integrity Risk** | Zero risk of parameter blending or attribution contamination. | Overwrites original partner referrals if a visitor clicks an incidental social link during the same session. |

### Recommended Solution: Session First-Touch Policy
Adopt a strict **Session First-Touch Policy**:
- When a visitor arrives via an inbound campaign, write the parameters to `sessionStorage` **only if no prior attribution exists for the session**:
  ```javascript
  if (hasUtm) {
    var existing = sessionStorage.getItem('fbro_utm');
    if (!existing) {
      sessionStorage.setItem('fbro_utm', JSON.stringify(captured));
    }
  }
  ```
- All contact and partnership forms submitted during that browser session will consistently report the original campaign referrer to Web3Forms.

### Code Changes Required
Yes. Add a single defensive check (`!sessionStorage.getItem('fbro_utm')`) in `initUtmCapture()` in [`script.js`](script.js).

### Verification Plan
1. Open the site with `?utm_source=unhcr-kakuma&utm_campaign=refugee-led`.
2. Verify `sessionStorage.getItem('fbro_utm')` contains `unhcr-kakuma`.
3. Navigate within the same tab to `contact.html?utm_source=facebook&utm_campaign=sports`.
4. Inspect `sessionStorage.getItem('fbro_utm')`: verify it remains `unhcr-kakuma`.
5. Submit the contact form and confirm Web3Forms payload contains `utm_source: "unhcr-kakuma"`.

---

## 5. Implementation Summary Table

| Focus Area | File(s) to Update | Nature of Change | Design / CSS Impact | Privacy Impact |
|---|---|---|---|---|
| **Brevo Newsletter** | [`script.js`](script.js), [`UTM-GUIDE.md`](UTM-GUIDE.md) | Forward parameters on outbound link; clarify hosted form scope in docs | None (0% visual change) | Zero tracking cookies; zero credential exposure |
| **WhatsApp Links** | [`script.js`](script.js), [`UTM-GUIDE.md`](UTM-GUIDE.md) | Embed `[Ref: ...]` in prefilled text; clean URL query string | None (0% visual change) | Zero personal data exposed |
| **Attribution Policy** | [`script.js`](script.js), [`UTM-GUIDE.md`](UTM-GUIDE.md) | Implement Session First-Touch guard | None (0% visual change) | Strict session-only storage (`sessionStorage`) |
