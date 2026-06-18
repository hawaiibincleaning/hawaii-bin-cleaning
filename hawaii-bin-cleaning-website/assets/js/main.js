(function () {
  const cfg = window.HBC_CONFIG || {};
  const current = document.body.getAttribute('data-page') || '';
  const navItems = (cfg.nav || []).filter(item => !item.hiddenFlag || cfg[item.hiddenFlag]);

  function navHtml() {
    return navItems.map(item => {
      const active = item.key === current ? ' aria-current="page"' : '';
      return `<a href="${item.href}"${active}>${item.label}</a>`;
    }).join('');
  }

  function customerLink(type) {
    if (type === 'portal') return cfg.customerPortalUrl || '#customer-portal';
    if (type === 'quote') return cfg.quoteUrl || cfg.foundersDiscountUrl || '/founders-discount';
    return cfg.bookingUrl || cfg.foundersDiscountUrl || '/founders-discount';
  }

  function externalizeGoogleLink(link, url) {
    if (!link || !url) return;
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  }

  const headerMount = document.getElementById('site-header');
  if (headerMount) {
    headerMount.innerHTML = `
      <div class="site-topbar"><a href="https://hawaiibincleaning.com/founders-discount">Coming soon on Oʻahu — join the founders discount list HERE</a></div>
      <header class="site-header" data-header>
        <div class="container header-inner">
          <a class="logo-link" href="/" aria-label="${cfg.businessName || 'Hawaii Bin Cleaning'} home">
            <picture>
              <source srcset="assets/images/hbc-logo-transparent.webp" type="image/webp">
              <img src="assets/images/hbc-logo-transparent.png" alt="${cfg.businessName || 'Hawaii Bin Cleaning'} logo">
            </picture>
          </a>
          <nav class="nav-links" aria-label="Main navigation">${navHtml()}</nav>
          <div class="header-actions">
            <a class="btn btn-primary btn-small header-cta" data-platform-link="book" href="${customerLink('book')}">Founders Discount</a>
          </div>
          <button class="mobile-toggle" type="button" data-mobile-toggle aria-expanded="false">Menu</button>
        </div>
      </header>`;
  }

  const footerMount = document.getElementById('site-footer');
  if (footerMount) {
    const year = new Date().getFullYear();
    footerMount.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid footer-grid-clean">
            <div>
              <picture>
                <source srcset="assets/images/hbc-logo-transparent.webp" type="image/webp">
                <img class="footer-logo" src="assets/images/hbc-logo-transparent.png" alt="${cfg.businessName || 'Hawaii Bin Cleaning'} logo">
              </picture>
              <p>${cfg.tagline || ''} A local, family-owned service for cleaner, fresher bins.</p>
            </div>
            <div>
              <div class="footer-title">Explore</div>
              <ul class="footer-links">${navItems.map(item => `<li><a href="${item.href}">${item.label}</a></li>`).join('')}</ul>
            </div>
            <div>
              <div class="footer-title">Contact</div>
              <ul class="footer-links">
                <li><a href="${cfg.siteUrl || '/'}">${cfg.website || 'hawaiibincleaning.com'}</a></li>
                <li><a href="mailto:${cfg.email || 'info@hawaiibincleaning.com'}">${cfg.email || 'info@hawaiibincleaning.com'}</a></li>
                <li><a data-platform-link="book" href="${customerLink('book')}">Founders Discount</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} ${cfg.businessName || 'Hawaii Bin Cleaning'}. All rights reserved.</span>
            <span><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a></span>
          </div>
        </div>
      </footer>`;
  }

  document.querySelectorAll('[data-platform-link]').forEach(link => {
    const type = link.getAttribute('data-platform-link');
    link.setAttribute('href', customerLink(type));
  });

  document.querySelectorAll('[data-google-form-link]').forEach(link => externalizeGoogleLink(link, cfg.googleFormPublicUrl));
  document.querySelectorAll('[data-google-form-edit-link]').forEach(link => externalizeGoogleLink(link, cfg.googleFormEditUrl));
  document.querySelectorAll('[data-google-sheet-link]').forEach(link => externalizeGoogleLink(link, cfg.googleSheetUrl));

  function isConfiguredEndpoint(url) {
    return Boolean(url && /^https:\/\//i.test(url) && !url.includes('PASTE_GOOGLE_APPS_SCRIPT'));
  }

  function setFormStatus(form, message, state) {
    const status = form.querySelector('[data-form-status]');
    if (!status) return;
    status.textContent = message;
    status.setAttribute('data-state', state || 'info');
  }

  function setSubmitState(button, isLoading) {
    if (!button) return;
    if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Sending...' : button.dataset.originalText;
  }

  document.querySelectorAll('[data-native-sheet-form]').forEach(form => {
    const endpoint = cfg.googleAppsScriptEndpoint || '';
    const submitButton = form.querySelector('button[type="submit"]');
    const timestampField = form.querySelector('[name="submitted_at"]');
    const pageUrlField = form.querySelector('[name="submission_url"]');

    if (isConfiguredEndpoint(endpoint)) {
      form.setAttribute('action', endpoint);
      setFormStatus(form, 'Secure native form ready — submissions will be added to the Hawaii Bin Cleaning Google Sheet.', 'ready');
    } else {
      setFormStatus(form, 'Owner setup needed: paste your deployed Google Apps Script Web App URL in assets/js/site-config.js before this form can save to Google Sheets.', 'setup');
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!isConfiguredEndpoint(endpoint)) {
        setFormStatus(form, 'Almost ready: deploy the Apps Script included in this website package, then paste the Web App URL into googleAppsScriptEndpoint.', 'error');
        return;
      }

      if (timestampField) timestampField.value = new Date().toISOString();
      if (pageUrlField) pageUrlField.value = window.location.href;

      const data = new URLSearchParams(new FormData(form));
      setSubmitState(submitButton, true);
      setFormStatus(form, 'Sending your founders discount request...', 'sending');

      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body: data
        });
        form.reset();
        setFormStatus(form, 'Mahalo! Your request was submitted. Hawaii Bin Cleaning will follow up when founders discount routes open.', 'success');
      } catch (error) {
        setFormStatus(form, 'Something went wrong while submitting. Please try again or contact Hawaii Bin Cleaning directly.', 'error');
      } finally {
        setSubmitState(submitButton, false);
      }
    });
  });

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-mobile-toggle]');
    if (toggle) {
      const header = document.querySelector('[data-header]');
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      header && header.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('no-scroll', !expanded);
    }
    const navLink = event.target.closest('.nav-links a, .header-actions a');
    if (navLink) {
      const header = document.querySelector('[data-header]');
      const toggleButton = document.querySelector('[data-mobile-toggle]');
      header && header.classList.remove('is-open');
      toggleButton && toggleButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
  });

  const revealItems = document.querySelectorAll('.hero-card, .truck-frame, .float-card, .page-hero .container > *, .section .container > .eyebrow, .section .container > h2, .section .container > .lede, .section .card, .section .callout, .section .split > *, .section .form-card, .section .notice, .section .embed-placeholder, .section .faq-item');
  revealItems.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 55}ms`);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }
})();
