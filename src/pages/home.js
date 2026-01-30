import { renderLayout, renderInlineAd } from './common.js';
import { renderCard } from '../components/card.js';
import { calculators } from '../data/calculators.js';
import { createElement } from '../lib/dom.js';

const cardsGrid = createElement('<div class="card-grid"></div>');
calculators.forEach((calc) => {
  cardsGrid.append(
    renderCard({
      title: calc.title,
      description: calc.description,
      href: calc.calculatorHref,
      ctaLabel: 'למחשבון',
      secondaryHref: calc.articleHref,
      secondaryLabel: 'למאמר'
    })
  );
});

const overviewSection = createElement(`
  <section class="section">
    <h2>מחשבונים חכמים ללימודים וקריירה</h2>
    <p>
      האתר נבנה במיוחד לצעירים בישראל שרוצים להבין מה העלות האמיתית של לימודים,
      כמה זמן לוקח להחזיר השקעה, ואיזה מסלול משתלם יותר בטווח של חמש שנים.
    </p>
    <div class="card-grid"></div>
  </section>
`);

overviewSection.querySelector('.card-grid').replaceWith(cardsGrid);

const audienceSection = createElement(`
  <section class="section">
    <h2>למי זה מתאים?</h2>
    <ul>
      <li>תיכוניסטים שמתלבטים בין מקצועות או מסלולים.</li>
      <li>חיילים משוחררים שרוצים להשוות לימודים מול עבודה עכשיו.</li>
      <li>סטודנטים והורים שמחפשים תמונת עלות מלאה.</li>
      <li>משפחות שרוצות תכנון פיננסי זהיר לפני התחייבות ללימודים.</li>
    </ul>
  </section>
`);

const howItWorks = createElement(`
  <section class="section">
    <h2>איך זה עובד?</h2>
    <ol>
      <li>מכניסים את המספרים הרלוונטיים למסלול שלכם.</li>
      <li>מקבלים תוצאה מידית עם טווחים שמרניים ואופטימיים.</li>
      <li>שומרים את ההזנה אוטומטית לחזרה מהירה בעתיד.</li>
    </ol>
    <div class="notice">כל החישובים מקומיים בדפדפן, ללא איסוף נתונים אישי.</div>
  </section>
`);

const seoSection = createElement(`
  <section class="section">
    <h2>למה זה חשוב?</h2>
    <p>
      החלטות לימודים הן השקעה ארוכת טווח. המחשבונים כאן עוזרים להבין את
      התמונה הכלכלית לפני שמקבלים החלטה. לכל מחשבון יש גם מאמר קצר עם הנחות,
      טיפים ושאלות נפוצות כדי שתדעו לפרש את התוצאה נכון.
    </p>
    <div class="card__actions">
      <a class="card__link" href="/calculators.html">לכל המחשבונים</a>
      <a class="card__link card__link--secondary" href="/articles/degree-roi-payback.html">מאמר מומלץ</a>
    </div>
  </section>
`);

const contentFragment = document.createDocumentFragment();
contentFragment.append(overviewSection, audienceSection);
renderInlineAd(contentFragment);
contentFragment.append(howItWorks, seoSection);

renderLayout({
  title: 'מחשבוני ROI ללימודים וקריירה בישראל',
  subtitle: 'תכנון כלכלי מדויק לפני שמחליטים על תואר, קורס או עבודה עכשיו.',
  intro: 'כל מחשבון מותאם לישראל, בשפה פשוטה ועם הנחות ברורות. תוצאות מהירות, נוחות לנייד, ושמירת נתונים מקומית.',
  highlight: 'אתר חינמי לצמיחה חכמה',
  content: contentFragment
});
