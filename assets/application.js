/**
 * Fragrance Theme - Application JavaScript
 * All code wrapped in IIFE to prevent global namespace collisions.
 */
(function () {
  'use strict';

  /* --------------------------------
   * Utility: Add event to element(s)
   * -------------------------------- */
  var addEventOnElem = function (elem, type, callback) {
    if (!elem) return;
    if (elem.length > 1) {
      for (var i = 0; i < elem.length; i++) {
        if (elem[i] && typeof elem[i].addEventListener === 'function') {
          elem[i].addEventListener(type, callback);
        }
      }
    } else {
      if (typeof elem.addEventListener === 'function') {
        elem.addEventListener(type, callback);
      }
    }
  };

  /* --------------------------------
   * Modal toggle
   * -------------------------------- */
  window.openModal = function () {
    var modal = document.getElementById('myModal');
    if (modal) modal.style.display = 'flex';
  };

  window.closeModal = function () {
    var modal = document.getElementById('myModal');
    if (modal) modal.style.display = 'none';
  };

  window.closeCartbar = function () {
    var modal = document.getElementById('myModal2');
    if (modal) modal.style.display = 'none';
  };

  window.toggleForm = function (formToShow) {
    var login = document.getElementById('login');
    var register = document.getElementById('register');
    if (!login || !register) return;
    if (formToShow === 'register') {
      login.classList.add('hidden');
      register.classList.remove('hidden');
    } else {
      login.classList.remove('hidden');
      register.classList.add('hidden');
    }
  };

  // Close modal on overlay click
  window.addEventListener('click', function (event) {
    var modal = document.getElementById('myModal');
    if (modal && event.target === modal) {
      window.closeModal();
    }
  });

  /* --------------------------------
   * Navbar toggle
   * -------------------------------- */
  var navTogglers = document.querySelectorAll('[data-nav-toggler]');
  var navbar = document.querySelector('[data-navbar]');
  var navbarLinks = document.querySelectorAll('[data-nav-link]');
  var overlay = document.querySelector('[data-overlay]');

  var toggleNavbar = function () {
    if (navbar) navbar.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
  };

  addEventOnElem(navTogglers, 'click', toggleNavbar);

  var closeNavbar = function () {
    if (navbar) navbar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  };

  addEventOnElem(navbarLinks, 'click', closeNavbar);

  /* --------------------------------
   * Sticky header & back-to-top
   * -------------------------------- */
  var header = document.querySelector('[data-header]');
  var backTopBtn = document.querySelector('[data-back-top-btn]');
  var lastScrolledPos = 0;
  var isScrolling = false;

  var handleScroll = function () {
    var currentScrollY = window.scrollY;

    if (header) {
      if (currentScrollY > 150) {
        header.classList.add('active');
      } else {
        header.classList.remove('active');
      }
      if (lastScrolledPos >= currentScrollY) {
        header.classList.remove('header-hide');
      } else {
        header.classList.add('header-hide');
      }
    }

    if (backTopBtn) {
      if (currentScrollY > 150) {
        backTopBtn.classList.add('active');
      } else {
        backTopBtn.classList.remove('active');
      }
    }

    lastScrolledPos = currentScrollY;
    isScrolling = false;
  };

  window.addEventListener('scroll', function () {
    if (!isScrolling) {
      window.requestAnimationFrame(handleScroll);
      isScrolling = true;
    }
  }, { passive: true });

  /* --------------------------------
   * Section reveal (IntersectionObserver)
   * -------------------------------- */
  var sections = document.querySelectorAll('[data-section]');
  var revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(function (section) {
    revealObserver.observe(section);
  });

  /* --------------------------------
   * AOS replacement (lightweight)
   * Uses CSS classes defined in theme.liquid
   * -------------------------------- */
  var aosElements = document.querySelectorAll('[data-aos]');
  if (aosElements.length > 0) {
    var aosObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    aosElements.forEach(function (el) {
      aosObserver.observe(el);
    });
  }

})();
