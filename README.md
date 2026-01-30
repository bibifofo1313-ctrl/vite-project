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

## SEO: משתני סביבה לכתובת האתר
ה‑build יוצר `sitemap.xml` לפי `SITE_URL`, וה‑HTML משתמש ב‑`VITE_SITE_URL` עבור `canonical` ו‑`og:url`.
הגדירו את שני המשתנים לאותו ערך.

דוגמה מקומית (PowerShell):
```powershell
$env:SITE_URL="https://example.com"
$env:VITE_SITE_URL="https://example.com"
npm run build
```

ב‑Netlify:
- Site settings → Environment variables
- הוסיפו `SITE_URL` ו‑`VITE_SITE_URL` עם הדומיין הפעיל.

אם המשתנים לא מוגדרים, יעשה שימוש ב‑`https://example.com` כברירת מחדל.

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
- `scripts` סקריפטים לבנייה (למשל sitemap)
