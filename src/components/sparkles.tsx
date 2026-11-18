/**
 * Gold four-point stars that twinkle slowly, scattered over a dark section. Positions come from a seeded random
 * sequence, so the server and the browser draw the same sky. Decorative only (aria-hidden, no pointer events).
 */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR = "M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z";

export function Sparkles({ count = 14, seed = 1, className = "", min = 7, max = 20, tone = "light" }: { count?: number; seed?: number; className?: string; min?: number; max?: number; tone?: "light" | "gold" }) {
  const r = rng(seed);
  const stars = Array.from({ length: count }, () => ({ x: r() * 100, y: r() * 100, s: min + r() * (max - min), d: r() * 6, t: 3 + r() * 4 }));
  return (
    <span className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {stars.map((st, i) => (
        <svg key={i} viewBox="0 0 24 24" width={st.s} height={st.s} className={`twinkle ${tone === "gold" ? "text-gilt" : ""}`} style={{ left: `${st.x}%`, top: `${st.y}%`, "--d": `${st.d.toFixed(2)}s`, "--t": `${st.t.toFixed(2)}s` } as React.CSSProperties}>
          <path d={STAR} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
