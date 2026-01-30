const THEME_KEY = 'roi-theme';

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

export function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') {
    document.documentElement.dataset.theme = stored;
    return;
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
}

export function bindThemeToggle(button) {
  if (!button) {
    return;
  }

  const setLabel = () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    button.setAttribute('aria-label', isDark ? 'מעבר למצב בהיר' : 'מעבר למצב כהה');
    button.querySelector('.theme-toggle__icon').textContent = isDark ? '◑' : '◐';
  };

  setLabel();

  button.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setLabel();
  });
}
