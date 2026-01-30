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
    id: 'workSalary',
    label: 'שכר חודשי בעבודה עכשיו',
    placeholder: 'לדוגמה 7,500',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'studyMonths',
    label: 'משך לימודים (חודשים)',
    placeholder: 'לדוגמה 36',
    min: 1,
    required: true
  }),
  renderFormField({
    id: 'studyIncome',
    label: 'הכנסה חודשית בזמן לימודים',
    placeholder: 'לדוגמה 2,000',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'salaryAfterStudy',
    label: 'שכר חודשי אחרי לימודים',
    placeholder: 'לדוגמה 12,000',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'monthlySavings',
    label: 'חיסכון חודשי קבוע',
    placeholder: 'לדוגמה 1,200',
    suffix: '₪',
    min: 0,
    required: true
  }),
  renderFormField({
    id: 'annualReturn',
    label: 'תשואה שנתית על חיסכון (אופציונלי)',
    placeholder: 'לדוגמה 4',
    suffix: '%',
    min: 0,
    required: false
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
  title: 'השוואת תרחישים',
  content: '<p>הזינו נתונים כדי לראות איפה הלימודים מנצחים.</p>'
});

function simulatePath(incomes, monthlySavings, monthlyRate) {
  let wealth = 0;
  const timeline = [];
  incomes.forEach((income) => {
    const saving = Math.min(monthlySavings, income);
    wealth = (wealth + saving) * (1 + monthlyRate);
    timeline.push(wealth);
  });
  return { wealth, timeline };
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors(form);

  const errors = {};
  const workSalary = readNumberField(form, 'workSalary', 'שכר בעבודה עכשיו', { min: 0 });
  if (workSalary.error) errors.workSalary = workSalary.error;
  const studyMonths = readNumberField(form, 'studyMonths', 'משך לימודים', { min: 1 });
  if (studyMonths.error) errors.studyMonths = studyMonths.error;
  const studyIncome = readNumberField(form, 'studyIncome', 'הכנסה בזמן לימודים', { min: 0 });
  if (studyIncome.error) errors.studyIncome = studyIncome.error;
  const salaryAfterStudy = readNumberField(form, 'salaryAfterStudy', 'שכר אחרי לימודים', { min: 0 });
  if (salaryAfterStudy.error) errors.salaryAfterStudy = salaryAfterStudy.error;
  const monthlySavings = readNumberField(form, 'monthlySavings', 'חיסכון חודשי', { min: 0 });
  if (monthlySavings.error) errors.monthlySavings = monthlySavings.error;
  const annualReturn = readNumberField(form, 'annualReturn', 'תשואה שנתית', { min: 0, required: false });
  if (annualReturn.error) errors.annualReturn = annualReturn.error;

  if (Object.keys(errors).length) {
    applyErrors(form, errors);
    return;
  }

  const annualRate = Number.isFinite(annualReturn.value) ? annualReturn.value / 100 : 0;
  const monthlyRate = annualRate > 0 ? Math.pow(1 + annualRate, 1 / 12) - 1 : 0;

  const totalMonths = 60;
  const studyDuration = Math.min(totalMonths, Math.round(studyMonths.value));

  const workIncomes = Array.from({ length: totalMonths }, () => workSalary.value);
  const studyIncomes = Array.from({ length: totalMonths }, (_, index) => {
    return index < studyDuration ? studyIncome.value : salaryAfterStudy.value;
  });

  const workSim = simulatePath(workIncomes, monthlySavings.value, monthlyRate);
  const studySim = simulatePath(studyIncomes, monthlySavings.value, monthlyRate);

  let crossover = null;
  for (let i = 0; i < totalMonths; i += 1) {
    if (studySim.timeline[i] >= workSim.timeline[i]) {
      crossover = i + 1;
      break;
    }
  }

  const incomeGap = (workSalary.value - studyIncome.value) * studyDuration;
  const salaryDelta = salaryAfterStudy.value - workSalary.value;
  let conditionNote = '';

  if (salaryDelta <= 0) {
    conditionNote = 'השכר אחרי הלימודים נמוך או שווה לשכר הנוכחי, ולכן הלימודים דורשים יתרון אחר (קיצור זמן או חיסכון גבוה יותר).';
  } else {
    const monthsToCatchUp = incomeGap > 0 ? incomeGap / salaryDelta : 0;
    conditionNote = `פער ההכנסה בזמן הלימודים הוא ${formatNIS(incomeGap)}. בהפרש שכר של ${formatNIS(salaryDelta)} נדרשים כ-${formatNumber(monthsToCatchUp, 1)} חודשים אחרי הלימודים כדי לסגור את הפער.`;
  }

  resultPanel.querySelector('.result-panel__content').innerHTML = `
    <div class="result-grid">
      <div class="result-item"><span>נקודת חצייה</span><strong>${crossover ? `${crossover} חודשים` : 'לא נמצאה ב-5 שנים'}</strong></div>
      <div class="result-item"><span>תוצאה 5 שנים - עבודה עכשיו</span><strong>${formatNIS(workSim.wealth)}</strong></div>
      <div class="result-item"><span>תוצאה 5 שנים - לימודים</span><strong>${formatNIS(studySim.wealth)}</strong></div>
    </div>
    <p class="field__hint">החישוב מניח חיסכון חודשי קבוע ומחשב תשואה חודשית מצטברת.</p>
    <div class="notice">${conditionNote}</div>
  `;
});

form.addEventListener('reset', () => {
  resultPanel.querySelector('.result-panel__content').innerHTML = '<p>הזינו נתונים כדי לראות איפה הלימודים מנצחים.</p>';
  clearErrors(form);
});

attachFormPersistence(form, 'study-vs-work');

const content = createElement('<div class="calc-grid"></div>');
const formSection = createElement('<section class="section"></section>');
formSection.append(
  createElement('<h2>סימולטור לימודים מול עבודה</h2>'),
  createElement('<p>השוואה בין עבודה מיידית לבין לימודים ואז עבודה עם שכר גבוה יותר.</p>'),
  form
);

const resultSection = createElement('<section class="section"></section>');
resultSection.append(resultPanel);

content.append(formSection, resultSection);

renderLayout({
  title: 'סימולטור לימודים מול עבודה עכשיו',
  subtitle: 'בדקו מתי לימודים משתלמים יותר ומה התנאים שגורמים להם לנצח.',
  intro: 'מחשב את נקודת החצייה ואת התוצאה ל-5 שנים כולל אפשרות לתשואה שנתית על חיסכון.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'לימודים מול עבודה' }
  ],
  highlight: 'מחשבון 4 מתוך 5',
  content
});
