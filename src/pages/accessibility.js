import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>הצהרת נגישות</h2>
      <p>
        אנו שואפים להנגיש את האתר בהתאם לעקרונות WCAG 2.1 ברמת AA ולתקן הישראלי ת"י 5568.
        האתר בעברית וכולל תמיכה ב‑RTL כדי להבטיח חוויית שימוש נוחה ככל האפשר.
      </p>
      <p><strong>תאריך עדכון אחרון:</strong> 31 בינואר 2026</p>
    </section>

    <section class="section">
      <h2>מה בוצע בפועל באתר</h2>
      <ul>
        <li>אפשרות ניווט מלא באמצעות מקלדת עם פוקוס בולט.</li>
        <li>קישור דילוג לתוכן (Skip Link) וגישה מהירה לאזור הראשי.</li>
        <li>תגיות ו‑ARIA לשדות טופס והודעות שגיאה ברורות.</li>
        <li>תמיכה ב‑aria-live להצגת תוצאות מחשבונים בצורה נגישה.</li>
        <li>התאמות RTL, טיפוגרפיה קריאה וניגודיות משופרת.</li>
        <li>תפריט נגישות פנימי ללא סקריפטים חיצוניים.</li>
      </ul>
    </section>

    <section class="section">
      <h2>מגבלות ידועות</h2>
      <p>
        למרות המאמצים, ייתכן וחלק מהחוויות עדיין דורשות בדיקה ידנית עם טכנולוגיות מסייעות.
        אם נתקלתם בקושי כלשהו, נשמח לקבל דיווח ולשפר.
      </p>
    </section>

    <section class="section">
      <h2>יצירת קשר בנושא נגישות</h2>
      <p>
        ניתן לפנות אלינו בכל בעיית נגישות או בקשה לשיפור:
        <br />
        אימייל: <a href="mailto:accessibility@example.com">accessibility@example.com</a>
      </p>
    </section>
  </div>
`);

renderLayout({
  title: 'נגישות באתר',
  subtitle: 'הצהרת נגישות ושקיפות לגבי ההתאמות שבוצעו באתר.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'נגישות' }
  ],
  highlight: 'נגישות ושימושיות',
  content
});
