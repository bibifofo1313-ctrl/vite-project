import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>איך לקרוא הלוואת סטודנטים?</h2>
      <p>
        הלוואה ללימודים יכולה להיות כלי חשוב, אבל חשוב להבין את העלות הכוללת
        ואת ההשפעה של הריבית לאורך זמן. המחשבון מאפשר להבין תשלום חודשי או משך.
      </p>
    </section>

    <section class="section">
      <h2>הנחות עיקריות</h2>
      <ul>
        <li>הריבית מחושבת חודשי על יתרת הקרן.</li>
        <li>החישוב מניח תשלום חודשי קבוע.</li>
        <li>הטבלה מציגה את 12 החודשים הראשונים.</li>
      </ul>
    </section>

    <section class="section">
      <h2>איך להשתמש?</h2>
      <ol>
        <li>הכניסו את סכום ההלוואה והריבית השנתית.</li>
        <li>בחרו אם אתם יודעים את התשלום החודשי או את מספר החודשים.</li>
        <li>בדקו את סך התשלום והריבית הכוללת.</li>
      </ol>
      <p class="notice">הגדלת התשלום החודשי מקצרת את משך ההלוואה ומפחיתה ריבית.</p>
    </section>

    <section class="section">
      <h2>שאלות נפוצות</h2>
      <div class="faq">
        <details>
          <summary>מה עושים אם התשלום נמוך מדי?</summary>
          <p>המחשבון יזהיר במקרה שהתשלום לא מכסה את הריבית החודשית.</p>
        </details>
        <details>
          <summary>האם אפשר לפרוע מוקדם?</summary>
          <p>כן, תשלום נוסף יקטין את הריבית הכוללת. מומלץ לבדוק תנאים מול הבנק.</p>
        </details>
        <details>
          <summary>למה מוצגת רק טבלה קצרה?</summary>
          <p>הטבלה הראשונה מספקת הבנה בסיסית. אפשר להריץ מחדש עם טווח אחר.</p>
        </details>
      </div>
    </section>
  </div>
`);

renderLayout({
  title: 'מאמר: פירעון הלוואת סטודנטים בצורה חכמה',
  subtitle: 'הסבר קצר על ריבית, תשלומים ומה חשוב לדעת לפני שמתחייבים.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'מאמר על הלוואת סטודנטים' }
  ],
  highlight: 'מאמר משלים למחשבון 5',
  content
});
