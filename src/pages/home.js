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
    <h2>המחשבונים המרכזיים</h2>
    <p>
      כאן תמצאו את חמשת המחשבונים החשובים ביותר לקבלת החלטה על לימודים, קורס או מסלול קריירה.
      כל מחשבון ממוקד בשאלה אחת ברורה ומציג תוצאה מהירה עם הסברים.
    </p>
    <div class="card-grid"></div>
  </section>
`);

overviewSection.querySelector('.card-grid').replaceWith(cardsGrid);

const trustSection = createElement(`
  <section class="section">
    <h2>בלוק אמון: מה זה ולמי זה מתאים</h2>
    <ul>
      <li><strong>מה זה?</strong> מרכז מחשבונים חינמיים בעברית לתכנון עלות לימודים והחזר השקעה.</li>
      <li><strong>למי זה?</strong> תלמידים, חיילים משוחררים, סטודנטים והורים שמחפשים תמונה כלכלית ברורה.</li>
      <li><strong>הנחות כלליות:</strong> ההזנה שלכם היא הבסיס לחישוב, ללא נתונים חיצוניים או פרסום פעיל.</li>
    </ul>
    <div class="notice">המידע חינוכי בלבד ואינו מהווה ייעוץ פיננסי או תעסוקתי.</div>
  </section>
`);

const audienceSection = createElement(`
  <section class="section">
    <h2>למי זה מתאים במיוחד?</h2>
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
    <div class="notice">כל החישובים מקומיים בדפדפן בלבד, ללא איסוף מידע אישי.</div>
  </section>
`);

const seoSection = createElement(`
  <section class="section">
    <h2>למה זה חשוב?</h2>
    <p>
      החלטות לימודים הן השקעה ארוכת טווח. המחשבונים כאן עוזרים להבין את התמונה הכלכלית
      לפני שמקבלים החלטה. לכל מחשבון יש גם מאמר קצר עם הנחות, טיפים ושאלות נפוצות.
    </p>
    <div class="card__actions">
      <a class="card__link" href="/calculators.html">לכל המחשבונים</a>
      <a class="card__link card__link--secondary" href="/articles/degree-roi-payback.html">מאמר מומלץ</a>
    </div>
  </section>
`);

const contentFragment = document.createDocumentFragment();
contentFragment.append(overviewSection, trustSection);
renderInlineAd(contentFragment);
contentFragment.append(audienceSection, howItWorks, seoSection);

renderLayout({
  title: 'מחשבוני כדאיות לימודים וקריירה בישראל',
  subtitle: 'כלים מהירים להשוואת עלות, החזר ושכר לפני שמתחייבים ללימודים.',
  intro:
    'כאן תמצאו מחשבונים בעברית שמראים כמה יעלו הלימודים באמת, תוך כמה זמן ההשקעה חוזרת ואיזה מסלול משתלם יותר. ' +
    'כל חישוב מבוסס על ההזנה שלכם בלבד ומופעל מקומית בדפדפן. ' +
    'אין איסוף נתונים אישיים ואין פרסומות פעילות בשלב זה. ' +
    'השתמשו בתוצאות כבסיס לתכנון ושיחה עם גורמים מקצועיים.',
  highlight: 'החלטות חכמות לפני הלימודים',
  content: contentFragment
});
