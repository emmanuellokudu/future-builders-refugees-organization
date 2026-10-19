/**
 * FBRO Website Core Script
 * Future Builders Refugee Organization - Kakuma, Kenya
 * Vanilla JS | Progressive Enhancement | WCAG 2.2 AA Compliant
 */

(function () {
  'use strict';

  /* ---  --- */
  var CONFIG = {
    // WhatsApp number (digits only for links). Display uses spaced format elsewhere.
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

  // Enable JS-dependent enhancements on root
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // Check reduced motion preference
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---  --- */
  (function initUtmCapture() {
    try {
      // Session first-touch attribution: preserve the first valid inbound campaign for the session
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

      // Inject stored UTMs into all forms as hidden fields
      var storedRaw = sessionStorage.getItem('fbro_utm');
      if (storedRaw) {
        var stored = JSON.parse(storedRaw);
        document.querySelectorAll('form').forEach(function (form) {
          Object.keys(stored).forEach(function (key) {
            if (!form.querySelector('input[name="' + key + '"]')) {
              var input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = stored[key];
              form.appendChild(input);
            }
          });
        });
      }
    } catch (e) {
      // Graceful fallback if sessionStorage is blocked
    }
  })();

  /* ---  --- */
  (function initDarkMode() {
    var toggles = document.querySelectorAll('.theme-toggle');
    if (!toggles.length) return;

    function getTheme() {
      try {
        var saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
      } catch (e) {}
      return 'light';
    }

    function applyTheme(theme, persist) {
      document.documentElement.setAttribute('data-theme', theme);
      if (persist) {
        try {
          localStorage.setItem('theme', theme);
        } catch (e) {}
      }
      var isDark = theme === 'dark';
      toggles.forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(isDark));
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      });
    }

    // Initialize toggle states with light mode as default
    applyTheme(getTheme(), false);

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || getTheme();
        var target = current === 'dark' ? 'light' : 'dark';
        applyTheme(target, true);
      });
    });
  })();

  /* ---  --- */
  (function initScrollFeatures() {
    var header = document.querySelector('.site-header');
    var progressBar = document.getElementById('scroll-progress');
    var backToTopBtn = document.getElementById('back-to-top');
    var ticking = false;

    function onScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Sticky header state
      if (header) {
        if (scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Scroll progress
      if (progressBar) {
        var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      }

      // Back to top button
      if (backToTopBtn) {
        if (scrollY > 600) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function () {
        if (prefersReducedMotion) {
          window.scrollTo(0, 0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        var skip = document.querySelector('.skip, .skip-link');
        if (skip) {
          skip.focus();
        } else {
          document.body.setAttribute('tabindex', '-1');
          document.body.focus();
        }
      });
    }

    // Run once on initial load
    onScroll();
  })();

  /* ---  --- */
  (function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('nav');
    if (!toggle || !nav) return;

    var focusableElsSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function openMenu() {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');

      // Focus first focusable item inside drawer
      var focusables = nav.querySelectorAll(focusableElsSelector);
      if (focusables.length) {
        focusables[0].focus();
      }
    }

    function closeMenu() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on navigation link clicks
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link && nav.classList.contains('open')) {
        closeMenu();
      }
    });

    // Keyboard navigation: Escape key to close & Focus Trap
    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('open')) return;

      if (e.key === 'Escape' || e.key === 'Esc') {
        closeMenu();
        return;
      }

      if (e.key === 'Tab') {
        var focusables = Array.prototype.slice.call(nav.querySelectorAll(focusableElsSelector));
        if (!focusables.length) return;
        var firstEl = focusables[0];
        var lastEl = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  })();

  /* ---  --- */
  (function initScrollReveals() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      reveals.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

    reveals.forEach(function (el) { observer.observe(el); });

    // Handle image skeleton removal
    document.querySelectorAll('.img-wrap img').forEach(function (img) {
      if (img.complete) {
        img.parentElement.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          img.parentElement.classList.add('loaded');
        });
      }
    });
  })();



  /* ---  --- */
  (function initWhatsAppLink() {
    var whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a.whatsapp-btn');
    var defaultMsg = 'Hello Future Builders Refugee Organization (FBRO), I would like to learn more about your community programs in Kakuma.';

    var campaign = '';
    try {
      var storedRaw = sessionStorage.getItem('fbro_utm');
      if (storedRaw) {
        var stored = JSON.parse(storedRaw);
        if (stored && stored.utm_campaign) {
          campaign = String(stored.utm_campaign).trim();
        }
      }
    } catch (e) {}

    var refTag = campaign ? ('[Ref: Web / ' + campaign + ']') : '[Ref: Website]';

    whatsappLinks.forEach(function (link) {
      try {
        var href = link.getAttribute('href') || '';
        var url = href.startsWith('http') ? new URL(href) : new URL('https://wa.me/' + CONFIG.WHATSAPP_NUMBER);

        // Remove any UTM query parameters from wa.me link
        url.searchParams.delete('utm_source');
        url.searchParams.delete('utm_medium');
        url.searchParams.delete('utm_campaign');
        url.searchParams.delete('utm_term');
        url.searchParams.delete('utm_content');

        var currentMsg = url.searchParams.get('text') || defaultMsg;
        // Strip any existing [Ref: ...] reference to prevent duplicates on repeated initialization
        var baseMsg = currentMsg.replace(/\s*\[Ref:[^\]]*\]/gi, '').trim();
        if (!baseMsg) {
          baseMsg = defaultMsg;
        }

        url.searchParams.set('text', baseMsg + ' ' + refTag);
        link.href = url.toString();
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      } catch (e) {
        // ignore malformed URLs
      }
    });

    // Update visible phone links to use display format while keeping tel: hrefs normalized
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      if (a.getAttribute('data-display')) return;
      var tel = a.getAttribute('href').replace(/[^+0-9]/g, '');
      if (tel === 'tel:+254703957274' || tel.indexOf('254703957274') !== -1) {
        a.setAttribute('data-display', CONFIG.WHATSAPP_DISPLAY);
        a.textContent = CONFIG.WHATSAPP_DISPLAY;
      }
    });
  })();

  /* ---  --- */
  (function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var summary = item.querySelector('summary');
      if (!summary) return;

      // Close other items when one is opened for clean accordion behavior
      summary.addEventListener('click', function () {
        if (!item.open) {
          faqItems.forEach(function (other) {
            if (other !== item && other.open) {
              other.removeAttribute('open');
            }
          });
        }
      });
    });
  })();

  /* ---  --- */
  (function initForms() {
    // Contact & Partnership forms are integrated with Web3Forms API.
    // Newsletter subscriptions are integrated with Brevo hosted subscription flow.
    // Includes accessible live status feedback, spam protection, and progressive enhancement.

    var ORG_EMAIL = 'futurebuildersrefugeeorganizat@gmail.com';

    function handleSuccess(container, message) {
      if (!container) return;
      container.classList.remove('is-error', 'is-info');
      container.classList.add('is-success');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>' + message + '</span>';
    }

    function handleError(container, message) {
      if (!container) return;
      container.classList.remove('is-success', 'is-info');
      container.classList.add('is-error');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'assertive');
      container.innerHTML = '<span>' + message + '</span>';
    }

    function handleInfo(container, message) {
      if (!container) return;
      container.classList.remove('is-error', 'is-success');
      container.classList.add('is-info');
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      container.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><span>' + message + '</span>';
    }

    function ensureFeedbackInDom(form, container) {
      if (!container.parentElement && form) {
        if (form.classList.contains('newsletter-form')) {
          var row = form.querySelector('.newsletter-form-row');
          if (row) {
            row.insertAdjacentElement('afterend', container);
          } else {
            form.appendChild(container);
          }
        } else {
          var heading = form.querySelector('h3');
          if (heading && heading.nextSibling) {
            heading.insertAdjacentElement('afterend', container);
          } else {
            form.prepend(container);
          }
        }
      }
    }

    function setSubmittingState(button, isSubmitting, loadingText, defaultText) {
      if (!button) return;
      button.disabled = isSubmitting;
      button.setAttribute('aria-busy', String(isSubmitting));
      if (isSubmitting) {
        if (!button.dataset.originalText) {
          button.dataset.originalText = button.textContent;
        }
        button.textContent = loadingText || 'Sending...';
      } else {
        button.textContent = button.dataset.originalText || defaultText || 'Submit';
      }
    }

    function isHoneypotTriggered(form) {
      var botField = form.querySelector('input[name="bot-field"]');
      return botField && botField.value.trim().length > 0;
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function submitToWeb3Forms(payload) {
      return fetch(CONFIG.WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(function (response) {
        return response.json().then(function (data) {
          if (response.ok && data.success) {
            return data;
          }
          var errMsg = (data && data.message) ? data.message : 'Submission failed (' + response.status + ')';
          throw new Error(errMsg);
        });
      });
    }

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

    // Contact form (contact.html)
    var contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (isHoneypotTriggered(contactForm)) return;

        var feedbackContainer = contactForm.querySelector('.form-feedback') || document.createElement('div');
        feedbackContainer.className = 'form-feedback';
        feedbackContainer.setAttribute('role', 'status');
        feedbackContainer.setAttribute('aria-live', 'polite');

        var nameInput = contactForm.querySelector('input[name="name"]');
        var emailInput = contactForm.querySelector('input[name="email"]');
        var orgInput = contactForm.querySelector('input[name="organization"]');
        var msgInput = contactForm.querySelector('textarea[name="message"]');
        var submitBtn = contactForm.querySelector('button[type="submit"]');

        var name = (nameInput ? nameInput.value : '').trim();
        var email = (emailInput ? emailInput.value : '').trim();
        var org = (orgInput ? orgInput.value : '').trim();
        var msg = (msgInput ? msgInput.value : '').trim();

        if (!name) {
          handleError(feedbackContainer, 'Please enter your name.');
          ensureFeedbackInDom(contactForm, feedbackContainer);
          if (nameInput) nameInput.focus();
          return;
        }

        if (!email || !isValidEmail(email)) {
          handleError(feedbackContainer, 'Please enter a valid email address.');
          ensureFeedbackInDom(contactForm, feedbackContainer);
          if (emailInput) emailInput.focus();
          return;
        }

        if (!msg) {
          handleError(feedbackContainer, 'Please enter your message.');
          ensureFeedbackInDom(contactForm, feedbackContainer);
          if (msgInput) msgInput.focus();
          return;
        }

        setSubmittingState(submitBtn, true, 'Sending message...', 'Send message');

        var payload = {
          access_key: CONFIG.WEB3FORMS_ACCESS_KEY,
          subject: 'FBRO Website — New Contact Inquiry',
          from_name: name,
          name: name,
          email: email,
          replyto: email,
          message: msg,
          botcheck: ''
        };
        if (org) {
          payload.organization = org;
        }
        appendUtmParams(contactForm, payload);

        submitToWeb3Forms(payload)
          .then(function () {
            setSubmittingState(submitBtn, false, '', 'Send message');
            handleSuccess(feedbackContainer, 'Thank you! Your message has been sent successfully. We will be in touch shortly.');
            ensureFeedbackInDom(contactForm, feedbackContainer);
            contactForm.reset();
            feedbackContainer.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
          })
          .catch(function () {
            setSubmittingState(submitBtn, false, '', 'Send message');
            handleError(
              feedbackContainer,
              'Submission could not be completed automatically. Please try again or email us directly at <a href="mailto:' + ORG_EMAIL + '">' + ORG_EMAIL + '</a>.'
            );
            ensureFeedbackInDom(contactForm, feedbackContainer);
            feedbackContainer.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
          });
      });
    }

    // Partnership inquiry form (get-involved.html)
    var partnershipForm = document.querySelector('form[name="partnership"]');
    if (partnershipForm) {
      partnershipForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (isHoneypotTriggered(partnershipForm)) return;

        var feedbackContainer = partnershipForm.querySelector('.form-feedback') || document.createElement('div');
        feedbackContainer.className = 'form-feedback';
        feedbackContainer.setAttribute('role', 'status');
        feedbackContainer.setAttribute('aria-live', 'polite');

        var nameInput = partnershipForm.querySelector('input[name="name"]');
        var emailInput = partnershipForm.querySelector('input[name="email"]');
        var orgInput = partnershipForm.querySelector('input[name="organization"]');
        var typeInput = partnershipForm.querySelector('select[name="inquiry-type"]');
        var msgInput = partnershipForm.querySelector('textarea[name="message"]');
        var submitBtn = partnershipForm.querySelector('button[type="submit"]');

        var name = (nameInput ? nameInput.value : '').trim();
        var email = (emailInput ? emailInput.value : '').trim();
        var org = (orgInput ? orgInput.value : '').trim();
        var inquiryType = (typeInput ? typeInput.value : '').trim();
        var msg = (msgInput ? msgInput.value : '').trim();

        if (!name) {
          handleError(feedbackContainer, 'Please enter your name.');
          ensureFeedbackInDom(partnershipForm, feedbackContainer);
          if (nameInput) nameInput.focus();
          return;
        }

        if (!email || !isValidEmail(email)) {
          handleError(feedbackContainer, 'Please enter a valid email address.');
          ensureFeedbackInDom(partnershipForm, feedbackContainer);
          if (emailInput) emailInput.focus();
          return;
        }

        if (!inquiryType) {
          handleError(feedbackContainer, 'Please select what kind of partner you are writing as.');
          ensureFeedbackInDom(partnershipForm, feedbackContainer);
          if (typeInput) typeInput.focus();
          return;
        }

        if (!msg) {
          handleError(feedbackContainer, 'Please enter your message.');
          ensureFeedbackInDom(partnershipForm, feedbackContainer);
          if (msgInput) msgInput.focus();
          return;
        }

        setSubmittingState(submitBtn, true, 'Sending inquiry...', 'Send inquiry');

        var payload = {
          access_key: CONFIG.WEB3FORMS_ACCESS_KEY,
          subject: 'FBRO Website — New Partnership Inquiry',
          from_name: name,
          name: name,
          email: email,
          replyto: email,
          'inquiry-type': inquiryType,
          inquiry_type: inquiryType,
          message: msg,
          botcheck: ''
        };
        if (org) {
          payload.organization = org;
        }
        appendUtmParams(partnershipForm, payload);

        submitToWeb3Forms(payload)
          .then(function () {
            setSubmittingState(submitBtn, false, '', 'Send inquiry');
            handleSuccess(feedbackContainer, 'Thank you! Your partnership inquiry has been sent successfully. We will follow up shortly.');
            ensureFeedbackInDom(partnershipForm, feedbackContainer);
            partnershipForm.reset();
            feedbackContainer.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
          })
          .catch(function () {
            setSubmittingState(submitBtn, false, '', 'Send inquiry');
            handleError(
              feedbackContainer,
              'Submission could not be completed automatically. Please try again or email us directly at <a href="mailto:' + ORG_EMAIL + '">' + ORG_EMAIL + '</a>.'
            );
            ensureFeedbackInDom(partnershipForm, feedbackContainer);
            feedbackContainer.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
          });
      });
    }

    // Newsletter forms across all pages
    var newsletterForms = document.querySelectorAll('form[name="newsletter"]');
    if (newsletterForms.length) {
      newsletterForms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (isHoneypotTriggered(form)) return;

          var feedbackContainer = form.querySelector('.form-feedback') || document.createElement('div');
          feedbackContainer.className = 'form-feedback';
          feedbackContainer.setAttribute('role', 'status');
          feedbackContainer.setAttribute('aria-live', 'polite');

          var emailInput = form.querySelector('input[type="email"]');
          var email = (emailInput ? emailInput.value : '').trim();

          if (!email || !isValidEmail(email)) {
            handleError(feedbackContainer, 'Please enter a valid email address.');
            ensureFeedbackInDom(form, feedbackContainer);
            if (emailInput) emailInput.focus();
            return;
          }

          var brevoUrl = CONFIG.BREVO_NEWSLETTER_URL;
          window.open(brevoUrl, '_blank', 'noopener,noreferrer');

          handleInfo(
            feedbackContainer,
            'Opening the official FBRO newsletter subscription page... Please complete your confirmation on Brevo. If the page did not open, <a href="' + brevoUrl + '" target="_blank" rel="noopener noreferrer">click here to subscribe</a>.'
          );
          ensureFeedbackInDom(form, feedbackContainer);

          form.reset();
        });
      });
    }
  })();

  /* ---  --- */
  (function initClipboardButtons() {
    var copyBtns = document.querySelectorAll('.copy-btn');
    if (!copyBtns.length) return;

    var liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      document.body.appendChild(liveRegion);
    }

    function announce(msg) {
      liveRegion.textContent = '';
      setTimeout(function () { liveRegion.textContent = msg; }, 50);
    }

    function fallbackCopyText(text) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {}
      document.body.removeChild(textarea);
    }

    copyBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy') || '';
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).catch(function () {
            fallbackCopyText(text);
          });
        } else {
          fallbackCopyText(text);
        }

        var originalHtml = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>Copied</span>';
        announce('Copied ' + text + ' to clipboard');

        setTimeout(function () {
          btn.classList.remove('copied');
          btn.innerHTML = originalHtml;
        }, 2000);
      });
    });
  })();

  /* ---  --- */
  (function initLightbox() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;

    var shots = Array.prototype.slice.call(document.querySelectorAll('.g-btn'));
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var cur = 0;

    var open = function (i) {
      cur = (i + shots.length) % shots.length;
      var b = shots[cur];
      lbImg.src = b.dataset.full;
      lbImg.alt = b.dataset.alt || '';
      lbCap.textContent = b.dataset.cap || '';
      if (!lb.open) {
        if (typeof lb.showModal === 'function') {
          lb.showModal();
        } else {
          lb.setAttribute('open', '');
        }
      }
    };

    shots.forEach(function (b, i) {
      b.addEventListener('click', function () { open(i); });
    });

    var closeBtn = document.getElementById('lb-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (typeof lb.close === 'function') lb.close();
        else lb.removeAttribute('open');
      });
    }

    var prevBtn = document.getElementById('lb-prev');
    if (prevBtn) prevBtn.addEventListener('click', function () { open(cur - 1); });

    var nextBtn = document.getElementById('lb-next');
    if (nextBtn) nextBtn.addEventListener('click', function () { open(cur + 1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) {
        if (typeof lb.close === 'function') lb.close();
        else lb.removeAttribute('open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!lb.open) return;
      if (e.key === 'ArrowLeft') open(cur - 1);
      if (e.key === 'ArrowRight') open(cur + 1);
      if (e.key === 'Escape') {
        if (typeof lb.close === 'function') lb.close();
        else lb.removeAttribute('open');
      }
    });
  })();

  /* ---  --- */
  (function initProgramsTabs() {
    var img = document.getElementById('program-img');
    var buttons = document.querySelectorAll('.program-btn');
    if (!img || !buttons.length) return;

    function show(btn) {
      var base = 'assets/img/' + btn.dataset.img;
      var w = btn.dataset.w;
      buttons.forEach(function (b) { b.setAttribute('aria-expanded', String(b === btn)); });

      if (prefersReducedMotion) {
        img.srcset = base + '-800.webp 800w, ' + base + '-1600.webp ' + w + 'w';
        img.src = base + '-800.webp';
        img.width = w;
        img.height = btn.dataset.h;
        img.alt = btn.dataset.alt;
        return;
      }

      img.classList.add('swap');
      setTimeout(function () {
        img.srcset = base + '-800.webp 800w, ' + base + '-1600.webp ' + w + 'w';
        img.src = base + '-800.webp';
        img.width = w;
        img.height = btn.dataset.h;
        img.alt = btn.dataset.alt;
        img.classList.remove('swap');
      }, 180);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { show(btn); });
      btn.addEventListener('mouseenter', function () {
        if (window.matchMedia('(hover: hover) and (min-width: 900px)').matches) show(btn);
      });
    });
  })();

})();
