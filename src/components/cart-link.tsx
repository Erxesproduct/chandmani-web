"use client";

import Link from "next/link";
import { cartCount, useCart } from "@/lib/cart";
import { BasketIcon } from "./icons";

export function CartLink() {
  const n = cartCount(useCart());
  return (
    <Link href="/cart" className="relative grid h-11 w-11 place-items-center transition-colors hover:text-gold" aria-label={n ? `Сагс, ${n} бараа` : "Сагс"}>
      <BasketIcon size={22} />
      {n > 0 && (
        <span key={n} className="pop-in absolute top-0.5 right-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-oxblood px-1 text-[10.5px] font-semibold text-ivory">
          {n}
        </span>
      )}
    </Link>
  );
}
