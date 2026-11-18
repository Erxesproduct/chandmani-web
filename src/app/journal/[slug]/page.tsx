import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/blocks";
import { getPost, lede, posts } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  const description = lede(p).slice(0, 180);
  return { title: p.title, description, alternates: { canonical: `/journal/${p.slug}` }, openGraph: { title: p.title, description, images: p.cover ? [{ url: p.cover.src, width: p.cover.w, height: p.cover.h }] : undefined } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const others = posts.filter((x) => x.custom === p.custom && x.id !== p.id).slice(0, 3);
  // the cover usually repeats as the first photo of a custom-order post
  const body = p.body.filter((b, i) => !(i < 3 && b.t === "img" && p.cover && b.src === p.cover.src));
  return (
    <article className="pt-12 md:pt-16">
      <header className="wrap flex max-w-4xl flex-col items-center text-center">
        <Link href={p.custom ? "/bespoke" : "/journal"} className="caps text-gold hover:text-ink">
          {p.custom ? "Тусгай захиалга" : "Сэтгүүл"}
        </Link>
        <h1 className="display mt-5 text-[38px] md:text-[60px]">{p.title}</h1>
        <p className="caps mt-5 text-[10px] text-mute">{formatDate(p.date)}</p>
        <div className="rule mt-6 w-40">
          <span className="diamond" />
        </div>
      </header>
      {p.cover && (
        <div className="wrap mt-12 max-w-5xl">
          <Image src={p.cover.src} alt="" width={p.cover.w} height={p.cover.h} priority sizes="(min-width: 1024px) 1000px, 100vw" className="mx-auto h-auto max-h-[78vh] w-auto bg-ivory object-contain" />
        </div>
      )}
      <div className="wrap mt-12 max-w-[720px] text-[17.5px]">
        <Blocks blocks={body} className="prose-silk [&>p:first-child]:mt-0 [&>p:first-child]:text-[19px] [&>p:first-child]:text-ink" />
      </div>

      {others.length > 0 && (
        <section className="wrap mt-24">
          <p className="caps border-b border-line pb-5 text-center text-gold">{p.custom ? "Бусад захиалга" : "Бусад нийтлэл"}</p>
          <ul className="mt-10 grid gap-10 md:grid-cols-3">
            {others.map((a) => (
              <li key={a.id}>
                <Link href={`/journal/${a.slug}`} className="group block">
                  <span className="frame block aspect-[4/3]">{a.cover && <Image src={a.cover.thumb.src} alt="" width={a.cover.thumb.w} height={a.cover.thumb.h} sizes="(min-width: 768px) 33vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />}</span>
                  <span className="display mt-4 block text-[20px] leading-snug transition-colors group-hover:text-oxblood">{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
