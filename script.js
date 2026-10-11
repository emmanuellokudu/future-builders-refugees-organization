(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Gallery lightbox
  var lb = document.getElementById('lightbox');
  if (lb) {
    var shots = Array.prototype.slice.call(document.querySelectorAll('.g-btn'));
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var cur = 0;
    var open = function (i) {
      cur = (i + shots.length) % shots.length;
      var b = shots[cur];
      lbImg.src = b.dataset.full;
      lbImg.alt = b.dataset.alt;
      lbCap.textContent = b.dataset.cap;
      if (!lb.open) lb.showModal();
    };
    shots.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
    document.getElementById('lb-close').addEventListener('click', function () { lb.close(); });
    document.getElementById('lb-prev').addEventListener('click', function () { open(cur - 1); });
    document.getElementById('lb-next').addEventListener('click', function () { open(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.open) return;
      if (e.key === 'ArrowLeft') open(cur - 1);
      if (e.key === 'ArrowRight') open(cur + 1);
    });
  }

  // Programs: choose a program to see its description and photo
  var img = document.getElementById('program-img');
  var buttons = document.querySelectorAll('.program-btn');
  if (!img || !buttons.length) return;

  function show(btn) {
    var base = 'assets/img/' + btn.dataset.img;
    var w = btn.dataset.w;
    buttons.forEach(function (b) { b.setAttribute('aria-expanded', String(b === btn)); });
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
