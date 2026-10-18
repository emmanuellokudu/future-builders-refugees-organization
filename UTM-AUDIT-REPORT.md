# FBRO UTM Parameter Guide & Implementation Audit Report

**Date**: 2026-10-17  
**Project**: Future Builders Refugee Organization (FBRO) Website  
**Reference Specification**: [`UTM-GUIDE.md`](UTM-GUIDE.md)  
**Primary Source File**: [`script.js`](script.js)  

---

## 1. Executive Summary & Verification Matrix

| # | Requirement | Status | Relevant File(s) | Relevant Function / Block |
|---|---|:---:|---|---|
| **1** | Inbound UTM parameters captured & stored exclusively in `sessionStorage` | **PASS** | [`script.js`](script.js) (lines 46–84) | `initUtmCapture()` |
| **2** | Contact & partnership submissions via Web3Forms include UTM fields | **PASS** | [`script.js`](script.js) (lines 457–464, 525, 617) | `appendUtmParams()`, `initForms()` |
| **3** | Newsletter subscriptions through Brevo preserve campaign attribution | **FAIL** | [`script.js`](script.js) (lines 640–674) | `initForms()` (newsletter listener) |
| **4** | WhatsApp campaign references work as intended (`wa.me` tagging) | **PASS** | [`script.js`](script.js) (lines 24–29, 305–325) | `initWhatsAppLink()` |
| **5** | Zero analytics trackers, behavioral cookies, or profiling scripts | **PASS** | All HTML templates, [`script.js`](script.js), [`privacy.html`](privacy.html) | Full codebase audit |
| **6** | Internal links, `mailto:`, and `tel:` links never receive appended UTMs | **PASS** | [`script.js`](script.js) (lines 305–336) | `initWhatsAppLink()`, `initForms()` |
| **7** | All 5 supported UTM parameters handled safely (inc. `utm_term`, `utm_content`) | **PASS** | [`script.js`](script.js) (lines 49, 458) | `initUtmCapture()`, `appendUtmParams()` |
| **8** | Invalid or malformed campaign values do not cause JavaScript errors | **PASS** | [`script.js`](script.js) (lines 46–84) | `initUtmCapture()` |

---

## 2. Detailed Findings by Requirement

### 1. Inbound UTM Parameter Capture & Storage — **PASS**
- **Location**: [`script.js:46-84`](script.js#L46-L84) (`initUtmCapture`)
- **Verification**:
  - `URLSearchParams` parses `window.location.search` on page load.
  - Sanitizes and stores parameters exclusively under session key `'fbro_utm'` via `sessionStorage.setItem('fbro_utm', JSON.stringify(captured))`.
  - Zero usage of `localStorage` or `document.cookie` for campaign tracking.
  - Operations are wrapped in `try ... catch`, preventing unhandled exceptions in sandboxed or privacy-restricted browser environments.
  - Across multiple page visits in the same session, `sessionStorage.getItem('fbro_utm')` successfully retrieves stored parameters and injects them as hidden `<input>` elements into any forms on that page.

### 2. Web3Forms Submissions Attribution — **PASS**
- **Location**: [`script.js:457-464`](script.js#L457-L464) (`appendUtmParams`), [`script.js:525`](script.js#L525) (Contact Form), [`script.js:617`](script.js#L617) (Partnership Form)
- **Verification**:
  - Both general contact and partnership forms invoke `appendUtmParams(form, payload)` immediately before JSON submission via `fetch()`.
  - The function iterates through all 5 parameter keys (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) and attaches them directly to the Web3Forms payload.
  - Web3Forms includes custom attributes directly in the notification emails delivered to `futurebuildersrefugeeorganizat@gmail.com`.

### 3. Brevo Newsletter Attribution — **FAIL** (Missing Pass-Through & Architectural Limitation)
- **Location**: [`script.js:640-674`](script.js#L640-L674) (`initForms`)
- **Finding & Root Cause**:
  - In [`UTM-GUIDE.md:10`](UTM-GUIDE.md#L10), the guideline states: *"When a visitor submits a contact or partnership inquiry or signs up for the newsletter, stored UTM parameters are automatically attached..."*
  - While `initUtmCapture()` injects hidden inputs into `form[name="newsletter"]`, the submit listener currently opens `CONFIG.BREVO_NEWSLETTER_URL` as a static string without appending query parameters:
    ```javascript
    var brevoUrl = CONFIG.BREVO_NEWSLETTER_URL;
    window.open(brevoUrl, '_blank', 'noopener,noreferrer');
    ```
  - *Provider Limitation*: The hosted Brevo form (`sibforms.com/serve/...`) only renders fields configured in the Brevo form builder. However, appending query parameters to `CONFIG.BREVO_NEWSLETTER_URL` is fully supported by standard HTTP GET requests (verified returning HTTP 200) and preserves campaign provenance on outbound clicks and access logs. Omitting this parameter attachment is a defect against the guide's intent.

### 4. WhatsApp Campaign Tagging — **PASS**
- **Location**: [`script.js:305-325`](script.js#L305-L325) (`initWhatsAppLink`), [`script.js:25-29`](script.js#L25-L29)
- **Verification**:
  - Selects all `a[href*="wa.me"], a.whatsapp-btn` elements across all 7 website pages.
  - Automatically appends:
    - `utm_source=website`
    - `utm_medium=whatsapp-button`
    - `utm_campaign=site-chat`
  - Preserves pre-filled greeting text and enforces `target="_blank"` and `rel="noopener noreferrer"`.
  - Matches Example 1 in [`UTM-GUIDE.md:35`](UTM-GUIDE.md#L35) character-for-character.

### 5. Zero Analytics Trackers, Cookies, or Profiling Scripts — **PASS**
- **Location**: All HTML files, [`script.js`](script.js), [`privacy.html:225-230`](privacy.html#L225-L230)
- **Verification**:
  - Zero external tracking scripts, Google Analytics / GTM, Meta / Facebook pixels, Hotjar, or advertising beacons exist in any template.
  - `document.cookie` is never accessed.
  - Storage is strictly limited to:
    1. `localStorage`: stores user UI color preference (`theme: 'light' | 'dark'`).
    2. `sessionStorage`: stores session campaign parameters (`fbro_utm`).

### 6. Strict Scope (Internal, `mailto:`, and `tel:` Protection) — **PASS**
- **Location**: [`script.js:305-336`](script.js#L305-L336)
- **Verification**:
  - Internal navigation links (`<a href="about.html">`, etc.) are never modified.
  - Phone links (`a[href^="tel:"]`) are parsed strictly to update visual display text (`CONFIG.WHATSAPP_DISPLAY`) without altering the clean `tel:+254703957274` protocol destination.
  - Fallback `mailto:` anchors remain plain email addresses without query tags.

### 7. Support for All Five Parameters (`utm_term` & `utm_content`) — **PASS**
- **Location**: [`script.js:49`](script.js#L49), [`script.js:458`](script.js#L458)
- **Verification**:
  - The full parameter set `['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']` is captured from `window.location.search`, sanitized, stored, and mapped to the Web3Forms submission payload.

### 8. Malformed Campaign Values & Error Resilience — **PASS**
- **Location**: [`script.js:56`](script.js#L56) (`initUtmCapture`)
- **Verification**:
  - `val.toLowerCase().replace(/[^a-z0-9_-]/g, '-')` strips/replaces spaces, uppercase letters, HTML tags, script delimiters, and punctuation with hyphens.
  - Prevents XSS injection and formatting breakages.
  - Empty parameters (`?utm_source=`) are ignored (`if (val)`).
  - Storage failures, quota exceptions, and malformed JSON parse scenarios are caught cleanly in `try ... catch`.

---

## 3. Recommended Smallest Necessary Corrections

The existing design, layout, and styling remain 100% intact. The following minimal modifications in [`script.js`](script.js) will resolve the identified gaps:

### Recommendation A: Forward Stored UTMs to Brevo Newsletter Subscription URL
In [`script.js:662-670`](script.js#L662-L670), construct a dynamic URL object based on `CONFIG.BREVO_NEWSLETTER_URL` and append any active UTM parameters and prefill email:
```javascript
var brevoUrlObj = new URL(CONFIG.BREVO_NEWSLETTER_URL);
if (email) {
  brevoUrlObj.searchParams.set('EMAIL', email);
}
try {
  var storedRaw = sessionStorage.getItem('fbro_utm');
  if (storedRaw) {
    var stored = JSON.parse(storedRaw);
    Object.keys(stored).forEach(function (k) {
      brevoUrlObj.searchParams.set(k, stored[k]);
    });
  }
} catch (e) {}

var finalBrevoUrl = brevoUrlObj.toString();
window.open(finalBrevoUrl, '_blank', 'noopener,noreferrer');
```

### Recommendation B: Direct `sessionStorage` Fallback in `appendUtmParams`
In [`script.js:457-464`](script.js#L457-L464), add a direct `sessionStorage` fallback in `appendUtmParams(form, payload)` in case hidden inputs were not attached to the form:
```javascript
function appendUtmParams(form, payload) {
  var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  utmKeys.forEach(function (key) {
    var input = form.querySelector('input[name="' + key + '"]');
    if (input && input.value) {
      payload[key] = input.value;
    }
  });
  try {
    var storedRaw = sessionStorage.getItem('fbro_utm');
    if (storedRaw) {
      var stored = JSON.parse(storedRaw);
      utmKeys.forEach(function (key) {
        if (!payload[key] && stored[key]) {
          payload[key] = stored[key];
        }
      });
    }
  } catch (e) {}
}
```

### Recommendation C: Session Parameter Merging
In `initUtmCapture()`, if a visitor enters on a subsequent page with an additional parameter (e.g. `?utm_content=footer`), merge new parameters with the existing `fbro_utm` object rather than overwriting the entire object, preserving the original `utm_source` and `utm_campaign`.
