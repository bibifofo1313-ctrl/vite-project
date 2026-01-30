# מחשבוני ROI ללימודים וקריירה

אתר Vite סטטי בעברית עם 5 מחשבונים להשוואת מסלולי לימודים וקריירה בישראל. כל החישובים מתבצעים בדפדפן בלבד, עם שמירת נתונים מקומית.

## הרצה מקומית
```bash
npm install
npm run dev
```

## בנייה (Build)
```bash
npm run build
```

## תצוגה מקומית של הבילד
```bash
npm run preview
```

## פריסה בחינם ל‑Netlify
1. הריצו `npm run build`.
2. העלו את תיקיית `dist` ל‑Netlify (Drag & Drop) או חברו את הריפו.
3. אם חיברתם ריפו, ודאו שהפקודה היא `npm run build` ושהתיקייה היא `dist`.

> האתר הוא Multi‑Page, לכן אין צורך בקובץ `_redirects` ל‑SPA.

## עדכון כתובת אתר (SEO)
לפני פריסה לדומיין סופי, החליפו את `https://example.com` בקבצים הבאים:
- `public/sitemap.xml`
- `public/robots.txt`
- כל קובצי ה‑HTML בשורש, `calculators/` ו‑`articles/` (תגי `canonical` ו‑`og:url`).

## הוספת מחשבון חדש
1. צרו קובץ HTML חדש תחת `calculators/` והוסיפו אותו ל‑`vite.config.js`.
2. צרו קובץ JS חדש תחת `src/pages/` עם הלוגיקה.
3. הוסיפו את המחשבון לרשימה ב‑`src/data/calculators.js`.
4. צרו מאמר תואם תחת `articles/` והוסיפו JSON‑LD מסוג FAQPage.

## הפעלת פרסומות בעתיד
האתר כולל רכיב `Ad slot` מותאם. כדי להסתיר/להציג:
- ערכו את `ADS_ENABLED` בקובץ `src/pages/common.js`.
- הוסיפו קוד פרסום אמיתי במקום התיבה הריקה לפי הצורך.

## מבנה תיקיות עיקרי
- `src/components` רכיבי UI משותפים
- `src/pages` קבצי לוגיקה לכל עמוד
- `src/lib` עזרי פורמט, אחסון, אימות
- `public` קבצי SEO סטטיים
