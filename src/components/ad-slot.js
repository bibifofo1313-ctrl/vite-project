import { createElement } from '../lib/dom.js';

export function renderAdSlot({ label = 'Ad slot', size = 'responsive' } = {}) {
  return createElement(`
    <div class="ad-slot" data-ad-slot data-ad-size="${size}">
      <span class="ad-slot__label">${label}</span>
    </div>
  `);
}
