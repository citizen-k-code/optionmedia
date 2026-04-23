  (function () {
    /* ── Mobile Menu ── */
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileMenu   = document.getElementById('mobileMenu');
    var menuOverlay  = document.getElementById('menuOverlay');
    var closeMenuBtn = document.getElementById('closeMenu');
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
    closeMenuBtn.addEventListener('click', closeMenus);
    menuOverlay.addEventListener('click', closeMenus);
    menuLinks.forEach(function (link) { link.addEventListener('click', closeMenus); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) { closeMenus(); }
    });

    /* ── Multi-Step Form Logic ── */
    var currentStep = 1;
    var formData = {
      services: [],
      timeline: '',
      budget: '',
      projectTitle: '',
      contentType: '',
      projectDesc: '',
      fullName: '',
      company: '',
      email: '',
      phone: '',
      notes: ''
    };

    var steps = [
      document.getElementById('step1'),
      document.getElementById('step2'),
      document.getElementById('step3')
    ];
    var progressSteps = document.querySelectorAll('.progress-step');
    var progressLines = [document.getElementById('line1'), document.getElementById('line2')];
    var successPanel = document.getElementById('successPanel');

    function goToStep(n) {
      // Hide current
      steps.forEach(function (s) {
        s.classList.remove('active');
        s.style.display = 'none';
      });

      // Update progress
      progressSteps.forEach(function (ps, i) {
        var stepNum = i + 1;
        ps.classList.remove('active', 'completed');
        if (stepNum < n) ps.classList.add('completed');
        else if (stepNum === n) ps.classList.add('active');
      });

      progressLines.forEach(function (line, i) {
        if (i < n - 1) line.classList.add('filled');
        else line.classList.remove('filled');
      });

      // Show target
      currentStep = n;
      steps[n - 1].style.display = 'block';
      steps[n - 1].classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Service card selection
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('click', function () {
        card.classList.toggle('selected');
      });
    });

    // Timeline selection (single)
    document.querySelectorAll('.timeline-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        document.querySelectorAll('.timeline-pill').forEach(function (p) { p.classList.remove('selected'); });
        pill.classList.add('selected');
      });
    });

    // Budget selection (single)
    document.querySelectorAll('.budget-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        document.querySelectorAll('.budget-pill').forEach(function (p) { p.classList.remove('selected'); });
        pill.classList.add('selected');
      });
    });

    // Progress step clicks
    progressSteps.forEach(function (ps) {
      ps.addEventListener('click', function () {
        var target = parseInt(ps.getAttribute('data-step'));
        if (target <= currentStep || ps.classList.contains('completed')) {
          goToStep(target);
        }
      });
    });

    // Navigation buttons
    document.getElementById('toStep2').addEventListener('click', function () {
      var selected = document.querySelectorAll('.service-card.selected');
      if (selected.length === 0) {
        // Gentle shake animation
        document.getElementById('serviceGrid').style.animation = 'none';
        setTimeout(function () {
          document.getElementById('serviceGrid').style.animation = 'shake 0.4s ease';
        }, 10);
        return;
      }
      goToStep(2);
    });

    document.getElementById('backTo1').addEventListener('click', function () { goToStep(1); });
    document.getElementById('toStep3').addEventListener('click', function () {
      buildReview();
      goToStep(3);
    });
    document.getElementById('backTo2').addEventListener('click', function () { goToStep(2); });

    // Build review panel
    function buildReview() {
      var grid = document.getElementById('reviewGrid');
      grid.innerHTML = '';

      // Services
      var services = [];
      document.querySelectorAll('.service-card.selected').forEach(function (c) {
        services.push(c.querySelector('h3').textContent);
      });

      addReviewItem(grid, 'Services', services.map(function (s) { return '<span class="tag">' + s + '</span>'; }).join(' ') || '<span style="color:var(--muted)">None selected</span>');

      // Content Type
      var ct = document.getElementById('contentType');
      addReviewItem(grid, 'Content Type', ct.value || '<span style="color:var(--muted)">Not specified</span>');

      // Project Title
      var pt = document.getElementById('projectTitle').value;
      addReviewItem(grid, 'Project', pt || '<span style="color:var(--muted)">Not specified</span>');

      // Timeline
      var tl = document.querySelector('.timeline-pill.selected');
      addReviewItem(grid, 'Timeline', tl ? tl.querySelector('.tl-text').textContent + ' — ' + tl.querySelector('.tl-sub').textContent : '<span style="color:var(--muted)">Not specified</span>');

      // Budget
      var bg = document.querySelector('.budget-pill.selected');
      addReviewItem(grid, 'Budget', bg ? bg.getAttribute('data-budget') : '<span style="color:var(--muted)">Not specified</span>');

      // Description
      var desc = document.getElementById('projectDesc').value;
      if (desc) {
        addReviewItem(grid, 'Description', desc.length > 120 ? desc.substring(0, 120) + '…' : desc);
      }
    }

    function addReviewItem(parent, label, value) {
      var item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = '<div class="ri-label">' + label + '</div><div class="ri-value">' + value + '</div>';
      parent.appendChild(item);
    }

    // Submit
    document.getElementById('submitBtn').addEventListener('click', function () {
      var name = document.getElementById('fullName').value.trim();
      var email = document.getElementById('email').value.trim();

      if (!name || !email) {
        var fields = document.querySelectorAll('#step3 .field input[required], #step3 .field input');
        fields.forEach(function (f) {
          if (!f.value.trim() && (f.id === 'fullName' || f.id === 'email')) {
            f.style.borderColor = 'var(--orange)';
            f.style.boxShadow = '0 0 0 3px rgba(223,254,1,0.12)';
            setTimeout(function () {
              f.style.borderColor = '';
              f.style.boxShadow = '';
            }, 2000);
          }
        });
        return;
      }

      // Hide form, show success
      steps.forEach(function (s) { s.classList.remove('active'); s.style.display = 'none'; });
      document.getElementById('progressRail').style.display = 'none';
      successPanel.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Shake keyframe injection
    var style = document.createElement('style');
    style.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 50%{transform:translateX(8px)} 75%{transform:translateX(-4px)} }';
    document.head.appendChild(style);

  }());
