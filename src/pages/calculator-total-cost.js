import { renderLayout, attachFormPersistence } from './common.js';
import { renderFormField } from '../components/form-field.js';
import { renderResultPanel } from '../components/result-panel.js';
import { createElement } from '../lib/dom.js';
import { formatNIS, formatNumber } from '../lib/format.js';
import { readNumberField, clearErrors, applyErrors } from '../lib/validation.js';

const form = document.createElement('form');
form.className = 'calc-form';
form.innerHTML = '<div class="form-summary" role="alert"></div>';

const fields = [
  renderFormField({
    id: 'annualTuition',
    label: 'שכר לימוד שנתי',
    placeholder: 'לדוגמה 11,000',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'studyYears',
    label: 'משך לימודים (שנים)',
    placeholder: 'לדוגמה 3',
    min: 0.5,
    step: 0.5,
    required: true
  }),
  renderFormField({
    id: 'rentMonthly',
    label: 'שכירות חודשית',
    placeholder: 'לדוגמה 3,000',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'livingMonthly',
    label: 'הוצאות מחייה חודשיות',
    placeholder: 'לדוגמה 2,200',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'transportMonthly',
    label: 'תחבורה חודשית',
    placeholder: 'לדוגמה 350',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'yearlyExtras',
    label: 'הוצאות שנתיות נוספות',
    placeholder: 'לדוגמה 2,500',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'monthlyIncome',
    label: 'הכנסה חודשית בזמן לימודים',
    placeholder: 'לדוגמה 2,000',
    suffix: '₪',
    min: 0,
    required: true
  })
];

fields.forEach((field) => form.append(field));

const rangesField = createElement(`
  <label class="field" for="showRanges">
    <span class="field__label">הצגת טווחים שמרניים ואופטימיים</span>
    <div class="field__input">
      <input class="field__control" type="checkbox" id="showRanges" name="showRanges" />
      <span class="field__suffix">להוסיף ±10% לכל העלויות</span>
    </div>
  </label>
`);

form.append(rangesField);
form.append(
  createElement(`
    <div class="card__actions">
      <button class="button" type="submit">חשב</button>
      <button class="button button--ghost" type="reset">איפוס</button>
    </div>
  `)
);

const resultPanel = renderResultPanel({
  title: 'תוצאות משוערות',
  content: '<p>הזינו ערכים כדי לקבל חישוב.</p>'
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors(form);

  const errors = {};
  const annualTuition = readNumberField(form, 'annualTuition', 'שכר לימוד שנתי', { min: 0 });
  if (annualTuition.error) errors.annualTuition = annualTuition.error;
  const studyYears = readNumberField(form, 'studyYears', 'משך לימודים', { min: 0.5 });
  if (studyYears.error) errors.studyYears = studyYears.error;
  const rentMonthly = readNumberField(form, 'rentMonthly', 'שכירות חודשית', { min: 0 });
  if (rentMonthly.error) errors.rentMonthly = rentMonthly.error;
  const livingMonthly = readNumberField(form, 'livingMonthly', 'הוצאות מחייה', { min: 0 });
  if (livingMonthly.error) errors.livingMonthly = livingMonthly.error;
  const transportMonthly = readNumberField(form, 'transportMonthly', 'תחבורה חודשית', { min: 0 });
  if (transportMonthly.error) errors.transportMonthly = transportMonthly.error;
  const yearlyExtras = readNumberField(form, 'yearlyExtras', 'הוצאות שנתיות נוספות', { min: 0 });
  if (yearlyExtras.error) errors.yearlyExtras = yearlyExtras.error;
  const monthlyIncome = readNumberField(form, 'monthlyIncome', 'הכנסה חודשית', { min: 0 });
  if (monthlyIncome.error) errors.monthlyIncome = monthlyIncome.error;

  if (Object.keys(errors).length) {
    applyErrors(form, errors);
    return;
  }

  const totalMonthlyCosts = rentMonthly.value + livingMonthly.value + transportMonthly.value - monthlyIncome.value;
  const totalCost =
    annualTuition.value * studyYears.value +
    yearlyExtras.value * studyYears.value +
    totalMonthlyCosts * 12 * studyYears.value;
  const monthlyAverage = totalCost / (studyYears.value * 12);
  const showRanges = form.querySelector('#showRanges').checked;

  let rangesHtml = '';
  if (showRanges) {
    const conservative = totalCost * 1.1;
    const optimistic = totalCost * 0.9;
    rangesHtml = `
      <div class="result-item"><span>טווח שמרני</span><strong>${formatNIS(conservative)}</strong></div>
      <div class="result-item"><span>טווח אופטימי</span><strong>${formatNIS(optimistic)}</strong></div>
      <p class="field__hint">הטווחים מבוססים על סטייה של ±10% מהעלות הכוללת.</p>
    `;
  }

  resultPanel.querySelector('.result-panel__content').innerHTML = `
    <div class="result-grid">
      <div class="result-item"><span>עלות כוללת</span><strong>${formatNIS(totalCost)}</strong></div>
      <div class="result-item"><span>ממוצע חודשי</span><strong>${formatNIS(monthlyAverage)}</strong></div>
      <div class="result-item"><span>עלות חודשית נטו אחרי הכנסה</span><strong>${formatNIS(totalMonthlyCosts)}</strong></div>
      ${rangesHtml}
    </div>
    <p class="field__hint">החישוב מניח עלויות קבועות לאורך ${formatNumber(studyYears.value)} שנים.</p>
  `;
});

form.addEventListener('reset', () => {
  resultPanel.querySelector('.result-panel__content').innerHTML = '<p>הזינו ערכים כדי לקבל חישוב.</p>';
  clearErrors(form);
});

attachFormPersistence(form, 'total-study-cost');

const content = createElement('<div class="calc-grid"></div>');
const formSection = createElement('<section class="section"></section>');
formSection.append(
  createElement('<h2>הזנת נתונים</h2>'),
  createElement('<p>מלאו את העלויות המרכזיות כדי לקבל תמונת עלות מלאה ללימודים.</p>'),
  form
);

const resultSection = createElement('<section class="section"></section>');
resultSection.append(resultPanel);

content.append(formSection, resultSection);

renderLayout({
  title: 'מחשבון עלות לימודים כוללת',
  subtitle: 'חישוב ברור של כמה הלימודים באמת יעלו לכם לאורך כל התקופה.',
  intro: 'מחשבונים אחרים מתמקדים רק בשכר לימוד. כאן משלבים גם דיור, מחייה והכנסה בזמן לימודים כדי להגיע לתמונה אמיתית.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'עלות לימודים כוללת' }
  ],
  highlight: 'מחשבון 1 מתוך 5',
  content
});
