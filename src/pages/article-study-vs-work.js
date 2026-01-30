import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>לימודים מול עבודה: השיקולים המרכזיים</h2>
      <p>
        ההחלטה בין עבודה מיידית ללימודים תלויה בזמן ההחזר, ביכולת לחסוך
        ובהפרש השכר העתידי. הסימולטור מאפשר לראות מתי הלימודים "מדביקים" את העבודה.
      </p>
    </section>

    <section class="section">
      <h2>הנחות במחשבון</h2>
      <ul>
        <li>חיסכון חודשי קבוע לאורך התקופה.</li>
        <li>הכנסה קבועה במהלך הלימודים ואז שכר חדש לאחריהם.</li>
        <li>אפשרות לתשואה שנתית על החיסכון.</li>
      </ul>
    </section>

    <section class="section">
      <h2>איך להשתמש?</h2>
      <ol>
        <li>הזינו שכר נוכחי ושכר צפוי אחרי לימודים.</li>
        <li>הגדירו תקופת לימודים והכנסה בתקופה זו.</li>
        <li>בדקו את נקודת החצייה והתוצאה ל-5 שנים.</li>
      </ol>
      <p class="notice">אם ההפרש בשכר גבוה, נקודת החצייה תגיע מהר יותר.</p>
    </section>

    <section class="section">
      <h2>שאלות נפוצות</h2>
      <div class="faq">
        <details>
          <summary>מה אם אני מתכנן ללמוד ולחסוך פחות?</summary>
          <p>אפשר להקטין את החיסכון החודשי כדי לראות את ההשפעה על התוצאות.</p>
        </details>
        <details>
          <summary>האם מומלץ להוסיף תשואה שנתית?</summary>
          <p>אם אתם משקיעים את החיסכון, תשואה יכולה לתת תמונה מדויקת יותר.</p>
        </details>
        <details>
          <summary>האם התוצאות ל-5 שנים מספיקות?</summary>
          <p>זה טווח השוואה נוח, אך אפשר להריץ את החישוב מחדש עם הערכות לטווח ארוך.</p>
        </details>
      </div>
    </section>

    <section class="section">
      <h2>להמשך תכנון</h2>
      <p>חזרו לסימולטור או בדקו את זמן ההחזר אחרי הלימודים.</p>
      <div class="card__actions">
        <a class="card__link" href="/calculators/study-vs-work-now.html">לסימולטור לימודים מול עבודה</a>
        <a class="card__link card__link--secondary" href="/calculators/degree-roi-payback.html">מחשבון ROI לתואר</a>
      </div>
    </section>
  </div>
`);

renderLayout({
  title: 'מאמר: ללמוד או לעבוד עכשיו?',
  subtitle: 'הסברים על נקודת החצייה ועל התנאים שבהם לימודים משתלמים.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'מאמר לימודים מול עבודה' }
  ],
  highlight: 'מאמר משלים למחשבון 4',
  content
});
