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
