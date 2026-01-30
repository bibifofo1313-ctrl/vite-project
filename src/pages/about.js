import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>מי אנחנו?</h2>
      <p>
        ROI לימודים וקריירה הוא אתר ישראלי עצמאי שמטרתו לעזור לצעירים ולמשפחות
        לקבל החלטות חכמות יותר לגבי לימודים, קורסים ומסלולי קריירה.
      </p>
    </section>

    <section class="section">
      <h2>מה מייחד אותנו?</h2>
      <ul>
        <li>מחשבונים מעשיים עם חישובים שמותאמים לשוק הישראלי.</li>
        <li>שפה פשוטה והסברים שמבהירים את ההנחות מאחורי המספרים.</li>
        <li>שמירת נתונים מקומית בלבד, ללא איסוף מידע אישי.</li>
      </ul>
    </section>

    <section class="section">
      <h2>יצירת קשר</h2>
      <p>מוזמנים לשלוח משוב והצעות לשיפור דרך דוא"ל האתר.</p>
    </section>
  </div>
`);

renderLayout({
  title: 'אודות האתר',
  subtitle: 'אנחנו כאן כדי להפוך החלטות לימודים לפשוטות, שקופות ובטוחות יותר.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'אודות' }
  ],
  highlight: 'קצת עלינו',
  content
});
