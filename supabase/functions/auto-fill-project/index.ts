import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OLLAMA_URL = "https://ollama.com/api/chat";
const MODEL = Deno.env.get("OLLAMA_MODEL") || "gpt-oss:120b";
const OLLAMA_KEY = Deno.env.get("OLLAMA_API_KEY");

// Never surface these as "tech stack" — they're builder/hosting brands the user doesn't want listed.
const TECH_BLOCKLIST = new Set([
  "lovable", "lovable.dev", "lovable.app", "gpt engineer", "gptengineer",
]);

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

function constrainToCatalog(list: unknown, catalog: string[]): string[] {
  if (!Array.isArray(list) || catalog.length === 0) return [];
  const map = new Map(catalog.map((c) => [c.toLowerCase().trim(), c]));
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of list) {
    const key = String(raw || "").toLowerCase().trim();
    if (!key) continue;
    const canonical = map.get(key);
    if (canonical && !seen.has(canonical)) { out.push(canonical); seen.add(canonical); }
  }
  return out.slice(0, 8);
}

function filterTech(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of list) {
    const s = String(raw || "").trim();
    if (!s) continue;
    const k = s.toLowerCase();
    if (TECH_BLOCKLIST.has(k)) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

// Detect real technologies from raw HTML + response headers via fingerprints.
function detectTech(rawHtml: string, headers: Headers): string[] {
  const h = rawHtml;
  const found = new Set<string>();
  const add = (t: string) => found.add(t);

  // Meta generator
  const gen = h.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i)?.[1] || "";

  // Frameworks / bundlers
  if (/\/@vite\/client|\/\.vite\/|from ["'`]\/@id\//i.test(h)) add("Vite");
  if (/__vite_ssr|\/_astro\//i.test(h)) { /* astro handled below */ }
  if (/data-reactroot|__REACT_DEVTOOLS|react\.production|react-dom|\bReact\.createElement\b|_reactRootContainer/i.test(h)) add("React");
  if (/id=["']__next["']|\/_next\/static\/|window\.__NEXT_DATA__/i.test(h)) { add("Next.js"); add("React"); }
  if (/id=["']__nuxt["']|\/_nuxt\//i.test(h)) { add("Nuxt"); add("Vue"); }
  if (/id=["']app["'][^>]*data-v-|__VUE__|window\.__INITIAL_STATE__/i.test(h) || /vue(?:\.esm)?(?:\.browser)?\.(?:min\.)?js/i.test(h)) add("Vue");
  if (/svelte-|__SVELTE|_app\/immutable\//i.test(h)) add("Svelte");
  if (/ng-version=|ng-app=|\/angular(?:\.min)?\.js/i.test(h)) add("Angular");
  if (/\/_astro\/|astro-island/i.test(h)) add("Astro");
  if (/\/_remix\/|__remixContext/i.test(h)) { add("Remix"); add("React"); }
  if (/gatsby-|___gatsby/i.test(h)) { add("Gatsby"); add("React"); }

  // CSS
  if (/tailwind|(?:^|[\s"'])(?:bg-|text-|flex|grid-cols-)\w+/i.test(h)) add("Tailwind CSS");
  if (/bootstrap(?:\.min)?\.css|class=["'][^"']*\b(container|row|col-\w+)\b/i.test(h)) add("Bootstrap");

  // CMS
  if (/\/wp-content\/|\/wp-includes\/|wp-json/i.test(h)) add("WordPress");
  if (/cdn\.shopify\.com|Shopify\.theme|shopify-features/i.test(h)) add("Shopify");
  if (/\/sites\/default\/files\/|Drupal\.settings/i.test(h)) add("Drupal");
  if (/cdn\.sanity\.io/i.test(h)) add("Sanity");
  if (/webflow\.com|w-nav|w-container/i.test(h)) add("Webflow");
  if (/squarespace(?:-cdn)?\.com/i.test(h)) add("Squarespace");
  if (/wix\.com|wixstatic\.com/i.test(h)) add("Wix");
  if (/framer(?:usercontent)?\.com/i.test(h)) add("Framer");

  // Analytics / tags
  if (/googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]+/i.test(h)) add("Google Tag Manager");
  if (/googletagmanager\.com\/gtag\/js|gtag\(['"]config/i.test(h)) add("Google Analytics");
  if (/connect\.facebook\.net.*fbevents|fbq\(['"]init/i.test(h)) add("Meta Pixel");
  if (/plausible\.io\/js/i.test(h)) add("Plausible");
  if (/static\.hotjar\.com/i.test(h)) add("Hotjar");
  if (/cdn\.mxpnl\.com/i.test(h)) add("Mixpanel");
  if (/js\.stripe\.com/i.test(h)) add("Stripe");
  if (/paypal\.com\/sdk\/js/i.test(h)) add("PayPal");

  // Fonts / icons
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(h)) add("Google Fonts");
  if (/font-awesome|fontawesome/i.test(h)) add("Font Awesome");

  // Libraries
  if (/jquery(?:-\d[\d.]*)?(?:\.min)?\.js|jQuery\(/i.test(h)) add("jQuery");
  if (/gsap(?:\.min)?\.js|GreenSock/i.test(h)) add("GSAP");
  if (/framer-motion/i.test(h)) add("Framer Motion");
  if (/three(?:\.min)?\.js|THREE\./i.test(h)) add("Three.js");
  if (/swiper(?:-bundle)?(?:\.min)?\.(?:js|css)/i.test(h)) add("Swiper");

  // Backend / hosting hints from headers
  const server = (headers.get("server") || "").toLowerCase();
  const poweredBy = (headers.get("x-powered-by") || "").toLowerCase();
  const via = (headers.get("via") || "").toLowerCase();
  if (server.includes("vercel") || h.includes("_vercel")) add("Vercel");
  if (server.includes("netlify") || headers.get("x-nf-request-id")) add("Netlify");
  if (server.includes("cloudflare") || via.includes("cloudflare")) add("Cloudflare");
  if (poweredBy.includes("next")) add("Next.js");
  if (poweredBy.includes("express")) add("Express");
  if (poweredBy.includes("php")) add("PHP");
  if (/supabase\.co/i.test(h)) add("Supabase");
  if (/firebaseio\.com|firebaseapp\.com/i.test(h)) add("Firebase");

  // Generator meta (WordPress x.y, Hugo, Gatsby, etc.)
  if (gen) {
    const g = gen.toLowerCase();
    if (g.includes("wordpress")) add("WordPress");
    if (g.includes("hugo")) add("Hugo");
    if (g.includes("gatsby")) { add("Gatsby"); add("React"); }
    if (g.includes("jekyll")) add("Jekyll");
    if (g.includes("astro")) add("Astro");
    if (g.includes("next")) { add("Next.js"); add("React"); }
  }

  return filterTech([...found]);
}

// ---- JSON-LD extraction (Organization / LocalBusiness / WebSite / Product) ----
function extractJsonLd(html: string): any[] {
  const blocks: any[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim());
      if (Array.isArray(parsed)) blocks.push(...parsed);
      else if (parsed?.["@graph"]) blocks.push(...parsed["@graph"]);
      else blocks.push(parsed);
    } catch (_) { /* ignore malformed */ }
  }
  return blocks;
}

// ---- Country inference from many signals ----
const PHONE_CC: Record<string, string> = {
  "1": "United States", "44": "United Kingdom", "33": "France", "49": "Germany",
  "34": "Spain", "39": "Italy", "31": "Netherlands", "32": "Belgium", "41": "Switzerland",
  "43": "Austria", "45": "Denmark", "46": "Sweden", "47": "Norway", "48": "Poland",
  "351": "Portugal", "353": "Ireland", "358": "Finland", "420": "Czechia", "30": "Greece",
  "90": "Turkey", "7": "Russia", "380": "Ukraine", "91": "India", "92": "Pakistan",
  "880": "Bangladesh", "94": "Sri Lanka", "977": "Nepal", "60": "Malaysia", "62": "Indonesia",
  "63": "Philippines", "65": "Singapore", "66": "Thailand", "84": "Vietnam", "81": "Japan",
  "82": "South Korea", "86": "China", "852": "Hong Kong", "886": "Taiwan",
  "61": "Australia", "64": "New Zealand", "27": "South Africa", "20": "Egypt",
  "212": "Morocco", "213": "Algeria", "216": "Tunisia", "234": "Nigeria", "254": "Kenya",
  "971": "United Arab Emirates", "966": "Saudi Arabia", "974": "Qatar", "973": "Bahrain",
  "965": "Kuwait", "968": "Oman", "962": "Jordan", "961": "Lebanon", "972": "Israel",
  "52": "Mexico", "54": "Argentina", "55": "Brazil", "56": "Chile", "57": "Colombia", "51": "Peru",
};
const TLD_COUNTRY: Record<string, string> = {
  pk: "Pakistan", in: "India", bd: "Bangladesh", lk: "Sri Lanka", uk: "United Kingdom",
  de: "Germany", fr: "France", it: "Italy", es: "Spain", nl: "Netherlands", be: "Belgium",
  ch: "Switzerland", at: "Austria", se: "Sweden", no: "Norway", fi: "Finland", dk: "Denmark",
  ie: "Ireland", pl: "Poland", pt: "Portugal", cz: "Czechia", gr: "Greece", tr: "Turkey",
  ru: "Russia", ua: "Ukraine", jp: "Japan", kr: "South Korea", cn: "China", hk: "Hong Kong",
  tw: "Taiwan", sg: "Singapore", my: "Malaysia", id: "Indonesia", ph: "Philippines", th: "Thailand",
  vn: "Vietnam", au: "Australia", nz: "New Zealand", za: "South Africa", eg: "Egypt",
  ma: "Morocco", ng: "Nigeria", ke: "Kenya", ae: "United Arab Emirates", sa: "Saudi Arabia",
  qa: "Qatar", kw: "Kuwait", il: "Israel", mx: "Mexico", br: "Brazil", ar: "Argentina",
  cl: "Chile", co: "Colombia", pe: "Peru", ca: "Canada", us: "United States",
};
const CURRENCY_COUNTRY: Record<string, string> = {
  USD: "United States", GBP: "United Kingdom", EUR: "European Union", INR: "India",
  PKR: "Pakistan", BDT: "Bangladesh", LKR: "Sri Lanka", AED: "United Arab Emirates",
  SAR: "Saudi Arabia", QAR: "Qatar", KWD: "Kuwait", TRY: "Turkey", JPY: "Japan",
  CNY: "China", HKD: "Hong Kong", SGD: "Singapore", MYR: "Malaysia", IDR: "Indonesia",
  PHP: "Philippines", THB: "Thailand", AUD: "Australia", NZD: "New Zealand",
  ZAR: "South Africa", NGN: "Nigeria", KES: "Kenya", EGP: "Egypt", MXN: "Mexico",
  BRL: "Brazil", CAD: "Canada", CHF: "Switzerland", SEK: "Sweden", NOK: "Norway",
  DKK: "Denmark", PLN: "Poland",
};

function inferCountry(url: string, html: string, text: string, jsonLd: any[]): { country: string; evidence: string[] } {
  const scores: Record<string, number> = {};
  const evidence: string[] = [];
  const bump = (c: string, n: number, why: string) => {
    if (!c) return;
    scores[c] = (scores[c] || 0) + n;
    evidence.push(`${c} +${n} (${why})`);
  };

  // 1. JSON-LD addressCountry
  for (const node of jsonLd) {
    const addr = node?.address || node?.location?.address;
    const arr = Array.isArray(addr) ? addr : [addr];
    for (const a of arr) {
      const ac = a?.addressCountry?.name || a?.addressCountry || a?.country;
      if (typeof ac === "string" && ac.trim()) bump(ac.trim(), 10, "JSON-LD address");
    }
  }

  // 2. TLD
  try {
    const host = new URL(url).hostname.toLowerCase();
    const tld = host.split(".").pop() || "";
    if (TLD_COUNTRY[tld]) bump(TLD_COUNTRY[tld], 4, `TLD .${tld}`);
  } catch (_) {}

  // 3. Phone country codes — look for +XX
  const phoneMatches = text.match(/\+\s?(\d{1,3})[\s.\-()\d]{6,}/g) || [];
  for (const p of phoneMatches.slice(0, 10)) {
    const digits = p.replace(/\D/g, "");
    for (const len of [3, 2, 1]) {
      const cc = digits.slice(0, len);
      if (PHONE_CC[cc]) { bump(PHONE_CC[cc], 5, `phone +${cc}`); break; }
    }
  }

  // 4. Currency symbols / codes
  const currMatches = text.match(/\b(USD|GBP|EUR|INR|PKR|BDT|LKR|AED|SAR|QAR|KWD|TRY|JPY|CNY|HKD|SGD|MYR|IDR|PHP|THB|AUD|NZD|ZAR|NGN|KES|EGP|MXN|BRL|CAD|CHF|SEK|NOK|DKK|PLN)\b/g) || [];
  for (const c of currMatches.slice(0, 10)) {
    if (CURRENCY_COUNTRY[c]) bump(CURRENCY_COUNTRY[c], 3, `currency ${c}`);
  }
  if (/₨|Rs\.?\s*\d/i.test(text)) bump("Pakistan", 3, "Rs symbol");
  if (/₹\s*\d/.test(text)) bump("India", 3, "₹ symbol");
  if (/د\.إ|AED/i.test(text)) bump("United Arab Emirates", 3, "AED symbol");

  // 5. Country name mentioned in address-like context
  const countryNames = new Set(Object.values(TLD_COUNTRY).concat(Object.values(PHONE_CC)));
  for (const name of countryNames) {
    const re = new RegExp(`\\b${name.replace(/\s+/g, "\\s+")}\\b`, "i");
    if (re.test(text)) bump(name, 2, `name mention`);
  }

  // 6. hreflang default
  const hreflangDefault = html.match(/hreflang=["']([a-z]{2})(?:-([A-Z]{2}))?["'][^>]*rel=["']alternate["']/i)
    || html.match(/rel=["']alternate["'][^>]*hreflang=["']([a-z]{2})(?:-([A-Z]{2}))?["']/i);
  if (hreflangDefault?.[2] && TLD_COUNTRY[hreflangDefault[2].toLowerCase()]) {
    bump(TLD_COUNTRY[hreflangDefault[2].toLowerCase()], 2, `hreflang ${hreflangDefault[0]}`);
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return { country: sorted[0]?.[0] || "", evidence: evidence.slice(0, 12) };
}

// ---- Deep fetch: about, contact, JS bundle inspection ----
async function fetchExtras(baseUrl: string, mainHtml: string): Promise<{ text: string; techExtras: string[] }> {
  const paths = ["/about", "/about-us", "/contact", "/contact-us", "/services", "/pricing"];
  const jsBundles: string[] = [];
  // Collect first few internal JS bundle URLs
  const jsRe = /<script[^>]+src=["']([^"']+\.js[^"']*)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = jsRe.exec(mainHtml)) !== null && jsBundles.length < 3) {
    try {
      const src = new URL(m[1], baseUrl).toString();
      if (new URL(src).hostname === new URL(baseUrl).hostname) jsBundles.push(src);
    } catch (_) {}
  }

  const doFetch = async (u: string) => {
    try {
      const r = await fetch(u, {
        headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html,*/*" },
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) return "";
      return await r.text();
    } catch (_) { return ""; }
  };

  const pageResults = await Promise.all(paths.map((p) => doFetch(new URL(p, baseUrl).toString())));
  const jsResults = await Promise.all(jsBundles.map(doFetch));

  const pageText = pageResults.map((h, i) => h ? `\n--- ${paths[i]} ---\n${stripHtml(h).slice(0, 4000)}` : "").join("");

  // Inspect JS bundles for framework hints (chunk names, dev markers)
  const jsBlob = jsResults.join("\n").slice(0, 300_000);
  const techExtras: string[] = [];
  if (/\bReact\b|react\.production|_reactRootContainer|useState|useEffect/.test(jsBlob)) techExtras.push("React");
  if (/__vite|\/@vite\/|vite\/preload-helper|\/assets\/index-[a-z0-9]+\.js/i.test(jsBlob) || /\/assets\/index-[A-Za-z0-9_-]+\.js/.test(mainHtml)) techExtras.push("Vite");
  if (/__NEXT_DATA__|next\/dist|next\/router/.test(jsBlob)) techExtras.push("Next.js");
  if (/@nuxt|nuxt\/dist/.test(jsBlob)) techExtras.push("Nuxt");
  if (/svelte\/internal|_svelte/.test(jsBlob)) techExtras.push("Svelte");
  if (/@tanstack\/react-query|useQuery|QueryClient/.test(jsBlob)) techExtras.push("React Query");
  if (/react-router|BrowserRouter/.test(jsBlob)) techExtras.push("React Router");
  if (/radix-ui/.test(jsBlob)) techExtras.push("Radix UI");
  if (/shadcn/.test(jsBlob)) techExtras.push("shadcn/ui");
  if (/framer-motion/.test(jsBlob)) techExtras.push("Framer Motion");
  if (/gsap/.test(jsBlob)) techExtras.push("GSAP");
  if (/supabase|@supabase\/supabase-js/.test(jsBlob)) techExtras.push("Supabase");
  if (/firebase\/app|firebase\/auth/.test(jsBlob)) techExtras.push("Firebase");
  if (/stripe\.com|@stripe\/stripe-js/.test(jsBlob)) techExtras.push("Stripe");

  return { text: pageText, techExtras: filterTech(techExtras) };
}


async function fetchMicrolink(url: string, waitMs = 3000) {
  // Microlink free tier: `waitUntil=networkidle0` on media-heavy sites hits 27s browser timeout.
  // Use `load` + a `screenshot.waitFor` (capped at 5000ms — the free-tier ceiling) instead.
  const capped = Math.min(Math.max(waitMs, 1500), 5000);
  const params = new URLSearchParams({
    url,
    screenshot: "true", meta: "true", palette: "false", audio: "false", video: "false",
    "viewport.width": "1440", "viewport.height": "900", "viewport.deviceScaleFactor": "2",
    "screenshot.type": "jpeg", "screenshot.fullPage": "false",
    "screenshot.overlay.browser": "false",
    "screenshot.waitFor": String(capped),
    waitUntil: "load",
    device: "macbook pro 15",
  });
  try {
    const r = await fetch(`https://api.microlink.io/?${params.toString()}`, {
      signal: AbortSignal.timeout(45000),
    });
    const j = await r.json().catch(() => ({}));
    if (j?.status !== "success") {
      console.log("microlink non-success:", j?.status, j?.code, j?.data?.url || j?.message || "");
      // Fallback: try minimal params (no waitFor script) — often succeeds when the fuller call times out
      const min = new URLSearchParams({
        url, screenshot: "true", meta: "true",
        "viewport.width": "1440", "viewport.height": "900",
        "screenshot.type": "jpeg", "screenshot.overlay.browser": "false",
      });
      const r2 = await fetch(`https://api.microlink.io/?${min.toString()}`, { signal: AbortSignal.timeout(30000) });
      const j2 = await r2.json().catch(() => ({}));
      if (j2?.status !== "success") {
        console.log("microlink fallback non-success:", j2?.status, j2?.code);
        return { screenshot: null, meta: {} as any };
      }
      const d2 = j2.data || {};
      return {
        screenshot: d2.screenshot?.url || null,
        meta: {
          title: d2.title || "", description: d2.description || "",
          publisher: d2.publisher || "", logo: d2.logo?.url || "",
          image: d2.image?.url || "", lang: d2.lang || "", author: d2.author || "",
        },
      };
    }
    const d = j.data || {};
    return {
      screenshot: d.screenshot?.url || null,
      meta: {
        title: d.title || "", description: d.description || "",
        publisher: d.publisher || "", logo: d.logo?.url || "",
        image: d.image?.url || "", lang: d.lang || "", author: d.author || "",
      },
    };
  } catch (e) {
    console.log("microlink fetch error:", String(e));
    return { screenshot: null, meta: {} as any };
  }
}

}

async function fetchRawHtml(url: string): Promise<{ html: string; headers: Headers }> {
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    });
    return { html: await r.text(), headers: r.headers };
  } catch (_) {
    return { html: "", headers: new Headers() };
  }
}

async function callOllama(system: string, user: string): Promise<any> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${OLLAMA_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL, stream: false, format: "json",
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      options: { temperature: 0.15 },
    }),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  const content = j?.message?.content || "{}";
  try { return JSON.parse(content); } catch {
    const m = content.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : {};
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!OLLAMA_KEY) {
      return new Response(JSON.stringify({ error: "OLLAMA_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;
    const { data: isAdminData } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdminData) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const mode: "scrape" | "refine" | "screenshot" = 
      body?.mode === "refine" ? "refine" : body?.mode === "screenshot" ? "screenshot" : "scrape";

    // ------- SCREENSHOT-ONLY MODE (for progressive retries from client) -------
    if (mode === "screenshot") {
      let url: string = String(body?.url || "").trim();
      if (!url) {
        return new Response(JSON.stringify({ error: "Missing 'url'" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;
      const attempt = Math.max(1, Math.min(5, Number(body?.attempt) || 1));
      // Progressive wait: 3s, 5s, 7s, 9s, 11s
      const waitMs = 1000 + attempt * 2000;
      const ml = await fetchMicrolink(url, waitMs);
      return new Response(JSON.stringify({ success: true, screenshot: ml.screenshot, attempt, waitMs }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load MY services catalog
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: svcRows } = await admin
      .from("services").select("title, category, short_description").eq("published", true);
    const serviceCatalog: string[] = (svcRows || [])
      .map((s: any) => String(s.title || "").trim()).filter(Boolean);
    const catalogDetail = (svcRows || [])
      .map((s: any) => `- ${s.title}${s.category ? ` [${s.category}]` : ""}${s.short_description ? `: ${s.short_description}` : ""}`)
      .join("\n");

    // ------- REFINE MODE -------
    if (mode === "refine") {
      const current = body?.current || {};
      const instructions: string = String(body?.instructions || "").trim();
      if (!instructions) {
        return new Response(JSON.stringify({ error: "Missing 'instructions'" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const system =
        "You are an expert portfolio editor. Apply every user instruction and fix grammar/spelling. HARD RULES: (1) `services_provided` MUST contain only exact strings from MY_SERVICES. (2) `tech_stack` must list REAL detected technologies — never include 'Lovable', 'Lovable.dev', 'GPT Engineer', or generic hosting brands as a tech. Return ONLY valid JSON with the same keys.";
      const user = `MY_SERVICES:\n${catalogDetail || "(none)"}\n\nCURRENT FIELDS:\n${JSON.stringify(current, null, 2)}\n\nUSER INSTRUCTIONS:\n"""\n${instructions}\n"""\n\nReturn the SAME JSON with edits applied.`;
      const ai = await callOllama(system, user);
      const merged = {
        ...current, ...ai,
        tech_stack: filterTech(ai.tech_stack ?? current.tech_stack).slice(0, 12),
        services_provided: constrainToCatalog(ai.services_provided, serviceCatalog),
        featured: typeof ai.featured === "boolean" ? ai.featured : Boolean(current.featured),
        published: typeof ai.published === "boolean" ? ai.published : current.published !== false,
      };
      return new Response(JSON.stringify({ success: true, data: merged }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ------- SCRAPE MODE -------
    let url: string = (body?.url || "").trim();
    if (!url) {
      return new Response(JSON.stringify({ error: "Missing 'url'" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    // First screenshot pass uses moderate wait — client will retry with longer waits.
    const [ml, raw] = await Promise.all([fetchMicrolink(url, 4000), fetchRawHtml(url)]);
    const detectedTechBase = detectTech(raw.html, raw.headers);
    const jsonLd = extractJsonLd(raw.html);
    const mainText = stripHtml(raw.html);
    // Fetch about/contact/services + JS bundles in parallel for deeper signal
    const extras = await fetchExtras(url, raw.html);
    const detectedTech = filterTech([...detectedTechBase, ...extras.techExtras]);
    const fullText = (mainText + extras.text).slice(0, 24000);

    // Country inference — evidence-based scoring across many signals
    const { country: detectedCountry, evidence: countryEvidence } = inferCountry(url, raw.html, mainText + extras.text, jsonLd);

    // JSON-LD condensed for the prompt
    const jsonLdSummary = jsonLd
      .filter((n) => n && (n["@type"] || n.name || n.description))
      .map((n) => ({
        type: n["@type"], name: n.name, description: n.description,
        url: n.url, address: n.address, telephone: n.telephone,
        areaServed: n.areaServed, sameAs: n.sameAs,
      }))
      .slice(0, 6);

    const system =
      "You are a senior web analyst. Extract STRICTLY factual portfolio data. HARD RULES:\n" +
      "1) `services_provided` — ONLY exact titles from MY_SERVICES.\n" +
      "2) `tech_stack` — START with every DETECTED_TECH entry verbatim (already verified from HTML+JS+headers). You MAY add more ONLY with direct evidence in the provided data. NEVER include 'Lovable', 'Lovable.dev', 'GPT Engineer', or the hosting provider (Vercel/Netlify/Cloudflare) unless it's clearly a core part of the stack.\n" +
      "3) `country` — Prefer DETECTED_COUNTRY when present (it's derived from JSON-LD, phone codes, currency, TLD, and address mentions). Only override if PAGE TEXT contains explicit contradicting evidence, and then use full English country name.\n" +
      "4) `description` — 3–5 substantive paragraphs (~120–180 words total) in third person, grounded in the page text and JSON-LD. Cover: what the product/site does, who it's for, notable real features/sections visible in the text, and any differentiators mentioned. No invention, no marketing fluff, no repetition of the short description.\n" +
      "5) `industry` — one precise label from a real vertical (E-commerce, SaaS, Fintech, Healthcare, EdTech, Real Estate, Marketing Agency, Restaurant, Fitness, Travel, Media, Non-profit, Portfolio, Manufacturing, Logistics, Legal, Automotive, Beauty, Fashion, Construction, etc.).\n" +
      "Return ONLY valid JSON.";
    const prompt = `URL: ${url}
META TITLE: ${ml.meta.title}
META DESCRIPTION: ${ml.meta.description}
PUBLISHER: ${ml.meta.publisher}
LANG: ${ml.meta.lang}

DETECTED_TECH (verified — include ALL verbatim in tech_stack):
${detectedTech.length ? detectedTech.map((t) => `- ${t}`).join("\n") : "(none detected)"}

DETECTED_COUNTRY: ${detectedCountry || "(unknown)"}
COUNTRY_EVIDENCE: ${countryEvidence.join("; ") || "(none)"}

JSON-LD STRUCTURED DATA (from the site):
${jsonLdSummary.length ? JSON.stringify(jsonLdSummary, null, 2) : "(none)"}

PAGE TEXT (home + about/contact/services, truncated):
"""
${fullText || "(no text extracted)"}
"""

MY_SERVICES (ONLY allowed values for services_provided — pick 2 to 6):
${catalogDetail || "(none configured)"}

Return JSON with keys:
{
  "title": "concise real project/brand name (2-6 words)",
  "short_description": "one-line factual pitch under 160 chars",
  "description": "3-5 factual paragraphs, ~120-180 words. Third person. Grounded in the provided text.",
  "industry": "one precise industry label",
  "country": "full English country name (prefer DETECTED_COUNTRY)",
  "tech_stack": ["MUST include every DETECTED_TECH entry verbatim; add more only with evidence"],
  "services_provided": ["EXACT titles from MY_SERVICES only"],
  "featured": false
}
Output ONLY JSON.`;

    const ai = await callOllama(system, prompt);

    const title = String(ai.title || ml.meta.title || "").trim();
    const mergedTech = filterTech([...detectedTech, ...(Array.isArray(ai.tech_stack) ? ai.tech_stack : [])]).slice(0, 12);
    // Country: prefer AI answer if non-empty and looks like a real country name, else fall back to detector
    const aiCountry = String(ai.country || "").trim();
    const country = aiCountry && aiCountry.toLowerCase() !== "unknown" ? aiCountry : detectedCountry;

    const result = {
      title,
      slug: slugify(title || new URL(url).hostname.replace(/^www\./, "")),
      short_description: String(ai.short_description || ml.meta.description || "").slice(0, 200),
      description: String(ai.description || ml.meta.description || ""),
      industry: String(ai.industry || ""),
      country,
      website_url: url,
      thumbnail_url: ml.screenshot || ml.meta.image || "",
      tech_stack: mergedTech,
      services_provided: constrainToCatalog(ai.services_provided, serviceCatalog),
      images: [] as string[],
      featured: Boolean(ai.featured),
      published: true,
      status: "active",
    };

    return new Response(JSON.stringify({
      success: true, data: result, meta: ml.meta,
      debug: { detectedTech, detectedCountry, countryEvidence, jsonLdCount: jsonLd.length },
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("auto-fill-project error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
