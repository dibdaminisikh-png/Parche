# وضعیت تحویل مرحله اول

این پروژه نمونه اجرایی فروشگاه و CMS است و آماده دریافت تنظیمات و اتصال‌های تولید. نام برند، تصاویر، مشخصات محصول و قیمت‌ها نمونه‌اند؛ هیچ ادعای فروش یا نظر خرید واقعی تولید نشده است.

## پیاده‌شده و قابل آزمایش
- HTML اولیه سرور برای صفحات اصلی، دسته، زیردسته، landing، محصول، مجموعه/برند، مجله/دسته/مقاله و صفحات محتوایی.
- Mega Menu، جستجو، فیلترهای جنس/کاربری/فصل/ضخامت/ایستایی/کشسانی/طرح/بافت/لطافت/شفافیت/رنگ/عرض/قیمت/موجودی؛ نتایج URL خواندنی و noindex برای ترکیب‌ها.
- Variant با SKU/قیمت/موجودی مستقل، انتخاب مقدار integer cm، بزرگ‌نمایی تصویر، جدول مشخصات، راهنمای نگهداری و لینک مرتبط.
- سبد پایدار در API، علاقه‌مندی و مقایسه پایدار، Checkout آزمایشی با محاسبه قیمت و موجودی سمت سرور، کد تخفیف نمونه، سفارش و timeline در حساب/مدیریت.
- CMS فارسی RTL با تمام بخش‌های اصلی؛ CRUD محصول/مقاله/صفحه/landing/attribute/coupon، Duplicate با Variant ID مستقل، دسته‌بندی والد/ترتیب، Media upload چندتایی + original/WebP، metadata/focal point.
- سازنده دیداری sections و منوی ستون‌دار، تغییر ترتیب Drag & Drop، Product/Category embed در Block Editor.
- Autosave محصول/مقاله/صفحه/landing با بازیابی draft محلی؛ working draft محصول/مقاله منتشرشده جدا از snapshot زنده، Preview احراز‌شده، Publish و Revision/Restore.
- SEO Center و Google/Social Preview، index/follow/canonical، 301/302 و جلوگیری از loop انتقال.
- لیست محصول/مقاله با جستجو و pagination سمت سرور؛ bulk انتشار/بایگانی/حذف؛ API bulk قیمت/موجودی/دسته؛ CSV validation/preview/per-row import و export.
- سفارش‌ها، مشتریان مشتق‌شده از سفارش مجاز، موجودی Variant و ثبت تغییر در Audit، moderation Review/Q&A و پیام تماس.
- RBAC سرور، Custom Role، مالک احراز‌شده خصوصی، CSRF/origin check، rate limiting، prepared SQL، اعتبارسنجی typed محتوا و optimistic version guard اتمی.
- Sitemap index و نقشه صفحات/محصولات/مقالات، metadata و JSON-LD معتبر؛ ریال = تومان ×۱۰، بدون AggregateRating ساختگی. در demo Offer قیمت واقعی منتشر نمی‌شود.
- تصاویر AVIF/WebP با اندازه رزروشده و srcset، فونت Vazirmatn دارای OFL و self-host، chunk فروشگاه/Admin جدا، reduced motion و keyboard/focus.
- Worker fetch و adapter Node/SQLite قابل اجرا بدون Cloudflare؛ مرز API/Repository برای انتقال به PostgreSQL/S3.

## طراحی‌شده؛ نیازمند راه‌اندازی تولید
- دامنه‌های واقعی example.com/admin.example.com، هویت مستقل مشتری با SMS/OIDC، session device management و 2FA مستقل.
- پرداخت بانکی واقعی، verify callback، idempotency، reservation اتمی موجودی/انقضای رزرو و refund واقعی.
- پردازش پس‌زمینه AVIF چنداندازه، ویدئو، crop دائمی، pipeline کامل responsive media (دارایی‌های اولیه از قبل بهینه هستند).
- اجرای scheduled publish (زمان انتخابی ذخیره می‌شود)، email/SMS/notification delivery، analytics pageview/conversion و monitoring.
- Excel native import/export (CSV اجرا شده)، سیاست snapshot/PITR/offsite media backup و restore drill خودکار.
- published snapshot/draft برای category و builders، autosave همه builderها، مدیریت پوشش ده‌هاهزار رکورد فروشگاه به‌صورت query-driven server grid؛ SSR فعلی dataset نمونه را با سقف ۵۰۰ document بارگیری می‌کند. Admin lists از API pagination استفاده می‌کنند؛ ادعای آزمون بار تولید وجود ندارد.
- taxonomy کامل ۱۲ موضوع تخصصی مجله و تمام زیرنوع‌ها؛ این مرحله برای هر Page Type نمونه کامل ارائه می‌دهد، نه تولید ده‌هاهزار محصول یا مقاله.
- گزارش خودکار orphan/لینک شکسته/alt سراسری، 404های پرتکرار، notification read state و search-engine اختصاصی.
- Field Core Web Vitals/RUM، CDN مستقل و cache عمومی HTML متکی به snapshot (HTML preview خصوصی no-store است تا داده کاربران cache نشود).

## دسترسی و استقرار
پیش‌نمایش Sites خصوصی است؛ فروشگاه و مدیریت در / و /admin/ روی یک host قرار دارند. APP_SURFACE=storefront|admin برای بسته‌های جدا و reverse-proxy API پیش‌بینی شده است. ارائه دامنه مستقل واقعی بدون domain و provider امکان‌پذیر نیست. Node production بدون LOCAL_DEV به adapter هویت trusted reverse proxy نیاز دارد؛ LOCAL_DEV فقط برای localhost آزمایش است و برای شبکه عمومی استفاده نمی‌شود.

راهنما و Schema نهایی در architecture.md و cms-production-architecture.md آمده‌اند. ویژگی‌هایی که سرویس متصل ندارند در UI وضعیت نیازمند اتصال دارند؛ موفقیت پرداخت، backup یا analytics جعلی نمایش داده نمی‌شود.
