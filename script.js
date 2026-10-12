/**
 * FBRO Website Core Script
 * Future Builders Refugee Organization - Kakuma, Kenya
 * Vanilla JS | Progressive Enhancement | WCAG 2.2 AA Compliant
 */

(function () {
  'use strict';

  /* ---  --- */
  var CONFIG = {
    // TODO: Confirm FBRO WhatsApp contact number with client (international format, digits only)
    WHATSAPP_NUMBER: '254703957274',

    // TODO: Confirm Netlify forms handler name for footer newsletter
    NEWSLETTER_FORM_NAME: 'newsletter',

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
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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

    // Initialize toggle states
    applyTheme(getTheme(), false);

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || getTheme();
        var target = current === 'dark' ? 'light' : 'dark';
        applyTheme(target, true);
      });
    });

    // Listen to OS preference changes
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var hasOverride = false;
        try { hasOverride = !!localStorage.getItem('theme'); } catch (err) {}
        if (!hasOverride) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    } catch (e) {}
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
    var whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    var defaultMsg = 'Hello Future Builders Refugee Organization (FBRO), I would like to learn more about your community programs in Kakuma.';

    whatsappLinks.forEach(function (link) {
      var url = new URL(link.href.startsWith('http') ? link.href : 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER);
      if (!url.searchParams.get('text')) {
        url.searchParams.set('text', defaultMsg);
      }
      url.searchParams.set('utm_source', CONFIG.UTM.whatsapp.utm_source);
      url.searchParams.set('utm_medium', CONFIG.UTM.whatsapp.utm_medium);
      url.searchParams.set('utm_campaign', CONFIG.UTM.whatsapp.utm_campaign);
      link.href = url.toString();
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
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
  (function initNewsletterForm() {
    var forms = document.querySelectorAll('.newsletter-form');
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        // Progressive enhancement: if fetch is supported, submit asynchronously
        if (!('fetch' in window)) return;
        e.preventDefault();

        var emailInput = form.querySelector('input[type="email"]');
        var submitBtn = form.querySelector('button[type="submit"]');
        var feedbackContainer = form.parentElement.querySelector('.form-feedback') || document.createElement('div');
        feedbackContainer.className = 'form-feedback';
        feedbackContainer.setAttribute('role', 'status');

        if (!emailInput || !emailInput.checkValidity()) {
          emailInput.focus();
          return;
        }

        var originalBtnText = submitBtn ? submitBtn.textContent : 'Subscribe';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending…';
        }

        var formData = new FormData(form);
        var urlEncoded = new URLSearchParams(formData).toString();

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: urlEncoded
        })
          .then(function (res) {
            if (res.ok) {
              feedbackContainer.classList.add('is-success');
              feedbackContainer.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>Thank you! You are now subscribed to FBRO community updates.</span>';
              form.replaceWith(feedbackContainer);
            } else {
              throw new Error('Server returned ' + res.status);
            }
          })
          .catch(function () {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalBtnText;
            }
            feedbackContainer.classList.add('is-error');
            feedbackContainer.innerHTML = '<span>Could not send subscription. Please contact us directly at <a href="mailto:fbrocbo@gmail.com" style="color:#ffffff; text-decoration:underline;">fbrocbo@gmail.com</a>.</span>';
            if (!feedbackContainer.parentElement) {
              form.appendChild(feedbackContainer);
            }
          });
      });
    });
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
