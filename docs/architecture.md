# معماری مرحله اول تار و پود

تاریخ طراحی: ۸ اکتبر ۲۰۲۶. نام برند موقت است. محصولات، قیمت‌ها، سفارش‌ها و تصاویر این تحویل داده نمونه هستند. هدف این مرحله اسکلت قابل اجرا و نمونه کامل قالب‌هاست؛ درگاه پرداخت و هویت مشتری واقعی هنوز متصل نیستند.

## تحلیل مرجع و مرز الهام
بررسی خواندنی Home، robots، sitemap و نمونه صفحات توسط گزارش reference-audit تکمیل می‌شود. sitemap مشاهده‌شده: ۴۲ فایل محصول، ۴۱٬۴۹۵ نشانی محصول و ۲۲۳ مدخل دسته/دسته جانبی. مسیر دسته‌ها غالباً /search/{نام} است. پوشش کاربرد، جنس و فصل مناسب است. در Home H1 پیدا نشد؛ viewport زوم را منع می‌کند. این موارد در نسخه جدید تکرار نمی‌شوند. مقادیر CWV مرجع بدون اندازه‌گیری معلوم نیستند.

## Sitemap و Page Types
- /: Home با sectionهای کنترل‌شده و قابل مدیریت
- /fabric/: دسته ریشه و کاتالوگ
- /fabric/shanel/ و /fabric/shanel/lamedaar/: دسته و زیردسته
- /fabric/linen/، /fabric/satin/، /fabric/crepe/، /fabric/cotton/، /fabric/jacquard/: دسته جنس
- /fabric/linen-summer/، /fabric/black-formal/، /fabric/manto-spring/: صفحات فرود کیوریت‌شده؛ فقط با متن و intent مستقل
- /product/{slug}/: محصول دارای Variant، انتخاب سانتی‌متر، Gallery، FAQ و مشخصات
- /search/?q=: نتایج جستجو noindex
- /collection/{slug}/ و /brand/{slug}/: مجموعه و برند
- /magazine/: Hub تخصصی
- /magazine/category/{slug}/: دسته مجله
- /magazine/{slug}/: مقاله دارای block و TOC
- /cart/، /checkout/، /login/، /account/، /wishlist/، /compare/: مسیرهای خصوصی/تراکنشی noindex
- /about/، /contact/، /terms/، /shipping/، /faq/، /fabric-guide/: صفحات محتوایی
- /admin/: محیط مدیریت؛ در استقرار مستقل Admin host مسیر پایه / دارد
- /admin/products/، /admin/products/{id}/، /admin/categories/، /admin/attributes/، /admin/media/، /admin/articles/، /admin/articles/{id}/
- /admin/homepage/، /admin/navigation/، /admin/pages/، /admin/landings/
- /admin/orders/، /admin/orders/{id}/، /admin/customers/، /admin/discounts/، /admin/reviews/، /admin/inventory/
- /admin/seo/، /admin/redirects/، /admin/analytics/، /admin/search-insights/، /admin/notifications/، /admin/users/، /admin/audit/، /admin/settings/
- /robots.txt، /sitemap.xml (index)، /sitemap-pages.xml، /sitemap-products.xml، /sitemap-articles.xml

## Component Architecture
Shared: Icon، Button، Dialog، Tabs، FormField، Status، Breadcrumb، FAQ، Toast.
Storefront: Header، MegaMenu، MobileNav، Search، ProductCard، ProductGrid، CategoryCard، Filter، Sort، Gallery، VariantSelector، MeterInput، PriceBox، ArticleCard، BlockRenderer، SEOContent، TrustSignals، Footer.
CMS: AdminShell، Sidebar، CommandSearch، DataTable، BulkActions، EntityEditor، ProductEditor، VariantGrid، MediaLibrary، SectionBuilder، BlockEditor، SEOEditor، RevisionHistory، OrderTimeline، AuditLog.

## Technical Architecture
React + TypeScript + Vite. Initial HTML SSR با react-dom/server؛ hydration مستقل فروشگاه و CMS، chunkهای جدا. Workers entry دارای fetch است. Node adapter مستقل برای Nginx/سرور اختصاصی. هیچ UI مستقیماً DB را نمی‌خواند. Repository از API و renderer سرور استفاده می‌شود. Backend فعلی D1 و adapter محلی SQLite دارد؛ مدل Production relational PostgreSQL در گزارش همراه تعریف می‌شود. Media روی R2، assetهای اولیه self-host. انتقال به PostgreSQL/S3 در Repository انجام می‌شود.

Storefront → Public API → Repository → DB
Admin → Authenticated Admin API → Authorization → Repository → DB
Media pipeline → Original object + derivative metadata → storage

مرز Deploy: APP_SURFACE=storefront|admin|all. Admin می‌تواند admin.example.com، فروشگاه example.com باشد. در پیش‌نمایش خصوصی هر دو از یک host با /admin قابل مرورند. APIها در origin مشترک محیط یا reverse proxy /api قرار می‌گیرند تا cookies cross-site لازم نباشد. CORS wildcard نداریم.

## Data Models
Product: id, name, slug, SKU, status, categoryIds, brandId, collectionIds, priceToman, compareAtToman, minCm, stepCm, widthCm, attributes, variants, mediaIds, blocks, FAQs, relatedIds, SEO, publishedAt.
Variant: id, productId, name, colorHex, SKU, priceToman, inventoryCm, reservedCm, mediaId, status.
Category: id, slug, path, parentId, position, description, SEO blocks, FAQs, featured, showHome, showMenu.
AttributeDefinition: id, key, label, type, options, filterable, unit. AttributeValue validated against definition; no fixed SQL column per new attribute.
Article: id, slug, title, excerpt, authorId, categoryId, tags, blocks, related products/categories/articles, cover, publish/updatedAt, status, SEO.
Author, Brand, Collection, Color, Review, Question, FAQ، Page، LandingPage، Media، HomepageSection، MenuColumn، SiteSettings.
Commerce: Customer، Cart، CartLineCm، Order، OrderLine (immutable snapshots), PaymentAttempt، InventoryMovement، Reservation، Coupon.
Admin: User، Role، Permission، Session، AuditEvent، Revision، Redirect، SearchEvent، Notification، ImportJob، BackupJob.

در پیش‌نمایش از tableهای Documents، Revisions، Audit، CartLines، Orders، Memberships، SearchEvents، Media، RateLimits برای storage استفاده می‌شود. JSON documents model نسخه‌دار و API محدود دارد؛ طرح relational کامل مقصد تولید جدا ارائه می‌شود. داده seed فقط در data/ قرار دارد؛ مؤلفه‌ها محتوا را از repository دریافت می‌کنند.

## SEO Architecture
هر صفحه indexable یک H1 و title/description/canonical مستقل دارد. HTML اولیه شامل navigation، متن محصول و مقاله است. URLها lowercase ASCII و slash پایانی؛ 301 برای normalize و Redirect Manager. canonical از trusted configured origin ساخته می‌شود. queryهای facet/sort و search noindex,follow؛ canonical به دسته پایه. صفحات pagination canonical به خود دارند و anchor واقعی prev/next. landingها whitelist محتوایی هستند، نه تولید تمام ترکیب‌ها. sitemap فقط published + index و بدون query. admin/header X-Robots-Tag noindex,nofollow و robots disallow /admin و /api. noindex امنیت نیست؛ API جدا auth دارد.
Schema: Organization، WebSite، BreadcrumbList، Product/Offer (ریال با تبدیل تومان ×۱۰)، ProductGroup برای variantهای معنادار، Article و FAQPage مطابق متن قابل مشاهده. AggregateRating/Review فقط با review واقعی تأییدشده؛ داده نمونه review به rich snippet واقعی تبدیل نمی‌شود. Offer برای مرحله نمایش کاتالوگ نمونه با flag demo از خروجی schema قیمت واقعی حذف می‌شود. نتایج غنی FAQ تضمین نمی‌شود.
Internal Linking: Home→دسته‌های مهم؛ Category→زیرگروه/مقاله/دسته مرتبط؛ Article→محصول و دسته؛ Product→دسته/مکمل/مشابه. CMS پیشنهاد لینک می‌دهد، درج خودکار افراطی ندارد.

## Design System
Editorial fabric atelier؛ warm-white #F7F5F0، neutral ink #292E29، brand evergreen #263C32، terracotta accent #B27154، muted #76796F. یک motif ظریف تار و پود در نشانه برند. فونت فارسی Vazirmatn self-host، نوشته اصلی ۱۶px و label حداقل ۱۴px. Radius 4–10px، خطوط ظریف، shadow بسیار کم، فضای سفید فراوان. Hero split editorial با عکس واقعی‌نما و عنوان درشت فارسی، cards بدون chrome اضافی. RTL واقعی و اعداد fa-IR. CMS با sidebar منظم، کاغذ سفید و تأکید سبز، formهای tabدار. موبایل navigation drawer، filter sheet، gallery swipe و CTA چسبان. reduced-motion، focus-visible، skip link، semantic native controls و keyboard.

## Performance
Hero eager و fetchpriority high؛ width/height مشخص، AVIF/WebP و srcset برای تصاویر. تصاویر پایین fold lazy. font woff2 self-host و font-display swap. JS فروشگاه و Admin جدا؛ CSS مشترک کوچک و route chunks. asset cache immutable، public HTML revalidation محدود، Admin/API private no-store. SEO محتوا client-only نیست. هدف CWV LCP<2.5s INP<200ms CLS<0.1 است؛ تضمین field metrics نیازمند RUM در محیط تولید و ترافیک واقعی است.

## CMS IA / UX
Dashboard: فروش، سفارش‌های منتظر، موجودی، مقاله، اعلان و quick action. Product editor tabs: عمومی، رسانه، قیمت/موجودی، گونه‌ها، ویژگی‌ها، محتوا، SEO، انتشار. Lists جستجو/صفحه‌بندی سمت سرور. Builders فقط componentهای تأییدشده، بدون CSS/HTML آزاد. Draft/Preview/Publish و optimistic revision check. Autosave debounce با draft recovery محلی؛ browser draft منبع authoritative نیست. save پایدار روی API. destructive confirmation، inline errors و status واضح. bulk actions در سرور permission بررسی می‌شوند.

## Security & Roles
پیش‌نمایش private Sites با platform identity. اولین owner از deployment owner restriction bootstrap می‌شود، سایر کاربرها membership لازم دارند؛ UI role جایگزین authorization نیست. هر mutation origin/CSRF و permission سرور بررسی می‌شود؛ queryها prepared و payload schema validation؛ strings escaped توسط React، HTML خام وارد نمی‌شود. rate limit persistent. media MIME/size allowlist. session identity واقعی پیش‌نمایش توسط platform مدیریت می‌شود. تولید مستقل باید OIDC یا Argon2id + session hash + HttpOnly Secure SameSite و TOTP، device revocation و login history adapter را تکمیل کند؛ اینها در demo بدون provider ادعا نمی‌شوند.
Roles: super_admin همه؛ admin مدیریت محتوا/محصول/سفارش بدون تغییر owner؛ content_manager مقاله/صفحه/media؛ seo_manager SEO/redirect؛ product_manager محصول/دسته/موجودی؛ order_manager سفارش؛ support review/question/customer محدود؛ editor فقط draft. Custom Role مجموعه permissionها با محدودیت privilege escalation.
Audit: actor/action/entity/before/after/timestamp در همان عملیات ذخیره. تغییر موجودی ledger مستقل دارد. published content قابل restore از revision است.

## Media / Backup / Operations
Original media حفظ می‌شود؛ upload تصویر allowlist JPEG/PNG/WebP/AVIF، ۱۰MB حداکثر. pipeline تولید AVIF/WebP/responsive derivatives در job با sharp در Node production؛ Workers preview آپلود original+metadata دارد و status processing را صادقانه نمایش می‌دهد. خروجی اولیه عکس‌ها پیشاپیش optimize می‌شود. ویدئو object-storage با size limit جدا، transcoding job لازم است. backup هدف: DB daily full + PostgreSQL PITR، media versioned + offsite copy، restore drill ماهانه، RPO ۱۵min و RTO ۴h هدف؛ preview Backup UI وضعیت واقعی بدون backup service موفقیت جعلی نشان نمی‌دهد.
Payment: مرحله نخست سفارش آزمایشی بدون اخذ وجه؛ تولید idempotency + provider callback verify + atomic reservation، expire و ledger. Analytics privacy-friendly aggregate events بدون PII. Search engine adapter برای PostgreSQL FTS/Meilisearch و cursor pagination در اندازه بزرگ.

## معیار تحویل
نمونه تمام Page Typeها با محتوای مفید، مدیریت واقعی نمونه محصولات/مقاله/دسته/sections/SEO از API، خرید آزمایشی با محاسبه سمت سرور، مسیرهای قابل Crawl، robots/sitemaps، responsive و گزارش verification. اتصال بانک/SMS، production host مستقل، 2FA provider، media background transcoding، backup scheduler و performance field verification مرحله راه‌اندازی تولید هستند.
