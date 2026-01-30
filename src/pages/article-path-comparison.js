import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>למה להשוות מסלולים?</h2>
      <p>
        כשיש שני מסלולים אפשריים (למשל תואר מול קורס מקצועי), חשוב להשוות את
        התמונה הכלכלית לטווח בינוני. המחשבון מציג תוצאה ל-5 שנים עם תרחישים שונים.
      </p>
    </section>

    <section class="section">
      <h2>הנחות ותסריטים</h2>
      <ul>
        <li>תרחיש בסיסי משקף את הנתונים שהזנתם.</li>
        <li>תרחיש שמרני מפחית שכר ומעלה סיכון אבטלה.</li>
        <li>תרחיש אופטימי משפר שכר ומפחית סיכון.</li>
      </ul>
    </section>

    <section class="section">
      <h2>איך להשתמש?</h2>
      <ol>
        <li>מלאו נתונים לכל מסלול (עלות, שכר, חיפוש עבודה וסיכון אבטלה).</li>
        <li>בדקו את התוצאות ל-5 שנים בכל תרחיש.</li>
        <li>התמקדו גם בהערת הרגישות לשכר.</li>
      </ol>
      <p class="notice">הבדלים קטנים בשכר יוצרים פערים משמעותיים לאורך זמן.</p>
    </section>

    <section class="section">
      <h2>שאלות נפוצות</h2>
      <div class="faq">
        <details>
          <summary>איך להעריך סיכון אבטלה?</summary>
          <p>אפשר להשתמש בנתוני ענף ובשיחות עם אנשי מקצוע כדי להעריך אחוז סביר.</p>
        </details>
        <details>
          <summary>האם 5 שנים מספיקות?</summary>
          <p>זה טווח שמאפשר השוואה מהירה, אבל מומלץ לבצע גם בדיקה לטווח ארוך יותר.</p>
        </details>
        <details>
          <summary>מה אם יש קפיצת שכר גדולה אחרי כמה שנים?</summary>
          <p>אפשר להזין שכר משוקלל שמייצג את הממוצע הצפוי.</p>
        </details>
      </div>
    </section>
  </div>
`);

renderLayout({
  title: 'מאמר: איך להשוות בין שני מסלולי קריירה',
  subtitle: 'מדריך קצר לקריאה נכונה של השוואת מסלולים A/B.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'מאמר על השוואת מסלולים' }
  ],
  highlight: 'מאמר משלים למחשבון 3',
  content
});
