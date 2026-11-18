"use client";

import { useState } from "react";
import { business } from "@/content/business";
import { cart, maxQty, useCart } from "@/lib/cart";
import { getLite } from "@/lib/lite";
import { BasketIcon, ChatIcon, CheckIcon } from "./icons";

/** Option chips (colour, engraving) + «Сагсанд хийх». A single choice is picked for the customer. */
export function BuyBox({ slug }: { slug: string }) {
  const p = getLite(slug)!;
  const items = useCart();
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);
  const [warn, setWarn] = useState(false);

  const choice = p.z.map(([label, values]) => picked[label] ?? (values.length === 1 ? values[0] : null));
  const full = choice.every(Boolean);
  const opt = p.z.length ? (full ? choice.join(" / ") : null) : null;

  if (p.k === 0)
    return (
      <div className="border border-line bg-ivory p-6">
        <p className="display text-[24px]">Дууссан</p>
        <p className="mt-1 text-[15px] text-ink-2">Дахин урлах эсэх, ижил загвараар захиалж болох эсэхийг асуугаарай.</p>
        <a href={business.messenger} target="_blank" rel="noreferrer" className="btn btn-line mt-5">
          <ChatIcon size={17} /> Facebook-ээр асуух
        </a>
      </div>
    );

  const inCart = items.find((i) => i.slug === slug && i.opt === opt)?.qty ?? 0;
  const canAdd = (!p.z.length || full) && maxQty(slug, opt) > inCart;

  return (
    <div>
      {p.z.map(([label, values], idx) => (
        <fieldset key={label} className="mt-6 first:mt-0">
          <legend className="caps text-[11px] text-gold">
            {label}
            {choice[idx] && <span className="text-ink normal-case"> · {choice[idx]}</span>}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
            {values.map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={choice[idx] === v}
                onClick={() => {
                  setPicked((s) => ({ ...s, [label]: v }));
                  setWarn(false);
                }}
                className="chip"
              >
                {v}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      {warn && (
        <p role="alert" className="pop-in mt-5 border-l-2 border-oxblood bg-oxblood/5 px-4 py-3 text-[14.5px] text-oxblood">
          {p.z.length && !full ? `${p.z.filter((_, i) => !choice[i]).map(([l]) => l.toLowerCase()).join(", ")} сонгоно уу.` : "Үлдэгдэл хүрэлцэхгүй байна."}
        </p>
      )}
      <button
        type="button"
        onClick={() => {
          if (!canAdd) return setWarn(true);
          cart.add(slug, opt);
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1800);
        }}
        className={`btn mt-7 h-14 w-full ${added ? "btn-ink" : "btn-gold"}`}
      >
        {added ? <CheckIcon size={18} /> : <BasketIcon size={18} />}
        {added ? "Сагсанд орлоо" : "Сагсанд хийх"}
      </button>
      {inCart > 0 && <p className="caps mt-3 text-center text-[10.5px] text-ink-2">Сагсанд {inCart} ширхэг</p>}
    </div>
  );
}
