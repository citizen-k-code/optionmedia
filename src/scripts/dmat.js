    /* ── Mobile menu ── */
    (function () {
      var btn = document.getElementById('hamburgerBtn');
      var menu = document.getElementById('mobileMenu');
      var overlay = document.getElementById('menuOverlay');
      var close = document.getElementById('closeMenu');

      function open() {
        btn.classList.add('active');
        menu.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('menu-open');
      }

      function shut() {
        btn.classList.remove('active');
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      }

      btn.addEventListener('click', function () {
        menu.classList.contains('active') ? shut() : open();
      });
      close.addEventListener('click', shut);
      overlay.addEventListener('click', shut);

      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', shut);
      });
    })();
