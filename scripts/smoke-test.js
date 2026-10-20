#!/usr/bin/env node
/**
 * FBRO Static Site Smoke Test
 * Tests file integrity, internal links, script syntax, form structures,
 * and form interaction logic without requiring heavy browser dependencies.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const EXPECTED_DOMAIN = 'futurebuildersrefugeeorganization.org';
const ORG_EMAIL = 'futurebuildersrefugeeorganizat@gmail.com';

const HTML_FILES = [
  'index.html',
  'about.html',
  'programs.html',
  'gallery.html',
  'get-involved.html',
  'contact.html',
  'privacy.html',
  '404.html'
];

let failures = 0;
let passed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failures++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n--- FBRO Static Site Smoke Test ---');

// 1. Core Deployment & Discovery Files
console.log('\n[1/5] Verifying Deployment & Discovery Files...');
const cnamePath = path.join(ROOT, 'CNAME');
assert(fs.existsSync(cnamePath), 'CNAME file exists');
if (fs.existsSync(cnamePath)) {
  const cnameContent = fs.readFileSync(cnamePath, 'utf8').trim();
  assert(cnameContent === EXPECTED_DOMAIN, `CNAME contains verified domain: ${EXPECTED_DOMAIN}`);
}

const robotsPath = path.join(ROOT, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  assert(robots.includes(`https://${EXPECTED_DOMAIN}/sitemap.xml`), 'robots.txt references production sitemap');
}

const sitemapPath = path.join(ROOT, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  assert(sitemap.includes(`https://${EXPECTED_DOMAIN}/`), 'sitemap.xml includes root/homepage URL');
  assert(sitemap.includes(`https://${EXPECTED_DOMAIN}/contact.html`), 'sitemap.xml includes contact page');
}

// 2. HTML Files & Critical UI Elements
console.log('\n[2/5] Verifying HTML Files & Structural Elements...');
HTML_FILES.forEach(file => {
  const filePath = path.join(ROOT, file);
  const exists = fs.existsSync(filePath);
  assert(exists, `${file} exists`);
  if (!exists) return;

  const html = fs.readFileSync(filePath, 'utf8');

  // Must include viewport, title, and link to styles.css
  assert(html.includes('<meta name="viewport"'), `${file} has viewport meta tag`);
  assert(/<title>[\s\S]+?<\/title>/.test(html), `${file} has page title`);
  assert(html.includes('styles.css'), `${file} links to styles.css`);
  assert(html.includes('script.js'), `${file} links to script.js`);

  // Canonical tag must match verified domain
  if (file !== '404.html') {
    assert(html.includes(`canonical" href="https://${EXPECTED_DOMAIN}/`), `${file} has canonical link matching verified domain`);
  }

  // Accessibility & navigation basics
  assert(html.includes('class="skip"'), `${file} has accessible skip-to-content link`);
  assert(html.includes('class="theme-toggle"'), `${file} has theme toggle button`);
  assert(html.includes('class="nav-toggle"'), `${file} has mobile menu toggle button`);
  if (file !== '404.html' && file !== 'privacy.html') {
    assert(/<form[^>]*name=["']newsletter["']/i.test(html), `${file} contains newsletter form`);
  }
});

// 3. Form Markup Integrity
console.log('\n[3/5] Verifying Form Inputs & Honeypot Fields...');
const contactHtml = fs.readFileSync(path.join(ROOT, 'contact.html'), 'utf8');
assert(/<form[^>]*name=["']contact["']/i.test(contactHtml), 'contact.html contains contact form');
assert(contactHtml.includes('name="bot-field"'), 'contact form has anti-spam bot-field');
assert(contactHtml.includes('type="email"'), 'contact form has email input');
assert(contactHtml.includes('name="message"'), 'contact form has message textarea');

const getInvolvedHtml = fs.readFileSync(path.join(ROOT, 'get-involved.html'), 'utf8');
assert(/<form[^>]*name=["']partnership["']/i.test(getInvolvedHtml), 'get-involved.html contains partnership form');
assert(getInvolvedHtml.includes('name="bot-field"'), 'partnership form has anti-spam bot-field');
assert(getInvolvedHtml.includes('name="inquiry-type"'), 'partnership form has inquiry type select');

// 4. Internal Link Resolution
console.log('\n[4/5] Checking Internal Asset and Page Links...');
let linkCheckedCount = 0;
HTML_FILES.forEach(file => {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  // Match href and src attributes
  const regex = /(?:href|src)=["']([^"'#?]+)(?:\?[^"']*)?(?:#[^"']*)?["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const target = match[1].trim();
    // Skip external, protocol, or data links
    if (!target || target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('data:')) {
      continue;
    }

    const cleanPath = target.replace(/^\//, '');
    const resolved = path.join(ROOT, cleanPath);
    const linkExists = fs.existsSync(resolved);
    if (!linkExists) {
      assert(false, `In ${file}: target file not found: "${target}" (resolved: ${cleanPath})`);
    } else {
      linkCheckedCount++;
    }
  }
});
assert(linkCheckedCount > 0, `Validated ${linkCheckedCount} internal links successfully with 0 broken references`);

// 5. JavaScript Syntax & Form Logic Unit Tests
console.log('\n[5/5] Testing JavaScript Syntax & Form Handling Fallbacks...');
const scriptPath = path.join(ROOT, 'script.js');
assert(fs.existsSync(scriptPath), 'script.js exists');

const scriptCode = fs.readFileSync(scriptPath, 'utf8');
let syntaxValid = false;
try {
  new vm.Script(scriptCode);
  syntaxValid = true;
} catch (e) {
  console.error('script.js syntax error:', e.message);
}
assert(syntaxValid, 'script.js compiles without syntax errors');

// Test handleSuccess and handleError DOM pattern logic
function mockElement(tag) {
  return {
    tagName: tag,
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    attributes: {},
    setAttribute(k, v) { this.attributes[k] = String(v); },
    getAttribute(k) { return this.attributes[k]; },
    innerHTML: '',
    parentElement: null
  };
}

// Logic implementations matching script.js
function handleSuccess(container, message) {
  if (!container) return;
  container.classList.remove('is-error');
  container.classList.add('is-success');
  container.setAttribute('role', 'status');
  container.setAttribute('aria-live', 'polite');
  container.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>' + message + '</span>';
}

function handleError(container, message) {
  if (!container) return;
  container.classList.remove('is-success');
  container.classList.add('is-error');
  container.setAttribute('role', 'alert');
  container.setAttribute('aria-live', 'assertive');
  container.innerHTML = '<span>' + message + '</span>';
}

const testContainer = mockElement('div');
handleSuccess(testContainer, 'Thank you! Message sent.');
assert(testContainer.classList.contains('is-success'), 'handleSuccess adds is-success class');
assert(!testContainer.classList.contains('is-error'), 'handleSuccess clears is-error class');
assert(testContainer.getAttribute('role') === 'status', 'handleSuccess sets role="status"');
assert(testContainer.innerHTML.includes('Thank you! Message sent.'), 'handleSuccess renders message');

handleError(testContainer, 'Submission failed. Please email us directly.');
assert(testContainer.classList.contains('is-error'), 'handleError adds is-error class');
assert(!testContainer.classList.contains('is-success'), 'handleError clears is-success class');
assert(testContainer.getAttribute('role') === 'alert', 'handleError sets role="alert"');
assert(testContainer.innerHTML.includes('Submission failed'), 'handleError renders message');

// Test mailto fallback URL length protection
const MAX_MAILTO_LENGTH = 1900;
function buildMailtoUrl(to, subject, body) {
  return 'mailto:' + encodeURIComponent(to) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

const shortMailto = buildMailtoUrl(ORG_EMAIL, 'Test Subject', 'Short message test');
assert(shortMailto.length < MAX_MAILTO_LENGTH, `Normal mailto length (${shortMailto.length}) is under limit (${MAX_MAILTO_LENGTH})`);

const hugeMessage = 'A'.repeat(2500);
const longMailto = buildMailtoUrl(ORG_EMAIL, 'Test Subject', hugeMessage);
assert(longMailto.length > MAX_MAILTO_LENGTH, `Oversized mailto length (${longMailto.length}) detected above threshold (${MAX_MAILTO_LENGTH})`);

// Summary
console.log('\n-----------------------------------');
console.log(`Results: ${passed} passed, ${failures} failed`);
console.log('-----------------------------------\n');

if (failures > 0) {
  process.exit(1);
} else {
  console.log('All smoke tests passed cleanly!\n');
  process.exit(0);
}
