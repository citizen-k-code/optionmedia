  /* ── Word cycle with animated width ── */
  (function () {
    var words = ['fix', 'make', 'do', 'create'];
    var idx   = 0;
    var wrap  = document.querySelector('.word-cycle-wrap');
    var inner = document.querySelector('.word-cycle-inner');
    if (!wrap || !inner) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* hidden measurer — lives inside h1 to inherit font exactly */
    var h1       = wrap.closest('h1');
    var measurer = document.createElement('span');
    measurer.setAttribute('aria-hidden', 'true');
    measurer.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;white-space:nowrap;';
    h1.style.position = 'relative';
    h1.appendChild(measurer);

    function measureWord(word) {
      measurer.textContent = word;
      return measurer.offsetWidth;
    }

    /* set initial width */
    wrap.style.width = measureWord(words[0]) + 'px';

    function next() {
      idx = (idx + 1) % words.length;
      var nextWord  = words[idx];
      var nextWidth = measureWord(nextWord);
      var ease      = 'cubic-bezier(0.22, 1, 0.36, 1)';
      var dur       = '0.42s';

      /* animate slot width to fit next word */
      wrap.style.transition = 'width ' + dur + ' ' + ease;
      wrap.style.width      = nextWidth + 'px';

      /* slide current word up and out */
      inner.style.transition = 'transform 0.36s cubic-bezier(0.77,0,0.175,1), opacity 0.22s ease';
      inner.style.transform  = 'translateY(-115%)';
      inner.style.opacity    = '0';

      setTimeout(function () {
        inner.textContent      = nextWord;
        inner.style.transition = 'none';
        inner.style.transform  = 'translateY(85%)';
        inner.style.opacity    = '0';

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            inner.style.transition = 'transform ' + dur + ' ' + ease + ', opacity 0.26s ease';
            inner.style.transform  = 'translateY(0)';
            inner.style.opacity    = '1';
          });
        });
      }, 360);
    }

    setTimeout(function () {
      setInterval(next, 2600);
    }, 2200);
  }());

  (function () {
    var slides   = document.querySelectorAll('.fs-slide');
    var imgs     = document.querySelectorAll('.fs-img');
    var steps    = document.querySelectorAll('.fs-step');
    var tabs     = document.querySelectorAll('.fs-tab');
    var counter  = document.querySelector('.fs-step-counter');
    var prevBtn  = document.querySelector('.fs-prev');
    var nextBtn  = document.querySelector('.fs-next');
    var current  = 0;
    var total    = slides.length;
    var busy     = false;

    function updateControls() {
      steps.forEach(function (s, i) { s.classList.toggle('active', i === current); });
      tabs.forEach(function (t, i)  { t.classList.toggle('active', i === current); });
      if (counter) counter.textContent = (current + 1) + ' / ' + total;
    }

    function goTo(newIndex, direction) {
      if (newIndex === current || busy) return;
      busy = true;

      var leaving  = slides[current];
      var entering = slides[newIndex];

      /* Reset any stale inline styles */
      leaving.style.transform  = '';
      leaving.style.opacity    = '';
      leaving.style.transition = '';
      entering.style.transform  = '';
      entering.style.opacity    = '';
      entering.style.transition = '';

      /* ── Exit: leaving slide animates out ── */
      leaving.classList.add('exiting');
      leaving.style.transform = direction >= 0 ? 'translateX(-32px)' : 'translateX(32px)';
      leaving.classList.remove('active');
      imgs[current].classList.remove('active');

      /* ── Enter: drive animation entirely via inline styles ── */
      entering.style.transition = 'none';
      entering.style.transform  = direction >= 0 ? 'translateX(32px)' : 'translateX(-32px)';
      entering.style.opacity    = '0';
      entering.classList.add('active');

      /* Force reflow so browser registers start state */
      void entering.offsetWidth;

      /* Animate to final position */
      entering.style.transition = 'opacity .3s ease-out, transform .3s ease-out';
      entering.style.transform  = 'translateX(0)';
      entering.style.opacity    = '1';
      imgs[newIndex].classList.add('active');

      current = newIndex;
      updateControls();

      /* Cleanup leaving slide */
      leaving.addEventListener('transitionend', function cleanLeave(e) {
        if (e.propertyName !== 'opacity') return;
        leaving.classList.remove('exiting');
        leaving.style.transform  = '';
        leaving.style.transition = '';
        leaving.removeEventListener('transitionend', cleanLeave);
      });

      /* Cleanup entering slide + release busy */
      var safetyTimer = setTimeout(function () {
        entering.style.transform  = '';
        entering.style.opacity    = '';
        entering.style.transition = '';
        busy = false;
      }, 600);

      entering.addEventListener('transitionend', function cleanEnter(e) {
        if (e.propertyName !== 'opacity') return;
        clearTimeout(safetyTimer);
        entering.style.transform  = '';
        entering.style.opacity    = '';
        entering.style.transition = '';
        entering.removeEventListener('transitionend', cleanEnter);
        busy = false;
      });
    }

    steps.forEach(function (btn, i) {
      btn.addEventListener('click', function () { goTo(i, i > current ? 1 : -1); });
    });

    tabs.forEach(function (btn, i) {
      btn.addEventListener('click', function () { goTo(i, i > current ? 1 : -1); });
    });

    prevBtn.addEventListener('click', function () {
      goTo((current - 1 + total) % total, -1);
    });

    nextBtn.addEventListener('click', function () {
      goTo((current + 1) % total, 1);
    });

    updateControls();

    /* ── Auto-advance with progress bar ── */
    var progressBar = document.querySelector('.fs-progress-bar');
    var autoTimer = null;
    var DURATION = 7000;

    function startProgress() {
      stopProgress();
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      void progressBar.offsetWidth;
      progressBar.style.transition = 'width ' + DURATION + 'ms linear';
      progressBar.style.width = '100%';
      autoTimer = setTimeout(function () {
        goTo((current + 1) % total, 1);
      }, DURATION);
    }

    function stopProgress() {
      if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
    }

    /* Restart progress after every slide change */
    var origGoTo = goTo;
    goTo = function (newIndex, direction) {
      origGoTo(newIndex, direction);
      startProgress();
    };

    startProgress();
  }());

  /* ── Team fan interaction ── */
  (function () {
    var fan = document.querySelector('.team-fan');
    if (!fan) return;
    var cards = Array.from(fan.querySelectorAll('.team-card:not(.team-card-empty)'));
    var emptyCards = Array.from(fan.querySelectorAll('.team-card-empty'));

    var SH   = '0 28px 64px rgba(0,0,0,0.55)';
    var DAMP = 0.1;

    /* Compute positions dynamically from actual card/fan dimensions */
    var CARD_W   = cards[0].offsetWidth;
    var SPACING  = Math.round(CARD_W * 0.72);
    var BASE     = [-SPACING, 0, SPACING];
    var MAX_PUSH = Math.max(0, Math.round(CARD_W / 2 * 0.94 - SPACING / 2));

    var anim = [
      { tx:-SPACING, sc:0.92, op:1, bg:0 },
      { tx:       0, sc:1.00, op:1, bg:0.05 },
      { tx: SPACING, sc:0.92, op:1, bg:0 }
    ];
    var tgt = [
      { tx:-SPACING, sc:0.92, op:1, bg:0,    z:1, sh:'none', bo:'rgba(255,255,255,0.05)' },
      { tx:       0, sc:1.00, op:1, bg:0.05, z:2, sh:SH,     bo:'rgba(255,255,255,0.12)' },
      { tx: SPACING, sc:0.92, op:1, bg:0,    z:1, sh:'none', bo:'rgba(255,255,255,0.05)' }
    ];
    var rafId = null;
    cards.forEach(function (c) { c.style.transition = 'none'; });

    function tick() {
      var done = true;
      cards.forEach(function (card, i) {
        anim[i].tx = anim[i].tx + (tgt[i].tx - anim[i].tx) * DAMP;
        anim[i].sc = anim[i].sc + (tgt[i].sc - anim[i].sc) * DAMP;
        anim[i].op = anim[i].op + (tgt[i].op - anim[i].op) * DAMP;
        anim[i].bg = anim[i].bg + (tgt[i].bg - anim[i].bg) * DAMP;
        if (Math.abs(anim[i].tx - tgt[i].tx) > 0.05 || Math.abs(anim[i].sc - tgt[i].sc) > 0.0005) done = false;
        card.style.transform   = 'translateX(' + anim[i].tx + 'px) scale(' + anim[i].sc + ')';
        card.style.opacity     = anim[i].op;
        card.style.background  = 'linear-gradient(180deg,rgba(255,255,255,' + anim[i].bg + '),rgba(255,255,255,' + (anim[i].bg * 0.5) + ')),var(--panel)';
        card.style.zIndex      = tgt[i].z;
        card.style.boxShadow   = tgt[i].sh;
        card.style.borderColor = tgt[i].bo;
      });
      rafId = done ? null : requestAnimationFrame(tick);
    }

    function update(cx) {
      /* Proximity weight: linear falloff from each card centre */
      var ws   = BASE.map(function (b) { return Math.max(0, 1 - Math.abs(cx - b) / SPACING); });
      var sumW = ws[0] + ws[1] + ws[2] || 1;
      var nw   = ws.map(function (w) { return w / sumW; });
      var ai   = nw[0] >= nw[1] && nw[0] >= nw[2] ? 0 : nw[1] >= nw[2] ? 1 : 2;

      /* Push adjacent pairs apart — sin peaks at midpoint (exact touching), zero at each base */
      var push = [0, 0, 0];
      if (cx > BASE[0] && cx < BASE[1]) {
        var p = Math.sin(((cx - BASE[0]) / (BASE[1] - BASE[0])) * Math.PI) * MAX_PUSH;
        push[0] -= p;  push[1] += p;
      }
      if (cx > BASE[1] && cx < BASE[2]) {
        var q = Math.sin(((cx - BASE[1]) / (BASE[2] - BASE[1])) * Math.PI) * MAX_PUSH;
        push[1] -= q;  push[2] += q;
      }

      BASE.forEach(function (b, i) {
        tgt[i].tx = b + push[i];
        tgt[i].sc = 0.88 + 0.12 * nw[i];
        tgt[i].op = 1;
        tgt[i].bg = 0.05 * nw[i];
        tgt[i].z  = i === ai ? 3 : 1;
        tgt[i].sh = i === ai ? SH    : 'none';
        tgt[i].bo = i === ai ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)';
      });
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function resetCenter() {
      tgt[0] = { tx:-SPACING, sc:0.92, op:1, bg:0,    z:1, sh:'none', bo:'rgba(255,255,255,0.05)' };
      tgt[1] = { tx:       0, sc:1.00, op:1, bg:0.05, z:2, sh:SH,     bo:'rgba(255,255,255,0.12)' };
      tgt[2] = { tx: SPACING, sc:0.92, op:1, bg:0,    z:1, sh:'none', bo:'rgba(255,255,255,0.05)' };
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    resetCenter();

    fan.addEventListener('mousemove', function (e) {
      var rect = fan.getBoundingClientRect();
      update((e.clientX - rect.left) - rect.width / 2);
    });
    fan.addEventListener('mouseleave', resetCenter);
  }());

  /* ── Marquee: reorder logos & colourize WB ── */
  (function () {
    var track = document.querySelector('.marquee-track');
    if (!track) return;

    var logos   = Array.from(track.querySelectorAll('.m-logo'));
    var setSize = 10; // 10 unique logos per set

    function identify(el) {
      if (el.querySelector('img[src*="caviar"]'))          return 'caviar';
      if (el.querySelector('img[src*="io"]'))              return 'io';
      if (el.querySelector('img[src*="warner"]'))          return 'wb';
      if (el.querySelector('img[src*="netflix"]'))         return 'netflix';
      if (el.querySelector('img[src*="canal"]'))           return 'canal';
      if (el.querySelector('img[src*="dpg"]'))             return 'dpg';
      if (el.querySelector('img[src*="vrt"]'))             return 'vrt';
      if (el.querySelector('img[src*="sony"]'))            return 'sony';
      if (el.querySelector('img[src*="vml"]'))             return 'vml';
      if (el.querySelector('svg[viewBox="0 0 2219 943"]')) return 'disney';
      return 'other';
    }

    var order = ['disney', 'wb', 'canal', 'io', 'dpg', 'netflix', 'caviar', 'vrt', 'sony', 'vml'];
    var map1 = {};
    logos.slice(0, setSize).forEach(function (el) { map1[identify(el)] = el; });

    while (track.firstChild) track.removeChild(track.firstChild);
    // Build exactly 2 identical sets for the seamless -50% loop
    order.forEach(function (k) { if (map1[k]) track.appendChild(map1[k]); });
    order.forEach(function (k) { if (map1[k]) track.appendChild(map1[k].cloneNode(true)); });

    // Reset animation so it starts fresh on the correctly-sized track
    track.style.animation = 'none';
    track.offsetHeight; // force reflow
    track.style.animation = '';
  }());

  /* ── Mobile Hamburger Menu ── */
  (function () {
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileMenu   = document.getElementById('mobileMenu');
    var menuOverlay  = document.getElementById('menuOverlay');
    var closeMenu    = document.getElementById('closeMenu');
    var menuLinks    = document.querySelectorAll('.mobile-menu a, .mobile-menu button:not(#closeMenu)');

    function openMenu() {
      mobileMenu.classList.add('active');
      menuOverlay.classList.add('active');
      hamburgerBtn.classList.add('active');
      document.body.classList.add('menu-open');
    }

    function closeMenus() {
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    hamburgerBtn.addEventListener('click', function () {
      if (mobileMenu.classList.contains('active')) {
        closeMenus();
      } else {
        openMenu();
      }
    });

    closeMenu.addEventListener('click', closeMenus);
    menuOverlay.addEventListener('click', closeMenus);

    menuLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (href && href.indexOf('#') !== -1) {
          e.preventDefault();
          closeMenus();
          setTimeout(function () {
            var target = document.querySelector(href.substring(href.indexOf('#')));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        } else {
          closeMenus();
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenus();
      }
    });
  }());

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ===== SERVICES SECTION ANIMATIONS =====
    // Fade in section label
    gsap.from('.section-head .label', {
      scrollTrigger: {
        trigger: '.services',
        start: 'top 80%'
      },
      duration: 0.8,
      opacity: 0,
      x: -30,
      ease: 'power3.out'
    });

    // Fade in section title
    gsap.from('.section-head h2', {
      scrollTrigger: {
        trigger: '.services',
        start: 'top 80%'
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
      delay: 0.1,
      ease: 'power3.out'
    });

    // Animate service cards with stagger
    gsap.from('.card', {
      scrollTrigger: {
        trigger: '.services',
        start: 'top 70%'
      },
      duration: 0.8,
      opacity: 0,
      y: 50,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'transform'
    });

    // ===== FACILITY SECTION ANIMATIONS =====
    gsap.from('.fs-step', {
      scrollTrigger: {
        trigger: '.facility-stepper',
        start: 'top 80%'
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
      stagger: 0.1,
      ease: 'power3.out'
    });

    gsap.from('.fs-slide', {
      scrollTrigger: {
        trigger: '.facility-stepper',
        start: 'top 75%'
      },
      duration: 0.8,
      opacity: 0,
      y: 50,
      delay: 0.2,
      ease: 'power3.out'
    });

    // ===== WORK SECTION ANIMATIONS =====
    gsap.from('.work', {
      scrollTrigger: {
        trigger: '.work',
        start: 'top 70%'
      },
      duration: 0.8,
      opacity: 0,
      y: 50,
      stagger: 0.12,
      ease: 'power3.out'
    });

    // ===== CLIENTS SECTION ANIMATIONS =====
    // (removed: gsap opacity animation conflicted with CSS marquee — logos were hidden mid-scroll)

    // ===== SCROLL PARALLAX EFFECT ON HERO =====
    gsap.to('.hero-video', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: 80,
      ease: 'none'
    });

    // ===== SMOOTH REFRESH ON SCROLL TRIGGER UPDATE =====
    ScrollTrigger.refresh();
