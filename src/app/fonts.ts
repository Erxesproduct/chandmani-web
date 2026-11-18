import { Didact_Gothic, Playfair, Source_Sans_3 } from "next/font/google";

// All three carry Mongolian Ө ө Ү ү (checked against the Google Fonts cmap).
/** High-contrast Didone with an optical-size axis: hairline serifs at headline sizes, like a tailor's label. */
export const display = Playfair({ subsets: ["latin", "cyrillic", "cyrillic-ext"], axes: ["opsz", "wdth"], style: ["normal", "italic"], variable: "--nf-display", display: "swap" });
/** Quiet, readable body text. */
export const sans = Source_Sans_3({ subsets: ["latin", "cyrillic", "cyrillic-ext"], variable: "--nf-sans", display: "swap" });
/** Wide geometric capitals that echo the CHANDMANI wordmark. */
export const caps = Didact_Gothic({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: "400", variable: "--nf-caps", display: "swap" });
