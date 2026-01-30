import { createElement } from '../lib/dom.js';

export function renderCard({ title, description, href, ctaLabel = 'למחשבון', secondaryHref, secondaryLabel, tag }) {
  const secondary = secondaryHref
    ? `<a class="card__link card__link--secondary" href="${secondaryHref}">${secondaryLabel}</a>`
    : '';

  return createElement(`
    <article class="card">
      ${tag ? `<span class="card__tag">${tag}</span>` : ''}
      <h3 class="card__title">${title}</h3>
      <p class="card__text">${description}</p>
      <div class="card__actions">
        ${href ? `<a class="card__link" href="${href}">${ctaLabel}</a>` : ''}
        ${secondary}
      </div>
    </article>
  `);
}
