"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { business, deliveryFee, deliveryOption, type DeliveryId } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { resolveLine } from "@/lib/lite";
import type { OrderErrors } from "@/lib/orders/schema";
import { BasketIcon, ChatIcon, CheckIcon, MinusIcon, PhoneIcon, PlusIcon, TrashIcon } from "./icons";

type Done = { reference: string; subtotal: number; total: number; deliveryFee: number | null; delivery: DeliveryId; lines: { name: string; opt: string | null; qty: number; total: number }[] };

const field = "mt-2 w-full border border-line bg-white px-4 py-3 text-[16px] outline-none transition focus:border-gold aria-invalid:border-oxblood aria-invalid:bg-oxblood/5";
const label = "caps block text-[10.5px] text-ink-2";
const feeText = (fee: number | null) => (fee == null ? "Утсаар" : fee === 0 ? "Үнэгүй" : formatPrice(fee));

export function Checkout() {
  const items = useCart();
  const [delivery, setDelivery] = useState<DeliveryId>("city");
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const lines = items.flatMap((i) => {
    const l = resolveLine(i.slug, i.opt);
    return l ? [{ ...i, line: l }] : [];
  });
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(delivery, subtotal);
  const total = subtotal + (fee ?? 0);
  const toFree = delivery === "city" && subtotal < business.freeFrom ? business.freeFrom - subtotal : 0;

  if (done) return <Receipt done={done} />;

  if (!lines.length)
    return (
      <div className="mx-auto max-w-lg border border-line bg-white px-8 py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gilt text-gold">
          <BasketIcon size={26} />
        </span>
        <p className="display mt-6 text-[34px]">Сагс хоосон байна</p>
        <p className="mt-2 text-[15.5px] text-ink-2">Өөрт болон эрхэм хүндээ тохирох зангиагаа сонгоорой.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop?k=tie" className="btn btn-ink">
            Зангиа
          </Link>
          <Link href="/shop?k=gift" className="btn btn-line">
            Бэлгийн багц
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          delivery,
          address: f.get("address") ?? "",
          payment: "qpay",
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ slug, opt, qty }) => ({ slug, opt, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setDone({
          reference: json.reference,
          subtotal: json.subtotal ?? subtotal,
          total: json.total ?? total,
          deliveryFee: json.deliveryFee === undefined ? fee : json.deliveryFee,
          delivery,
          lines: lines.map((l) => ({ name: l.line.product.n, opt: l.opt, qty: l.qty, total: l.line.price * l.qty })),
        });
        cart.clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Мэдээллээ шалгаад дахин оролдоно уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалгын систем тохируулагдаж байна. Захиалгаа ${business.phone.display} дугаарт эсвэл Facebook чатаар өгнө үү (лавлах код ${json.reference}, нийт ${formatPrice(json.total ?? total)}).`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) => errors[k] && <p className="mt-1.5 text-[14px] text-oxblood">{errors[k]}</p>;
  const step = (n: string, t: string) => (
    <h2 className="flex items-baseline gap-4 border-b border-line pb-4">
      <span className="display text-[15px] text-gold italic">{n}</span>
      <span className="display text-[26px]">{t}</span>
    </h2>
  );
  const radio = (on: boolean) => <span className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${on ? "border-gold" : "border-ink/30"}`}>{on && <span className="h-2 w-2 rounded-full bg-gold" />}</span>;
  const option = "flex items-start gap-3.5 border border-line bg-white p-4 text-left transition hover:border-ink/40 aria-checked:border-gold aria-checked:bg-ivory";

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
      <div className="space-y-12">
        <section>
          <ul className="divide-y divide-line border-y border-line">
            {lines.map(({ slug, opt, qty, line }) => (
              <li key={`${slug}|${opt}`} className="flex gap-5 py-5">
                <Link href={`/p/${slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden bg-ivory md:h-28 md:w-28">
                  {line.product.t ? <Image src={line.product.t} alt="" fill sizes="112px" className="object-cover" /> : null}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/p/${slug}`} className="display line-clamp-2 text-[18px] leading-snug hover:text-oxblood">
                    {line.product.n}
                  </Link>
                  <span className="caps mt-1 text-[10px] text-mute">
                    {line.product.a ? `№ ${line.product.a} · ` : ""}
                    {opt ? `${opt} · ` : ""}
                    {formatPrice(line.price)}
                  </span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                    <div className="flex items-center border border-line">
                      <button type="button" onClick={() => cart.setQty(slug, opt, qty - 1)} className="grid h-9 w-9 place-items-center hover:bg-ivory" aria-label="Цөөлөх">
                        <MinusIcon size={14} />
                      </button>
                      <span className="w-8 text-center text-[15px] tabular-nums">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(slug, opt, qty + 1)} disabled={qty >= maxQty(slug, opt)} className="grid h-9 w-9 place-items-center hover:bg-ivory disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <span className="display text-[19px] tabular-nums">{formatPrice(line.price * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(slug, opt, 0)} className="grid h-9 w-9 place-items-center text-mute hover:text-oxblood" aria-label={`${line.product.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          {step("I", "Захиалагч")}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={label}>
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} className={field} />
              {err("name")}
            </label>
            <label className={label}>
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} className={field} />
              {err("phone")}
            </label>
            <label className={`${label} sm:col-span-2`}>
              Имэйл <span className="normal-case tracking-normal text-mute">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section>
          {step("II", "Хүргэлт")}
          <div className="mt-6 grid gap-3" role="radiogroup" aria-label="Хүргэлт">
            {business.delivery.map((d) => (
              <button key={d.id} type="button" role="radio" aria-checked={delivery === d.id} onClick={() => setDelivery(d.id)} className={option}>
                {radio(delivery === d.id)}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 text-[16px] font-semibold">
                    {d.name}
                    <span className="display text-[16px] font-normal text-gold">{feeText(deliveryFee(d.id, subtotal))}</span>
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-snug text-ink-2">{d.note}</span>
                </span>
              </button>
            ))}
          </div>
          {toFree > 0 && <p className="mt-4 border-l-2 border-gilt bg-ivory px-4 py-3 text-[14.5px]">Дахиад {formatPrice(toFree)}-ийн бараа нэмбэл хүргэлт үнэгүй.</p>}
          {err("delivery")}
          <label className={`${label} mt-5`}>
            {delivery === "countryside" ? "Аймаг, сум, унааны мэдээлэл" : "Хаяг"}
            <textarea name="address" rows={2} required aria-invalid={!!errors.address} placeholder={delivery === "countryside" ? "Аймаг, сум, хүлээн авах хүн, унааны дугаар" : "Дүүрэг, хороо, байр, орц, давхар, тоот"} className={field} />
            {err("address")}
          </label>
          <p className="mt-3 text-[14.5px] text-ink-2">{business.rules.delivery}</p>
        </section>

        <section>
          {step("III", "Төлбөр, и-баримт")}
          <div className="mt-6 flex items-start gap-3.5 border border-gold bg-ivory p-4">
            {radio(true)}
            <span>
              <span className="block text-[16px] font-semibold">{business.payments[0].name}</span>
              <span className="block text-[14px] leading-snug text-ink-2">{business.payments[0].note}</span>
            </span>
          </div>
          {err("payment")}
          <div className="mt-7 flex gap-2" role="radiogroup" aria-label="И-баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, text]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="chip">
                {text}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className={`${label} mt-5`}>
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className={field} />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[14.5px] text-ink-2">И-баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className={`${label} mt-6`}>
            Нэмэлт тайлбар <span className="normal-case tracking-normal text-mute">(бэлгийн мэндчилгээ, хүргэх цаг гэх мэт)</span>
            <textarea name="note" rows={2} className={field} />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-40 lg:self-start">
        <div className="panel-dark relative p-7 md:p-9">
          <span className="pointer-events-none absolute inset-2.5 border border-gilt/25" aria-hidden />
          <p className="caps relative text-gilt">Төлөх дүн</p>
          <dl className="relative mt-6 space-y-3 text-[15.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-ivory/65">Барааны дүн</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ivory/65">{deliveryOption(delivery).name}</dt>
              <dd className="tabular-nums">{feeText(fee)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-gilt/25 pt-4">
              <dt className="caps text-[11px] text-ivory/80">Нийт</dt>
              <dd className="display sheen text-[38px] tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="relative mt-4 text-[13.5px] leading-snug text-ivory/60">{business.rules.payment}</p>
          {notice && (
            <p role="alert" className="relative mt-5 bg-ivory px-4 py-3 text-[14.5px] text-ink">
              {notice}
            </p>
          )}
          {errors.items && <p className="relative mt-4 bg-oxblood px-4 py-2.5 text-[14.5px] text-ivory">{errors.items}</p>}
          <button type="submit" disabled={busy} className="btn btn-gold relative mt-7 h-14 w-full disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? "Илгээж байна…" : "Захиалга өгөх"}
          </button>
          <div className="relative mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px] text-ivory/80">
            <a href={`tel:${business.phone.tel}`} className="inline-flex items-center gap-2 hover:text-gilt-2">
              <PhoneIcon size={16} /> {business.phone.display}
            </a>
            <a href={business.messenger} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gilt-2">
              <ChatIcon size={16} /> Facebook чат
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}

function Receipt({ done }: { done: Done }) {
  const option = deliveryOption(done.delivery);
  return (
    <div className="mx-auto max-w-xl">
      <div className="pop-in border border-line bg-white">
        <div className="panel-dark relative p-9 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gilt text-gilt-2">
            <CheckIcon size={26} />
          </span>
          <h2 className="display mt-6 text-[38px]">Баярлалаа</h2>
          <p className="mt-2 text-ivory/75">
            Захиалгын дугаар: <b className="font-semibold text-gilt-2">{done.reference}</b>
          </p>
        </div>
        <div className="p-8 md:p-10">
          <ul className="space-y-2.5 text-[15px]">
            {done.lines.map((l) => (
              <li key={`${l.name}|${l.opt}`} className="flex justify-between gap-4">
                <span className="text-ink-2">
                  {l.name}
                  {l.opt && ` (${l.opt})`} × {l.qty}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-ink-2">{option.name}</span>
              <span className="shrink-0 tabular-nums">{feeText(done.deliveryFee)}</span>
            </li>
            <li className="display flex justify-between gap-4 border-t border-line pt-4 text-[22px]">
              <span>Нийт</span>
              <span className="tabular-nums">{formatPrice(done.total)}</span>
            </li>
          </ul>
          <p className="mt-7 text-[15px] leading-relaxed text-ink-2">
            QPay-ийн нэхэмжлэлийг таны утас руу илгээнэ. {business.rules.payment} {business.rules.delivery} {business.rules.ebarimt}
          </p>
          <Link href="/" className="btn btn-ink mt-8">
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
