import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>מה מחשבים כאן?</h2>
      <p>
        מחשבון עלות לימודים כוללת מרכז את כל מרכיבי העלות שסטודנטים בישראל באמת
        משלמים: שכר לימוד, דיור, מחייה, תחבורה, הוצאות חד-פעמיות והכנסה בזמן הלימודים.
      </p>
      <p>
        המטרה היא להגיע לתמונה מלאה של העלות נטו ולא להסתפק רק בשכר הלימוד הרשמי.
      </p>
    </section>

    <section class="section">
      <h2>הנחות מרכזיות</h2>
      <ul>
        <li>הוצאות חודשיות נשארות יציבות לאורך כל השנים.</li>
        <li>ההכנסה בזמן הלימודים מפחיתה את העלות הכוללת.</li>
        <li>הטווחים השמרניים/אופטימיים מבוססים על סטייה של ±10% מהעלות הכוללת.</li>
      </ul>
    </section>

    <section class="section">
      <h2>איך להשתמש במחשבון?</h2>
      <ol>
        <li>אוספים נתוני שכר לימוד, שכר דירה והוצאות מחייה חודשיות.</li>
        <li>מכניסים מספר שנות לימודים והכנסה צפויה במהלך התקופה.</li>
        <li>בודקים את העלות הכוללת והעלות החודשית הממוצעת.</li>
      </ol>
      <p class="notice">טיפ: עדיף להזין סכומים מעט גבוהים כדי לקבל תמונה שמרנית.</p>
    </section>

    <section class="section">
      <h2>שאלות נפוצות</h2>
      <div class="faq">
        <details>
          <summary>האם לכלול מלגות?</summary>
          <p>כן. אם יש מלגה קבועה, הפחיתו אותה משכר הלימוד השנתי.</p>
        </details>
        <details>
          <summary>מה עושים אם ההוצאות משתנות בין השנים?</summary>
          <p>הזינו ממוצע משוקלל. אם צפויה קפיצה משמעותית, השתמשו בטווח השמרני.</p>
        </details>
        <details>
          <summary>איך להתייחס להכנסות לא קבועות?</summary>
          <p>מומלץ להזין ממוצע חודשי זהיר על בסיס השנה האחרונה.</p>
        </details>
      </div>
    </section>

    <section class="section">
      <h2>להמשך תכנון</h2>
      <p>חזרו למחשבון או המשיכו למחשבון הבא בתהליך.</p>
      <div class="card__actions">
        <a class="card__link" href="/calculators/total-study-cost.html">למחשבון עלות לימודים</a>
        <a class="card__link card__link--secondary" href="/calculators/degree-roi-payback.html">מחשבון ROI לתואר</a>
      </div>
    </section>
  </div>
`);

renderLayout({
  title: 'מאמר: איך לחשב עלות לימודים כוללת',
  subtitle: 'הסבר קצר על כל ההנחות והנתונים שצריך לפני שמחליטים על לימודים.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'מאמר על עלות לימודים' }
  ],
  highlight: 'מאמר משלים למחשבון 1',
  content
});
