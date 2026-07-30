import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { initWasm, Resvg } from "npm:@resvg/resvg-wasm@2.6.2";

const WASM_URL = "https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm";
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf";

let wasmReady: Promise<void> | null = null;
let fontCache: Uint8Array | null = null;

async function ensureWasm() {
  if (!wasmReady) {
    wasmReady = (async () => {
      const res = await fetch(WASM_URL);
      await initWasm(await res.arrayBuffer());
    })();
  }
  await wasmReady;
}

async function getFont(): Promise<Uint8Array> {
  if (!fontCache) {
    const res = await fetch(FONT_URL);
    fontCache = new Uint8Array(await res.arrayBuffer());
  }
  return fontCache;
}

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else {
      line = next;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[.,;:]?$/, "…");
  }
  return lines;
}

function buildSvg(opts: {
  title: string;
  description: string;
  eyebrow: string;
  site: string;
}) {
  const titleLines = wrap(opts.title, 28, 3);
  const descLines = wrap(opts.description, 62, 2);
  const titleSize = titleLines.length >= 3 ? 62 : titleLines.length === 2 ? 78 : 92;
  const lineGap = titleSize * 1.14;

  // Title block is bottom-anchored so the eyebrow above and the description
  // below never collide, whatever the line count is.
  const titleBaselineStart = 388 - (titleLines.length - 1) * lineGap;


  // The Inter variable font renders at its default weight in resvg, so bold
  // text is simulated with a matching stroke (faux bold).
  const bold = (w: number) => `stroke="#0A0A0A" stroke-width="${w}"`;

  const titleTspans = titleLines
    .map(
      (l, i) =>
        `<text x="88" y="${titleBaselineStart + i * lineGap}" font-family="Inter" font-size="${titleSize}" fill="#0A0A0A" ${bold(2.4)} letter-spacing="-2">${esc(l)}</text>`,
    )
    .join("");

  const descTspans = descLines
    .map(
      (l, i) =>
        `<text x="88" y="${440 + i * 44}" font-family="Inter" font-size="30" fill="#4A4A4A">${esc(l)}</text>`,

    )
    .join("");


  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="55%" stop-color="#F7F6F4"/>
      <stop offset="100%" stop-color="#EFEDE9"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.88" cy="0.12" r="0.6">
      <stop offset="0%" stop-color="#FF5B21" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#FF5B21" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="1055" cy="150" r="210" fill="none" stroke="#0A0A0A" stroke-opacity="0.07" stroke-width="1"/>
  <circle cx="1055" cy="150" r="140" fill="none" stroke="#0A0A0A" stroke-opacity="0.07" stroke-width="1"/>

  <rect x="0" y="0" width="1200" height="10" fill="#0A0A0A"/>
  <rect x="0" y="0" width="240" height="10" fill="#FF5B21"/>

  <!-- brand -->
  <rect x="88" y="72" width="64" height="64" rx="18" fill="#0A0A0A"/>
  <text x="120" y="118" font-family="Inter" font-size="36" font-weight="700" fill="#FFFFFF" text-anchor="middle">N</text>
  <circle cx="150" cy="76" r="9" fill="#FF5B21"/>
  <text x="172" y="116" font-family="Inter" font-size="30" font-weight="600" fill="#0A0A0A" letter-spacing="-0.5">${esc(opts.site)}</text>

  <text x="88" y="186" font-family="Inter" font-size="20" font-weight="600" fill="#FF5B21" letter-spacing="4">${esc(opts.eyebrow.toUpperCase())}</text>

  ${titleTspans}
  ${descTspans}

  <line x1="88" y1="524" x2="1112" y2="524" stroke="#0A0A0A" stroke-opacity="0.10" stroke-width="1"/>
  <text x="88" y="572" font-family="Inter" font-size="24" font-weight="500" fill="#0A0A0A">WordPress · React · Frontend Engineering</text>
  <text x="1112" y="572" font-family="Inter" font-size="24" font-weight="600" fill="#0A0A0A" text-anchor="end" opacity="0.55">Available for work</text>
</svg>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const p = url.searchParams;
    const clamp = (v: string | null, max: number, fallback: string) =>
      ((v ?? "").trim() || fallback).slice(0, max);

    const svg = buildSvg({
      title: clamp(p.get("title"), 120, "Nauman Ellahi"),
      description: clamp(
        p.get("description"),
        200,
        "Senior WordPress & Frontend Developer building fast, conversion-focused websites.",
      ),
      eyebrow: clamp(p.get("eyebrow"), 40, "Portfolio"),
      site: clamp(p.get("site"), 40, "Nauman Ellahi"),
    });

    await ensureWasm();
    const font = await getFont();

    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
      font: { fontBuffers: [font], defaultFontFamily: "Inter", loadSystemFonts: false },
    });
    const png = resvg.render().asPng();

    return new Response(png, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    });
  } catch (e) {
    console.error("og-image error", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
