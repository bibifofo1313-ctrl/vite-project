import { renderLayout, attachFormPersistence } from './common.js';
import { renderFormField } from '../components/form-field.js';
import { renderResultPanel } from '../components/result-panel.js';
import { createElement } from '../lib/dom.js';
import { formatNIS, formatNumber, formatMonthYear } from '../lib/format.js';
import { readNumberField, clearErrors, applyErrors } from '../lib/validation.js';

const form = document.createElement('form');
form.className = 'calc-form';
form.innerHTML = '<div class="form-summary" role="alert"></div>';

const fields = [
  renderFormField({
    id: 'totalCost',
    label: 'עלות כוללת של הלימודים',
    placeholder: 'לדוגמה 120,000',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'salaryBefore',
    label: 'שכר חודשי לפני לימודים',
    placeholder: 'לדוגמה 7,000',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'salaryAfter',
    label: 'שכר חודשי אחרי לימודים',
    placeholder: 'לדוגמה 12,500',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'taxMode',
    label: 'מצב שכר',
    as: 'select',
    options: [
      { value: 'net', label: 'נטו (ללא חישוב מס)' },
      { value: 'gross', label: 'ברוטו (הערכת נטו בסיסית)' }
    ],
    value: 'net'
  }),
  renderFormField({
    id: 'rampMonths',
    label: 'חודשי רמפה להגעה לשכר מלא',
    placeholder: 'לדוגמה 6',
    min: 0,
    required: true
  })
];

fields.forEach((field) => form.append(field));

form.append(
  createElement(`
    <div class="card__actions">
      <button class="button" type="submit">חשב</button>
      <button class="button button--ghost" type="reset">איפוס</button>
    </div>
  `)
);

const resultPanel = renderResultPanel({
  title: 'תוצאות החזר השקעה',
  content: '<p>הזינו ערכים כדי לראות זמן החזר והצטברות חודשית.</p>'
});

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors(form);

  const errors = {};
  const totalCost = readNumberField(form, 'totalCost', 'עלות כוללת', { min: 0 });
  if (totalCost.error) errors.totalCost = totalCost.error;
  const salaryBefore = readNumberField(form, 'salaryBefore', 'שכר לפני לימודים', { min: 0 });
  if (salaryBefore.error) errors.salaryBefore = salaryBefore.error;
  const salaryAfter = readNumberField(form, 'salaryAfter', 'שכר אחרי לימודים', { min: 0 });
  if (salaryAfter.error) errors.salaryAfter = salaryAfter.error;
  const rampMonths = readNumberField(form, 'rampMonths', 'חודשי רמפה', { min: 0 });
  if (rampMonths.error) errors.rampMonths = rampMonths.error;

  if (Object.keys(errors).length) {
    applyErrors(form, errors);
    return;
  }

  const taxMode = form.querySelector('[name="taxMode"]').value;
  const taxFactor = taxMode === 'gross' ? 0.78 : 1;
  const netDiff = (salaryAfter.value - salaryBefore.value) * taxFactor;

  if (netDiff <= 0) {
    resultPanel.querySelector('.result-panel__content').innerHTML = `
      <div class="notice">
        ההפרש בין השכר אחרי הלימודים ללפני הלימודים אינו חיובי, ולכן אין החזר השקעה לפי הנתונים.
      </div>
    `;
    return;
  }

  const ramp = Math.max(0, Math.round(rampMonths.value));
  let cumulative = -totalCost.value;
  let paybackMonth = null;
  const tableRows = [];
  const maxMonths = 240;

  for (let month = 1; month <= maxMonths; month += 1) {
    let uplift = netDiff;
    if (ramp > 0 && month <= ramp) {
      uplift = netDiff * (month / ramp);
    }
    cumulative += uplift;
    if (paybackMonth === null && cumulative >= 0) {
      paybackMonth = month;
    }
    if (month <= 60) {
      tableRows.push({ month, cumulative });
    }
  }

  const paybackYears = paybackMonth ? paybackMonth / 12 : null;
  const breakEvenDate = paybackMonth ? formatMonthYear(addMonths(new Date(), paybackMonth)) : '—';
  const taxNote =
    taxMode === 'gross'
      ? 'הערכת הנטו חושבה באופן גס לפי מקדם 0.78, ללא מדרגות מס.'
      : 'החישוב מניח שהשכר שהוזן הוא נטו.';

  const rowsHtml = tableRows
    .map(
      (row) => `
      <tr>
        <td>${row.month}</td>
        <td>${formatNIS(row.cumulative)}</td>
      </tr>
    `
    )
    .join('');

  resultPanel.querySelector('.result-panel__content').innerHTML = `
    <div class="result-grid">
      <div class="result-item"><span>חודשי החזר</span><strong>${paybackMonth ?? 'לא נמצא'}</strong></div>
      <div class="result-item"><span>שנות החזר</span><strong>${paybackYears ? formatNumber(paybackYears, 1) : '—'}</strong></div>
      <div class="result-item"><span>תאריך איזון משוער</span><strong>${breakEvenDate}</strong></div>
      <div class="result-item"><span>הפרש חודשי נטו משוער</span><strong>${formatNIS(netDiff)}</strong></div>
    </div>
    <p class="field__hint">${taxNote} הרמפה מחלקת את ההפרש על פני ${ramp} חודשים.</p>
    <h3>טבלת הצטברות (60 חודשים)</h3>
    <table class="table">
      <thead>
        <tr><th>חודש</th><th>יתרה מצטברת</th></tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
});

form.addEventListener('reset', () => {
  resultPanel.querySelector('.result-panel__content').innerHTML = '<p>הזינו ערכים כדי לראות זמן החזר והצטברות חודשית.</p>';
  clearErrors(form);
});

attachFormPersistence(form, 'degree-roi');

const content = createElement('<div class="calc-grid"></div>');
const formSection = createElement('<section class="section"></section>');
formSection.append(
  createElement('<h2>הזנת נתונים</h2>'),
  createElement('<p>תוך דקה תראו זמן החזר, תאריך איזון משוער וטבלת הצטברות חודשית.</p>'),
  form
);

const resultSection = createElement('<section class="section"></section>');
resultSection.append(resultPanel);

const interpretationSection = createElement(`
  <section class="section">
    <h2>איך לפרש את התוצאות?</h2>
    <p>
      חודשי ההחזר מראים מתי הפער בשכר מכסה את העלות הכוללת. תאריך האיזון מסייע להבין
      באיזה חודש צפוי להיות שינוי חיובי. הטבלה מציגה את ההצטברות ב‑60 החודשים הראשונים.
    </p>
    <ul>
      <li>אם ההפרש החודשי נמוך, זמן ההחזר יגדל.</li>
      <li>רמפה ארוכה יותר דוחה את נקודת האיזון.</li>
    </ul>
  </section>
`);

const faqSection = createElement(`
  <section class="section" id="faq">
    <h2>שאלות נפוצות</h2>
    <div class="faq">
      <details>
        <summary>למה יש רמפה?</summary>
        <p>רמפה מדמה תקופת הסתגלות שבה השכר עולה בהדרגה אחרי סיום הלימודים.</p>
      </details>
      <details>
        <summary>מה ההבדל בין נטו לברוטו?</summary>
        <p>במצב ברוטו אנו משתמשים בהערכה בסיסית לנטו כדי לאפשר השוואה מהירה.</p>
      </details>
      <details>
        <summary>מה אם השכר אחרי הלימודים לא גבוה יותר?</summary>
        <p>אם ההפרש אינו חיובי לא מתקבל החזר השקעה לפי הנתונים שהוזנו.</p>
      </details>
      <details>
        <summary>האם החישוב כולל העלאות שכר עתידיות?</summary>
        <p>לא. החישוב שמרני ומניח שכר קבוע לאחר תקופת הרמפה.</p>
      </details>
      <details>
        <summary>כמה זמן נבדקת ההצטברות?</summary>
        <p>המחשבון מחשב החזר עד 240 חודשים ומציג טבלה מפורטת ל‑60 החודשים הראשונים.</p>
      </details>
    </div>
  </section>
`);

const linksSection = createElement(`
  <section class="section">
    <h2>להמשך תכנון</h2>
    <p>עברו למאמר ההסבר או בדקו את העלות הכוללת לפני חישוב ההחזר.</p>
    <div class="card__actions">
      <a class="card__link" href="/articles/degree-roi-payback.html">מאמר על ROI וזמן החזר</a>
      <a class="card__link card__link--secondary" href="/calculators/total-study-cost.html">מחשבון עלות לימודים</a>
    </div>
  </section>
`);

content.append(formSection, resultSection, interpretationSection, faqSection, linksSection);

renderLayout({
  title: 'מתי התואר מחזיר את עצמו?',
  subtitle: 'מחשבון ROI ללימודים עם רמפה והערכת מס בסיסית.',
  intro: 'הזינו עלות ושכר לפני/אחרי וקבלו זמן החזר, תאריך איזון וטבלת הצטברות חודשית.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'ROI וזמן החזר' }
  ],
  highlight: 'מחשבון 2 מתוך 5',
  content
});
