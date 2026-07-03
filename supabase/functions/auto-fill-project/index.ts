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

async function fetchMicrolink(url: string, waitMs = 5000) {
  const scrollScript = `async () => {
    await new Promise(r => setTimeout(r, 1200));
    window.scrollTo(0, 300); await new Promise(r => setTimeout(r, 500));
    window.scrollTo(0, 0);   await new Promise(r => setTimeout(r, 400));
    document.querySelectorAll('video').forEach(v => { try { v.muted = true; v.play().catch(()=>{}); } catch(_) {} });
    // Wait for <img> in viewport to actually finish decoding
    const imgs = Array.from(document.querySelectorAll('img')).slice(0, 30);
    await Promise.all(imgs.map(img => img.complete ? null : new Promise(res => { img.onload = img.onerror = () => res(null); setTimeout(res, 3000); })));
    await new Promise(r => setTimeout(r, ${waitMs}));
  }`;
  const params = new URLSearchParams({
    url,
    screenshot: "true", meta: "true", palette: "false", audio: "false", video: "false",
    "viewport.width": "1440", "viewport.height": "900", "viewport.deviceScaleFactor": "2",
    "screenshot.type": "jpeg", "screenshot.fullPage": "false", "screenshot.overlay.browser": "false",
    "screenshot.waitFor": String(Math.min(waitMs, 5000)),
    waitUntil: "networkidle0",
    waitFor: String(waitMs + 5000),
    device: "macbook pro 15",
    scripts: scrollScript,
  });
  const r = await fetch(`https://api.microlink.io/?${params.toString()}`);
  const j = await r.json().catch(() => ({}));
  if (j?.status !== "success") return { screenshot: null, meta: {} as any };
  const d = j.data || {};
  return {
    screenshot: d.screenshot?.url || null,
    meta: {
      title: d.title || "", description: d.description || "",
      publisher: d.publisher || "", logo: d.logo?.url || "",
      image: d.image?.url || "", lang: d.lang || "", author: d.author || "",
    },
  };
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
    const detectedTech = detectTech(raw.html, raw.headers);
    const pageText = stripHtml(raw.html).slice(0, 18000);

    const system =
      "You are an expert web analyst. Extract STRICTLY factual portfolio data. RULES: (1) `services_provided` must come only from MY_SERVICES catalog. (2) For `tech_stack`, START with the DETECTED_TECH list (already verified via HTML fingerprints) — you MAY add more only if you see clear evidence in the HTML/text. NEVER include 'Lovable', 'Lovable.dev', 'GPT Engineer', or the site's hosting provider unless it's a genuine part of the stack. Return ONLY valid JSON.";
    const prompt = `URL: ${url}
META TITLE: ${ml.meta.title}
META DESCRIPTION: ${ml.meta.description}
PUBLISHER: ${ml.meta.publisher}
LANG: ${ml.meta.lang}

DETECTED_TECH (verified from HTML/headers — always include ALL of these in tech_stack):
${detectedTech.length ? detectedTech.map((t) => `- ${t}`).join("\n") : "(none detected)"}

PAGE TEXT (truncated):
"""
${pageText || "(no text extracted)"}
"""

MY_SERVICES (ONLY allowed values for services_provided — pick 2 to 6):
${catalogDetail || "(none configured)"}

Return JSON with keys:
{
  "title": "concise real project/brand name (2-6 words)",
  "short_description": "one-line factual pitch under 160 chars",
  "description": "3-5 factual paragraphs. Third person. No invented features.",
  "industry": "one precise industry label",
  "country": "full country name or empty string",
  "tech_stack": ["MUST include all DETECTED_TECH entries verbatim; may add more with evidence"],
  "services_provided": ["EXACT titles from MY_SERVICES only"],
  "featured": false
}
Output ONLY JSON.`;

    const ai = await callOllama(system, prompt);

    const title = String(ai.title || ml.meta.title || "").trim();
    // Merge detected + AI tech, filter blocklist, dedupe.
    const mergedTech = filterTech([...detectedTech, ...(Array.isArray(ai.tech_stack) ? ai.tech_stack : [])]).slice(0, 12);

    const result = {
      title,
      slug: slugify(title || new URL(url).hostname.replace(/^www\./, "")),
      short_description: String(ai.short_description || ml.meta.description || "").slice(0, 200),
      description: String(ai.description || ml.meta.description || ""),
      industry: String(ai.industry || ""),
      country: String(ai.country || ""),
      website_url: url,
      thumbnail_url: ml.screenshot || ml.meta.image || "",
      tech_stack: mergedTech,
      services_provided: constrainToCatalog(ai.services_provided, serviceCatalog),
      images: [] as string[],
      featured: Boolean(ai.featured),
      published: true,
      status: "active",
    };

    return new Response(JSON.stringify({ success: true, data: result, meta: ml.meta, detectedTech }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("auto-fill-project error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
