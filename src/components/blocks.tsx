import Image from "next/image";
import type { JournalBlock } from "@/lib/catalog";

/** Text from Zochil (descriptions, posts) in order: paragraphs, list runs grouped into one <ul>, photos. */
export function Blocks({ blocks, className = "prose-silk" }: { blocks: JournalBlock[]; className?: string }) {
  const groups: (JournalBlock | { t: "ul"; items: string[] })[] = [];
  for (const b of blocks) {
    const last = groups.at(-1);
    if (b.t === "li") {
      if (last?.t === "ul") last.items.push(b.x);
      else groups.push({ t: "ul", items: [b.x] });
    } else groups.push(b);
  }
  return (
    <div className={className}>
      {groups.map((g, i) =>
        g.t === "ul" ? (
          <ul key={i}>
            {g.items.map((x, j) => (
              <li key={j}>{x}</li>
            ))}
          </ul>
        ) : g.t === "img" ? (
          <Image key={i} src={g.src} alt="" width={g.w} height={g.h} sizes="(min-width: 768px) 720px, 100vw" className="my-8 h-auto w-full" />
        ) : (
          <p key={i}>{g.x}</p>
        ),
      )}
    </div>
  );
}
