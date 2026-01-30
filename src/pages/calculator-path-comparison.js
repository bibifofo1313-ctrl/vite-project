import { renderLayout, attachFormPersistence } from './common.js';
import { renderFormField } from '../components/form-field.js';
import { renderResultPanel } from '../components/result-panel.js';
import { createElement } from '../lib/dom.js';
import { formatNIS, formatNumber, clampNumber } from '../lib/format.js';
import { readNumberField, clearErrors, applyErrors } from '../lib/validation.js';

const form = document.createElement('form');
form.className = 'calc-form';
form.innerHTML = '<div class="form-summary" role="alert"></div>';

function buildPathFields(prefix, title) {
  const wrapper = createElement(`<div class="section"><h3>${title}</h3></div>`);
  const fields = [
    renderFormField({
      id: `${prefix}TotalCost`,
      label: 'עלות כוללת',
      placeholder: 'לדוגמה 95,000',
      suffix: '₪',
      min: 0,
      required: true
    }),
    renderFormField({
      id: `${prefix}SalaryAfter`,
      label: 'שכר חודשי אחרי המסלול',
      placeholder: 'לדוגמה 11,000',
      suffix: '₪',
      min: 0,
      required: true
    }),
    renderFormField({
      id: `${prefix}JobSearch`,
      label: 'חודשי חיפוש עבודה',
      placeholder: 'לדוגמה 4',
      min: 0,
      required: true
    }),
    renderFormField({
      id: `${prefix}Unemployment`,
      label: 'סיכון אבטלה (אחוזים)',
      placeholder: 'לדוגמה 8',
      suffix: '%',
      min: 0,
      max: 100,
      required: true
    })
  ];
  fields.forEach((field) => wrapper.append(field));
  return wrapper;
}

const pathsGrid = createElement('<div class="calc-grid"></div>');
pathsGrid.append(buildPathFields('pathA', 'מסלול A'), buildPathFields('pathB', 'מסלול B'));

form.append(pathsGrid);
form.append(
  createElement(`
    <div class="card__actions">
      <button class="button" type="submit">חשב</button>
      <button class="button button--ghost" type="reset">איפוס</button>
    </div>
  `)
);

const resultPanel = renderResultPanel({
  title: 'תוצאות השוואה ל-5 שנים',
  content: '<p>הזינו נתונים כדי לקבל השוואה מלאה.</p>'
});

const scenarios = [
  { id: 'conservative', label: 'שמרני', salaryMultiplier: 0.9, riskDelta: 5, jobSearchDelta: 2 },
  { id: 'baseline', label: 'בסיסי', salaryMultiplier: 1, riskDelta: 0, jobSearchDelta: 0 },
  { id: 'optimistic', label: 'אופטימי', salaryMultiplier: 1.1, riskDelta: -5, jobSearchDelta: -1 }
];

function calculateOutcome({ totalCost, salaryAfter, jobSearchMonths, risk }, scenario) {
  const salary = salaryAfter * scenario.salaryMultiplier;
  const adjustedRisk = clampNumber(risk + scenario.riskDelta, 0, 100);
  const adjustedJobSearch = Math.max(0, jobSearchMonths + scenario.jobSearchDelta);
  const incomeMonths = Math.max(0, 60 - adjustedJobSearch);
  const expectedMonthly = salary * (1 - adjustedRisk / 100);
  return expectedMonthly * incomeMonths - totalCost;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors(form);

  const errors = {};
  const inputs = {
    pathATotalCost: readNumberField(form, 'pathATotalCost', 'עלות כוללת למסלול A', { min: 0 }),
    pathASalaryAfter: readNumberField(form, 'pathASalaryAfter', 'שכר אחרי מסלול A', { min: 0 }),
    pathAJobSearch: readNumberField(form, 'pathAJobSearch', 'חודשי חיפוש למסלול A', { min: 0 }),
    pathAUnemployment: readNumberField(form, 'pathAUnemployment', 'סיכון אבטלה למסלול A', { min: 0, max: 100 }),
    pathBTotalCost: readNumberField(form, 'pathBTotalCost', 'עלות כוללת למסלול B', { min: 0 }),
    pathBSalaryAfter: readNumberField(form, 'pathBSalaryAfter', 'שכר אחרי מסלול B', { min: 0 }),
    pathBJobSearch: readNumberField(form, 'pathBJobSearch', 'חודשי חיפוש למסלול B', { min: 0 }),
    pathBUnemployment: readNumberField(form, 'pathBUnemployment', 'סיכון אבטלה למסלול B', { min: 0, max: 100 })
  };

  Object.entries(inputs).forEach(([key, value]) => {
    if (value.error) {
      errors[key] = value.error;
    }
  });

  if (Object.keys(errors).length) {
    applyErrors(form, errors);
    return;
  }

  const pathA = {
    totalCost: inputs.pathATotalCost.value,
    salaryAfter: inputs.pathASalaryAfter.value,
    jobSearchMonths: inputs.pathAJobSearch.value,
    risk: inputs.pathAUnemployment.value
  };
  const pathB = {
    totalCost: inputs.pathBTotalCost.value,
    salaryAfter: inputs.pathBSalaryAfter.value,
    jobSearchMonths: inputs.pathBJobSearch.value,
    risk: inputs.pathBUnemployment.value
  };

  const results = scenarios.map((scenario) => {
    return {
      label: scenario.label,
      a: calculateOutcome(pathA, scenario),
      b: calculateOutcome(pathB, scenario)
    };
  });

  const baseline = results.find((row) => row.label === 'בסיסי');
  const winner = baseline.a === baseline.b
    ? 'תיקו'
    : baseline.a > baseline.b
      ? 'מסלול A'
      : 'מסלול B';

  const incomeMonthsA = Math.max(0, 60 - pathA.jobSearchMonths);
  const incomeMonthsB = Math.max(0, 60 - pathB.jobSearchMonths);
  const sensitivityA = 0.01 * pathA.salaryAfter * incomeMonthsA;
  const sensitivityB = 0.01 * pathB.salaryAfter * incomeMonthsB;

  resultPanel.querySelector('.result-panel__content').innerHTML = `
    <div class="result-grid">
      ${results
        .map(
          (row) => `
          <div class="result-item"><span>${row.label} - מסלול A</span><strong>${formatNIS(row.a)}</strong></div>
          <div class="result-item"><span>${row.label} - מסלול B</span><strong>${formatNIS(row.b)}</strong></div>
        `
        )
        .join('')}
    </div>
    <div class="notice">המסלול המוביל בתרחיש הבסיסי: ${winner}.</div>
    <p class="field__hint">רגישות לשכר: שינוי של 1% בשכר במסלול A משנה את התוצאה בכ-${formatNIS(sensitivityA)}, ובמסלול B בכ-${formatNIS(sensitivityB)} לאורך 5 שנים.</p>
  `;
});

form.addEventListener('reset', () => {
  resultPanel.querySelector('.result-panel__content').innerHTML = '<p>הזינו נתונים כדי לקבל השוואה מלאה.</p>';
  clearErrors(form);
});

attachFormPersistence(form, 'path-comparison');

const content = createElement('<div class="calc-grid"></div>');
const formSection = createElement('<section class="section"></section>');
formSection.append(
  createElement('<h2>השוואת מסלולים</h2>'),
  createElement('<p>הזינו את הנתונים לכל מסלול כדי להשוות תוצאות ל-5 שנים.</p>'),
  form
);

const resultSection = createElement('<section class="section"></section>');
resultSection.append(resultPanel);

content.append(formSection, resultSection);

renderLayout({
  title: 'מחשבון השוואת מסלולים A/B',
  subtitle: 'ראו איזה מסלול מנצח לאורך חמש שנים בשלושה תרחישים שונים.',
  intro: 'המחשבון כולל סיכון אבטלה וחודשים ללא עבודה כדי להעריך תוצאות בצורה מציאותית.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'מחשבונים', href: '/calculators.html' },
    { label: 'השוואת מסלולים' }
  ],
  highlight: 'מחשבון 3 מתוך 5',
  content
});
