import { createElement } from '../lib/dom.js';

export function renderResultPanel({ title = 'תוצאות', content = '' } = {}) {
  return createElement(`
    <section class="result-panel" aria-live="polite">
      <h2 class="result-panel__title">${title}</h2>
      <div class="result-panel__content">${content}</div>
    </section>
  `);
}
