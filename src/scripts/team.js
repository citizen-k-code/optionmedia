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
      if (mobileMenu.classList.contains('active')) { closeMenus(); } else { openMenu(); }
    });

    closeMenu.addEventListener('click', closeMenus);
    menuOverlay.addEventListener('click', closeMenus);
    menuLinks.forEach(function (link) { link.addEventListener('click', closeMenus); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) { closeMenus(); }
    });
  }());
