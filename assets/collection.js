/**
 * Collection Page Logic
 * Extracted from main-collection.liquid
 */

(function () {
  const STORAGE_KEY = 'collection-grid-columns-v1';
  const DEFAULT_MIN = 3;
  const DEFAULT_MAX = 6;

  function clamp(value, min, max) {
    const parsedValue = Number.parseInt(value, 10);
    if (Number.isNaN(parsedValue)) return min;
    return Math.min(Math.max(parsedValue, min), max);
  }

  function readStoredState() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      return {};
    }
  }

  function writeStoredState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {}
  }

  function getSectionScope(sectionId) {
    return document.getElementById('shopify-section-' + sectionId) || document;
  }

  function applyColumnsToGrid(sectionId, values) {
    const scope = getSectionScope(sectionId);
    const grid = scope.querySelector('[data-collection-grid][data-section-id="' + sectionId + '"]');
    if (!grid) return;

    grid.style.setProperty('--products-per-row', String(values.columns));
  }

  function getDefaults(controlElement) {
    const min = clamp(controlElement.dataset.minColumns || DEFAULT_MIN, DEFAULT_MIN, DEFAULT_MAX);
    const max = clamp(controlElement.dataset.maxColumns || DEFAULT_MAX, min, DEFAULT_MAX);

    return {
      min: min,
      max: max,
      columns: clamp(controlElement.dataset.defaultColumns || min, min, max),
    };
  }

  function updateButtonsState(controlElement, values, min, max) {
    controlElement.querySelectorAll('[data-grid-columns-set]').forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) return;

      const rawValue = Number.parseInt(button.dataset.gridColumnsSet || '', 10);
      const hasValidValue = !Number.isNaN(rawValue);
      const optionValue = hasValidValue ? rawValue : values.columns;
      const isDisabled = !hasValidValue || optionValue < min || optionValue > max;
      const isSelected = !isDisabled && optionValue === values.columns;

      button.disabled = isDisabled;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-disabled', isDisabled.toString());
      button.setAttribute('aria-pressed', isSelected.toString());
    });
  }

  function renderControlState(controlElement, values, min, max) {
    controlElement.dataset.columns = String(values.columns);
    updateButtonsState(controlElement, values, min, max);
  }

  function restoreControlState(controlElement, state) {
    const sectionId = controlElement.dataset.sectionId;
    if (!sectionId) return;

    const defaults = getDefaults(controlElement);
    const storedSectionState = state[sectionId] || {};
    const storedColumns = storedSectionState.columns ?? storedSectionState.lg ?? storedSectionState.md;
    const values = {
      columns: clamp(storedColumns ?? defaults.columns, defaults.min, defaults.max),
    };

    renderControlState(controlElement, values, defaults.min, defaults.max);
    applyColumnsToGrid(sectionId, values);
  }

  function refreshControls() {
    const state = readStoredState();

    document.querySelectorAll('[data-collection-grid-controls]').forEach((controlElement) => {
      if (!(controlElement instanceof HTMLElement)) return;
      restoreControlState(controlElement, state);
    });
  }

  function handleControlClick(event) {
    const eventTarget = event.target;
    if (!(eventTarget instanceof Element)) return;

    const button = eventTarget.closest('[data-grid-columns-set]');
    if (!(button instanceof HTMLButtonElement)) return;

    const controlElement = button.closest('[data-collection-grid-controls]');
    if (!(controlElement instanceof HTMLElement)) return;

    const sectionId = controlElement.dataset.sectionId;
    if (!sectionId) return;

    const defaults = getDefaults(controlElement);
    const values = {
      columns: clamp(button.dataset.gridColumnsSet || defaults.columns, defaults.min, defaults.max),
    };

    renderControlState(controlElement, values, defaults.min, defaults.max);
    applyColumnsToGrid(sectionId, values);

    const state = readStoredState();
    state[sectionId] = values;
    writeStoredState(state);
  }

  /**
   * Optimized MutationObserver
   * Observes specific containers instead of document.body if possible
   */
  function observeSectionUpdates() {
    if (window.collectionGridColumnsObserver) return;

    const observer = new MutationObserver((mutations) => {
      let shouldRefresh = false;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;

          // Target specific selectors to reduce work
          if (
            node.hasAttribute('data-collection-grid-controls') || 
            node.hasAttribute('data-collection-grid') ||
            node.querySelector('[data-collection-grid-controls], [data-collection-grid]')
          ) {
            shouldRefresh = true;
            break;
          }
        }
        if (shouldRefresh) break;
      }

      if (shouldRefresh) {
        // Use requestIdleCallback or Scheduler if available to avoid blocking
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => refreshControls());
        } else {
          refreshControls();
        }
      }
    });

    // Observe the main content area instead of the whole body if it exists
    const mainContent = document.querySelector('main') || document.body;
    observer.observe(mainContent, { childList: true, subtree: true });
    window.collectionGridColumnsObserver = observer;
  }

  function initCollectionGridColumns() {
    if (!window.collectionGridColumnsInitialized) {
      window.collectionGridColumnsInitialized = true;
      document.addEventListener('click', handleControlClick);
      observeSectionUpdates();
    }

    refreshControls();
  }

  // Add to Cart Logic
  function initAddToCart() {
    document.addEventListener('submit', function(e) {
      const form = e.target.closest('.add-to-cart-form');
      if (!form) return;
      
      e.preventDefault();
      
      const formData = new FormData(form);
      
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        return fetch('/cart.js');
      })
      .then(response => response.json())
      .then(cart => {
        const cartCountElements = document.querySelectorAll('.cart-count-bubble, [data-cart-count]');
        cartCountElements.forEach(el => {
          el.textContent = cart.item_count;
        });
        
        const cartEvent = new CustomEvent('cart:updated', { detail: cart });
        document.dispatchEvent(cartEvent);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
      });
    });
  }

  // Initialize on load or idle
  const init = () => {
    initCollectionGridColumns();
    initAddToCart();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    // If already loaded, use idle callback for grid initialization
    if (window.requestIdleCallback) {
      window.requestIdleCallback(init);
    } else {
      init();
    }
  }
})();
