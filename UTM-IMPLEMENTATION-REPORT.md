# FBRO UTM Attribution Implementation Report

**Date**: 2026-10-17  
**Project**: Future Builders Refugee Organization (FBRO) Website  
**Branch**: `fix/forms-ci-and-accessibility`  
**Reference Specifications**: [`UTM-GUIDE.md`](UTM-GUIDE.md), [`UTM-ATTRIBUTION-REVIEW.md`](UTM-ATTRIBUTION-REVIEW.md)  
**Primary Source Files**: [`script.js`](script.js), [`UTM-GUIDE.md`](UTM-GUIDE.md)  

---

## 1. Executive Summary

All approved FBRO UTM attribution improvements have been implemented, tested, and verified. 

The website now operates with:
1. **Session First-Touch Attribution**: Captures the initial referring partner or campaign on arrival and protects it from being overwritten or blended during the active session.
2. **WhatsApp In-Message Attribution**: Removes useless URL query parameters from `wa.me` links and replaces them with an explicit, human-readable tag (`[Ref: Website]` or `[Ref: Web / <campaign>]`) inside the prefilled message text.
3. **Preserved Brevo Flow**: Maintains the clean, hosted Brevo double-opt-in subscription flow without appending unused query parameters or visitor email addresses.
4. **Complete Documentation**: Fully updates [`UTM-GUIDE.md`](UTM-GUIDE.md) to define the first-touch policy, explain staff identification of WhatsApp tags, and document hosted form boundaries.
5. **100% Verification**: All 104 smoke tests and all targeted attribution tests pass cleanly with zero regressions.

---

## 2. Implementation Details

### A. Session First-Touch Attribution Policy
- **File**: [`script.js`](script.js) (lines 46–70, `initUtmCapture()`)
- **Implementation**:
  ```javascript
  var existingRaw = sessionStorage.getItem('fbro_utm');
  if (!existingRaw) {
    var params = new URLSearchParams(window.location.search);
    var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var captured = {};
    var hasUtm = false;

    utmKeys.forEach(function (key) {
      var val = params.get(key);
      if (val) {
        captured[key] = val.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        hasUtm = true;
      }
    });

    if (hasUtm) {
      sessionStorage.setItem('fbro_utm', JSON.stringify(captured));
    }
  }
  ```
- **Rationale**: For humanitarian non-profit outreach, crediting the partner organization, flyer, or community post that initially brought the visitor to FBRO is paramount. Guarding against re-writes ensures that internal site exploration or incidental secondary links never overwrite the original referrer.
- **Defensive Fallback**: In `appendUtmParams(form, payload)` ([`script.js`](script.js), lines 484–502), a direct fallback reads `sessionStorage['fbro_utm']` if hidden form inputs are missing, guaranteeing that contact and partnership Web3Forms submissions always carry the session's campaign attributes.

### B. WhatsApp In-Message Campaign Attribution
- **File**: [`script.js`](script.js) (lines 309–352, `initWhatsAppLink()`)
- **Implementation**:
  - URL query parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) are explicitly deleted from `wa.me` links via `url.searchParams.delete()`.
  - The script checks `sessionStorage['fbro_utm']`:
    - If `utm_campaign` is stored: appends `[Ref: Web / <campaign>]`
    - If no campaign is stored: appends `[Ref: Website]`
  - Prior to appending, existing `\[Ref:[^\]]*\]` tags are stripped to guarantee idempotency (preventing duplicate tags if the link initializer runs multiple times).
  - Preserves standard floating button styling, phone display formatting, and secure tab attributes (`target="_blank"`, `rel="noopener noreferrer"`).

### C. Hosted Brevo Subscription Flow
- **File**: [`script.js`](script.js) (lines 650–680, `initForms()`)
- **Implementation**:
  - The newsletter submission handler validates email syntax and opens `CONFIG.BREVO_NEWSLETTER_URL` directly as a static URL in a new window.
  - Does not append unused UTM parameters or visitor email addresses to the Brevo URL.
  - Transparent user feedback explains that the official subscription confirmation page is opening on Brevo.

### D. Documentation Alignment
- **File**: [`UTM-GUIDE.md`](UTM-GUIDE.md)
- **Updates**:
  - Codified the **Session First-Touch Attribution Policy**.
  - Added a dedicated **WhatsApp Campaign Attribution** section explaining the reference tag format and how staff can identify campaign origins in incoming WhatsApp chats.
  - Documented the architectural limitation of Brevo hosted forms and clarified that subscriber contact attribute persistence is currently unsupported without a serverless backend proxy.
  - Updated all canonical campaign link examples.

---

## 3. Modified Files Summary

| File | Status | Lines Changed | Primary Purpose |
|---|:---:|:---:|---|
| [`script.js`](script.js) | Modified | +39 / -12 | Session first-touch attribution guard, WhatsApp prefilled message reference tagging with deduplication, and defensive `sessionStorage` fallback in `appendUtmParams`. |
| [`UTM-GUIDE.md`](UTM-GUIDE.md) | Modified | +35 / -12 | Updated attribution policy, WhatsApp staff identification guide, Brevo hosted form boundary documentation, and canonical link examples. |

---

## 4. Verification & Testing Results

| Test Category | Suite / Command | Outcome | Details |
|---|---|:---:|---|
| **Syntax Verification** | `node vm.Script` | **PASS** | `script.js` compiles cleanly without syntax or lint issues. |
| **Static Smoke Tests** | `npm test` (`scripts/smoke-test.js`) | **PASS** | **104 passed, 0 failed**. All deployment files, meta tags, DOM structures, forms, honeypots, and internal links verified. |
| **First-Touch Preservation** | Custom automated suite | **PASS** | Subsequent visits with secondary campaign parameters in the same session are ignored; initial partner attribution is preserved intact. |
| **Web3Forms Submissions** | Custom automated suite | **PASS** | General contact and partnership proposal form payloads include the first-touch `utm_source`, `utm_medium`, and `utm_campaign`. |
| **WhatsApp Without Campaign** | Custom automated suite | **PASS** | `wa.me` query parameters removed; prefilled text ends with `[Ref: Website]`. |
| **WhatsApp With Campaign** | Custom automated suite | **PASS** | `wa.me` query parameters removed; prefilled text ends with `[Ref: Web / refugee-led-partnerships]`. |
| **Idempotency** | Custom automated suite | **PASS** | Repeated link initialization retains exactly one `[Ref: ...]` tag without duplication. |
| **Brevo Flow Stability** | Custom automated suite & HTTP check | **PASS** | Hosted Brevo URL opens cleanly without extraneous query parameters; returns HTTP 200. |

---

## 5. Operational Guide for FBRO Staff

### Identifying Inbound Form Submissions (Web3Forms)
When an inquiry arrives in `futurebuildersrefugeeorganizat@gmail.com`:
- The notification email will include fields for `utm_source`, `utm_medium`, and `utm_campaign`.
- Example:
  - `utm_source: unhcr-kakuma`
  - `utm_medium: partner-referral`
  - `utm_campaign: refugee-led-partnerships`

### Identifying WhatsApp Inquiries
When a chat arrives on the organizational phone (`+254 703 957 274`):
- Staff can check the end of the initial prefilled message greeting:
  - `... [Ref: Website]` &rarr; Visitor arrived via general website exploration.
  - `... [Ref: Web / <campaign>]` &rarr; Visitor entered the website through that specific campaign, partner post, or QR flyer.

---

## 6. Constraints & Privacy Compliance

- **Zero Trackers**: No third-party profiling scripts, Google Analytics / GTM, or Meta pixels are present.
- **Zero Cookies**: `document.cookie` is never set or read. Storage is restricted exclusively to `sessionStorage` (for active campaign parameters) and `localStorage` (for user dark/light theme preference).
- **Design Integrity**: Zero CSS changes, zero HTML layout changes, and zero font/color alterations were made.
- **Deployment Control**: Code changes are contained locally on branch `fix/forms-ci-and-accessibility`. Nothing has been pushed to GitHub or deployed.
