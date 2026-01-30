import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>איזה מידע נאסף?</h2>
      <p>
        האתר אינו אוסף מידע אישי. כל ההזנות נשמרות רק בדפדפן שלכם לצורך נוחות.
      </p>
    </section>

    <section class="section">
      <h2>עוגיות (Cookies)</h2>
      <p>
        אנו משתמשים באחסון מקומי (LocalStorage) בלבד כדי לזכור את ההזנה האחרונה שלכם.
      </p>
    </section>

    <section class="section">
      <h2>פרסום עתידי</h2>
      <p>
        האתר עשוי לכלול פרסום בעתיד. גם אז נשמור על חוויית שימוש נקייה ומינימלית.
      </p>
    </section>
  </div>
`);

renderLayout({
  title: 'מדיניות פרטיות',
  subtitle: 'שקיפות מלאה לגבי נתונים, אחסון ומדיניות שימוש באתר.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'פרטיות' }
  ],
  highlight: 'פרטיות וביטחון',
  content
});
