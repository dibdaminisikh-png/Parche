# گزارش راستی‌آزمایی مرحله اول

محیط: Node 24، Chromium headless، build تولید روی loopback. این نتایج field CWV یا آزمون بار production نیستند.

- TypeScript typecheck موفق.
- Build client/Worker/Node موفق؛ Worker دارای default.fetch و بدون import builtin Node است.
- ۶ آزمون معنی‌دار: حداقل/گام/موجودی سانتی‌متر، ماتریس نقش، رد write قدیمی و type change، CSRF و private-type/RBAC، جدایی autosave draft از public snapshot، canonical/page/variant/sitemap و تبدیل تومان/ریال. همه موفق.
- Browser QA: ۴۴ مسیر فروشگاه و CMS با status 200، دقیقاً یک H1 و بدون overflow در desktop.
- جریان واقعی مرورگر: انتخاب ۲٫۵ متر، افزودن سبد، ورود گیرنده و نشانی، ثبت سفارش آزمایشی و مشاهده پیام موفق؛ هیچ وجهی گرفته نشد.
- جریان واقعی CMS: ویرایش نام محصول منتشرشده، autosave، باقی ماندن نام عمومی اصلی، preview احراز‌شده draft، بازگرداندن نام و انتشار؛ موفق.
- Mobile 390×844: category/product/cart/checkout/article/admin dashboard/inventory/product editor بدون overflow.
- Console/pageerror نسخه تولید در آزمون مرورگر: صفر.
- Screenshotهای desktop home/admin و mobile home/product بررسی شدند.
- دارایی Hero 1440 AVIF: حدود 110KB؛ Hero موبایل 640 AVIF: حدود 25KB. Font regular/bold هرکدام حدود 50KB، self-host.
- bundle gzip: React حدود 69KB، Storefront حدود 14KB، Shared حدود 9KB؛ Admin حدود 25KB جداست و در صفحه فروشگاه بارگیری نمی‌شود. CSS مشترک gzip حدود 15KB.

Performance synthetic mobile با CPU 4× و network 1.6Mbps/150ms در فایل .runtime/qa/performance.json تولید می‌شود. مقدار INP میدانی و ضمانت LCP<2.5/CLS<0.1 بدون محیط عمومی و داده کاربر واقعی قابل گزارش نیست. تصاویر بالای viewport eager، img size/srcset، فونت swap و motion سبک از ابتدا اعمال شده‌اند.

داده آزمون سفارش/تغییرات در SQLite محلی .runtime بوده و در artifact انتشار گنجانده نمی‌شود. seed production داده تمیز اولیه دارد.

آخرین آزمون synthetic موبایل پس از اصلاح بارگیری فونت و فشرده‌سازی Node: Home cold-cache LCP=1084ms و CLS=0.002607. Category و Product در همان context با cache گرم LCP=308/256ms و CLS=0؛ این دو عدد نباید به‌عنوان cold-cache گزارش شوند. شرایط CPU 4× و network 1.6Mbps با latency150ms بودند. INP آزمایش میدانی نشده است.
