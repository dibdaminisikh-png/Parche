---
target: Parche Persian RTL fabric e-commerce UI/UX, locally rendered checkout; public URL blocked
total_score: 26
max_score: 40
na_heuristics: ""
p0_count: 0
p1_count: 2
target_identity: "file:/workspace/Parche/src/storefront/Storefront.tsx"
target_fingerprint: "sha256:7de8aa8a855773cc6bdb6dfecd5cdb1b25920ba18a46bf8446def91e95319da3"
target_path: /workspace/Parche/src/storefront/Storefront.tsx
timestamp: 2026-10-19T01-17-33Z
slug: src-storefront-storefront-tsx
---
Method: dual-agent (A: /root/design_review · B: /root/detector_review)

# Parche — Persian RTL fabric e-commerce critique

Date: 2026-10-19. Resolved source target: `src/storefront/Storefront.tsx`; scope extends across the representative storefront journey and supporting CMS templates.

## Design specificity verdict

**A credible Persian textile identity, expressed through a conventional storefront composition.** Copper/cream draped cloth, detailed swatches, burgundy/blush colors, woven brand mark and W Yekan feel coherent. Meters, width, color, drape and care belong to this product. Preserve them. The opportunity is to make this material intelligence shape discovery and purchase, instead of relying mostly on a familiar split hero, six category tiles, repeated product grids, collection banner and article row.

Those repeatable patterns are category-interchangeable; their presence is not proof that AI generated the site. Repeated English kickers, linen-specific fallback prose on unrelated catalog/search/collection contexts, and constant `+۲` color hints make it feel templated. No evidence justifies accusing this site of generic purple gradients, glassmorphism, or an Inter-based Persian interface. A redesign should address what is present.

## Evidence scope and limits

The public URL <https://dibdaminisikh-png.github.io/Parche/> could not be loaded: HTTP CONNECT proxy 403; Chromium `net::ERR_TUNNEL_CONNECTION_FAILED`. Findings refer to the freshly built **local checkout**, served internally from its existing Pages output, including the user's pending W Yekan font changes. Public-deployment parity is unverified.

Assessment A inspected home at 1440/768/390/320px; catalog at desktop/768/390, category at 320, positive/empty search, desktop/mobile PDP, populated cart/checkout, order/account, empty/populated wishlist and comparison, login, fabric guide, shipping, article/journal, collection, contact, FAQ and representative CMS dashboard/product list/editor. Assessment B independently inspected home/catalog/PDP at 1440/390/320, mobile menu, computed fonts/geometry, spot contrast, detector output and headless overlays. This samples all major page families; it does not deeply test all 127 pages or every CMS module/action.

The Pages journey successfully selected 2m of linen, saved and compared it, added it to cart, checked 770,000 تومان plus 60,000 تومان shipping, submitted a synthetic TEST order and saw it in account history. No real payment, external contact, public content publication, fulfillment or authentication occurred. Source review covered the server counterpart and preservation rules; this run did not validate a live Node/API shopping flow. Full screen-reader testing, every keyboard path, 200% zoom, device keyboards, slow-network behavior and all stock/coupon boundaries remain untested.

## Design health score

All ten Nielsen heuristics apply to this shopping flow. Each is scored 0–4. These qualitative expert scores are not measured conversion rates or accessibility certification.

| # | Heuristic | Score | Main evidence |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Exact totals, availability and success are clear; header cart count goes stale after add/completion |
| 2 | Match to the real world | 3 | Persian fabric attributes, meters and تومان; unrelated linen fallback guidance breaks context |
| 3 | User control and freedom | 2 | Cart removal/reset paths work; comparison lacks direct removal and checkout draft disappears on refresh |
| 4 | Consistency and standards | 3 | Coherent visual/control language; saved states and compare toggle message disagree with actions |
| 5 | Error prevention | 2 | Minimum/step and transport validation exist; incomplete immediate stock guard and misleading color count |
| 6 | Recognition rather than recall | 3 | Images, named colors and totals help; icon-only utilities and off-page comparison curation add memory work |
| 7 | Flexibility and efficiency | 2 | Useful search/filter/sort/save; mobile filtering and purchase hierarchy delay progress |
| 8 | Aesthetic and minimalist design | 3 | Strong photography and restrained palette; repeated modules, small text and mobile form density dilute it |
| 9 | Error recovery | 2 | Helpful empty results; quantity errors conflate causes and interrupted form work is not restored |
| 10 | Help and documentation | 3 | Fabric guide, care, FAQ and shipping are useful; repeated context-insensitive advice weakens relevance |
| **Total** | | **26/40** | **Acceptable; meaningful improvement needed** |

## Deterministic and browser evidence

The unanchored design assessment was finalized before the parent read detector findings. The two assessments were isolated and did not consume each other's artifacts.

- Narrow source scan (`src/storefront src/components src/pages`): exit 0, zero primary/advisory findings. This text scan cannot establish rendered quality.
- Three raw rendered HTML snapshots: exit 2, four primary findings. Three `flat-type-hierarchy` results are false positives because saved root-relative CSS links did not resolve in those snapshot paths. The real catalog `skipped-heading` remains: H1 followed by card H3 without H2 (`src/storefront/Storefront.tsx:40`, `src/components/shared.tsx:14`).
- Supplemental snapshots with embedded CSSOM: exit 2, 119 primary findings plus three advisories. Rule counts: `low-contrast` 3, `tiny-text` 19, `cramped-padding` 31, `undersized-ui-text` 63, `overused-font` 1, `kicker-above-heading` 1, `repeating-stripes-gradient` 3, `skipped-heading` 1. These include inactive admin rules/media-query flattening and repeated elements; they are not 122 confirmed user problems. Each generated snapshot reports line 0, so use element/source associations rather than pretending those are original source lines.
- Detailed live headless overlays: home 24 instances (`tiny-text` 5, `undersized-ui-text` 18, `kicker-above-heading` 1); catalog 21 (`tiny-text` 2, `undersized-ui-text` 18, `skipped-heading` 1); PDP 14 (`tiny-text` 3, `undersized-ui-text` 9, `line-length` 2). The initial multi-viewport home run had 23; the detailed fresh-page capture is the stated basis. Counts are repeated rule instances, not distinct usability issues.

Confirmed measurements include 10.88px shipping-details text, 10.4px clear-filters text, 10.24px product badges and 9.6px extra-color hints. The 9px Latin brand sublabel is less consequential than shopping controls. Two desktop PDP paragraphs measure about 122 characters per rendered line (`.product-summary` and main descriptive paragraph, Storefront PDP near line 43). Actual desktop H1s are 49.6px home, 35.2px catalog and 32px PDP, versus 16px body; there is genuine hierarchy. At 390px the PDP H1 is 29.6px.

False positives explicitly excluded: Arial as the primary font (Persian text uses loaded WYekan), shared admin chart stripes as storefront decoration, static hero white-on-pale contrast inference, and generic wrapper-padding flags as confirmed touch failures. Kicker usage is an observation to judge, not inherently a defect.

Solid-background text spot checks measured at least 4.85:1 on home and 5.06:1 on catalog/PDP. This is not pixel contrast validation over imagery or coverage of every state. No whole-document horizontal overflow occurred on the sampled three pages at 320/390/1440; both Yekan faces loaded, document direction was RTL, and baseline browser pages had no observed application errors or failed requests. Menu opening and Escape dismissal worked through the existing native dialog. Smaller controls/links warrant hit-area review; 17px checkboxes inside larger labels are not automatically tiny-target failures.

## Overall impression

The site is already calm, tactile and substantially functional. A premium redesign should make the expertise of buying cloth visible at the right moment. The largest opportunity is **a textile specimen system that makes material comparison and buying a precise cut feel effortless on a phone**.

## What is working

1. Material photography, Persian voice, woven mark and coherent colors form a believable atelier identity. Improve authorship without discarding those strengths.
2. The PDP already explains width, selected color, availability, minimum cut, step and exact total. This domain specificity is more valuable than decorative luxury language.
3. The local shopping journey works, and the demo is honest about sample imagery, no real payment and lack of real purchase reviews. Preserve that trust.

## Priority issues

### 1. P1 — Mobile catalog presents a filter form before the fabrics

**What:** The full main filter container is expanded by default. At 390×844, the first product starts around document y=1383. The mobile summary says “باز کردن فیلترها” even while open.

**Why:** Browsing begins as a configuration task and demands many decisions before shoppers see merchandise.

**Fix:** Lead with result context and a compact filter/sort entry. Open an accessible sheet or collapsed filter section on request; show active choices and accurate counts. Preserve all filters, category/search scope, sort, paging and query navigation. Keep the desktop sidebar when useful.

**Suggested command:** `$impeccable adapt` for catalog mobile hierarchy, followed by `$impeccable clarify` for disclosure/state labels.

### 2. P1 — An interrupted checkout loses recipient and address entry

**What:** After entering synthetic name/phone/city/postal/address, refresh clears form fields while the cart survives.

**Why:** The same shopping journey has inconsistent durability; an interrupted phone session repeats high-effort typing.

**Fix:** Deliberately recover in-progress fields within an appropriate session boundary, clear after success/reset, and keep demo-local versus server/account persistence explicit. Do not put customer details into a shared global store or imply current persistence that does not exist.

**Suggested command:** `$impeccable harden` for interruption, recovery and form feedback.

### 3. P2 — Mobile purchase context and secondary text need stronger hierarchy

**What:** At 390×844, the add action sits around y=1348. It follows the gallery, thumbnails, note, description and choices. Small functional text is confirmed; PDP desktop prose is overly wide.

**Why:** Shoppers repeatedly scroll to reconnect selected material, cut length, price and action. Critical context becomes visually subordinate.

**Fix:** Rebalance the gallery/purchase first fold and strengthen consequential labels. Consider a compact purchase summary only if it mirrors the same validated choices and never covers inputs/errors. Keep W Yekan, increase useful small text and constrain reading measure. Do not assume every action must fit above the fold or that every small brand label is equally important.

**Suggested commands:** `$impeccable adapt` and `$impeccable typeset`.

### 4. P2 — Cart and saved-state feedback disagree with actual actions

**What:** Badge stays 0 after successful add until navigation and 1 on success until the next page. Hearts lack selected styling. Compare toast says added even when toggling off; comparison table lacks direct per-item removal.

**Why:** Shoppers must verify whether actions worked and remember where to undo them.

**Fix:** Synchronize badge/pressed states with current successful transport state, distinguish add/remove feedback, and enable comparison curation where comparison occurs. Preserve browser-local/API separation and failure handling.

**Suggested commands:** `$impeccable harden` and `$impeccable clarify`.

### 5. P2 — Templated guidance and color hints promise false specificity

**What:** Generic/search and collection templates reuse first-category linen blocks. Every product card appends constant `+۲` after rendering all swatches. Repeated editorial kickers and section structures add little meaning.

**Why:** Unrelated advice and inaccurate color hints weaken expertise and make the composition feel interchangeable.

**Fix:** Make help contextually relevant or omit irrelevant fallback; derive color counts from genuinely hidden variants. Use specimen captions and actual fabric attributes to create a distinctive visual grammar. Vary editorial composition without inventing new claims or deleting CMS rendering capabilities.

**Suggested commands:** `$impeccable shape`, `$impeccable clarify`, then `$impeccable polish` after future implementation.

No P0 blocker was observed in the exercised demo flow. Source-only additional prevention issue: Add's disabled condition omits `cm > available`, despite the field's max and transport stock validation. This can defer an over-stock amount to API rejection; it is **not evidence of overselling**, and that boundary was not exercised.

## Cognitive load and emotional journey

Three of eight cognitive-load checklist areas fail: chunking, one-thing-at-a-time, and choice minimization. Main overload: stock plus roughly thirteen attribute groups, color, width and price precede results on mobile. Other decision points exceed four options (six fabric categories, seven garment links, eighteen specification fields, five account choices, 23 CMS modules). These counts are not themselves defects: images, hierarchy and expert task grouping can justify visible choice. Progressive disclosure should reduce initial burden without deleting specialist options.

The opening emotional peak is the tactile photography. Confidence grows through concrete fabric facts and exact totals; it drops during filter configuration, distant purchase controls and lost checkout work. The honest TEST confirmation restores clarity; its stale cart badge weakens the ending. Preserve sample/no-payment disclosures instead of hiding them to simulate production luxury.

## Persona red flags

- **Casey, distracted mobile shopper:** expanded filters delay fabrics; add action is distant; checkout refresh loses recipient work; very small secondary labels demand attention. Persistent cart is a strength.
- **Riley, edge-case tester:** badge/action feedback diverges; compare removal is indirect; fixed color counts and unrelated linen guidance fail literal inspection. Untested stock/keyboard paths are not automatically broken.
- **Jordan, first-time fabric buyer:** selected color and total are helpful, but dense specifications and an outbound quantity guide require translating technical fabric properties into a sewing decision. Icon-only utilities and unreflected saved states add uncertainty.

## Minor observations

- Preserve native dialog semantics and its working Escape behavior; do not mistake absence of an explicit role attribute for missing semantics.
- Keep mixed-direction SKU/contact strings isolated; existing RTL composition is generally intentional. Test Persian digit entry on actual number fields/device keyboards rather than assuming it works from phone/postal patterns.
- Lazy below-fold images can remain unloaded in an unscrolled full-page screenshot. Scrolled captures confirmed appearance; blank initial placeholders are not counted as broken assets.
- CMS dashboard/list/editor retain a coherent working-tool character. Sampled checks do not certify all modules, permissions, upload or publish behavior.
- Genuine collection/drape/scale photography could strengthen differentiation when supplied; never label repeated sample imagery as verified product evidence.
- Reassess catalog H1→H3 semantics and small target separation. Preserve useful focus, skip navigation and label associations.

## Recommended premium direction

**«دفتر بافت» — a textile atelier ledger.** Use warm undyed-paper surfaces, dark readable ink and restrained burgundy dye. Let fabric supply the color. Give each product a specimen caption: fabric identity, material/width, named color, price per meter. Let that grammar connect cards, PDP, comparison and purchase summary.

Home/collections can be editorial and asymmetrical; catalog/checkout should be predictable, precise and fast. Keep W Yekan regular/bold, a readable Persian measure, responsive AVIF/WebP assets and actual content. Move from repeated equal-weight modules toward a composed fabric selection, a useful material/use discovery block and context-relevant learning. Avoid decorative faux weave, ornamental Persian clichés, fake luxury labels, unrelated stock imagery and manufactured social proof.

The complete future implementation brief is `GPT_TASTE_PROMPT.md`. It includes repository/component mapping, immutable functionality/RTL/font constraints, all page families, color/type/layout targets, state/error behavior, responsive/accessibility requirements and validation for both Pages and server modes. No redesign was applied during this review.

## Questions to consider

1. Discovery priority: **fabric/material first** (recommended, current default in the prompt) or **garment/use first** using existing taxonomy?
2. Visual direction: **warm-paper textile ledger** (recommended in the prompt) or **rose-led evolution** retaining more of the current surface palette?

These are later direction refinements; they do not block the completed review and prompt, and neither authorizes application edits in this task.
