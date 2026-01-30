const STORAGE_PREFIX = 'roi-calculator:';

export function loadFormData(key) {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function saveFormData(key, data) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch (error) {
    // Ignore storage errors (e.g. private mode).
  }
}
