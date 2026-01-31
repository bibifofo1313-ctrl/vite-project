import { createElement } from '../lib/dom.js';
import { navLinks } from '../data/nav.js';

export function renderFooter() {
  const links = navLinks
    .map((link) => `<a class="footer__link" href="${link.href}">${link.label}</a>`)
    .join('');
  const year = new Date().getFullYear();

  return createElement(`
    <footer class="site-footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <span class="logo__mark">ROI</span>
          <span>לימודים וקריירה בישראל</span>
        </div>
        <div class="footer__links" aria-label="קישורים תחתיים">
          ${links}
          <a class="footer__link" href="/accessibility.html">נגישות</a>
        </div>
        <div class="footer__meta">© ${year} כל הזכויות שמורות</div>
      </div>
    </footer>
  `);
}
