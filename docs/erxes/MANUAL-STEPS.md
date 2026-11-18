# Chandmani: erxes manual steps

Owner of every step below: **Terbish**, with Chandmani for credentials and decisions.

These steps happen inside the erxes 3.0 admin, not in code. The website reads the results through the environment
variables in `.env.example`. Never commit their values.

| Task | Status | What to do in erxes (admin path) |
| --- | --- | --- |
| [1.1] Import products, categories, prices | website done · manual import in erxes | Section 1.1 |
| [1.2] Payment setup (QPay) | website done · manual, blocked on QPay merchant credentials | Section 1.2 |
| [1.3] eBarimt setup | website done · manual, blocked on PosAPI registration + TIN | Section 1.3 |
| [1.4] Delivery zones, fees, order statuses | website done · manual in erxes; countryside fee to confirm | Section 1.4 |
| [1.5] Test order from cart to receipt | validation verified · real order blocked on erxes env vars + 1.2 + 1.3 | Section 1.5 |

There is no erxes instance for Chandmani yet ("erxes 3.0: NOT SET"). Create it first, then add the env vars under
**Vercel → chandmani-web → Settings → Environment Variables**.

---

## 1.1 Import products, categories and prices

Source: chandmani.mn (Zochil shop 11867), scraped 2026-11-18: **430 products** (Zochil's shop total says 436, see the
open questions), 18 Zochil categories, the logo, 3 home banners, the About page, the terms, 5 FAQ answers and
18 posts (10 articles, 8 custom-order stories). The Facebook page (facebook.com/chandmanibrand) gives no content
without a login beyond its name and profile photo.

The website imports all **430 products** (none excluded).

- **Kinds:** 11, from the Zochil categories and, where a product has none, from its name: Зангиа 119, Зангиа, алчуурын
  сэт 169, Эрвээхэй зангиа 50, Энгэрийн алчуур 27, Аскот 17, Бэлгийн багц 29, Эмэгтэй алчуур 8, Зангианы хавчаар 4,
  Энгэрийн гоёл 3, Бэлгийн карт 3, Аялалын хайрцаг 1. 11 products are in the women's line.
- **Collaborations:** Chandmani × Lamy 7, × Plasencia 6, × SF Soap 8, × Man Bar 2, Spooky ties 3.
- **Materials / patterns** (website filters) are read from names and descriptions: silk 398, microfiber 183, cotton 83,
  wool 3; Mongolian pattern 25, floral 35, weave 25, paisley 8, dot 4.
- **Colour** (website filter only) is **estimated from the first photo** for ties, bows, pockets, ascots, sets and
  scarves; 21 of them got no clear colour. The site says «өнгийг зургаас тооцсон» next to the filter.
- **Names:** Zochil ALL-CAPS lowered, «CHANDMANI X …» written «Chandmani × …». **360 products share 13 names**
  («Зангиа», «Бэлгийн багц 7», «Зангиа, алчуурын сэт»…), so the site and the CSV add the article number
  («Зангиа, алчуурын сэт № 852319»). The original name is kept in the CSV column `zochilName`.
- **Options:** 11 products have choices on Zochil (clip colour Gold / Silver / Dark and engraving, pin and ascot colour,
  travel case colour). Zochil has no per-option stock, so one stock count covers all options.
- **Prices:** none are on sale on Zochil. Range 13,000₮–404,900₮.

Files:

- `docs/erxes/chandmani-categories.csv`: **18 rows**, parent `CH`, kinds `CH-<KIND>`, collaborations `CH-COLLAB-<ID>`.
- `docs/erxes/chandmani-products.csv`: **430 rows**, code `CH-<zochilId>`, name (with № for shared names), kind
  category, collaboration category, price, options, women's line, patterns, materials, colour estimate, stock, status,
  the Zochil name, description, photo paths.

Steps:

1. **Products & services → Categories**: import `chandmani-categories.csv` (parents first: it is already ordered).
2. **Settings → Import & Export → Import → Products**: upload `chandmani-products.csv`. Map `code → Code`,
   `name → Name`, `categoryCode → Category code`, `unitPrice → Unit price`, `type → Type`, `uom → UOM`,
   `description → Description`. Keep the codes: the website and `npm run sync:erxes` match on them.
3. Products with options: add the choices as product variants or properties (**Products & services → Properties**),
   or keep them in the order text (the website writes the chosen option on every order line).
4. **Inventories → Remainders**: Zochil stock, 2,049 units; **210 products are sold out** (hidden on the site by
   default, shown with «дууссан …-г харуулах»).
5. Upload the photos (`public/images/p/*.webp`, 828 photos) on the products.
6. Run `npm run sync:erxes` once with a Client Portal token (`ERXES_APP_TOKEN`) to confirm the codes match (it also
   refreshes `src/data/lite.json`, which the cart reads).

## 1.2 Payment setup (QPay)

Zochil: QPay (`qpay2`, Khan Bank) is the shop's only payment method. Payment rule: the order is confirmed only after
100% payment. erxes 3.0 has a QPay payment kind (`backend/plugins/payment_api/src/constants.ts`).

1. Get Chandmani's QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`); ask QPay / Zochil
   whether the existing merchant can be used outside Zochil. Owner: Terbish / Chandmani.
2. **Settings → Payments → Add → QPay**: enter them. **Settings → Payments → (QPay) → Test**: a 100₮ invoice.
3. **Sales → Pipelines → «Вэбсайт» → Settings → Payments**: select QPay.

Website (done): checkout offers **QPay** only, validated on the server (bank transfer, cash and anything else are
rejected). The browser's prices are ignored; the server prices every line from the catalog.

## 1.3 eBarimt setup

Zochil has no eBarimt setting for this shop (`vat_enabled` is off on every product).

1. Collect from Chandmani: company TIN, district code (СБД), VAT status, product classification code (clothing
   accessories).
2. Register for **PosAPI 3.0** (ebarimt.mn → Business → PosAPI) and install the PosAPI service.
3. **Settings → eBarimt → Add**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.

Website (done): checkout asks «Хувь хүн» or «Байгууллага»; a company needs a 7-digit registry number, validated on the
server; the order message carries it. Custom orders for organisations (see `/bespoke`) usually need a company receipt.

## 1.4 Delivery zones, fees and order statuses

**Website (done)**, from Zochil shop 11867:

| Option | Fee | Rule |
| --- | --- | --- |
| Улаанбаатар хот дотор | 10,000₮, free from 200,000₮ | Delivered 24–48 hours after payment; address and phone must be exact |
| Орон нутаг | told by phone | Countryside is enabled on Zochil but has no fee |

- No order minimum on Zochil. **No pick-up** (not enabled on Zochil), so the checkout has none.
- Exchange: ready-made products within 72 hours if unused, clean and not creased; custom-made products are not
  returned, free repair within 14 days (Zochil terms). Shown on product pages and `/info#exchange`.
- No international delivery (Zochil FAQ).

**erxes (manual):**

1. Import `docs/erxes/chandmani-delivery.csv`: services `DELIVERY-CITY` (10,000₮; staff set 0₮ from 200,000₮) and
   `DELIVERY-COUNTRYSIDE` (no price).
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages: Шинэ захиалга → Төлбөр хүлээгдэж буй →
   Төлбөр баталгаажсан (100%) → Бэлтгэж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus «Цуцлагдсан» and «Солилт / засвар».
3. A second pipeline **«Тусгай захиалга»** for organisation orders: Хүсэлт → Загварын хувилбар → Батлагдсан →
   Урлаж байна → Хүлээлгэн өгсөн (the steps on `/bespoke`). Those requests come by email / phone today.
4. **Frontline → Forms → (order form) → Settings**: create a sales card in «Шинэ захиалга» for every submission.

## 1.5 Test order from cart to receipt

**Verified on a local production build:** `npm run test:order -- http://localhost:3155` passes **28 checks**: empty
cart, unknown product, an option on a product without options, a product with choices needs all of them (none, only
some, a value not offered, all chosen), sold-out, more than the stock, no minimum (one 13,000₮ item), city + 10,000₮,
free from 200,000₮, countryside (fee null), pick-up rejected, address required (city, countryside), QPay accepted,
bank transfer and unknown payment rejected, unknown delivery, company registry rejected and accepted, phone (incl.
+976), email, quantity over 10, the browser's price ignored, honeypot. Without erxes the order returns
`503 not_configured` and the checkout shows the phone number, the reference (`CH-YYMMDD-XXXX`) and the total.

Steps for a real test order:

1. **Frontline → Forms → Create** «Вэбсайт захиалга» with fields Нэр, Утас, Имэйл, Захиалга. Copy the form id and
   the field ids.
2. In Vercel set `ERXES_API_URL`, `ERXES_ORDER_FORM_ID`, `ERXES_ORDER_FIELD_IDS`, then redeploy.
3. Run `npm run test:order -- https://chandmani-web.vercel.app --send`. The script prints the expected total (a tie and
   the cheapest item + 10,000₮ city delivery).
4. In erxes: find the submission and its card → send the QPay invoice and pay it → issue the eBarimt → move the card
   to «Хүргэгдсэн» → void the test order.

---

## Open questions for Chandmani

1. **Product count**: Zochil reports 436 products, its listing returns 430. Are 6 hidden or drafts?
2. **Shared names**: 360 products share 13 names («Зангиа», «Бэлгийн багц 7»…). Can they get real names (pattern,
   colour)? Until then the article number tells them apart.
3. **Colour filter** is estimated from photos (sets on dark or green backgrounds are the least reliable). Should staff
   tag colours in erxes instead?
4. **210 sold-out products**: hide them for good, or keep them as «made to order»?
5. **Countryside**: enabled on Zochil without a fee. How is it sent and who pays the bus?
6. **Pick-up / showroom**: not enabled on Zochil. Is there an address where customers can collect or see the ties?
7. **QPay merchant** outside Zochil: credentials for erxes.
8. **TIN / PosAPI** for eBarimt.
9. **Custom orders**: keep email / phone, or add a request form on `/bespoke` that creates a card in «Тусгай
   захиалга»?
10. **FAQ on payment** says cash, card and online payment work «on the site and in the store»; online it is QPay only,
    so the site leaves that answer out. Confirm or correct.
11. **72-hour exchange**: does the 72 hours run from delivery or from payment?
12. **Domain**: point chandmani.mn at the new site when ready.
