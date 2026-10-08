# معماری پیشنهادی فروشگاه پارچه و CMS مستقل — مرحله اول

این سند پیشنهاد معماری است و ادعای اندازه‌گیری یا ممیزی سایت مرجع ندارد. نتیجه بررسی سایت مرجع باید در گزارش جداگانه همراه URL، شواهد و محدودیت دسترسی ثبت شود. امکانات دمو، اطلاعات نمونه و قابلیت‌های عملیاتی تولید نیز باید در تحویل به‌وضوح از هم جدا شوند.

## ۱. تصمیم معماری

فروشگاه، پنل و API سه برنامه مستقل با قرارداد مشترک هستند. فروشگاه تنها از API عمومی و پنل تنها از API مدیریتی احراز هویت‌شده استفاده می‌کند. هیچ‌یک از برنامه‌های مرورگر به Database، کلید پرداخت یا فضای ذخیره‌سازی خصوصی دسترسی ندارد.

```text
example.com                admin.example.com
Storefront SSR             Admin CMS
  /api/* same-origin         /api/* same-origin
          \                  /
           API / Domain services
            |       |       |
        PostgreSQL  Search  Media storage
            |               |
        Outbox / Worker     AVIF/WebP derivatives
            |
        Cache invalidation / jobs / notifications
```

انتخاب اجرایی مرحله اول مطابق محدودیت runtime پیش‌نمایش: Vite + React SSR با ورودی Worker-compatible `fetch`، repositoryهای مستقل، D1/R2 در مسیر میزبانی Sites و Adapter قابل انتقال Node با `node:sqlite`. محتوای اصلی SEO در HTML اولیه SSR رندر می‌شود. پنل و API از همان قرارداد داده استفاده می‌کنند و تغییرات نمونه از طریق API ذخیره می‌شوند. پنل مرحله اول به مالک احراز هویت‌شده پلتفرم محدود است؛ رمز عمومی یا ورود ساختگی به‌عنوان امنیت واقعی ارائه نمی‌شود.

برای سرور اختصاصی، Adapter داده به PostgreSQL و رسانه به S3-compatible یا filesystem امن منتقل می‌شود و سرویس‌های storefront/admin/api با Nginx روی میزبان‌های مستقل قرار می‌گیرند. SSR portable Node و Worker باید یک renderer داشته باشند. در تولید پرحجم، worker background، queue و cache مناسب اضافه می‌شود؛ Redis انتخاب اجرایی است و ضرورت ذاتی همه deploymentها نیست. PostgreSQL زیر، schema مقصد تولید است و نباید به‌عنوان migration اجراشده D1 معرفی شود.

```text
apps/storefront       قالب‌ها، server render، نمایش محتوا
apps/admin            مدیریت محتوا، سفارش، ابزارهای Visual
apps/api              auth، validation، authorization، domain services
apps/worker           media، schedule، import، backup، index، outbox
packages/contracts    DTO، schema validation، error codes، OpenAPI
packages/domain       قواعد پول، مقدار پارچه، publish، inventory
packages/ui           tokens، اجزای مشترک کنترل‌شده
packages/content      block schema، migrations، sanitization
packages/seo          canonical، metadata، structured data، sitemap
infra                 Nginx، container، backup، deployment
docs                  تصمیم‌های معماری، API، عملیات
```

در نمونه اولیه هم داده در repository/adaptor قرار می‌گیرد، نه در JSX اجزا. Adapter D1 و Adapter SQLite/Node یک قرارداد دارند؛ Adapter PostgreSQL تولید نیز همان قرارداد را پیاده می‌کند. جابه‌جایی آن‌ها به بازنویسی قالب‌ها نیاز ندارد. اطلاعات عمومی سایت، Navigation، Footer، FAQ و Home sections نیز مدل داده دارند. جدایی logical برنامه‌ها از deploy جدا متفاوت است: اگر پیش‌نمایش یک origin مشترک داشته باشد، باید این محدودیت و راه جداکردن subdomainها در گزارش تحویل نوشته شود.

## ۲. Sitemap و Page Typeها

نام Slugها نمونه است؛ مسیرهای موجود پس از انتشار با Redirect Manager حفظ می‌شوند.

| Page type | مسیر نمونه | index | نمونه کامل لازم در مرحله اول |
|---|---|---|---|
| Home | `/` | بله | Hero، دسته‌ها، محصولات، محتوا، اعتماد، FAQ |
| دسته اصلی | `/fabric/` | بله | معرفی، گروه‌ها، محصولات، محتوای راهنما |
| دسته پارچه | `/fabric/shanel/` | بله | زیرگروه، فیلتر، محصول، محتوای تخصصی و FAQ |
| زیردسته | `/fabric/shanel/lamedaar/` | بله | توضیح مستقل و مجموعه مرتبط |
| Landing SEO | `/fabric/linen-summer/` | بله | intent مستقل، محتوای اصل و محصولات منتخب |
| محصول | `/product/shanel-pearl/` | بله | Variant، متر/سانتی‌متر، مشخصات، راهنما، ارتباط محتوا |
| جستجو | `/search/?q=linen` | خیر | نتایج، پیشنهاد اصلاح، zero-result مفید |
| مجموعه | `/collections/spring-edit/` | بله | روایت مجموعه، محصولات و محتوا |
| برند | `/brands/atelier/` | بله اگر محتوای مستقل دارد | معرفی برند، دسته‌ها و محصولات |
| مجله | `/magazine/` | بله | Content Hub با دسته‌ها، راهنماهای اصلی و مقاله |
| دسته مجله | `/magazine/fabric-knowledge/` | بله | مقدمه تخصصی، مقالات و ارتباط با فروشگاه |
| مقاله | `/magazine/choosing-shanel/` | بله | TOC، H2/H3، embeds، author، تاریخ واقعی، FAQ |
| سبد | `/cart/` | خیر | اقلام واقعی، مقدار، خلاصه هزینه و empty state |
| Checkout | `/checkout/` | خیر | آدرس، ارسال، پرداخت نمونه شفاف، اعتبارسنجی |
| ورود | `/login/` | خیر | فرم، بازیابی و وضعیت خطا/موفقیت |
| ثبت‌نام | `/register/` | خیر | فرم مستقل یا جریان ورود مشترک |
| حساب | `/account/` | خیر | سفارش، آدرس، تنظیمات و راهنمای ورود |
| سفارش حساب | `/account/orders/sample-order/` | خیر | Timeline نمونه با دسترسی مالک |
| علاقه‌مندی | `/wishlist/` | خیر | محصول ذخیره‌شده و انتقال به سبد |
| مقایسه | `/compare/` | خیر | مقایسه جنس، عرض، ایستایی، کشسانی و قیمت |
| درباره | `/about/` | بله | محتوای برند، منطق انتخاب پارچه و تجربه خرید |
| تماس | `/contact/` | بله | اطلاعات تماس قابل مدیریت و فرم |
| قوانین | `/terms/` | بله | شرایط فروش و حریم خصوصی نمونه قابل تکمیل |
| ارسال | `/shipping/` | بله | روش، زمان، هزینه و پیگیری |
| FAQ | `/faq/` | بله | گروه‌بندی موضوعی و سؤال‌های واقعی |
| راهنمای خرید | `/buying-guide/` | بله | انتخاب کاربرد، متر، اندازه و نگهداری |
| 404 | مسیر ناموجود | خیر | وضعیت HTTP 404، جستجو و مسیرهای پیشنهادی |
| Admin | دامنه مستقل | خیر | Dashboard و نمونه عملکردی تمام گروه‌های مدیریتی اصلی |

چیدمان CMS در تولید روی ریشه دامنه Admin است. مسیر `/admin/` تنها می‌تواند مسیر پیش‌نمایش یکپارچه باشد؛ معنای آن deployment مستقل عملیاتی نیست.

## ۳. مدل محتوا و اجزای مشترک

اجزای Storefront: `Header`، `MegaMenu`، `MobileNavigation`، `Search`، `Breadcrumb`، `ProductCard`، `ProductGrid`، `CategoryCard`، `FilterPanel`، `MobileFilterSheet`، `SortControl`، `Pagination`، `Gallery`، `VariantSelector`، `MeterQuantityInput`، `PriceBox`، `Specifications`، `ArticleCard`، `RichContentRenderer`، `SEOContent`، `FAQ`، `Reviews`، `RelatedLinks`، `Footer`.

اجزای Admin: `AdminShell`، `GlobalCommandSearch`، `DataTable`، `BulkActionBar`، `StatusBadge`، `FormField`، `MediaPicker`، `VariantTable`، `AttributeEditor`، `BlockEditor`، `RevisionDrawer`، `PublishPanel`، `SEOEditor`، `GooglePreview`، `SocialPreview`، `SectionBuilder`، `MenuBuilder`، `AuditTimeline` و `ConfirmDialog`.

مدل Block editor یک union نسخه‌دار است: paragraph، heading، image، gallery، video، quote، table، list، FAQ، productEmbed، categoryEmbed، callout، button، comparisonTable، tableOfContents. متن غنی در درخت محدود JSON ذخیره و هنگام نمایش sanitize می‌شود؛ HTML و CSS دلخواه پذیرفته نمی‌شود. Embedها به ID پایدار اشاره دارند. حذف محصول، block مقاله را خراب نمی‌کند؛ renderer می‌تواند لینک دسته جایگزین و وضعیت عدم دسترسی نشان دهد.

Home/Landing/Menu builders تنها Blockهای شناخته‌شده و تنظیمات token-based را می‌پذیرند. `Background` انتخاب یک token است، نه CSS آزاد. Schema هر Section با نوع آن اعتبارسنجی می‌شود. Preview از همان Renderer فروشگاه استفاده می‌کند.

## ۴. قواعد دامنه‌ای مهم

### مقدار پارچه و موجودی

واحد داخلی تمام پارچه‌ها **سانتی‌متر صحیح** است؛ مقدار خرید، موجودی، رزرو، برگشت و ledger همگی integer هستند. مثال: ۱٫۷۵ متر = `175 cm`، Step نیم‌متر = `50 cm`، Step یک‌دهم متر = `10 cm`. محاسبه با float انجام نمی‌شود.

`minimum_quantity_cm` باید مضرب Step باشد. API مقدار را پس از تبدیل اعداد فارسی و اعشار، با قواعد `quantity >= minimum` و `quantity % step = 0` اعتبارسنجی می‌کند. UI هم فیلد «متر» و هم «سانتی‌متر» را ارائه می‌کند و مقدار نهایی را واضح می‌نویسد.

موجودی در Variant نگهداری می‌شود. `available = on_hand - reserved`؛ قراردادن در سبد به‌تنهایی موجودی را رزرو نمی‌کند. آغاز Checkout رزرو با TTL ایجاد می‌کند. پرداخت موفق، webhook معتبر و idempotent، رزرو را به خروج تبدیل می‌کند. انقضای رزرو در worker انجام می‌شود. Over-selling با تراکنش و قفل سطر یا UPDATE شرطی جلوگیری می‌شود.

پول در Database عدد صحیح **ریال** و currency برابر `IRR` است. UI اگر تومان نشان می‌دهد تقسیم دقیق بر ۱۰ و label روشن دارد. `price_per_meter_rial` منبع قیمت پارچه است؛ قیمت هر خط با عدد صحیح و rounding تعریف‌شده محاسبه می‌شود. Checkout قیمت، تخفیف، مالیات و ارسال را دوباره در سرور محاسبه و snapshot می‌کند. مبلغ دریافتی از مرورگر معتبر نیست.

### Draft و Revision

هر موجودیت قابل انتشار یک `content_document` دارد. ویرایش در Draft revision انجام می‌شود؛ Published revision تا انتشار بعدی تغییر نمی‌کند. انتشار در یک تراکنش، snapshot معتبر را به projection خواندنی و SEO منتقل می‌کند، route/redirect را به‌روزرسانی می‌کند و outbox event می‌سازد. موجودی و قیمت عملیاتی از محتوای editorial جدا هستند؛ API Checkout همیشه مقدار فعلی را می‌خواند.

Autosave بر اساس `base_revision` یا ETag از overwrite هم‌زمان جلوگیری می‌کند. Local recovery draft در IndexedDB با نسخه و زمان ذخیره می‌شود، در قطع شبکه «ذخیره روی این دستگاه» را نشان می‌دهد و پس از اتصال conflict را آگاهانه حل می‌کند. اطلاعات سفارش، آدرس یا رمز عبور در local recovery ذخیره نمی‌شود.

### Attributes

Attribute definition شامل نام، code پایدار، type، واحد، گزینه‌ها، validation، scope و تنظیم filterability است. Attribute جدید، مثلاً ضدآب، با تعریف جدید و مقدارهای محصول اضافه می‌شود. تغییر type یک Attribute دارای مقدار، migration/تأیید سازگاری لازم دارد؛ حذف آن archive می‌شود تا داده‌های قبلی شکسته نشوند. فیلترها از Attributeهای فعال و قابل‌فیلتر ساخته می‌شوند.

## ۵. پیشنهاد Schema اصلی PostgreSQL

DDL زیر هسته پیشنهادی PostgreSQL است، نه migration اجراشده. بخش‌های همراه در جدول بعدی آمده‌اند. برای همه migrationها review، تست تراکنش، تست هم‌زمانی و seed مستقل لازم است. UUID در سرویس تولید می‌شود؛ extension اضافی برای این هسته ضروری نیست. در D1/SQLite، UUID به TEXT، enum به CHECK و JSONB به JSON validated تبدیل می‌شود؛ هر Adapter باید رفتار تراکنش، idempotency و محدودیت concurrency مخصوص runtime را رعایت کند. محدودیت عدد صحیح امن JavaScript نیز در قرارداد مبلغ لحاظ می‌شود؛ bigint خارج از JSON number به رشته عددی منتقل می‌شود.

```sql
CREATE TYPE document_kind AS ENUM
  ('product','category','article','page','landing','collection','brand','homepage','navigation');
CREATE TYPE publication_status AS ENUM
  ('draft','scheduled','published','archived');
CREATE TYPE order_status AS ENUM
  ('new','paid','processing','packed','shipped','delivered','cancelled','refunded');
CREATE TYPE moderation_status AS ENUM
  ('pending','approved','rejected','spam');

CREATE TABLE staff_users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  totp_secret_ciphertext bytea,
  mfa_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE roles (
  id uuid PRIMARY KEY, code text NOT NULL UNIQUE,
  name text NOT NULL, system_role boolean NOT NULL DEFAULT false
);
CREATE TABLE permissions (code text PRIMARY KEY, description text NOT NULL);
CREATE TABLE role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id),
  permission_code text NOT NULL REFERENCES permissions(code),
  PRIMARY KEY(role_id, permission_code)
);
CREATE TABLE user_roles (
  user_id uuid NOT NULL REFERENCES staff_users(id),
  role_id uuid NOT NULL REFERENCES roles(id),
  PRIMARY KEY(user_id, role_id)
);
CREATE TABLE staff_sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES staff_users(id),
  token_hash bytea NOT NULL UNIQUE,
  csrf_token_hash bytea NOT NULL,
  device_label text,
  ip_prefix text,
  expires_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE content_documents (
  id uuid PRIMARY KEY,
  kind document_kind NOT NULL,
  status publication_status NOT NULL DEFAULT 'draft',
  draft_revision_id uuid,
  published_revision_id uuid,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE content_revisions (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL REFERENCES content_documents(id),
  revision_number integer NOT NULL CHECK (revision_number > 0),
  schema_version integer NOT NULL CHECK (schema_version > 0),
  snapshot jsonb NOT NULL,
  author_id uuid REFERENCES staff_users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(document_id, revision_number),
  UNIQUE(document_id, id)
);
ALTER TABLE content_documents ADD CONSTRAINT draft_revision_owner
  FOREIGN KEY(id, draft_revision_id)
  REFERENCES content_revisions(document_id, id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE content_documents ADD CONSTRAINT published_revision_owner
  FOREIGN KEY(id, published_revision_id)
  REFERENCES content_revisions(document_id, id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE media_assets (
  id uuid PRIMARY KEY,
  original_storage_key text NOT NULL UNIQUE,
  original_filename text NOT NULL,
  mime_type text NOT NULL,
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  width integer CHECK (width > 0),
  height integer CHECK (height > 0),
  alt_text text NOT NULL DEFAULT '',
  focal_x numeric(5,4) NOT NULL DEFAULT 0.5 CHECK (focal_x BETWEEN 0 AND 1),
  focal_y numeric(5,4) NOT NULL DEFAULT 0.5 CHECK (focal_y BETWEEN 0 AND 1),
  folder_id uuid,
  state text NOT NULL CHECK (state IN ('processing','ready','failed','quarantined')),
  created_by uuid REFERENCES staff_users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE media_derivatives (
  id uuid PRIMARY KEY,
  media_id uuid NOT NULL REFERENCES media_assets(id),
  storage_key text NOT NULL UNIQUE,
  format text NOT NULL CHECK (format IN ('avif','webp','jpeg','poster')),
  width integer NOT NULL CHECK (width > 0),
  height integer NOT NULL CHECK (height > 0),
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  UNIQUE(media_id, format, width, height)
);
CREATE TABLE categories (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL UNIQUE REFERENCES content_documents(id),
  parent_id uuid REFERENCES categories(id),
  slug text NOT NULL,
  name text NOT NULL,
  canonical_path text NOT NULL UNIQUE,
  short_description text NOT NULL DEFAULT '',
  cover_media_id uuid REFERENCES media_assets(id),
  sort_order integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT false,
  show_in_menu boolean NOT NULL DEFAULT false,
  CHECK (id IS DISTINCT FROM parent_id)
);
CREATE UNIQUE INDEX category_sibling_slug
  ON categories(COALESCE(parent_id::text, 'root'), slug);
CREATE TABLE category_closure (
  ancestor_id uuid NOT NULL REFERENCES categories(id),
  descendant_id uuid NOT NULL REFERENCES categories(id),
  depth integer NOT NULL CHECK (depth >= 0),
  PRIMARY KEY(ancestor_id, descendant_id)
);

CREATE TABLE brands (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL UNIQUE REFERENCES content_documents(id),
  name text NOT NULL, slug text NOT NULL UNIQUE
);
CREATE TABLE collections (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL UNIQUE REFERENCES content_documents(id),
  name text NOT NULL, slug text NOT NULL UNIQUE,
  starts_at timestamptz, ends_at timestamptz
);
CREATE TABLE products (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL UNIQUE REFERENCES content_documents(id),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sku text NOT NULL UNIQUE,
  primary_category_id uuid NOT NULL REFERENCES categories(id),
  brand_id uuid REFERENCES brands(id),
  minimum_quantity_cm integer NOT NULL DEFAULT 50 CHECK (minimum_quantity_cm > 0),
  quantity_step_cm integer NOT NULL DEFAULT 25 CHECK (quantity_step_cm > 0),
  width_cm integer CHECK (width_cm > 0),
  search_normalized text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (minimum_quantity_cm % quantity_step_cm = 0)
);
CREATE TABLE product_categories (
  product_id uuid NOT NULL REFERENCES products(id),
  category_id uuid NOT NULL REFERENCES categories(id),
  PRIMARY KEY(product_id, category_id)
);
CREATE INDEX category_product_lookup ON product_categories(category_id, product_id);
CREATE TABLE collection_products (
  collection_id uuid NOT NULL REFERENCES collections(id),
  product_id uuid NOT NULL REFERENCES products(id),
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY(collection_id, product_id)
);
CREATE TABLE colors (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  hex text CHECK (hex ~ '^#[0-9a-fA-F]{6}$')
);
CREATE TABLE product_variants (
  id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id),
  sku text NOT NULL UNIQUE,
  barcode text,
  color_id uuid REFERENCES colors(id),
  title text NOT NULL,
  price_per_meter_rial bigint NOT NULL CHECK (price_per_meter_rial >= 0),
  compare_at_price_rial bigint CHECK (compare_at_price_rial >= 0),
  image_id uuid REFERENCES media_assets(id),
  active boolean NOT NULL DEFAULT true,
  CHECK (compare_at_price_rial IS NULL OR compare_at_price_rial >= price_per_meter_rial)
);
CREATE INDEX variant_product_lookup ON product_variants(product_id, active);
CREATE TABLE product_media (
  product_id uuid NOT NULL REFERENCES products(id),
  media_id uuid NOT NULL REFERENCES media_assets(id),
  variant_id uuid REFERENCES product_variants(id),
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY(product_id, media_id)
);
CREATE TABLE attribute_definitions (
  id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  value_type text NOT NULL CHECK
    (value_type IN ('text','number','boolean','select','multiselect')),
  unit text,
  validation jsonb NOT NULL DEFAULT '{}',
  options jsonb NOT NULL DEFAULT '[]',
  scope text NOT NULL CHECK (scope IN ('product','variant','both')),
  filterable boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true
);
CREATE TABLE attribute_values (
  id uuid PRIMARY KEY,
  attribute_id uuid NOT NULL REFERENCES attribute_definitions(id),
  product_id uuid REFERENCES products(id),
  variant_id uuid REFERENCES product_variants(id),
  value jsonb NOT NULL,
  CHECK (num_nonnulls(product_id, variant_id) = 1)
);
CREATE UNIQUE INDEX product_attribute_unique
  ON attribute_values(product_id, attribute_id) WHERE product_id IS NOT NULL;
CREATE UNIQUE INDEX variant_attribute_unique
  ON attribute_values(variant_id, attribute_id) WHERE variant_id IS NOT NULL;
CREATE INDEX attribute_filter_lookup ON attribute_values(attribute_id);

CREATE TABLE inventory_balances (
  variant_id uuid PRIMARY KEY REFERENCES product_variants(id),
  on_hand_cm integer NOT NULL DEFAULT 0 CHECK (on_hand_cm >= 0),
  reserved_cm integer NOT NULL DEFAULT 0 CHECK (reserved_cm >= 0),
  low_stock_threshold_cm integer NOT NULL DEFAULT 500 CHECK (low_stock_threshold_cm >= 0),
  version bigint NOT NULL DEFAULT 1,
  CHECK (reserved_cm <= on_hand_cm)
);
CREATE TABLE inventory_ledger (
  id uuid PRIMARY KEY,
  variant_id uuid NOT NULL REFERENCES product_variants(id),
  on_hand_delta_cm integer NOT NULL DEFAULT 0,
  reserved_delta_cm integer NOT NULL DEFAULT 0,
  reason text NOT NULL,
  reference_id uuid,
  idempotency_key text NOT NULL UNIQUE,
  actor_id uuid REFERENCES staff_users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX inventory_history_lookup ON inventory_ledger(variant_id, created_at DESC);

CREATE TABLE customers (
  id uuid PRIMARY KEY,
  display_name text NOT NULL,
  email text,
  phone_normalized text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  order_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES customers(id),
  status order_status NOT NULL DEFAULT 'new',
  payment_status text NOT NULL CHECK
    (payment_status IN ('unpaid','pending','paid','failed','partially_refunded','refunded')),
  currency char(3) NOT NULL DEFAULT 'IRR' CHECK (currency = 'IRR'),
  subtotal_rial bigint NOT NULL CHECK (subtotal_rial >= 0),
  discount_rial bigint NOT NULL DEFAULT 0 CHECK (discount_rial >= 0),
  shipping_rial bigint NOT NULL DEFAULT 0 CHECK (shipping_rial >= 0),
  tax_rial bigint NOT NULL DEFAULT 0 CHECK (tax_rial >= 0),
  total_rial bigint NOT NULL CHECK (total_rial >= 0),
  address_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (total_rial = subtotal_rial - discount_rial + shipping_rial + tax_rial),
  CHECK (discount_rial <= subtotal_rial)
);
CREATE INDEX order_status_date_lookup ON orders(status, created_at DESC, id);
CREATE INDEX customer_order_lookup ON orders(customer_id, created_at DESC);
CREATE TABLE order_items (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id),
  variant_id uuid NOT NULL REFERENCES product_variants(id),
  product_snapshot jsonb NOT NULL,
  quantity_cm integer NOT NULL CHECK (quantity_cm > 0),
  price_per_meter_rial bigint NOT NULL CHECK (price_per_meter_rial >= 0),
  line_total_rial bigint NOT NULL CHECK (line_total_rial >= 0)
);
CREATE TABLE stock_reservations (
  id uuid PRIMARY KEY,
  checkout_id uuid NOT NULL,
  variant_id uuid NOT NULL REFERENCES product_variants(id),
  quantity_cm integer NOT NULL CHECK (quantity_cm > 0),
  expires_at timestamptz NOT NULL,
  state text NOT NULL CHECK (state IN ('active','consumed','released')),
  idempotency_key text NOT NULL UNIQUE
);
CREATE INDEX reservation_expiry_lookup
  ON stock_reservations(expires_at) WHERE state = 'active';
CREATE TABLE order_events (
  id uuid PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id),
  actor_id uuid REFERENCES staff_users(id),
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE authors (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio text NOT NULL DEFAULT '',
  avatar_id uuid REFERENCES media_assets(id)
);
CREATE TABLE article_categories (
  id uuid PRIMARY KEY,
  name text NOT NULL, slug text NOT NULL UNIQUE,
  parent_id uuid REFERENCES article_categories(id),
  description text NOT NULL DEFAULT ''
);
CREATE TABLE articles (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL UNIQUE REFERENCES content_documents(id),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  cover_id uuid REFERENCES media_assets(id),
  author_id uuid NOT NULL REFERENCES authors(id),
  category_id uuid NOT NULL REFERENCES article_categories(id),
  content_blocks jsonb NOT NULL DEFAULT '[]',
  first_published_at timestamptz,
  content_updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE pages (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL UNIQUE REFERENCES content_documents(id),
  title text NOT NULL,
  path text NOT NULL UNIQUE,
  blocks jsonb NOT NULL DEFAULT '[]'
);
CREATE TABLE faq_items (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL REFERENCES content_documents(id),
  question text NOT NULL,
  answer_blocks jsonb NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
CREATE TABLE seo_metadata (
  document_id uuid PRIMARY KEY REFERENCES content_documents(id),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  canonical_url text,
  indexable boolean NOT NULL DEFAULT true,
  follow_links boolean NOT NULL DEFAULT true,
  og_title text,
  og_description text,
  og_image_id uuid REFERENCES media_assets(id),
  twitter_image_id uuid REFERENCES media_assets(id),
  schema_settings jsonb NOT NULL DEFAULT '{}'
);
CREATE TABLE content_routes (
  id uuid PRIMARY KEY,
  path text NOT NULL UNIQUE,
  document_id uuid NOT NULL REFERENCES content_documents(id),
  is_canonical boolean NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX one_canonical_route_per_document
  ON content_routes(document_id) WHERE is_canonical;
CREATE TABLE redirects (
  id uuid PRIMARY KEY,
  source_path text NOT NULL UNIQUE,
  target_path text NOT NULL,
  status_code integer NOT NULL CHECK (status_code IN (301,302)),
  active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES staff_users(id),
  CHECK (source_path <> target_path)
);
CREATE TABLE content_links (
  source_document_id uuid NOT NULL REFERENCES content_documents(id),
  target_document_id uuid NOT NULL REFERENCES content_documents(id),
  link_type text NOT NULL CHECK (link_type IN ('editorial','embed','related','navigation')),
  PRIMARY KEY(source_document_id, target_document_id, link_type),
  CHECK (source_document_id <> target_document_id)
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id),
  customer_id uuid REFERENCES customers(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL,
  status moderation_status NOT NULL DEFAULT 'pending',
  verified_purchase boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX approved_product_reviews
  ON reviews(product_id, created_at DESC) WHERE status = 'approved';
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY,
  actor_id uuid REFERENCES staff_users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  before_snapshot jsonb,
  after_snapshot jsonb,
  request_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_entity_lookup
  ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE TABLE outbox_events (
  id uuid PRIMARY KEY,
  event_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  attempts integer NOT NULL DEFAULT 0
);
CREATE INDEX pending_outbox_lookup
  ON outbox_events(created_at) WHERE processed_at IS NULL;
```

قواعد تکمیلی که با CHECK ساده قابل پوشش نیستند در service و در صورت مناسب با trigger پیاده می‌شوند: جلوگیری از cycle دسته، تطابق نوع document با جدول، تطابق Variant گالری با محصول، سازگاری type/option مقادیر Attribute، عضویت primary category در product_categories، مقدار مجاز خرید، کلید route منحصربه‌فرد بین Landing و Category و جلوگیری از redirect loop. Revisions و Ledger برای نقش برنامه append-only هستند؛ UPDATE/DELETE آن‌ها مجاز نیست.

| Schema همراه | فیلدها و مسئولیت |
|---|---|
| `customer_addresses` | مالک، نام، تلفن، province/city/postal، آدرس، default؛ دسترسی محدود |
| `customer_auth_sessions` | مستقل از staff؛ token hash، expiry، revoke؛ OTP challenge جداگانه |
| `wishlists`, `wishlist_items` | مالک و محصول؛ unique(owner,product) |
| `questions`, `question_answers` | محصول، نویسنده، وضعیت moderation، پاسخ و تاریخ |
| `coupons`, `coupon_scopes`, `coupon_redemptions` | percent/fixed/free-shipping، زمان، حداقل، سقف، کاربرد و idempotency |
| `payments`, `payment_events`, `refunds` | provider، authority، مبلغ، وضعیت، callback signature، idempotency |
| `shipments` | carrier، tracking، وضعیت، زمان؛ اطلاعات پرداخت در آن نیست |
| `imports`, `import_rows` | فایل، schema، preview، خطا برای هر ردیف، apply status |
| `media_folders` | parent و ترتیب؛ جابه‌جایی folder کلید فایل را تغییر نمی‌دهد |
| `site_settings` | key، schema_version، value JSON، visibility؛ secrets در vault نه JSON عمومی |
| `homepage_sections` | document، type، props JSON، order، visibility، schedule |
| `navigation_menus`, `navigation_items` | parent، kind، target ID/path، media، column؛ محدودیت عمق |
| `tags`, `article_tags`, `article_related_products` | روابط واقعی برای content hub |
| `notifications` | مخاطب یا role، type، read_at، target؛ فاقد اطلاعات حساس در پیام عمومی |
| `login_events`, `mfa_recovery_codes` | رویداد ورود، hash recovery code، consumed_at؛ هرگز secret در log |
| `scheduled_publications` | target revision، due time، lease، retry، published idempotently |
| `search_events`, `analytics_daily` | query نرمال‌شده، شمارنده، zero result؛ retention و حذف PII |
| `not_found_events` | path normalized، referrer host، count، last_seen؛ query حساس حذف می‌شود |
| `backups` | location رمزگذاری‌شده، checksum، وضعیت، زمان، retention؛ دسترسی Super Admin |

برای چند انبار، `inventory_balances` به کلید مرکب `(variant_id, warehouse_id)` گسترش می‌یابد. این مسئله باید قبل از اولین migration تولید تصمیم‌گیری شود؛ مرحله اول یک انبار دارد.

## ۶. Roles و Permissions

Authorization بر اساس capability انجام می‌شود، نه مقایسه عنوان role در UI. نمونه permissionها: `products.read`، `products.write`، `products.publish`، `prices.write`، `inventory.adjust`، `articles.write`، `articles.publish`، `seo.write`، `redirects.write`، `orders.transition`، `orders.refund`، `customers.pii.read`، `customers.export`، `media.upload`، `reviews.moderate`، `settings.public.write`، `settings.security.write`، `roles.assign`، `backup.restore`.

| Role | محصول/قیمت | موجودی | مقاله/صفحه | Visual builders | SEO/Redirect | سفارش | PII مشتری | Moderation | Users/Security |
|---|---|---|---|---|---|---|---|---|---|
| Super Admin | کامل | کامل | کامل | کامل | کامل | کامل | کامل | کامل | کامل |
| Admin | کامل | کامل | کامل | کامل | کامل | تغییر + refund | مجاز | کامل | مشاهده session خودش؛ بدون تنظیمات حساس |
| Content Manager | مشاهده | مشاهده summary | ویرایش + انتشار | ویرایش + انتشار | metadata محتوای خودش | ندارد | ندارد | ندارد | ندارد |
| SEO Manager | مشاهده | ندارد | مشاهده، ویرایش Landing | Landing | کامل | ندارد | ندارد | ندارد | ندارد |
| Product Manager | ویرایش + انتشار + قیمت | ثبت/اصلاح | مشاهده | انتخاب محصولات بخش‌ها | metadata محصول/دسته | ندارد | ندارد | مشاهده مرتبط | ندارد |
| Order Manager | مشاهده | مشاهده + عملیات سفارش | ندارد | ندارد | ندارد | تغییر مجاز، بدون refund مالی | برای fulfillment | ندارد | ندارد |
| Support | مشاهده | مشاهده availability | مشاهده | ندارد | ندارد | مشاهده محدود، افزودن note | محدود به پرونده پشتیبانی | پاسخ + moderation | ندارد |
| Editor | مشاهده | ندارد | draft و autosave؛ بدون publish | draft محتوای خودش | metadata draft | ندارد | ندارد | ندارد | ندارد |

Media permission به نقش‌های محصول، محتوا، SEO و Editor در scope مربوط اعطا می‌شود. ارسال تبلیغات، export اطلاعات مشتری، restore backup، تغییر پرداخت، ایجاد Super Admin و تعریف permission جدید به‌صورت پیش‌فرض فقط Super Admin است. سفارش پرداخت‌شده حذف نمی‌شود؛ cancel/refund و anonymization فرایند جدا دارند. Role دلخواه از permissionهای موجود ساخته می‌شود و امکان self-escalation ندارد. UI دکمه را مخفی می‌کند و API همان permission را مستقل بررسی می‌کند.

## ۷. API و مرز امنیت

| گروه | نمونه endpoint | نکته |
|---|---|---|
| Public content | `GET /v1/store/pages/:path` | فقط published projection |
| Catalog | `GET /v1/store/products?category=...` | query allowlist، محدودیت limit، فیلتر indexed |
| Product | `GET /v1/store/products/:slug` | variants، مشخصات، related و metadata |
| Search | `GET /v1/store/search?q=...` | normalizer فارسی، rate limit، zero-result logging |
| Cart quote | `POST /v1/store/cart/quote` | قیمت سرور، cm صحیح، تخفیف معتبر |
| Checkout | `POST /v1/store/checkouts` | idempotency، رزرو، آدرس معتبر |
| Payment callback | `POST /v1/payments/:provider/webhook` | امضا، lookup، مبلغ و idempotency |
| Admin auth | `POST /v1/admin/auth/login` | CSRF/Origin، throttling، MFA challenge |
| Admin content | `PATCH /v1/admin/products/:id/draft` | permission، ETag، schema validation |
| Publishing | `POST /v1/admin/documents/:id/publish` | validate، projection، audit، outbox |
| Inventory | `POST /v1/admin/inventory/adjustments` | reason اجباری، تراکنش، audit |
| Media | `POST /v1/admin/media/uploads` | signed upload محدود، finalize و worker |
| Import | `POST /v1/admin/imports/:id/apply` | preview معتبر، موفقیت/خطا per row |
| Global search | `GET /v1/admin/search?q=...` | نتایج فقط در scope permission کاربر |

API از schema مشترک (مثلاً Zod و OpenAPI تولیدشده) برای input/output استفاده می‌کند. پاسخ error دارای `code`، `message` فارسی، `fieldErrors` و `requestId` است. limit به‌صورت server-enforced حداکثر دارد. Admin tables با pagination و filtering سرور هستند؛ export و bulk operations بزرگ job مستقل‌اند.

مرورگر ترجیحاً API را روی same-origin `/api` هر برنامه فراخوانی می‌کند. Nginx/BFF آن را به API مشترک می‌رساند؛ cookie هر میزبان host-only است. اگر API عمومی روی `api.example.com` ارائه شود، CORS فقط originهای مشخص را می‌پذیرد و `*` با credentials به کار نمی‌رود. Backend همه درخواست‌های مدیریتی را independently authorize می‌کند.

## ۸. Security model

- HTTPS اجباری، HSTS پس از تأیید کامل زیر‌دامنه‌ها، cookies با `Secure; HttpOnly; SameSite=Lax` و ترجیحاً پیشوند `__Host-`؛ Session Admin و Customer جدا هستند.
- Password hashing با Argon2id و پارامتر متناسب با ظرفیت، MFA با TOTP/WebAuthn، recovery code یک‌بارمصرف hashed؛ secret MFA در vault/key-managed encryption.
- Session identifier تصادفی طولانی فقط hash در DB، rotate پس از ورود و ارتقای دسترسی، timeout idle/absolute، فهرست دستگاه‌ها و revoke مستقل.
- CSRF با token متصل به session و بررسی Origin، mutation فقط POST/PATCH/DELETE؛ SameSite به‌تنهایی کافی نیست.
- Brute-force/rate limit بر account و IP prefix، lockout کوتاه و افزایش تدریجی تأخیر؛ خطای ورود اطلاعات وجود حساب را لو نمی‌دهد.
- XSS با rich-text schema محدود، sanitizer، URL protocol allowlist، CSP بدون unsafe-eval؛ iframe فقط provider allowlist.
- SQL فقط با query parameterized/ORM؛ نام sort/filter از allowlist، نه تزریق مستقیم رشته.
- API از role جاری session و capability دفاع می‌کند؛ تغییر role، sessionهای مربوط را invalid یا permission cache را فوری پاک می‌کند.
- Audit log در تراکنش عملیات مهم ثبت می‌شود؛ رمز، token، شماره کامل کارت و secret در before/after قرار نمی‌گیرد.
- `/admin` و دامنه Admin هم HTML meta و هم `X-Robots-Tag: noindex, nofollow` دارند. robots به‌تنهایی محافظ امنیتی نیست؛ هر read مدیریتی auth دارد.
- Backup رمزگذاری‌شده، least-privilege DB users، rotation secrets، dependency scanning و log access جزو deployment عملیاتی هستند.

## ۹. SEO architecture

Metadata در server render از Published content ساخته می‌شود. هر Page Type قواعد ثابت دارد و CMS تنها فیلدهای مجاز را تغییر می‌دهد. Primary content، H1، breadcrumb، navigation، محصول/مقاله و canonical در HTML اولیه حاضرند.

**URL و canonical:** محصول canonical کوتاه `/product/:slug/` است؛ تغییر دسته محصول URL محصول را عوض نمی‌کند. دسته‌ها hierarchy واقعی `/fabric/:parent/:child/` دارند. تغییر slug/parent در تراکنش routeها و پیشنهاد redirect فرزندان را مدیریت می‌کند. Redirect loop، redirect chain غیرضروری و canonical خارج از دامنه بدون مجوز رد می‌شوند. Slug فارسی یا لاتین باید یک سیاست واحد داشته باشد؛ کوتاهی و پایداری از transliteration خودکار هر بار مهم‌تر است.

**Faceted navigation:** UI فیلترها form/control است و برای هر ترکیب anchor قابل crawl تولید نمی‌کند. URLهای query برای تعامل کاربر قابل share هستند ولی `noindex,follow` دارند و وارد sitemap نمی‌شوند. Canonical فقط برای duplicate واقعی، مثل tracking parameters و نمایش هم‌ارز، به URL پاک می‌رود. برای subset دارای فیلتر، canonical قراردادن به دسته مادر به معنی equivalent content نیست؛ noindex سیاست اصلی است و canonical در صورت نیاز به URL normalizeشده همان ترکیب اشاره می‌کند. Landingهای انتخابی با intent، محتوای مستقل، route ثابت، internal link و محصولات مرتبط index می‌شوند. Robots disallow قبل از دیده‌شدن noindex استفاده نمی‌شود، چون خزنده noindex را نخواهد خواند.

**Pagination:** `/fabric/shanel/page/2/` خروجی server، self-canonical، title مشخص و link واقعی قبلی/بعدی دارد. صفحه ۲ canonical به صفحه ۱ نمی‌شود. Load more می‌تواند همان URLهای crawlable را به‌تدریج نمایش دهد. مسیر page خارج از تعداد موجود 404 است؛ صفر محصول واقعی برای دسته معتبر الزاماً 404 نیست و محتوای راهنما/جایگزین دارد.

**Variants:** رنگ‌های یک محصول به‌صورت `?variant=:id` قابل انتخاب‌اند و canonical به parent دارند؛ HTML پایه Variant پیش‌فرض معتبر را نشان می‌دهد. فقط اگر variant دارای intent و محتوای مستقل واقعی باشد، route indexable مستقل با ProductGroup و links بین نسخه‌ها ایجاد می‌شود. Variant ناموجود حذف نمی‌شود و وضعیت صحیح دارد. محصول حذف‌شده، در صورت جانشین مناسب 301 و در غیر این صورت 410/404 خواهد داشت.

**Structured data:** Organization/WebSite در سطح سایت؛ BreadcrumbList در صفحات عمیق؛ Product/Offer و در صورت مناسب ProductGroup در محصول؛ Article با author و زمان واقعی در مقاله. Price schema با `IRR` و مبلغ ریال هماهنگ است. AggregateRating/Review فقط از نظرات واقعی approved ساخته می‌شود؛ داده دمو وارد claim تولیدی نمی‌شود. FAQPage تنها با FAQ visible و شرایط معتبر ایجاد می‌شود؛ نمایش rich result برای فروشگاه تضمین‌شدنی نیست. فیلد schema دلخواه CMS اجازه تزریق JSON-LD بدون validation ندارد.

**Sitemap:** `/sitemap.xml` index به sitemaps categories/products/articles/pages/collections و در صورت نیاز images اشاره دارد. فقط canonical، published و indexable وارد می‌شوند؛ هر فایل کمتر از ۵۰٬۰۰۰ URL و ۵۰ MB uncompressed است. `lastmod` از تغییر واقعی محتوای published می‌آید، نه از هر deploy. Query، Admin، حساب، سبد، Checkout و جستجو خارج‌اند.

**SEO Center:** title/description length به‌صورت warning است، نه قانون سخت مشابه تعداد کاراکتر ثابت Google. نبود H1، تصاویر محتوایی بدون alt، canonical ناسازگار، route نامعتبر، orphan و نبود internal link هشدار واقعی‌اند. تصاویر تزئینی alt خالی درست دارند و نباید warning کاذب بگیرند. Link graph از navigation، breadcrumbs، related و blocks ساخته می‌شود؛ پیشنهاد لینک contextual است، auto-link افراطی انجام نمی‌شود.

## ۱۰. Admin information architecture و Product Editor

Navigation اصلی:

1. نمای کلی — فروش، وضعیت سفارش، موجودی، نظرات، مقاله، هشدار، Quick Actions.
2. فروشگاه — محصولات، دسته‌ها، Attributes، رنگ‌ها، برندها، مجموعه‌ها، موجودی.
3. سفارش‌ها — فهرست، جزئیات، Timeline، ارسال، پرداخت/برگشت مجاز.
4. مشتریان — سابقه، آدرس، note، Wishlist؛ PII طبق permission.
5. محتوا — مجله، دسته‌های مجله، نویسندگان، صفحه‌ها، Landingها، رسانه.
6. طراحی محتوا — Home builder، Mega menu، Footer، announcement، site-wide blocks.
7. بازاریابی — تخفیف‌ها، Reviews، Q&A، Search insights، Analytics.
8. SEO — Metadata، audit warnings، internal linking، Redirect، 404، sitemap status.
9. عملیات — Import/Export، Jobs، Notification، Backup، Audit.
10. تنظیمات — عمومی، فروشگاه، Currency، Shipping، Tax، Payment، Email/SMS، Social، Security، Users، Roles، Integrations.

Search global با CMD/CTRL+K محصول، SKU، سفارش، مشتری، مقاله و دسته را جستجو می‌کند. فهرست نتایج به permission محدود است و client cache نتیجه حساس نقش دیگر را نگه نمی‌دارد.

Product Editor با Tabs: عمومی، رسانه، قیمت، موجودی، Variant، مشخصات، محتوا، SEO، مرتبط، انتشار. Summary ثابت شامل نام، وضعیت ذخیره، Preview و Publish است. Required fields کوچک و واضح‌اند. تنظیمات حرفه‌ای در disclosure/sections قابل بازشدن‌اند. عملیات Bulk قیمت/موجودی Preview «قبل/بعد» دارند و حذف/Archive با تعداد آیتم و تأیید روشن انجام می‌شود. جابه‌جایی drag-and-drop همیشه جایگزین keyboard «بالا/پایین/انتخاب والد» دارد.

موبایل برای بررسی/تغییر وضعیت سفارش، موجودی، publish و پاسخ Review طراحی مستقل دارد؛ tables به cards خلاصه و bottom sheet actions تبدیل می‌شوند. عملیات پیچیده مانند import بزرگ یا ساخت MegaMenu تجربه Desktop اصلی است، اما مسیرها روی موبایل شکسته نیستند.

## ۱۱. Media و Performance

Upload از API مجوز کوتاه‌مدت و اندازه محدود می‌گیرد. سرور magic bytes، MIME، ابعاد و تعداد pixels را بررسی می‌کند؛ تنها extension قابل اعتماد نیست. Original به‌صورت private نگهداری می‌شود. نام نمایشی فایل از storage key UUID جداست. پردازش async با libvips/Sharp شامل strip EXIF، correction orientation، thumbnail، WebP/AVIF و focal crop می‌شود. SVG نامطمئن به‌صورت executable پذیرفته نمی‌شود. Media تا وضعیت `ready` عمومی/قابل انتشار نیست.

تصاویر ۳۲۰، ۴۸۰، ۷۶۸، ۱۰۲۴، ۱۶۰۰ و برای تصاویر با کیفیت کافی ۲۴۰۰ پیکسل با srcset/sizes عرضه می‌شوند. Hero/LCP `loading=eager` و `fetchpriority=high` دارد؛ برای همه تصاویر priority بالا تعیین نمی‌شود. تصویر کارت aspect ratio و width/height مشخص دارد. تصاویر زیر fold lazy هستند. Video poster دارد و preload محدود است.

فونت فارسی WOFF2 self-host، حداکثر وزن‌های لازم، font-display مناسب و fallback با metric نزدیک دارد. Storefront JS به islandهای لازم محدود می‌شود؛ filter، gallery، variant و cart جدا load می‌شوند. انیمیشن‌ها opacity/transform و reduced-motion دارند. Admin block editor و media manager lazy chunk هستند.

Caching: فایل‌های hashدار و derivativeها immutable؛ HTML عمومی با TTL محدود و invalidation event/tag؛ Admin، حساب، cart/checkout و پاسخ‌های PII `Cache-Control: private, no-store`. invalidation پس از انتشار/تغییر قیمت از outbox انجام می‌شود. قیمت/موجودی SSR یک snapshot است؛ quote Checkout همیشه authoritative و server-side است.

Core Web Vitals هدف‌اند، نه نتیجه اثبات‌شده. LCP < 2.5s، INP < 200ms و CLS < 0.1 باید با تست واقعی موبایل، شبکه مناسب و سپس داده field سنجیده شوند. Lighthouse یک proxy آزمایشگاهی است؛ امتیاز آن تضمین تجربه کاربران یا رتبه SEO نیست.

## ۱۲. Scale، Search و عملیات

فهرست public برای Crawl صفحه‌بندی شماره‌دار با ۲۴/۳۶ محصول و شمارنده cached دارد؛ Admin برای فهرست بزرگ cursor pagination یا pagination server-side با index مناسب دارد. چندصد هزار سفارش با `status + created_at`، `customer + created_at` و order number/SKU index سرویس‌دهی می‌شود؛ API اجازه دانلود نامحدود همه records در درخواست تعاملی نمی‌دهد.

جستجوی فارسی قبل از index کردن، ی/ک عربی، کشیده و اعراب را normalize می‌کند و نیم‌فاصله را با سیاست ثابت مدیریت می‌کند. PostgreSQL normalized text/trigram برای مرحله ابتدایی مناسب است؛ موتور مستقل Typesense/OpenSearch/Meilisearch بعداً پشت Search adapter می‌آید. «حمایت از فارسی» باید با عبارت‌های واقعی، رنگ‌ها و SKU آزموده شود؛ استفاده از full-text ساده به‌تنهایی stemming فارسی حرفه‌ای نیست.

Import در مرحله validate/preview مستقل است و برای هر row خطا یا نتیجه ثبت می‌شود؛ apply با idempotency و transactionهای کوچک است. چند ردیف خراب همه import را نابود نمی‌کنند. Export CSV از formula injection با escape صحیح مقادیر محافظت می‌کند. XLSX پشتیبانی parser واقعی و محدودیت فایل/ردیف می‌خواهد؛ صرف داشتن دکمه Excel به معنای پشتیبانی واقعی نیست.

Backup تولید شامل Database به‌علاوه WAL/PITR در صورت نیاز، Media originals، config، رمزگذاری، retention، ذخیره در مقصد مستقل و آزمون Restore دوره‌ای است. `RPO/RTO` بر اساس نیاز کسب‌وکار تعیین می‌شود؛ برای شروع پیشنهاد RPO حداکثر ۲۴ ساعت با backup روزانه و قابلیت ارتقا به PITR است. موفقیت job backup بدون آزمون restore اثبات recovery نیست.

Analytics بدون third-party script سنگین، با event کم‌حجم و aggregation سمت سرور اجرا می‌شود. query جستجو ممکن است حاوی تلفن یا اطلاعات شخصی باشد؛ قبل از ذخیره scrub و مدت نگهداری محدود دارد. Dashboard بدون اتصال analytics داده نمونه را صریح نشان می‌دهد.

## ۱۳. مرز تحویل مرحله اول و تولید

| حوزه | مرحله اول قابل تحویل | برای production لازم |
|---|---|---|
| فروشگاه | همه Page Typeها با محتوای کامل نمونه، navigation، filter/sort، variant، مقدار، cart نمونه و SSR Worker/Node | تطبیق API/DB تولید، cache invalidation، scale و مانیتورینگ |
| CMS | UI اصلی، محصول/مقاله/SEO/builders نمونه، ذخیره تغییرات از طریق API و دسترسی مالک احراز هویت‌شده پلتفرم | احراز هویت staff مستقل، RBAC تفصیلی سرور، conflict handling و revision کامل |
| موجودی | محاسبه دقیق cm و demo ledger | تراکنش، reservation worker، idempotency، concurrency tests |
| سفارش/پرداخت | checkout دارای validation و سفارش نمونه؛ وضعیت دمو روشن | درگاه واقعی، signature/webhook، پرداخت و refund idempotent |
| رسانه | media picker و preview/crop controls نمونه | upload امن، queue، AVIF/WebP واقعی، origin private |
| Preview/Publish | draft/preview UI با renderer مشترک | signed preview token محدود، publish transaction و scheduler |
| Import/Export | CSV قابل اعتبارسنجی و گزارش row در صورت پیاده‌سازی | پردازش فایل امن، jobs، XLSX parser واقعی |
| امنیت | حفاظت مالک پلتفرم برای CMS، مرز API و قرارداد امنیت | sessions مستقل، CSRF، MFA، rate limit، roles سفارشی و review تولید |
| SEO | metadata، schema، robots/sitemap و HTML اولیه SSR مسیرهای اصلی | ممیزی HTTP statusها، canonicalها، output sitemap و تست crawler روی deployment |
| Backup/Analytics | setting و نمونه وضعیت؛ بدون ادعای اتصال | سرویس پیکربندی‌شده، retention، restore test و field metrics |

داده demo باید در بخش مدیریت با برچسب روشن نمایش داده شود. احراز هویت مالک پلتفرم در پیش‌نمایش، جای مدل مستقل حساب‌های staff، RBAC چندکاربره و session management تولید را نمی‌گیرد. Login نمونه یا role selector برای مرور قابلیت‌های پنل، حفاظت واقعی Admin نیست. رمز نمونه hardcoded نباید به‌عنوان امنیت production معرفی یا deploy عمومی روی داده واقعی شود. وضعیت‌های Import/Backup/Payment/2FA تنها اگر عملیات واقعی انجام شده تغییر به «فعال/موفق» می‌کنند.

## ۱۴. ترتیب اجرایی پیشنهادی

۱) گزارش شواهد مرجع → ۲) Sitemap، schema، قرارداد API و tokens → ۳) seed مستقل و repositories → ۴) قالب Home/Category/Product/Magazine/Article → ۵) cart/checkout/account و صفحات اطلاعاتی → ۶) Admin shell/Dashboard/product editor/content editor/SEO/builders → ۷) تکمیل صفحه‌های مدیریتی عملیاتی → ۸) کنترل canonical/facets، a11y، responsive و performance → ۹) گزارش فاصله دمو تا production و برنامه اتصال backend.

آزمون‌های مهم: تبدیل دقیق مقدار فارسی به cm، قواعد Step، rounding ریال، منع over-selling هم‌زمان، idempotency پرداخت/رزرو، permissionهای هر API، publish/draft isolation، جلوگیری از redirect loop، منع raw HTML در blocks، canonical/pagination درست، server HTML صفحه‌های SEO، recovery autosave و keyboard navigation. آزمون‌های UI کم‌ارزش که صرفاً متن پیاده‌سازی را تکرار می‌کنند ضروری نیستند.
