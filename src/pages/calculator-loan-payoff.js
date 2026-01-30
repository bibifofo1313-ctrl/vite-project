import { renderLayout, attachFormPersistence } from './common.js';
import { renderFormField, renderRadioGroup } from '../components/form-field.js';
import { renderResultPanel } from '../components/result-panel.js';
import { createElement } from '../lib/dom.js';
import { formatNIS, formatNumber } from '../lib/format.js';
import { readNumberField, readRadioField, clearErrors, applyErrors } from '../lib/validation.js';

const form = document.createElement('form');
form.className = 'calc-form';
form.innerHTML = '<div class="form-summary" role="alert"></div>';

const fields = [
  renderFormField({
    id: 'principal',
    label: 'סכום הלוואה',
    placeholder: 'לדוגמה 80,000',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'annualRate',
    label: 'ריבית שנתית',
    placeholder: 'לדוגמה 4.5',
    suffix: '%',
    min: 0,
    required: true
  })
];

fields.forEach((field) => form.append(field));

const modeField = renderRadioGroup({
  name: 'loanMode',
  label: 'איך תרצו לחשב?',
  options: [
    { value: 'payment', label: 'יש לי תשלום חודשי רצוי', checked: true },
    { value: 'months', label: 'יש לי מספר חודשים רצוי', checked: false }
  ]
});

form.append(modeField);

const paymentField = renderFormField({
  id: 'monthlyPayment',
  label: 'תשלום חודשי רצוי',
  placeholder: 'לדוגמה 1,200',
  suffix: '₪',
  min: 0,
  required: false
});

const monthsField = renderFormField({
  id: 'desiredMonths',
  label: 'מספר חודשים רצוי',
  placeholder: 'לדוגמה 48',
  min: 1,
  required: false
});

form.append(paymentField, monthsField);
form.append(
  createElement(`
    <div class="card__actions">
      <button class="button" type="submit">חשב</button>
      <button class="button button--ghost" type="reset">איפוס</button>
    </div>
  `)
);

const resultPanel = renderResultPanel({
  title: 'פירעון הלוואת סטודנטים',
  content: '<p>בחרו מצב חישוב והזינו נתונים.</p>'
});

function calculateSchedule(principal, monthlyRate, payment, months) {
  let balance = principal;
  let totalPaid = 0;
  let totalInterest = 0;
  const preview = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = monthlyRate > 0 ? balance * monthlyRate : 0;
    let principalPayment = payment - interest;
    if (principalPayment <= 0) {
      return { error: 'התשלום החודשי נמוך מדי ביחס לריבית.' };
    }
    if (principalPayment > balance) {
      principalPayment = balance;
      payment = interest + principalPayment;
    }
    balance -= principalPayment;
    totalPaid += payment;
    totalInterest += interest;

    if (month <= 12) {
      preview.push({ month, payment, interest, balance });
    }
    if (balance <= 0) {
      return { totalPaid, totalInterest, preview, months: month };
    }
  }

  return { totalPaid, totalInterest, preview, months };
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors(form);

  const errors = {};
  const principal = readNumberField(form, 'principal', 'סכום הלוואה', { min: 0 });
  if (principal.error) errors.principal = principal.error;
  const annualRate = readNumberField(form, 'annualRate', 'ריבית שנתית', { min: 0 });
  if (annualRate.error) errors.annualRate = annualRate.error;

  const mode = readRadioField(form, 'loanMode', 'מצב חישוב');
  if (mode.error) errors.loanMode = mode.error;

  const monthlyRate = annualRate.value / 100 / 12;

  let paymentValue = null;
  let monthsValue = null;

  if (mode.value === 'payment') {
    const monthlyPayment = readNumberField(form, 'monthlyPayment', 'תשלום חודשי', { min: 1 });
    if (monthlyPayment.error) errors.monthlyPayment = monthlyPayment.error;
    paymentValue = monthlyPayment.value;
  } else {
    const desiredMonths = readNumberField(form, 'desiredMonths', 'מספר חודשים', { min: 1 });
    if (desiredMonths.error) errors.desiredMonths = desiredMonths.error;
    monthsValue = Math.round(desiredMonths.value);
  }

  if (Object.keys(errors).length) {
    applyErrors(form, errors);
    return;
  }

  if (mode.value === 'payment') {
    if (monthlyRate === 0) {
      monthsValue = Math.ceil(principal.value / paymentValue);
    } else {
      const threshold = principal.value * monthlyRate;
      if (paymentValue <= threshold) {
        resultPanel.querySelector('.result-panel__content').innerHTML = `
          <div class="notice">התשלום החודשי נמוך מדי ביחס לריבית ולכן ההלוואה לא תיסגר.</div>
        `;
        return;
      }
      const monthsRaw = -Math.log(1 - (monthlyRate * principal.value) / paymentValue) / Math.log(1 + monthlyRate);
      monthsValue = Math.ceil(monthsRaw);
    }
  } else {
    if (monthlyRate === 0) {
      paymentValue = principal.value / monthsValue;
    } else {
      paymentValue = principal.value * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -monthsValue)));
    }
  }

  const schedule = calculateSchedule(principal.value, monthlyRate, paymentValue, monthsValue);
  if (schedule.error) {
    resultPanel.querySelector('.result-panel__content').innerHTML = `
      <div class="notice">${schedule.error}</div>
    `;
    return;
  }

  const rowsHtml = schedule.preview
    .map(
      (row) => `
      <tr>
        <td>${row.month}</td>
        <td>${formatNIS(row.payment)}</td>
        <td>${formatNIS(row.interest)}</td>
        <td>${formatNIS(row.balance)}</td>
      </tr>
    `
    )
    .join('');

  resultPanel.querySelector('.result-panel__content').innerHTML = `
    <div class="result-grid">
      <div class="result-item"><span>תשלום חודשי</span><strong>${formatNIS(paymentValue)}</strong></div>
      <div class="result-item"><span>משך משוער</span><strong>${schedule.months} חודשים</strong></div>
      <div class="result-item"><span>סה"כ תשלום</span><strong>${formatNIS(schedule.totalPaid)}</strong></div>
      <div class="result-item"><span>סה"כ ריבית</span><strong>${formatNIS(schedule.totalInterest)}</strong></div>
    </div>
    <h3>טבלת אמורטיזציה (12 חודשים ראשונים)</h3>
    <table class="table">
      <thead>
        <tr><th>חודש</th><th>תשלום</th><th>ריבית</th><th>יתרה</th></tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
});

form.addEventListener('reset', () => {
  resultPanel.querySelector('.result-panel__content').innerHTML = '<p>בחרו מצב חישוב והזינו נתונים.</p>';
  clearErrors(form);
});

attachFormPersistence(form, 'student-loan');

const content = createElement('<div class="calc-grid"></div>');
const formSection = createElement('<section class="section"></section>');
formSection.append(
  createElement('<h2>פירעון הלוואה</h2>'),
  createElement('<p>בחרו האם לחשב תשלום חודשי או משך הלוואה רצוי.</p>'),
  form
);

const resultSection = createElement('<section class="section"></section>');
resultSection.append(resultPanel);

content.append(formSection, resultSection);

renderLayout({
  title: 'מחשבון פירעון הלוואת סטודנטים',
  subtitle: 'חישוב תשלום חודשי או משך הלוואה מדויק עם ריבית.',
  intro: 'מחשב ריבית אפקטיבית חודשית ומציג טבלת אמורטיזציה קצרה.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'פירעון הלוואה' }
  ],
  highlight: 'מחשבון 5 מתוך 5',
  content
});
