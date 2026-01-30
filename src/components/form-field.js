import { createElement } from '../lib/dom.js';

export function renderFormField({
  id,
  label,
  type = 'number',
  placeholder = '',
  hint = '',
  suffix = '',
  min,
  max,
  step,
  inputMode,
  required = false,
  value = '',
  as = 'input',
  options = []
}) {
  const inputAttributes = [
    `id="${id}"`,
    `name="${id}"`,
    `placeholder="${placeholder}"`,
    required ? 'required' : '',
    inputMode ? `inputmode="${inputMode}"` : ''
  ]
    .filter(Boolean)
    .join(' ');

  let fieldControl = '';
  if (as === 'select') {
    fieldControl = `
      <select class="field__control" ${inputAttributes}>
        ${options
          .map((option) => {
            const selected = option.value === value ? 'selected' : '';
            return `<option value="${option.value}" ${selected}>${option.label}</option>`;
          })
          .join('')}
      </select>
    `;
  } else {
    const numberAttributes = [
      typeof min === 'number' ? `min="${min}"` : '',
      typeof max === 'number' ? `max="${max}"` : '',
      typeof step === 'number' ? `step="${step}"` : ''
    ]
      .filter(Boolean)
      .join(' ');

    fieldControl = `
      <input class="field__control" type="${type}" ${inputAttributes} ${numberAttributes} value="${value}" />
    `;
  }

  return createElement(`
    <label class="field" for="${id}">
      <span class="field__label">${label}${required ? ' *' : ''}</span>
      <div class="field__input">
        ${fieldControl}
        ${suffix ? `<span class="field__suffix">${suffix}</span>` : ''}
      </div>
      ${hint ? `<span class="field__hint">${hint}</span>` : ''}
      <span class="field__error" data-error-for="${id}" aria-live="polite"></span>
    </label>
  `);
}

export function renderRadioGroup({ name, label, options = [], hint = '' }) {
  return createElement(`
    <fieldset class="field field--radio">
      <legend class="field__label">${label}</legend>
      <div class="field__radio">
        ${options
          .map((option) => {
            const checked = option.checked ? 'checked' : '';
            return `
              <label class="radio">
                <input type="radio" name="${name}" value="${option.value}" ${checked} />
                <span>${option.label}</span>
              </label>
            `;
          })
          .join('')}
      </div>
      ${hint ? `<span class="field__hint">${hint}</span>` : ''}
      <span class="field__error" data-error-for="${name}" aria-live="polite"></span>
    </fieldset>
  `);
}
