import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>מה זה ROI בלימודים?</h2>
      <p>
        ROI בלימודים מודד כמה זמן לוקח להחזיר את ההשקעה הכספית בלימודים
        באמצעות שיפור בשכר החודשי. זה עוזר לדעת מתי ההשקעה מתחילה להשתלם.
      </p>
    </section>

    <section class="section">
      <h2>הנחות עיקריות</h2>
      <ul>
        <li>ההפרש בין השכר לפני ואחרי הלימודים הוא הגורם המרכזי.</li>
        <li>ניתן להוסיף תקופת רמפה להתקדמות שכר הדרגתית.</li>
        <li>במצב ברוטו אנו משתמשים בהערכה בסיסית לנטו.</li>
      </ul>
    </section>

    <section class="section">
      <h2>איך להשתמש?</h2>
      <ol>
        <li>הכניסו עלות כוללת (שכר לימוד + מחייה).</li>
        <li>בחרו שכר לפני ואחרי לימודים במצב נטו או ברוטו.</li>
        <li>הגדירו רמפה אם צפוי זמן הסתגלות בשוק העבודה.</li>
      </ol>
      <p class="notice">כדאי לבחון גם תרחיש שמרני עם שכר נמוך יותר.</p>
    </section>

    <section class="section">
      <h2>שאלות נפוצות</h2>
      <div class="faq">
        <details>
          <summary>למה יש רמפה?</summary>
          <p>ברוב המקרים שכר התחלתי נמוך יותר, והרמפה מדמה את העלייה הדרגתית.</p>
        </details>
        <details>
          <summary>האם החישוב כולל העלאות שכר עתידיות?</summary>
          <p>לא. מדובר בחישוב שמרני שמניח שכר קבוע לאחר הרמפה.</p>
        </details>
        <details>
          <summary>איך לחשב כשיש בונוסים?</summary>
          <p>אפשר להוסיף אותם כחלק מהממוצע החודשי אם הם קבועים יחסית.</p>
        </details>
      </div>
    </section>
  </div>
`);

renderLayout({
  title: 'מאמר: חישוב ROI וזמן החזר על תואר',
  subtitle: 'הבנה של זמן ההחזר ושל ההנחות מאחורי המספרים.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'מאמר על ROI' }
  ],
  highlight: 'מאמר משלים למחשבון 2',
  content
});
