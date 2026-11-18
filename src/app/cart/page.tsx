import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-12 md:pt-16">
      <div className="flex flex-col items-center text-center">
        <p className="caps text-gold">Захиалга</p>
        <h1 className="display mt-4 text-[46px] md:text-[68px]">Таны сагс</h1>
        <div className="rule mt-6 w-40">
          <span className="diamond" />
        </div>
      </div>
      <div className="mt-12">
        <Checkout />
      </div>
    </div>
  );
}
