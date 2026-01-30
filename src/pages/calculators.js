import { renderLayout } from './common.js';
import { renderCard } from '../components/card.js';
import { calculators } from '../data/calculators.js';
import { createElement } from '../lib/dom.js';

const grid = createElement('<div class="card-grid"></div>');
calculators.forEach((calc, index) => {
  grid.append(
    renderCard({
      title: calc.title,
      description: calc.description,
      href: calc.calculatorHref,
      ctaLabel: 'למחשבון',
      secondaryHref: calc.articleHref,
      secondaryLabel: 'למאמר',
      tag: `מחשבון ${index + 1}`
    })
  );
});

const section = createElement(`
  <section class="section">
    <h2>בחרו מחשבון</h2>
    <p>כל מחשבון כולל הסבר קצר, שמירת נתונים אוטומטית ומדדים רלוונטיים לשוק הישראלי.</p>
    <div class="card-grid"></div>
  </section>
`);

section.querySelector('.card-grid').replaceWith(grid);

const guidance = createElement(`
  <section class="section">
    <h2>איך לבחור מחשבון נכון?</h2>
    <ul>
      <li>אם אתם רק מתחילים לחשוב על לימודים, התחילו במחשבון עלות כוללת.</li>
      <li>כדי להבין החזר השקעה, עברו למחשבון ROI.</li>
      <li>אם יש לכם שני מסלולים, השתמשו בהשוואת מסלולים.</li>
      <li>ללימודים מול עבודה עכשיו - השתמשו בסימולטור.</li>
      <li>להלוואות ומימון, המחשבון האחרון ייתן לכם תשלום חודשי ברור.</li>
    </ul>
  </section>
`);

const content = document.createDocumentFragment();
content.append(section, guidance);

renderLayout({
  title: 'מחשבון ROI לכל שלב בדרך',
  subtitle: 'חמשת המחשבונים המרכזיים שלנו מסודרים לפי תהליך קבלת החלטה.',
  breadcrumbs: [{ label: 'דף הבית', href: '/' }, { label: 'מחשבונים' }],
  highlight: 'מחשבונים מעשיים',
  content
});
