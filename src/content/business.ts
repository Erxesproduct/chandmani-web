/**
 * Business facts from chandmani.mn (Zochil shop 11867: shop settings, payment / delivery rules, delivery option, terms,
 * FAQ, About page, posts) and the Facebook page facebook.com/chandmanibrand, read on 2026-11-18. Nothing here is
 * invented; where Zochil is unclear the choice is noted and listed in docs/erxes/MANUAL-STEPS.md.
 */
export const business = {
  name: "Chandmani",
  domain: "chandmani.mn",
  /** Zochil shop description. */
  tagline: "Mongolian men's stylish neckties and accessories brand",
  /** FAQ «Chandmani брэнд гэж юу вэ?». */
  founded: 2016,
  description: "Chandmani: 2016 оноос хойш гар аргаар урласан торгон зангиа, эрвээхэй зангиа, энгэрийн алчуур, аскот, бэлгийн багц. Байгууллагын тусгай захиалга.",
  phone: { display: "8810-8567", tel: "+97688108567" },
  email: "chandmanimongolia@gmail.com",
  /** Zochil shop address «БГД, 4р хороо». There is no showroom pick-up on Zochil. */
  address: "Баянгол дүүрэг, 4-р хороо",
  facebook: "https://www.facebook.com/chandmanibrand",
  messenger: "https://m.me/chandmanibrand",
  instagram: "https://www.instagram.com/chandmani.mongolia/",
  /** Zochil payment rule: the order is confirmed after full payment. QPay (Khan Bank merchant) is the only method. */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө. Захиалга 100% төлбөрийн дараа баталгаажна." }],
  /** Zochil has no `order_min_limit` for this shop. */
  minOrder: 0,
  /** Zochil delivery option «Улаанбаатар · Үндсэн хүргэлт»: 10,000₮, free from 200,000₮ (`delivery_price_limit`). */
  cityFee: 10000,
  freeFrom: 200000,
  delivery: [
    { id: "city", name: "Улаанбаатар хот дотор", note: "Төлбөр төлөгдсөнөөс хойш 24–48 цагийн дотор хүргэнэ" },
    { id: "countryside", name: "Орон нутаг", note: "Орон нутгийн унаанд хийж өгнө. Төлбөрийг холбогдож мэдэгдэнэ" },
  ],
  rules: {
    delivery: "Захиалга төлбөр төлөгдсөнөөс хойш 24–48 цагийн дотор хүргэгдэнэ. Хаяг, утасны дугаараа зөв, дэлгэрэнгүй бичээрэй.",
    payment: "Захиалга 100% төлбөр төлөгдсөний дараа баталгаажна.",
    exchange: "Бэлэн бүтээгдэхүүнийг хэрэглээгүй, цэвэр, үрчлээгүй тохиолдолд 72 цагийн дотор солино.",
    custom: "Тусгай захиалгын бүтээгдэхүүнийг буцаахгүй; 14 хоногийн дотор үнэгүй засвар хийнэ.",
    ebarimt: "Утасны дугаараараа НӨАТ-ын баримт авна. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
    giftBox: "Зангиа бүр Chandmani бэлгийн хайрцагтай.",
    international: "Олон улсын хүргэлт одоогоор хийхгүй байна.",
  },
} as const;

export type DeliveryId = (typeof business.delivery)[number]["id"];
export type PaymentId = (typeof business.payments)[number]["id"];
export const deliveryOption = (id: DeliveryId) => business.delivery.find((d) => d.id === id)!;
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** Delivery fee for a goods subtotal: city 10,000₮ (free from 200,000₮); countryside told by phone (null). */
export function deliveryFee(id: DeliveryId, subtotal: number): number | null {
  if (id === "countryside") return null;
  return subtotal >= business.freeFrom ? 0 : business.cityFee;
}
