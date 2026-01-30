import '../styles/main.css';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { renderAdSlot } from '../components/ad-slot.js';
import { initTheme, bindThemeToggle } from '../lib/theme.js';
import { loadFormData, saveFormData } from '../lib/storage.js';
import { collectFormData, hydrateFormData } from '../lib/validation.js';

const ADS_ENABLED = true;

function renderBreadcrumbs(items) {
  if (!items || items.length === 0) {
    return '';
  }
  const crumbs = items
    .map((item) => {
      if (item.href) {
        return `<a href="${item.href}">${item.label}</a>`;
      }
      return `<span>${item.label}</span>`;
    })
    .join(' <span class="breadcrumb__sep">/</span> ');
  return `<nav class="breadcrumb" aria-label="פירורי לחם">${crumbs}</nav>`;
}

export function renderLayout({
  title,
  subtitle,
  intro,
  breadcrumbs = [],
  content,
  withAds = true,
  highlight = ''
}) {
  initTheme();
  const app = document.getElementById('app');
  app.innerHTML = '';

  const header = renderHeader(window.location.pathname);
  const footer = renderFooter();

  const main = document.createElement('main');
  main.className = 'site-main';
  main.innerHTML = `
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__content">
          ${highlight ? `<span class="hero__tag">${highlight}</span>` : ''}
          ${renderBreadcrumbs(breadcrumbs)}
          <h1>${title}</h1>
          ${subtitle ? `<p class="hero__subtitle">${subtitle}</p>` : ''}
          ${intro ? `<p class="hero__intro">${intro}</p>` : ''}
        </div>
      </div>
    </section>
    <section class="page-section">
      <div class="container page-grid">
        <div class="page-content"></div>
        ${withAds && ADS_ENABLED ? '<aside class="sidebar"></aside>' : ''}
      </div>
    </section>
  `;

  const contentTarget = main.querySelector('.page-content');
  if (typeof content === 'string') {
    contentTarget.innerHTML = content;
  } else if (content instanceof HTMLElement || content instanceof DocumentFragment) {
    contentTarget.append(content);
  }

  if (withAds && ADS_ENABLED) {
    const sidebar = main.querySelector('.sidebar');
    const slots = [
      renderAdSlot({ label: 'Ad slot' }),
      renderAdSlot({ label: 'Ad slot', size: 'tall' })
    ];
    slots.forEach((slot) => sidebar.append(slot));
  }

  app.append(header, main, footer);
  bindThemeToggle(header.querySelector('[data-theme-toggle]'));
}

export function attachFormPersistence(form, key) {
  if (!form) {
    return;
  }
  const saved = loadFormData(key);
  hydrateFormData(form, saved);
  form.addEventListener('input', () => {
    saveFormData(key, collectFormData(form));
  });
}

export function renderInlineAd(target) {
  if (!ADS_ENABLED || !target) {
    return;
  }
  target.append(renderAdSlot({ label: 'Ad slot' }));
}
