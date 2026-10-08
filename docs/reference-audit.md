# بررسی معماری پارچه‌نگار برای مرحله اول فروشگاه جدید

تاریخ: ۸ اکتبر ۲۰۲۶. روش: درخواست‌های HTTP خواندنی با حفظ proxy، بررسی HTML اولیه، robots، تمام فایل‌های sitemap فروشگاه و نمونه‌های اصلی صفحه. هیچ حساب، سبد خرید، سفارش، نظر یا داده‌ای در مرجع تغییر نکرده است. این گزارش ارزیابی بصری مرورگر، آزمایش Checkout یا اندازه‌گیری Core Web Vitals نیست؛ درباره کیفیت بصری، رفتار واقعی موبایل، INP، LCP و CLS ادعای اندازه‌گیری ندارد.

## پوشش بررسی و شواهد

HTML صفحه اصلی، سه دسته «شانل طرحدار»، «لینن ساده» و «مانتویی»، یک محصول شانل، مجله، دسته مجله «پارچه‌شناسی»، مقاله «ترنچ کت چیست؟»، قوانین و روش ارسال دریافت شد. نسخه مرتب‌شده و صفحه دوم دسته شانل نیز بررسی شد. URL حدسی محصول لینن ۴۰۴ داد و در استنتاج ساختار استفاده نشده است.

تمام ۴۵ sitemap معرفی‌شده در `/sitemap.xml` دریافت شد: ۴۲ فایل محصول با **۴۱٬۴۹۵ مدخل**، دو فایل دسته با **۲۱۷ مدخل** و یک فایل دسته جانبی با **۶ مدخل**. ۲۲۳ مدخل دسته در مجموع **۲۲۱ URL یکتا** دارند؛ دو مورد پاییزه و تابستانه تکرار شده‌اند. شمارش، تعداد مدخل‌های sitemap است؛ برابر دانستن آن با موجودی فعال فروشگاه مجاز نیست. sitemap مجله جداگانه `/mag/sitemap_index.xml` است: دو sitemap مقاله با **۱۱۴۳ مدخل مقاله** و دسته‌های مجله با **۱۹ مدخل**. در index مجله هفت sitemap تگ، یک author و یک page نیز معرفی شده‌اند؛ فایل‌های تگ در این مرحله دانلود نشده‌اند.

شواهد قابل بازبینی: `fetch-log.json` وضعیت HTTP، حجم پاسخ و هدرهای مرتبط؛ `home-links.json` لینک‌ها؛ `sitemap-urls.json` تمام مدخل‌های نقشه فروشگاه؛ فایل‌های `*.html` شواهد خام و `*.json` خروجی استخراج‌شده هر صفحه. زمان پاسخ ثبت‌شده تحت تأثیر شبکه این محیط است و CWV محسوب نمی‌شود.

## نقشه منطقی و taxonomy مرجع

```text
/
├─ /search/{نام-یا-عبارت-فارسی}
│  ├─ جنس/بافت: ژاکارد، شانل، لینن، کرپ، ساتن، حریر، مخمل، کتان، فوتر...
│  ├─ زیرنوع: ژاکارد لمه/ترک/مجلسی، لینن ساده/طرحدار، شانل طرحدار...
│  ├─ فصل: پاییزه، زمستانه، تابستانه
│  ├─ کاربرد: مانتویی، مجلسی، روزمره، چادری
│  ├─ مبدأ/مجموعه: پارچه‌های هندی، پارچه جدید، حراج، رنگ سال
│  └─ sort / filters / page به صورت query string
├─ /product/{نام-پارچه-رنگ-و-کد}
├─ /mag/
│  ├─ /mag/category/{موضوع}/
│  ├─ /mag/category/{موضوع}/{زیرموضوع}/
│  ├─ /mag/{عنوان-مقاله}/
│  ├─ /mag/tag/... و /mag/author/... (معرفی در sitemap index)
│  └─ استایل، اخبار، پارچه‌شناسی، مراقبت، ترفند دوخت، دانستنی‌ها
├─ /cart
├─ /login
├─ /terms
├─ /ways-to-send
├─ /express-tehran
├─ /refund
└─ /free-delivery
```

لینک‌های cart و login در Home دیده شدند؛ صفحات تراکنشی بررسی نشده‌اند. robots مسیرهای `/cart/`، `/shipping`، `/transaction/*`، `/profile/*` و `/admin/*` را منع کرده است. وجود مسیر در robots، وجود صفحه یا کیفیت پیاده‌سازی آن را اثبات نمی‌کند. robots فروشگاه sitemap را معرفی نمی‌کند. robots در زیردایرکتوری مجله جایگزین robots ریشه برای crawlerها نیست.

Page Typeهای مشاهده‌شده: Home، دسته والد با کارت زیردسته، دسته محصول با فیلتر/مرتب‌سازی/صفحه‌بندی، محصول و رنگ‌های هم‌خانواده، Hub مجله، آرشیو موضوعی مجله، مقاله، صفحه خدمات/قوانین؛ Page Typeهای صرفاً لینک‌شده: سبد و ورود. Wishlist، Compare، Brand، Account و Checkout در این بررسی اثبات نشده‌اند و باید به صورت نیاز نسخه جدید طراحی شوند.

## نقاط موفقی که باید به معماری جدید منتقل شوند

- پوشش زیاد جنس، کاربرد، فصل و زیرنوع در منوی اصلی؛ امکان رسیدن مستقیم به جنس‌های مهم با لینک واقعی HTML.
- دسته والد مانتویی، کارت زیردسته با شمار محصولات و قیمت شروع دارد؛ دسته‌های انتهایی شامل محصول و متن تخصصی هستند.
- دسته شانل، متن آموزشی مفصل درباره الیاف، بافت، ایستایی، لطافت، کاربرد، نگهداری، شستشو و دوخت دارد. این الگوی «خرید + انتخاب آگاهانه» ارزش حفظ کردن دارد؛ متن مرجع نباید کپی شود.
- محصول، گالری، رنگ‌های خانواده، موجود/ناموجود، انتخاب متر و سانتی‌متر، مشخصات عرض/جنس/کاربری/ضخامت/ایستایی و متن تخصصی شامل آبرفت و اتورفت دارد. Q&A و نظر با پاسخ فروشگاه و خریدار مشخص دیده می‌شود.
- مجله یک آرشیو کوچک نیست؛ دسته‌های چندسطحی و آرشیو بزرگ مقاله دارد. مقاله نمونه، تیترهای بخش‌بندی‌شده، تصویر، breadcrumb، مقاله مرتبط و لینک خرید دسته مرتبط دارد.
- محتوای دسته، محصول و مقاله در HTML اولیه موجود است؛ این مزیت SSR باید حفظ شود.
- Trust signals ارسال، ضمانت بازگشت وجه و کیفیت، آدرس و تلفن در Footer حضور دارند.

## ضعف‌های مشاهده‌شده و راهکار نسخه جدید

| شاهد مشاهده‌شده | اثر/محدودیت | راهکار پیشنهادی |
|---|---|---|
| دسته‌ها و landingها همگی در namespace `/search/` و با عبارت‌های فارسی دارای فاصله‌اند؛ taxonomy رسمی، جستجوی آزاد و campaign از هم تفکیک URL ندارند. | ابهام مدیریتی و canonical، دشوار شدن governance؛ صرف این مسیر به معنی ضعف رتبه نیست. | دسته پایدار `/fabric/{slug}/`، زیردسته واقعی، landing curated و `/search?q=` با noindex. |
| منو تعداد زیادی لینک `?sort=last` دارد. | پارامترهای غیرضروری در مسیرهای اصلی خزیدن. | لینک منو فقط URL canonical؛ state فیلتر/Sort از navigation جدا. |
| دسته صفحه دوم شانل canonical خود را به صفحه اول اعلام کرده، با وجود Grid متفاوت. | سیگنال canonical نامناسب برای صفحه‌بندی واقعی. | صفحات page=2+ با canonical خودشان و لینک crawlable؛ sort/filter طبق سیاست مشخص. |
| Home هیچ H1 ندارد؛ محصول نمونه دو H1 دارد؛ H1 دسته شانل پس از Product Grid است. | سلسله‌مراتب محتوایی و عنوان اصلی برای کاربر/ماشین مبهم‌تر می‌شود. | H1 واحد و واضح بالای main؛ متن تخصصی پایین grid با H2/H3. |
| دسته والد مانتویی title «قیمت و خرید آنلاین - پارچه نگار» دارد؛ قوانین و ارسال همان title Home را تکرار می‌کنند. | متادیتای عمومی به جای هدف صفحه. | Title و description مستقل، CMS preview و validation. |
| BreadcrumbList محصول به علت trailing comma JSON نامعتبر است. | crawler نمی‌تواند آن JSON-LD را به شکل استاندارد parse کند. | تولید typed schema از data layer و JSON serialization معتبر. |
| Offer محصول `priceCurrency: IRR` و `price: 988000` دارد، اما UI همان عدد را «۹۸۸٬۰۰۰ تومان» می‌نویسد؛ condition برابر UsedCondition است. | ناسازگاری واحد قیمت با UI و condition نامتناسب با پارچه نو. | نگهداری integer IRR، تبدیل نمایش به تومان، schema با IRR صحیح و NewCondition. |
| Product description در schema خالی است و ProductGroup برای خانواده رنگ مشاهده نشد. | schema قابلیت بیشتری دارد که استفاده نشده است؛ نبود ProductGroup الزاماً خطا نیست. | Product/Offer و در صورت مناسب بودن ProductGroup، variant identity و availability دقیق. |
| viewport فروشگاه `maximum-scale=1,user-scalable=no` دارد. | محدود کردن zoom برای کاربران کم‌بینا. | آزاد گذاشتن zoom، keyboard/focus و کنترل کنتراست. |
| Home ۲۷۳ img دارد؛ ۲۵۸ مورد `data-src`، هیچ img در Home/دسته/محصول width+height یا srcset ندارد؛ منابع محصول/کارت عمدتاً JPG و برخی GIF هستند. | lazy loading به JavaScript متکی است؛ فضای رزروشده و پاسخ‌گویی تصویر در markup دیده نمی‌شود. CLS واقعی اندازه‌گیری نشده است. | AVIF/WebP، width/height یا aspect-ratio، srcset/sizes؛ src واقعی، loading=lazy فقط خارج viewport و hero eager. |
| CSS bundle حدود ۲۸۷٬۷۱۴ بایت و JS bundle حدود ۶۰۲٬۴۵۵ بایت دریافت‌شده دارد؛ Home حدود ۳۵۷٬۵۰۲ بایت HTML است. | حجم decoded پاسخ است، نه transfer size با gzip؛ عملکرد نهایی اندازه‌گیری نشده. | template-specific imports، code splitting، server-first render، بودجه تصاویر/JS و آزمون CWV واقعی. |
| پاسخ HTML فروشگاه `no-cache, private` و x-cache BYPASS دارد؛ مجله cache max-age=3 اعلام می‌کند. | در این پاسخ‌ها cache عمومی بلندمدت مشاهده نشد؛ backend strategy داخلی نامعلوم است. | cache عمومی صفحات خواندنی، revalidation رویدادی و جداسازی session/cart از HTML عمومی. |
| Twitter image فروشگاه خالی و OG logo با ابعاد ۶۰×۶۰ است. | preview اشتراک‌گذاری محدودتر می‌شود. | تصویر اختصاصی ۱۲۰۰×۶۳۰ برای صفحه/محصول و fallback معتبر. |
| sitemap دسته‌ها دو URL تکراری و نام‌هایی مثل «ر»، «نخی خالدار اشتباه»، «کتان111» دارد. | نشانه نیاز به اعتبارسنجی انتشار taxonomy؛ ۲۰۰/ایندکس/محتوای این تک‌صفحه‌ها بررسی نشده است. | فقط canonicalهای منتشرشده و indexable در sitemap؛ slug validation، orphan report و draft workflow. |

نسخه sort دسته شانل canonical را درست به URL بدون sort می‌دهد؛ این رفتار مثبت است. کنترل همه ترکیب‌های filters بررسی نشده و نباید بدون شاهد ادعا کرد مرجع هزاران URL indexable تولید می‌کند. مجله نمونه Article، Person و Breadcrumb schema دارد؛ چند graph و BlogPosting همزمان دیده شد، اما conflicting facts بررسی نشده و «خطا» فرض نمی‌شود.

## sitemap پیشنهادی نسخه جدید و نقش هر مسیر

| مسیر پایدار | قالب/محتوا | سیاست crawl/index |
|---|---|---|
| `/` | Home ساخته‌شده از sectionهای CMS | index + canonical خود |
| `/fabric/` | ریشه جنس/کاربرد/فصل و guide | index |
| `/fabric/shanel/` | دسته، زیرنوع، filter، grid، راهنما، FAQ | index |
| `/fabric/shanel/lamedaar/` | زیردسته واقعی با intent مستقل | index |
| `/fabric/linen-summer/` و مشابه | landing curated با collection rule و متن مستقل | index بعد از تأیید SEO |
| `/product/shanel-noir/` | خانواده محصول، رنگ و متراژ؛ variant با ID و SKU | index؛ query رنگ canonical به خانواده مگر صفحه variant مستقل مصوب |
| `/collections/autumn-edit/` | کالکشن و خرید editorial | index در صورت محتوای کافی |
| `/brands/{slug}/` | برند/مبدأ با محتوای مستقل | index در صورت ارزش مستقل |
| `/search?q=` | جستجو + zero-result useful state | noindex,follow؛ خارج sitemap |
| `/magazine/` | Content Hub با موضوع و مسیر انتخاب | index |
| `/magazine/category/{slug}/` | topic hub | index |
| `/magazine/{slug}/` | مقاله + TOC + نویسنده + محصول/دسته مرتبط | index |
| `/cart/`, `/checkout/`, `/login/`, `/account/`, `/wishlist/`, `/compare/` | نمونه کامل transactional/account | noindex؛ اطلاعات شخصی private |
| `/about/`, `/contact/`, `/terms/`, `/shipping/`, `/faq/`, `/fabric-guide/` | صفحات خدماتی واقعی و block-based | index جز موارد سیاستی انتخابی |
| `/404` | پاسخ واقعی ۴۰۴، جستجو و دسته‌های محبوب | noindex |
| `/sitemap.xml` | index تفکیک products/categories/articles/pages/images | فقط URL ۲۰۰ canonical indexable |
| `admin.{domain}` | CMS جدا با API احرازشده | noindex,nofollow + X-Robots-Tag، authentication |

Landing از فیلتر تولید خودکار نمی‌شود. ترکیب‌های عادی filter noindex,follow دارند و canonical به پایه مناسب، در sitemap نمی‌آیند؛ لینک منوی ثابت پارامتر ندارد. صفحات pagination واقعی canonical خودشان دارند. Robots disallow جایگزین noindex نیست؛ crawler باید بتواند دستور noindex را ببیند. redirects slug قدیم → جدید در CMS پیشنهاد و پس از ثبت resolve می‌شوند.

Internal linking هدفمند: Home → دسته/کالکشن مهم؛ Category ↔ guide/article مرتبط؛ Article → category و product مناسب؛ Product → breadcrumb/category، complementary و similar؛ هر deep page breadcrumb معتبر. محتوای آموزشی باید مطابق ویژگی همان محصول/الیاف باشد و از تعمیم قطعی مراقبت به تمام خانواده‌ها پرهیز کند.

## محدودیت بررسی

این مرحله coverage ساختار با sitemap و نمونه قالب‌هاست، نه crawl تک‌تک ۴۱ هزار صفحه. صحت تمام URLها، محصول ناموجود، canonical تمام فیلترها، نرخ خطا، checkout واقعی، امنیت backend مرجع، سرعت روی دستگاه واقعی و UX بصری/keyboard مرورگر بررسی نشده‌اند. هویت بصری، عکس‌ها، متن‌ها و دارایی‌های مرجع برای ساخت کپی نمی‌شوند.
