const STORAGE_KEY = 'roi-accessibility';
const TEXT_CLASSES = ['a11y-text-1', 'a11y-text-2', 'a11y-text-3'];

const defaultState = {
  textScale: 0,
  highContrast: false,
  highlightLinks: false,
  reduceMotion: false
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...defaultState };
    }
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function applyState(state) {
  const root = document.documentElement;
  TEXT_CLASSES.forEach((cls) => root.classList.remove(cls));
  if (state.textScale > 0 && state.textScale <= TEXT_CLASSES.length) {
    root.classList.add(TEXT_CLASSES[state.textScale - 1]);
  }
  root.classList.toggle('a11y-contrast', Boolean(state.highContrast));
  root.classList.toggle('a11y-links', Boolean(state.highlightLinks));
  root.classList.toggle('a11y-reduce-motion', Boolean(state.reduceMotion));
}

function getFocusable(panel) {
  return Array.from(
    panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled'));
}

export function initAccessibilityMenu() {
  if (document.querySelector('.a11y-container')) {
    return;
  }
  const state = loadState();
  applyState(state);

  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.className = 'a11y-toggle';
  toggleButton.setAttribute('aria-haspopup', 'dialog');
  toggleButton.setAttribute('aria-controls', 'a11y-panel');
  toggleButton.setAttribute('aria-expanded', 'false');
  toggleButton.innerHTML = '<span aria-hidden="true">♿</span> נגישות';

  const panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'a11y-title');
  panel.hidden = true;
  panel.innerHTML = `
    <div class="a11y-panel__header">
      <h2 id="a11y-title">אפשרויות נגישות</h2>
      <button type="button" class="a11y-panel__close" data-a11y-close aria-label="סגירת תפריט נגישות">×</button>
    </div>
    <div class="a11y-panel__body">
      <fieldset class="a11y-group">
        <legend>גודל טקסט</legend>
        <div class="a11y-options" role="radiogroup">
          <button type="button" class="a11y-option" data-text-scale="0" aria-pressed="true">רגיל</button>
          <button type="button" class="a11y-option" data-text-scale="1">גדול</button>
          <button type="button" class="a11y-option" data-text-scale="2">גדול +</button>
          <button type="button" class="a11y-option" data-text-scale="3">גדול ++</button>
        </div>
      </fieldset>
      <div class="a11y-group">
        <button type="button" class="a11y-toggle-btn" data-toggle="contrast" aria-pressed="false">ניגודיות גבוהה</button>
        <button type="button" class="a11y-toggle-btn" data-toggle="links" aria-pressed="false">הדגשת קישורים</button>
        <button type="button" class="a11y-toggle-btn" data-toggle="motion" aria-pressed="false">הפחתת תנועה</button>
      </div>
      <button type="button" class="a11y-reset" data-a11y-reset>איפוס להגדרות ברירת מחדל</button>
    </div>
  `;

  const container = document.createElement('div');
  container.className = 'a11y-container';
  container.append(toggleButton, panel);
  document.body.append(container);

  const updateButtons = () => {
    const textButtons = panel.querySelectorAll('[data-text-scale]');
    textButtons.forEach((btn) => {
      const scale = Number(btn.getAttribute('data-text-scale'));
      const isActive = scale === state.textScale;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.classList.toggle('is-active', isActive);
    });

    panel.querySelector('[data-toggle="contrast"]').setAttribute(
      'aria-pressed',
      state.highContrast ? 'true' : 'false'
    );
    panel.querySelector('[data-toggle="links"]').setAttribute(
      'aria-pressed',
      state.highlightLinks ? 'true' : 'false'
    );
    panel.querySelector('[data-toggle="motion"]').setAttribute(
      'aria-pressed',
      state.reduceMotion ? 'true' : 'false'
    );
  };

  let lastFocused = null;

  const openPanel = () => {
    lastFocused = document.activeElement;
    panel.hidden = false;
    toggleButton.setAttribute('aria-expanded', 'true');
    updateButtons();
    const focusable = getFocusable(panel);
    (focusable[0] || panel).focus();
  };

  const closePanel = () => {
    panel.hidden = true;
    toggleButton.setAttribute('aria-expanded', 'false');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  };

  toggleButton.addEventListener('click', () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (target.matches('[data-a11y-close]')) {
      closePanel();
      return;
    }
    if (target.matches('[data-text-scale]')) {
      state.textScale = Number(target.getAttribute('data-text-scale'));
      applyState(state);
      saveState(state);
      updateButtons();
      return;
    }
    if (target.matches('[data-toggle="contrast"]')) {
      state.highContrast = !state.highContrast;
    }
    if (target.matches('[data-toggle="links"]')) {
      state.highlightLinks = !state.highlightLinks;
    }
    if (target.matches('[data-toggle="motion"]')) {
      state.reduceMotion = !state.reduceMotion;
    }
    if (target.matches('[data-toggle]')) {
      applyState(state);
      saveState(state);
      updateButtons();
    }
    if (target.matches('[data-a11y-reset]')) {
      Object.assign(state, defaultState);
      applyState(state);
      saveState(state);
      updateButtons();
    }
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePanel();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const focusable = getFocusable(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  updateButtons();
}
