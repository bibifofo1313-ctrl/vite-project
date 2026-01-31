import { createElement } from '../lib/dom.js';
import { navLinks } from '../data/nav.js';

function isActiveLink(href, currentPath) {
  if (href === '/') {
    return currentPath === '/' || currentPath.endsWith('/index.html');
  }
  if (href.includes('calculators.html')) {
    return (
      currentPath === '/calculators.html' ||
      currentPath.startsWith('/calculators/') ||
      currentPath.startsWith('/articles/')
    );
  }
  return currentPath === href;
}

export function renderHeader(currentPath = '/') {
  const navItems = navLinks
    .map((link) => {
      const active = isActiveLink(link.href, currentPath);
      return `
        <a class="nav__link${active ? ' is-active' : ''}" href="${link.href}" ${
          active ? 'aria-current="page"' : ''
        }>
          ${link.label}
        </a>
      `;
    })
    .join('');

  const header = createElement(`
    <header class="site-header">
      <div class="container header__inner">
        <a class="logo" href="/">
          <span class="logo__mark">ROI</span>
          <span class="logo__text">מחשבוני לימודים וקריירה</span>
        </a>
        <nav class="nav" aria-label="ניווט ראשי">
          ${navItems}
        </nav>
        <button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false">
          <span class="theme-toggle__icon" aria-hidden="true">◐</span>
          מצב כהה
        </button>
      </div>
    </header>
  `);

  return header;
}
