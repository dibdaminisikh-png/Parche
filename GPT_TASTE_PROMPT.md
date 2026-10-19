# GPT Taste — Parche premium Persian fabric storefront redesign

> Implementation brief for a future coding task. This review task changed no application code. Read the evidence and constraints before implementing. The design direction below is a recommendation, not a claim that the redesign has already shipped.

## Your assignment

Act as an experienced Persian e-commerce product designer and frontend engineer. Redesign **تار و پود / Parche**, an existing Persian RTL fabric shop, into an authored textile atelier and fabric library: tactile, editorial, contemporary, and exceptionally clear to buy from. Deliver a working redesign in the existing React/TypeScript application, not a static mockup or a new disconnected landing page.

Public reference: <https://dibdaminisikh-png.github.io/Parche/>. The review environment could not reach that deployment: the network proxy returned HTTP 403 and Chromium reported `net::ERR_TUNNEL_CONNECTION_FAILED`. Review findings concern the locally rendered Pages build of this checkout, including the user's pending W Yekan font change. Do not assume the public deployment has identical assets, content, or behavior. Inspect the deployment afresh if it becomes accessible and record differences.

Use the installed project-local Impeccable skill at `.agents/skills/impeccable/SKILL.md` and its documented workflow. Do not install or modify global/user skills, Codex settings, other projects, or external services. Work only in this repository. Read the archived critique linked in the review evidence below. If you use Impeccable's design/setup workflow, capture product truth from existing documentation and code before choosing visual direction. Keep genuine unknown business facts explicit; do not invent them.

### Non-negotiable scope and preservation

1. Preserve existing functionality, routes, data, CMS-driven content, business rules, and both runtime modes. Improve presentation and interaction without replacing working capabilities with decorative placeholders.
2. Keep Persian as the primary language and `lang="fa" dir="rtl"` on the document. Preserve the brand name تار و پود. Do not translate the interface into English or replace its identity with a fabricated brand.
3. **Keep the user-supplied W Yekan fonts.** `public/fonts/w-yekan-regular.ttf` is the regular face; `public/fonts/w-yekan-bold.ttf` is the bold face. Existing CSS names the family `WYekan`. Keep body text regular and headings/emphasis bold; map intermediate requested weights deliberately to these two actual files. Do not download Inter, a Latin display font, or a replacement Persian font. Avoid synthetic heavy text. Keep font preloads, MIME types, and base-prefixed URLs correct.
4. Preserve uncommitted user changes, including the pending font integration. Inspect Git state before touching files. Do not reset or overwrite other work. The review itself did not authorize implementing this brief; execute it only in the subsequent implementation task.
5. Keep React 19, TypeScript, Vite, the current server/API/repository structure, and existing CMS. No framework migration, parallel app, dependency replacement, database schema change, lockfile rewrite, or production integration merely for styling.
6. Preserve authentication/authorization boundaries, validation, CSRF checks, content permissions, media behavior, optimistic versions, draft/public separation, revisions, redirects, and SEO behavior. Never remove safeguards to make a UI demonstration work.
7. Preserve honest demo disclosures. GitHub Pages is a browser-local test, not a working payment gateway, shared CMS, authenticated service, or production inventory system. Do not fabricate transactions, ratings, stock scarcity, sales counts, testimonials, guarantees, delivery promises, certifications, fabric provenance, or support channels.

## Repository and behavior map

Read these before designing or coding:

| Area | Existing files | Preserve |
|---|---|---|
| Storefront templates | `src/storefront/Storefront.tsx` | Home, catalog/category/landing/search, PDP, cart/checkout, saved items/comparison, account/login, journal/articles, collections/brands, content pages, not-found states |
| Shared elements | `src/components/shared.tsx` | Product cards, grids, responsive fabric images, navigation primitives, breadcrumbs, forms, FAQ, modal, block rendering, icon semantics |
| Visual system | `src/styles.css` | All storefront and CMS responsive behavior; coordinate shared tokens without breaking the CMS |
| Routing/base URLs | `src/lib/runtime.ts`, `src/pages/routes.ts`, `src/pages/PagesApp.tsx` | Root server paths, `/Parche/` static base, `/cms/` alias for admin, query navigation, back/forward, links to hashes and assets |
| Data and units | `src/lib/models.ts`, `src/data/seed.ts`, `src/data/config.ts` | Entity/variant IDs, SKU, content-driven sections/navigation, fabric attributes, prices, category hierarchy, reference relationships |
| Static demo | `src/pages/demo-store.ts`, `src/pages/DemoNotice.tsx` | Browser-local state, cart/preferences/orders, draft/public snapshots, local media in IndexedDB, export/reset and honest test notices |
| CMS | `src/admin/Admin.tsx` | Every existing module and editor, uploads, preview/publish, builder sections/navigation, lists/import/export, orders, settings and permissions |
| Server | `server/api.ts`, `server/repository.ts`, `server/validation.ts`, `server/worker.ts`, `server/node.ts` | Existing API contracts and authoritative calculations/validation; local SQLite migrations and media; Worker adapter |
| Rendering/SEO/build | `server/render.tsx`, `server/seo.ts`, `vite.config.ts`, `scripts/package-build.mjs`, `scripts/build-pages.mjs`, `scripts/export-pages.tsx`, `scripts/serve-pages.mjs` | SSR, metadata, structured data, robots/noindex demo behavior, asset/preload paths, all generated pages and both builds |
| Baseline contracts | `README.md`, `docs/implementation-status.md`, `tests/core.test.ts`, `tests/pages.test.ts`, existing QA scripts | Distinguish implemented behavior from documented future production work; retain passing tests and meaningful flows |

### Business rules are part of the design

- Prices shown to shoppers are integer **تومان** amounts. The domain stores quantities and inventory in integer **centimeters**; the UI may show meters. Convert at the boundaries without float drift or silently changing the amount selected.
- Quantity must honor each product's `minCm`, `stepCm`, and selected variant's available `inventoryCm - reservedCm`. Do not hardcode one universal minimum, step, or inventory.
- Changing a variant updates its name, image, SKU, stock and price. Show the selected color by name and a non-color indicator. A color dot alone is not a reliable fabric description.
- Unit price means تومان / متر. Line total is variant unit price × selected centimeters / 100; preserve authoritative rounding/calculation behavior. Show unit price, chosen length, line total, shipping, actual applied discount, and final total distinctly.
- Preserve existing coupon rules and the distinction between entered and successfully applied coupons. Do not invent discounts or change shipping thresholds/amounts, supported shipping methods, or calculations in pursuit of a cleaner summary. Derive displays from the existing model/response.
- In commercial structured data, preserve existing تومان-to-IRR multiplication by 10 and existing demo exclusions. Do not publish fake AggregateRating or production Offer data for a demo.
- Preserve empty cart, invalid amount, inactive/unavailable variant, insufficient stock, expired/invalid coupon, validation error, storage failure, pending/success/error, and browser back/reload states.
- Pages state remains scoped to the current browser; another context does not inherit edits. Server state uses the API/repository. Do not merge these transports or accidentally make Pages call nonexistent backend endpoints.

## Recommended visual direction: «دفتر بافت» — the textile atelier ledger

Make the product feel like a beautifully edited collection of actual fabrics, with the precision of a swatch book and the warmth of an atelier. The memorable device is a **fabric specimen caption**: readable material, width, color and price arranged with a restrained typographic rule. Use that grammar consistently on cards, the PDP, comparisons, and purchase summaries. Build character from textile imagery, composition and Persian typesetting, not UI ornament.

The working audience assumption is Persian-speaking shoppers buying fabric by length, including people seeking sewing guidance and experienced buyers comparing material/specifications. Confirm this against actual product context; do not invent research, demographic certainty, or claims of physical stores or bespoke services.

Surface modes:

- Home and collections: **Persuade**. Express a clear material point of view and lead quickly to browsing.
- Catalog, search, PDP, cart, checkout, account and CMS: **Operate**. Make price, variants, quantities and next actions obvious.
- Journal, care, fabric guide and policy pages: **Read**. Use comfortable Persian measures and contextual routes back to fabric selection.

### Color and material

Use a narrow palette with explicit jobs. Suggested starting tokens, subject to measured contrast and actual fabric photography:

| Role | Starting value | Application |
|---|---|---|
| Canvas | `#F6F3EB` | Warm undyed-paper background, not a pink wash over every surface |
| Raised surface | `#FFFEFA` | Input, purchase summary, dialog and genuinely grouped tasks |
| Main ink | `#2D2925` | Body, headings, product names, prices |
| Secondary ink | `#62594F` | Readable material notes and secondary metadata |
| Brand dye | `#74384A` | Selected actions, current navigation, restrained brand signature |
| Dividers | `#D8CFC0` | Fine editorial rules; do not rely on this alone for form boundaries |
| Functional control edge | `#8A7A6B` | Input/interactive boundaries if contrast checks pass |
| Supporting olive | `#4D5D46` | Restrained supporting notation when justified; separate semantic success/error tokens |

Treat these as starting values, not proof of WCAG compliance. Test every actual foreground/background state, including transparent image overlays, disabled controls, focus rings and selected color chips. Keep any current rose/burgundy recognition through the brand dye rather than tinting every section. Fabric photographs supply most of the color. Do not stack multiple accent palettes or use gold as a shorthand for luxury.

No background mesh, purple gradients, glassmorphism, floating decorative blobs, fabricated paper/grain overlays, black-and-gold luxury clichés, excessive drop shadows, ornamental corner flourishes or ubiquitous rounded containers. Textile texture belongs in honest imagery. Functional cards and dialogs remain appropriate where they group a task.

### Typography

- Use W Yekan throughout Persian interface text, including controls, totals, labels, cards and editorial text. Preserve intentional LTR handling for SKU, email, URL and order identifiers.
- Base body text starts around 16px with a Persian-appropriate line-height of 1.8–1.95. Controls and essential product metadata must remain comfortably readable; avoid shrinking to fit a template.
- Use regular 400 for paragraphs and secondary information; the real bold face for 600–900 requests where emphasis is needed. A restrained 400/700 hierarchy is preferable to pretending there are many independent font weights.
- Suggested desktop/mobile type targets: H1 40–52 / 28–36px; H2 28–34 / 24–28px; product name 17–20 / 16–18px; primary price 24–30 / 22–28px; form labels 15–16px. Adjust after looking at real Yekan metrics and long Persian strings, not by mechanically applying Latin ratios.
- Keep reading text near 55–70 comfortable characters per line and ensure Persian letters/diacritics are not clipped. Use real content for checks. Avoid all-caps English eyebrows repeated above every Persian heading, decorative Latin letter spacing on Persian text, and breaking a Persian sentence into slogan fragments just to fill a layout.
- Use bidi isolation for mixed strings and semantic direction where appropriate; do not force all numbers to RTL or LTR. Display currency and meter notation consistently with existing `fa-IR` formatters. Preserve Persian ی/ک and localized display without breaking numeric input/validation.

### Layout, rhythm and imagery

- Build with logical properties (`padding-inline`, `margin-inline`, `inset-inline`, etc.). RTL is a structural requirement, not a `text-align:right` patch.
- Start with a maximum content width around 1280–1360px, responsive 16–20px mobile gutters, and a small spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96). Apply optical adjustments after inspecting real content.
- Establish a clear hierarchy: specimen images and product titles dominate browsing; the amount and buy action dominate purchasing; prose leads guides. Use asymmetry selectively on editorial surfaces; keep shopping controls predictably arranged.
- Use existing responsive AVIF/WebP assets, dimensions, srcset and focal points. Preserve accurate image alt text. Do not substitute unrelated stock lifestyle images or synthetic claims that sample images show a particular real supplier's goods.
- Favor close fabric texture, a drape/scale view when an actual asset supports it, and consistent neutral lighting/crops. Where needed photography does not exist, state the gap rather than assigning misleading labels to duplicate images. Do not represent a generic repeated image as an accurate swatch of every color.
- Product images should have a deliberate, consistent ratio; 4:5 is a starting hypothesis, not a compulsory crop that discards useful texture. Test original assets. Keep gallery zoom and image notes.
- Use motion only for orientation and feedback: about 120–200ms for small states; no staggered reveal that delays shopping, scroll hijacking, bounce, parallax, or auto-playing carousels. Honor `prefers-reduced-motion`.

## Screen-by-screen implementation instructions

### 1. Global shell and navigation

Keep a compact brand/search/utility hierarchy. Shopping must be immediately discoverable in Persian. Preserve category mega-menu depth and all links, search queries, account, wishlist, comparison, cart state and CMS entry. Give utilities meaningful accessible names and visible text where icons alone are ambiguous. Avoid letting admin/test utilities visually compete with the customer journey, but retain their discoverability and honest demo scope.

On phones, build a reliable menu/drawer with correct focus placement, escape-to-close, return focus, scroll handling and keyboard semantics. Mirror directional navigation thoughtfully; don't flip brand marks, nondirectional icons, images or Latin strings. Cart feedback must use state that matches the actual cart after changes. Do not redesign a stale badge into a more prominent but still incorrect badge.

### 2. Homepage

Use one strong textile-led opening composition with a clear Persian proposition, one dominant browsing action and one restrained guidance action. The first screen should answer what is sold, why fabric is worth exploring, and where to start. Avoid an oversized generic centered slogan followed by interchangeable equal-card sections.

Follow with a deliberate sequence: curated fabric selection, a materially different discovery block organized by actual material/use data, a useful fabric-learning moment, then other existing CMS sections. Keep all CMS section kinds and visibility/order controls working. Do not silently drop trust, FAQ, banner or testimonial rendering capabilities; when content is not genuine, retain the honest empty/hidden behavior rather than authoring invented endorsements.

Vary image scale and density to create rhythm without making cards jump around unpredictably. Promote real material and sewing questions over vague phrases such as “experience luxury.” Do not hardcode product lists or copy over the section/seed models.

### 3. Category, catalog and search

Put the result context and products close to the top. On desktop, group filters by shopping relevance; show a small useful set first and progressively expose specialist attributes. On phones, use a clearly labeled filter/sort control and an accessible sheet or well-behaved collapsed section. Do not leave a full open filter sidebar consuming multiple screens before products.

Retain all current filters: material, use, season and the other CMS-defined attributes, color, width, maximum price and stock; retain sorting, paging, category/landing scopes and search term. Show active choices as removable labeled chips plus a clear-all action scoped to the current category/search, and accurately preserve the remaining query parameters. Returning from a PDP must retain the shopper's context. Preserve supported direct query URLs and back/forward behavior.

Show result count and an unambiguous sort label. Keep zero results useful with specific reset options and existing fabric guidance. Preserve category descriptions, useful SEO blocks and FAQs lower on the page; avoid long duplicated copy above the grid. Use a readable 2-column mobile grid only where price/name/actions fit at 320px; otherwise adopt a more legible card layout rather than clipping content.

### 4. Product cards

Use image + fabric specimen caption as the distinctive system. Make the hierarchy: name, material/width or relevant actual specification, price per meter, then secondary controls. Retain badges only when data supports them. Do not add fake “bestseller,” countdowns, ratings or promotions.

Keep wishlist and comparison functional and discoverable without hover. Color markers must reflect actual active variants; derive counts from data, never render a constant `+۲`. Either make a swatch a genuine accessible choice/navigation control or leave it clearly informational; don't style inert dots as controls. Keep color names available and distinguish current/saved state programmatically. If variant prices differ, do not promise one universal price; use the real data/established pricing contract.

Do not quick-add an arbitrary color and length from a generic card. If quick purchase is introduced, it must ask for valid variant and amount and preserve the same validation and cart path; otherwise keep the PDP as the purchase decision surface.

### 5. Product detail

Let shoppers inspect cloth and buy a precise length without hunting. Desktop: coordinated gallery and purchase panel. Mobile: keep image inspection substantial but compact enough that title, unit price and the route to purchase appear early. A restrained sticky purchase summary may be used only if it mirrors the same validated state and never hides content or the software keyboard.

Purchase panel: product identity and actual core attributes, unit price, chosen named color, stock for that variant, length field with clear unit/minimum/increment, live calculated total, one dominant add-to-cart action. Keep wish/share secondary, fabric guide and delivery explanation nearby, and selected image/zoom behavior intact.

Make color selection large enough to tap, with name, selected ring/check and `aria-pressed`. Display invalid and out-of-stock states inline next to the relevant field. Validate pasted/typed lengths and unavailable choices without silently changing the request. Disable purchase for invalid amounts or insufficient stock and explain how to recover. Prevent double submission while preserving clear progress and success feedback.

Retain all specifications, descriptions/blocks, care guidance, FAQ, approved reviews/questions, submission form and related products. Organize long details with accessible anchors or disclosures; do not hide crucial composition/width/care data behind a decorative story. Preserve the existing image/demo/color-accuracy disclosure and absence-of-real-reviews honesty. Any sticky bar must avoid collisions with demo notice, cookie-like messaging, dialogs and safe areas.

### 6. Cart

Each row shows the actual selected fabric/color, width, length, unit price and line total. Keep quantity controls, removal, product return links and continued shopping. Present shipping, successfully applied discount and final amount in a stable hierarchy. Make updates, pending states and failures observable; preserve state across reloads and browser navigation according to the existing transport.

Coupon disclosure can be visually subordinate, but preserve applying and validating coupons without misleading totals. If adding a remove/revalidate affordance, keep it aligned with the existing response and calculations; do not imply that a capability already exists when it does not. Reject invalid quantity changes with inline explanation. Confirm successful removal unobtrusively and provide safe recovery if supported; do not promise an undo that does not restore state. Empty cart remains useful with a direct browse action and no fabricated recommendations based on personal history.

### 7. Checkout and order confirmation

Create a calm, focused task page while preserving all fields, labels, autocomplete, validation, notes, supported shipping choice, terms acceptance and summary. On mobile, keep total and submit action easy to reach without obscuring fields; make item/price details inspectable. Do not force login, invent OTP or add a payment step that the backend does not support.

Use persistent labels, useful input modes, and concise Persian validation near fields. Preserve entered data when a validation/request error occurs. Keep focus and error announcements coherent. Keyboard navigation must reach every field and the final action. Expose server errors safely with recovery instructions, never a raw stack trace.

Retain explicit **ثبت سفارش آزمایشی** labeling, no-charge disclosure, real returned order number and account/status links. No success page may imply bank payment or actual dispatch. The confirmation should be the emotional resolution: clearly state what happened, what did not happen, and the supported next step.

### 8. Wishlist, comparison, account and login

Keep persistent selections, accurate saved state, meaningful empty states and links back to products. Comparison should make fabric attributes easy to scan and keep horizontal scrolling contained in its table on small screens rather than widening the entire page. Never truncate the name/price so a shopper cannot identify a column.

Keep account order lists/status, address/profile views and existing demo identity explanation. Distinguish these from production authentication. Do not manufacture profile editing, shared accounts, shipment tracking or SMS success where the current implementation does not support them.

### 9. Journal, fabric guides, content and footer

Make guides a functional shopping aid: long-form Persian reading with clear headings, comfortable measure, meaningful illustrations, readable metadata, and contextual links to actual associated fabrics. Preserve article categories, tags, related products/articles, author details, FAQ and anchor navigation. Do not replace every content page with the same centered marketing header.

Keep contact form behavior, terms, shipping, FAQ, about, fabric guide and 404 recovery. Do not invent a real store address, opening hours, supplier story or product certification. Preserve existing data-driven contact/footer links and make help visible at fabric and checkout decision points.

### 10. CMS compatibility

The customer storefront is the expressive surface; the existing Persian CMS remains a precise working tool. Carry over shared font/tokens only after checking readability and table/form density. Preserve `/cms/` and `/admin/` handling, all current modules, preview/draft/publish separation, navigation/section builders, media upload, revisions, SEO and redirects, inventory/order management, import/export and browser-local Pages behavior. Do not re-theme an admin editor into editorial product cards or remove modules to simplify a screenshot.

## Accessibility, RTL and responsive contract

- Test at 320, 360/390, 768, 1024 and 1440px, landscape and 200% zoom. Use content-driven breakpoints. The page must not overflow horizontally; contained comparison tables or deliberate strips can scroll with visible affordances.
- Target comfortable 44×44px hit areas for mobile controls, with adequate separation; the visible icon can be smaller than its hit area. Keep text labels readable, focus visible, and hover nonessential.
- Meet WCAG 2.2 AA contrast and interaction requirements. Use semantic headings, links, buttons, field labels and descriptions. Preserve skip navigation. Do not claim compliance from automated scans alone.
- Use `aria-live` for concise cart/status/error updates when appropriate. Announce selected variants and saved states through semantics. Dialogs/sheets need accessible title, focus management, escape handling, return focus and background interaction control.
- Use actual Persian strings, long names, prices with many digits, mixed SKU/text and empty states in testing. Preserve numerals and unit meaning through wrapping. Don't replace Persian text with Latin lorem ipsum during evaluation.
- Ensure sticky elements account for browser chrome, safe areas, visible keyboard and other fixed notices. No floating action may cover checkout inputs or the document footer.
- Preserve reduced-motion behavior, image dimensions, efficient responsive assets, local fonts and storefront/admin chunk splitting. Avoid loading animation libraries or webfonts for decorative effects.

## Implementation sequence for the future coding task

1. Inspect Git state, current routes/components and actual content. Read the project-local skill and critique. Capture baseline screenshots and core flow behavior before edits. Identify the public-vs-local version gap honestly.
2. Confirm product truth and pin the recommended textile-led direction. Document a small coherent visual system and surface decisions through Impeccable's appropriate project-local workflow; do not let tool defaults replace the user's constraints or fonts.
3. Implement shared typography/color/spacing primitives and responsive shell. Check CMS impact immediately.
4. Implement homepage, listing/search/filter system and product cards. Verify direct URLs and mobile discovery before moving on.
5. Implement PDP and validated variant/quantity/purchase feedback. Then cart and checkout; keep backend contracts stable.
6. Carry the system through saved/comparison/account, editorial/content, help and empty/error states. Verify every existing template remains reachable.
7. Run meaningful existing tests and browser flows, inspect screenshots at real viewport sizes, fix defects, and finish with Impeccable critique/audit/polish as appropriate. A detector pass alone does not establish visual quality or preserved commerce behavior.

## Acceptance checklist and evidence to return

### Existing automated checks

From this repository, run `npm run typecheck`, `npm test`, `npm run build`, and `npm run build:pages`. Preserve their actual exit statuses. The onboarding baseline was 10 existing tests and 127 pre-rendered pages; verify current expectations rather than hardcoding stale counts. Do not remove tests, disable assertions or change business rules just to pass a redesigned UI.

### Representative functional validation

Use synthetic data in fresh browser contexts. Test both server mode and Pages mode where the workflow exists; do not infer one from the other.

| Journey/state | Required evidence |
|---|---|
| Navigation and discovery | Home → category/subcategory → filtered/sorted results → PDP; menu/search keyboard behavior; query/back/forward retention; zero results and reset |
| Variant/amount | Change color and see matching name/image/SKU/price/stock; valid 2.5m example where permitted; below-minimum, wrong-step, pasted invalid and over-stock values; no invalid cart submission |
| Saved selections | Add/remove wishlist and comparison, reload, inspect saved and empty states; contained comparison table on phones |
| Purchase | Add chosen variant/length → cart; increase/decrease/remove → correct totals; invalid and valid coupon; shipping and discount arithmetic unchanged |
| Checkout | Required-field recovery, Persian/Latin digit input as supported, retained data after error, pending/double-submit prevention, honest demo confirmation and matching account order |
| Content/help | Guide → related fabric, article anchors, FAQ keyboard, contact form, policies, not-found recovery |
| CMS regression | Products/list/editor, draft/autosave → authenticated or demo preview → publish with public snapshot unchanged until publish; media, builders/navigation, SEO/redirects and order modules remain functional |
| Static routing | All URLs/assets honor `/Parche/`; direct generated pages, fonts/preloads, CMS links, browser back/reload and the documented fallback for locally created pages work |
| Runtime separation | Pages edits/orders remain browser-local and separate across contexts; server mode continues to use existing API/repository and permission boundaries |

Inspect screenshots, not only element counts: desktop and mobile home, listing with filter closed/open/applied, PDP first fold and purchase state, filled cart, checkout keyboard/error/success, guide/article, saved comparison and representative CMS. Confirm no material console errors, clipped Persian, overlapped controls or whole-page overflow. Measure actual contrast and touch bounds. Report measured facts separately from recommendations or untested claims.

### Final handoff for the implementation task

Return the design rationale in plain language, changed files, screenshots, test/flow results, preserved capability checklist, known limitations and any real asset/content gaps. If committing is requested in that future task, stage only its intended changes. Do not publish, push, deploy or claim production readiness without a separate explicit request and evidence.

## Review evidence and priorities

Read the [archived independent Impeccable critique](.impeccable/critique/2026-10-19T01-17-33Z__src-storefront-storefront-tsx.md) and its prioritized findings alongside this brief. Treat observations as local-checkout evidence with scope stated; use them to guide implementation rather than mechanically decorating every detector warning. The review's final evidence and priority mapping are recorded below.

### Critique verdict and confirmed priorities

Method: two isolated assessments, `/root/design_review` (visual/UX) and `/root/detector_review` (detector/browser). The visual assessment was finalized before detector findings entered synthesis. The design-review score is **26/40**, an expert heuristic assessment, not a user-research or accessibility certification. The public deployment remained unreachable; these are local Pages observations.

The existing identity has real strengths: warm fabric photography, a woven brand mark, burgundy/blush consistency, Persian copy, and unusually concrete fabric-by-length buying mechanics. Do not treat it as a blank generic website. Its sameness comes mainly from conventional split hero → six category tiles → repeated grids → collection banner → article cards, repeated editorial kickers and reusable filler guidance. Do not claim it has gradient/glass/Inter problems that were not observed. Preserve the material honesty while making the composition and shopping hierarchy more authored.

| Priority | Evidence in this checkout | Required redesign response |
|---|---|---|
| P1: mobile discovery delayed | At 390×844, first catalog product begins around document y=1383; the main filter `<details>` is open by default while its mobile label says “باز کردن فیلترها” | Products and result context first; filters/sort open on request; preserve every filter and URL state |
| P1: interrupted checkout loses work | Refresh after synthetic recipient/address entry clears those fields while the cart survives | Add deliberate session-scoped recovery with clear privacy boundaries and cleanup on success/reset; do not put customer drafts in a shared account/global store |
| P2: product purchase context and secondary text | Mobile add action around y=1348; sampled functional labels roughly 9–11px; desktop PDP paragraphs about 122 characters per line | Rebalance mobile first fold, maintain exact purchase context, enlarge consequential labels and constrain prose; verify optional sticky UI never obscures content |
| P2: feedback disagrees with state | Header badge stays 0 immediately after add and 1 on order success until navigation; hearts lack saved styling; compare message says added on a toggle removal; comparison has no direct per-item removal | Derive badge/selected states from successful current transport state; accurate add/remove feedback and comparison curation |
| P2: generic content and inaccurate color hints | All-fabric/search and collection templates fall back to first category's linen blocks; cards append constant `+۲` after displaying all swatches | Use context-relevant guidance/empty behavior and data-derived visible/hidden color counts; no fabricated specificity |

Additional prevention observation from source, **not an exercised failure**: the PDP number field has `max`, but the Add button predicate omits `cm > available`; because it is a click handler rather than form submission, over-stock input can reach API rejection. The API still checks stock, so this is not evidence of overselling. Improve immediate UI explanation and guard conditions while keeping authoritative validation.

### Detector interpretation and evidence boundaries

- Narrow source scan: exit 0, zero findings. That does not imply the rendered experience is flawless.
- Detailed headless browser overlays: home 24, catalog 21, PDP 14 rule instances. These are repeated element-level instances, not 59 distinct design defects. Home's initial responsive run had 23; use the detailed fresh-page capture consistently.
- Confirmed live rules: `tiny-text`, `undersized-ui-text`, one catalog `skipped-heading`, one home `kicker-above-heading` advisory, and two PDP `line-length` observations. Correct catalog heading semantics where card H3s follow H1 without a meaningful H2.
- Do not act on the snapshot-only “flat hierarchy” or primary “Arial” inference: computed Persian text uses WYekan and real headings are larger. Admin chart stripes in shared CSS are not a storefront design defect. Static contrast inference on the hero is not reliable pixel contrast evidence. Padding warnings from flattened responsive CSS need actual layout inspection.
- Sampled solid text/background pairs were at least 4.85:1 on home and 5.06:1 on catalog/PDP; a palette replacement is a direction choice, not a remedy for a confirmed sitewide contrast failure. Images, interaction states and unsampled text still need checks.
- No whole-page overflow or application page errors were found in the three core pages at 320/390/1440px. Mobile menu opening/Escape worked. This does not prove all routes, zoom settings, keyboard paths, stock edges, devices or assistive technologies pass.
- The exercised Pages journey selected 2m of linen, saved/compared it, added it to cart, checked 770,000 تومان subtotal plus 60,000 تومان shipping, completed a synthetic TEST order and saw it in account history. No real payment, dispatch, public content publishing or external contact occurred.
- Representative reading/help/content and CMS dashboard/list/editor templates were inspected. All 127 routes and every CMS action were not exhaustively tested. Server transport remains a preservation requirement, not something this critique newly certified.

### Desired design decisions

Default recommendation for this brief: **fabric/material browsing first**, with garment-use guidance as a secondary route using existing taxonomy. Choose the **warm undyed-paper textile ledger** described above, retaining burgundy as a signature and W Yekan as required. A future owner may instead choose rose-led evolution or garment-first navigation; treat those as explicit direction changes, not reasons to stall a complete first implementation plan. Do not add an unvalidated fabric calculator, artificial personalization or new taxonomy merely to make the design concept sound distinctive.

Prioritize in this order: mobile discovery and checkout resilience; product purchase/readability; accurate shared state and content; then the authored visual rhythm across every template. Recommended Impeccable playbooks for the future implementation: `shape`, `adapt`, `harden`, `typeset`, `clarify`, and final `polish`. Read each playbook when used rather than treating the names as a sequence of shell commands.
