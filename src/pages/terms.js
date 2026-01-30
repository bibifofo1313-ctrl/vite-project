import { renderLayout } from './common.js';
import { createElement } from '../lib/dom.js';

const content = createElement(`
  <div>
    <section class="section">
      <h2>שימוש באתר</h2>
      <p>
        האתר מספק מידע וכלים לחישוב בלבד ואינו מהווה ייעוץ פיננסי או תעסוקתי.
      </p>
    </section>

    <section class="section">
      <h2>אחריות</h2>
      <p>
        הנתונים והחישובים מבוססים על ההזנות שלכם ועל הנחות כלליות. מומלץ
        לאמת נתונים ולקבל ייעוץ מקצועי לפני קבלת החלטות פיננסיות.
      </p>
    </section>

    <section class="section">
      <h2>קניין רוחני</h2>
      <p>
        כל התכנים באתר שייכים לבעלי האתר ואין לעשות בהם שימוש מסחרי ללא אישור.
      </p>
    </section>
  </div>
`);

renderLayout({
  title: 'תקנון שימוש',
  subtitle: 'כללי שימוש באתר כדי להבטיח חוויית שימוש הוגנת וברורה.',
  breadcrumbs: [
    { label: 'דף הבית', href: '/' },
    { label: 'תקנון' }
  ],
  highlight: 'תנאי שימוש',
  content
});
