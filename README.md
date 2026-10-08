# تار و پود — فروشگاه و CMS پارچه

مرحله اول اجرایی: React/TypeScript SSR + Vite، API و Repository مستقل، D1/R2 در preview، Node/SQLite برای اجرا پشت Nginx. داده‌های محصولات و متن‌ها در seed data قرار دارند و از CMS/API مدیریت می‌شوند؛ در مؤلفه‌های محصول hardcode نشده‌اند.

## اجرا

```bash
npm ci
npm run dev
```

آدرس: http://localhost:3000 — فروشگاه / و مدیریت /admin/. محیط dev فقط loopback است و مدیر محلی نمونه دارد.

```bash
npm run typecheck
npm test
npm run build
NODE_ENV=production LOCAL_DEV=1 npm start
```

دستور آخر صرفاً آزمون تولید روی loopback است. پیش از ارائه عمومی، LOCAL_DEV را حذف و adapter هویت مستقل را متصل کنید. Worker در dist/server/index.js و assetها در dist/client قرار دارند. Migrationها در drizzle/ هستند؛ schema runtime ساخته نمی‌شود. نمونه schema PostgreSQL مقصد تولید در docs/cms-production-architecture.md است.

## مستندات

- docs/reference-audit.md: بررسی مبتنی بر شواهد پارچه‌نگار و sitemap منطقی
- docs/architecture.md: Sitemap نسخه جدید، Page Types، Design System، SEO و مدل داده
- docs/cms-production-architecture.md: Schema، RBAC، API و معماری تولید
- docs/implementation-status.md: قابلیت‌های اجراشده و اتصال‌های مرحله تولید
- docs/verification.md: نتایج آزمون‌ها

قیمت‌ها تومان integer هستند؛ مقادیر خرید inventory سانتی‌متر integer. Structured Offer در حالت تجاری از price ×10 با IRR استفاده می‌کند. demo=true پرداخت واقعی و review/rating ساختگی ندارد.

نام برند، مشخصات/قیمت محصولات و تصاویر این نسخه نمونه هستند. عکس‌های نمایشی اختصاصی تولید شده‌اند؛ هویت بصری و محتوای مرجع کپی نشده‌اند. فونت Vazirmatn با مجوز OFL در public/fonts/OFL.txt حفظ شده است.
