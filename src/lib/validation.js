export function parseNumberValue(value) {
  if (typeof value !== 'string') {
    return Number(value);
  }
  const cleaned = value.replace(/,/g, '').trim();
  if (cleaned === '') {
    return NaN;
  }
  return Number(cleaned);
}

export function readNumberField(form, name, label, { required = true, min, max } = {}) {
  const input = form.querySelector(`[name="${name}"]`);
  const raw = input ? input.value : '';
  if (!raw && required) {
    return { value: NaN, error: `נדרש להזין ${label}.` };
  }
  if (!raw && !required) {
    return { value: NaN, error: null };
  }
  const value = parseNumberValue(raw);
  if (!Number.isFinite(value)) {
    return { value: NaN, error: `${label} חייב להיות מספר תקין.` };
  }
  if (typeof min === 'number' && value < min) {
    return { value: NaN, error: `${label} חייב להיות לפחות ${min}.` };
  }
  if (typeof max === 'number' && value > max) {
    return { value: NaN, error: `${label} חייב להיות עד ${max}.` };
  }
  return { value, error: null };
}

export function readTextField(form, name, label, { required = true } = {}) {
  const input = form.querySelector(`[name="${name}"]`);
  const value = input ? input.value.trim() : '';
  if (!value && required) {
    return { value: '', error: `נדרש להזין ${label}.` };
  }
  return { value, error: null };
}

export function readRadioField(form, name, label) {
  const input = form.querySelector(`input[name="${name}"]:checked`);
  if (!input) {
    return { value: '', error: `יש לבחור ${label}.` };
  }
  return { value: input.value, error: null };
}

export function clearErrors(form) {
  form.querySelectorAll('[data-error-for]').forEach((element) => {
    element.textContent = '';
  });
  form.querySelectorAll('[aria-invalid="true"]').forEach((element) => {
    element.removeAttribute('aria-invalid');
  });
  const summary = form.querySelector('.form-summary');
  if (summary) {
    summary.textContent = '';
  }
}

export function applyErrors(form, errors) {
  const summary = form.querySelector('.form-summary');
  if (summary) {
    summary.textContent = 'אנא תקנו את השדות המסומנים.';
  }
  Object.entries(errors).forEach(([name, message]) => {
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    if (errorEl) {
      errorEl.textContent = message;
    }
    const input = form.querySelector(`[name="${name}"]`);
    if (input) {
      input.setAttribute('aria-invalid', 'true');
    }
  });
}

export function collectFormData(form) {
  const data = {};
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    if (!field.name) {
      return;
    }
    if (field.type === 'radio') {
      if (field.checked) {
        data[field.name] = field.value;
      }
      return;
    }
    if (field.type === 'checkbox') {
      data[field.name] = field.checked;
      return;
    }
    data[field.name] = field.value;
  });
  return data;
}

export function hydrateFormData(form, data) {
  if (!data) {
    return;
  }
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    if (!field.name || !(field.name in data)) {
      return;
    }
    const value = data[field.name];
    if (field.type === 'radio') {
      field.checked = field.value === value;
      return;
    }
    if (field.type === 'checkbox') {
      field.checked = Boolean(value);
      return;
    }
    field.value = value;
  });
}
