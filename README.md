# chandmani-web

Storefront for **Chandmani** (chandmani.mn, Zochil shop 11867): handmade silk neckties, bow ties, pocket squares,
ascots, gift sets and bespoke orders for organisations. Next.js 16 (App Router), Tailwind 4, static product pages,
orders to erxes 3.0.

- 430 products in 11 kinds, filters by colour, Mongolian pattern, material, collaboration (Lamy, Plasencia, SF Soap,
  Man Bar) and women's line; sold-out items hidden by default
- «Private Office» look: midnight navy, antique gold hairlines, oxblood, ivory; Playfair, Source Sans 3, Didact Gothic;
  slow gold sheen, drawn rules, photos that settle in
- `/bespoke` (custom orders and the organisations made for), `/journal` (18 posts from the shop)
- Cart and checkout: QPay only (100% up front), Ulaanbaatar 10,000₮ (free from 200,000₮), countryside by phone
- `/api/orders` validates on the server and sends the order to erxes (`widgetsSaveLead`)

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000          # order API checks
npm run test:order -- https://<url> --send           # + one real test order (needs erxes env vars)
npm run sync:erxes                                   # check product codes / prices against erxes
```

Environment variables: see `.env.example` (never commit values). erxes admin steps and open questions:
[`docs/erxes/MANUAL-STEPS.md`](docs/erxes/MANUAL-STEPS.md).
