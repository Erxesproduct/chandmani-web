import { formatPrice } from "@/lib/format";

export function Price({ price, compareAt, size = "md" }: { price: number; compareAt?: number | null; size?: "sm" | "md" | "lg" }) {
  const sale = compareAt != null && compareAt > price;
  const big = size === "lg" ? "text-[30px] md:text-[34px]" : size === "sm" ? "text-[15.5px]" : "text-[19px]";
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={`font-display tracking-tight tabular-nums ${big} ${sale ? "text-oxblood" : ""}`}>{formatPrice(price)}</span>
      {sale && <s className={`text-mute ${size === "lg" ? "text-[16px]" : "text-[13px]"}`}>{formatPrice(compareAt!)}</s>}
    </span>
  );
}
