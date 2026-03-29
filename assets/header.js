(function() {
  'use strict';

  const config = window.HeaderConfig || {};

  function ensureModalInBody(id) {
    var modal = document.getElementById(id);
    if (!modal) return null;
    if (modal.parentNode !== document.body) {
      document.body.appendChild(modal);
    }
    return modal;
  }

  function setModalOpenState(modal, isOpen) {
    if (!modal) return;
    modal.dataset.modalOpen = isOpen ? 'true' : 'false';
    modal.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    modal.style.display = isOpen ? 'block' : 'none';
  }

  function initializeModalState(id) {
    var modal = ensureModalInBody(id);
    if (!modal) return null;

    if (modal.dataset.modalOpen !== 'true') {
      setModalOpenState(modal, false);
    } else {
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'block';
    }

    return modal;
  }

  function syncModalBodyState() {
    var openModal = document.querySelector('.modal[data-modal-open="true"]') !== null;
    document.body.classList.toggle('modal-open', openModal);
  }

  function resetSidebarSubmenus() {
    document.querySelectorAll('[data-submenu-toggle]').forEach(function(toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    });

    document.querySelectorAll('.dropdown-list, .dropdown-sublist').forEach(function(menu) {
      menu.hidden = true;
    });
  }

  var sidebarHideTimer = null;

  function setSidebarState(isOpen) {
    var navbar = document.querySelector('[data-navbar]');
    var overlay = document.querySelector('[data-overlay]');
    if (!navbar || !overlay) return;

    if (sidebarHideTimer) {
      clearTimeout(sidebarHideTimer);
      sidebarHideTimer = null;
    }

    if (isOpen) {
      navbar.hidden = false;
      overlay.hidden = false;
      navbar.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');

      requestAnimationFrame(function() {
        navbar.classList.add('active');
        overlay.classList.add('active');
      });
      return;
    }

    navbar.classList.remove('active');
    overlay.classList.remove('active');
    navbar.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    sidebarHideTimer = window.setTimeout(function() {
      navbar.hidden = true;
      overlay.hidden = true;
      resetSidebarSubmenus();
    }, 550);
  }

  var predictiveSearchAssetsPromise = null;
  var predictiveSearchStylesheetHref = config.predictiveSearchStylesheet;

  function loadScriptOnce(src) {
    return new Promise(function(resolve, reject) {
      var existingScript = document.querySelector('script[src="' + src + '"]');

      if (existingScript) {
        if (existingScript.dataset && existingScript.dataset.loaded === 'true') {
          resolve();
          return;
        }

        existingScript.addEventListener('load', resolve, { once: true });
        existingScript.addEventListener('error', function() {
          reject(new Error('Failed to load script: ' + src));
        }, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = src;
      script.defer = true;

      script.addEventListener('load', function() {
        script.dataset.loaded = 'true';
        resolve();
      }, { once: true });

      script.addEventListener('error', function() {
        reject(new Error('Failed to load script: ' + src));
      }, { once: true });

      document.head.appendChild(script);
    });
  }

  function loadStylesheetOnce(href) {
    return new Promise(function(resolve, reject) {
      var existingLink = document.querySelector('link[href="' + href + '"]');

      if (existingLink) {
        resolve();
        return;
      }

      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.addEventListener('load', resolve, { once: true });
      link.addEventListener('error', function() {
        reject(new Error('Failed to load stylesheet: ' + href));
      }, { once: true });
      document.head.appendChild(link);
    });
  }

  function loadPredictiveSearchAssets() {
    if (window.__velourPredictiveSearchReady) return Promise.resolve();
    if (!document.querySelector('predictive-search')) {
      window.__velourPredictiveSearchReady = true;
      return Promise.resolve();
    }
    if (predictiveSearchAssetsPromise) return predictiveSearchAssetsPromise;

    predictiveSearchAssetsPromise = Promise.all([
      loadStylesheetOnce(predictiveSearchStylesheetHref),
      loadScriptOnce(config.searchFormScript),
      loadScriptOnce(config.predictiveSearchScript)
    ]).then(function() {
      window.__velourPredictiveSearchReady = true;
    }).catch(function(error) {
      predictiveSearchAssetsPromise = null;
      throw error;
    });

    return predictiveSearchAssetsPromise;
  }

  function primePredictiveSearchAssets() {
    loadPredictiveSearchAssets().catch(function(error) {
      console.warn(error);
    });
  }

  function setupSearchAssetPriming() {
    document.querySelectorAll('[onclick="openSearchModal()"]').forEach(function(button) {
      button.addEventListener('mouseenter', primePredictiveSearchAssets, { once: true });
      button.addEventListener('focus', primePredictiveSearchAssets, { once: true });
      button.addEventListener('touchstart', primePredictiveSearchAssets, { once: true, passive: true });
    });
  }

  /* Modal Actions */
  window.openSearchModal = function() {
    var searchModal = ensureModalInBody('search-modal');
    if (!searchModal) return;
    setModalOpenState(searchModal, true);
    syncModalBodyState();
    primePredictiveSearchAssets();
    setTimeout(() => {
      document.getElementById('Search-In-Modal').focus();
    }, 100);
  };

  window.closeSearchModal = function() {
    var searchModal = document.getElementById('search-modal');
    if (!searchModal) return;
    setModalOpenState(searchModal, false);
    syncModalBodyState();
  };

  window.openLoginModal = function() {
    var loginModal = ensureModalInBody('login-modal');
    if (!loginModal) return;
    setModalOpenState(loginModal, true);
    syncModalBodyState();
  };

  window.closeLoginModal = function() {
    var loginModal = document.getElementById('login-modal');
    if (!loginModal) return;
    setModalOpenState(loginModal, false);
    syncModalBodyState();
  };

  // Close modals on outside click
  window.addEventListener('click', function(event) {
    var searchModal = document.getElementById('search-modal');
    var loginModal = document.getElementById('login-modal');
    var cartModal = document.getElementById('myModal2');
    if (event.target == searchModal) {
      window.closeSearchModal();
    }
    if (event.target == loginModal) {
      window.closeLoginModal();
    }
    if (event.target == cartModal && typeof window.closeCartbar === 'function') {
      window.closeCartbar();
    }
  });

  /* UI Toggles (Sidebar) */
  document.addEventListener('click', function(event) {
    var target = event.target;

    var submenuToggle = target.closest('[data-submenu-toggle]');
    if (submenuToggle) {
      var controlledMenu = document.getElementById(submenuToggle.getAttribute('aria-controls'));
      if (controlledMenu) {
        var isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';
        submenuToggle.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
        controlledMenu.hidden = isExpanded;
      }
      return;
    }
    
    // Sidebar Toggle (Nav Toggler)
    var navToggler = target.closest('[data-nav-toggler]');
    if (navToggler) {
      var navbar = document.querySelector('[data-navbar]');
      setSidebarState(!(navbar && navbar.classList.contains('active')));
      return;
    }

    // Close Sidebar on link click or overlay click
    if (target.closest('[data-nav-link]') || target.closest('[data-overlay]')) {
      setSidebarState(false);
    }
  });

  /* Cart State */
  window.updateCartCount = function() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        var itemCount = Number(cart.item_count) || 0;
        document.querySelectorAll('.btn-badge').forEach(function(el) {
          el.textContent = itemCount;
          el.classList.toggle('is-hidden', itemCount === 0);
          el.setAttribute('aria-hidden', itemCount === 0 ? 'true' : 'false');
        });
      })
      .catch(error => console.error('Error fetching cart data:', error));
  };

  document.addEventListener('DOMContentLoaded', function() {
    if (window.updateCartCount) window.updateCartCount();
  });
  document.addEventListener('cart:updated', function() {
    if (window.updateCartCount) window.updateCartCount();
  });
  if (document.readyState !== 'loading') {
    window.updateCartCount();
  }

  /* Cart Modal Actions - uses the existing myModal2 */
  window.openCart = function() {
    var modal = document.getElementById('myModal2');
    if (modal) {
      modal.style.display = 'block'; // Open cart drawer
      document.body.classList.add('modal-open');
      if (typeof fetchCart === 'function') fetchCart();
    }
  };

  /* Localization Management */
  document.querySelectorAll('.localization-form select').forEach(function(element) {
      element.addEventListener('change', function(e) { e.target.form.submit(); });
  }); 

  /* Header Currency Dropdown Logic */
  const headerDropdown = document.querySelector('#currency-dropdown-header');
  if (headerDropdown) {
    const select = headerDropdown.querySelector('.select');
    const caretWrapper = headerDropdown.querySelector('.caret-icon-wrapper');
    const menu = headerDropdown.querySelector('.newmenu');
    const options = headerDropdown.querySelectorAll('.newmenu li');
    const form = headerDropdown.closest('form');
    const hiddenInput = form.querySelector('input[name="country_code"]');

    select.addEventListener('click', (e) => {
        e.stopPropagation();
        caretWrapper.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', ()=> {
            const value = option.getAttribute('data-value');
            hiddenInput.value = value;
            form.submit();
        });
    });

    document.addEventListener('click', () => {
        if (caretWrapper) caretWrapper.classList.remove('caret-rotate');
        menu.classList.remove('menu-open');
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initializeModalState('search-modal');
    initializeModalState('login-modal');
    setSidebarState(false);
    syncModalBodyState();
    setupSearchAssetPriming();
  });

  if (document.readyState !== 'loading') {
    setupSearchAssetPriming();
  }

})();
