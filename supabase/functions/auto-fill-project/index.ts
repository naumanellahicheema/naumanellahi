import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const OLLAMA_URL = "https://ollama.com/api/chat";
const MODEL = Deno.env.get("OLLAMA_MODEL") || "gpt-oss:120b";
const OLLAMA_KEY = Deno.env.get("OLLAMA_API_KEY");

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

// Constrain a list to the allowed catalog (case-insensitive, keeps canonical casing).
function constrainToCatalog(list: unknown, catalog: string[]): string[] {
  if (!Array.isArray(list) || catalog.length === 0) return [];
  const map = new Map(catalog.map((c) => [c.toLowerCase().trim(), c]));
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of list) {
    const key = String(raw || "").toLowerCase().trim();
    if (!key) continue;
    const canonical = map.get(key);
    if (canonical && !seen.has(canonical)) {
      out.push(canonical);
      seen.add(canonical);
    }
  }
  return out.slice(0, 8);
}

async function fetchMicrolink(url: string) {
  // Long wait + scroll script so hero video/image + lazy backgrounds finish loading.
  const scrollScript = `async () => {
    await new Promise(r => setTimeout(r, 800));
    window.scrollTo(0, 200);
    await new Promise(r => setTimeout(r, 400));
    window.scrollTo(0, 0);
    // Force any <video> in hero to play so first frame paints
    document.querySelectorAll('video').forEach(v => { try { v.muted = true; v.play().catch(()=>{}); } catch(_) {} });
    // Wait for background images / videos
    await new Promise(r => setTimeout(r, 4500));
  }`;
  const params = new URLSearchParams({
    url,
    screenshot: "true",
    meta: "true",
    palette: "false",
    audio: "false",
    video: "false",
    "viewport.width": "1440",
    "viewport.height": "900",
    "viewport.deviceScaleFactor": "2",
    "screenshot.type": "jpeg",
    "screenshot.fullPage": "false",
    "screenshot.overlay.browser": "false",
    "screenshot.waitFor": "3000",
    waitUntil: "networkidle0",
    waitFor: "8000",
    device: "macbook pro 15",
    scripts: scrollScript,
  });
  const api = `https://api.microlink.io/?${params.toString()}`;
  const r = await fetch(api);
  const j = await r.json().catch(() => ({}));
  if (j?.status !== "success") return { screenshot: null, meta: {} };
  const d = j.data || {};
  return {
    screenshot: d.screenshot?.url || null,
    meta: {
      title: d.title || "",
      description: d.description || "",
      publisher: d.publisher || "",
      logo: d.logo?.url || "",
      image: d.image?.url || "",
      lang: d.lang || "",
      author: d.author || "",
    },
  };
}

async function fetchPageText(url: string): Promise<string> {
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
    });
    const html = await r.text();
    return stripHtml(html).slice(0, 18000);
  } catch (_) {
    return "";
  }
}

async function callOllama(system: string, user: string): Promise<any> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OLLAMA_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      format: "json",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      options: { temperature: 0.15 },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Ollama ${res.status}: ${t.slice(0, 300)}`);
  }
  const j = await res.json();
  const content = j?.message?.content || "{}";
  try {
    return JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : {};
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!OLLAMA_KEY) {
      return new Response(JSON.stringify({ error: "OLLAMA_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;
    const { data: isAdminData } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdminData) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load MY services catalog — services_provided must come only from this list.
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: svcRows } = await admin
      .from("services")
      .select("title, category, short_description")
      .eq("published", true);
    const serviceCatalog: string[] = (svcRows || [])
      .map((s: any) => String(s.title || "").trim())
      .filter(Boolean);
    const catalogDetail = (svcRows || [])
      .map((s: any) => `- ${s.title}${s.category ? ` [${s.category}]` : ""}${s.short_description ? `: ${s.short_description}` : ""}`)
      .join("\n");

    const body = await req.json().catch(() => ({}));
    const mode: "scrape" | "refine" = body?.mode === "refine" ? "refine" : "scrape";

    // ------- REFINE MODE -------
    if (mode === "refine") {
      const current = body?.current || {};
      const instructions: string = String(body?.instructions || "").trim();
      if (!instructions) {
        return new Response(JSON.stringify({ error: "Missing 'instructions'" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const system =
        "You are an expert portfolio editor. You receive the CURRENT project fields as JSON, a user's natural-language instructions, and a fixed catalog of MY OWN services. Apply every requested change, fix grammar/spelling/casing/formatting, and return the FULL updated JSON with the same keys. HARD RULE: `services_provided` MUST contain only exact strings from the provided MY_SERVICES list (never invent new ones, never copy services from the client's website). Return ONLY valid JSON.";
      const user = `MY_SERVICES (the ONLY allowed values for services_provided):
${catalogDetail || "(none configured — leave services_provided as an empty array)"}

CURRENT FIELDS:
${JSON.stringify(current, null, 2)}

USER INSTRUCTIONS:
"""
${instructions}
"""

Return the SAME JSON object with all edits applied. Keys: title, slug, short_description, description, industry, country, website_url, thumbnail_url, tech_stack (array of real technologies detected/known), services_provided (array — ONLY from MY_SERVICES exact titles), featured (boolean), published (boolean), status.`;
      const ai = await callOllama(system, user);
      const merged = {
        ...current,
        ...ai,
        tech_stack: Array.isArray(ai.tech_stack) ? ai.tech_stack.slice(0, 12).map(String) : current.tech_stack || [],
        services_provided: constrainToCatalog(ai.services_provided, serviceCatalog),
        featured: typeof ai.featured === "boolean" ? ai.featured : Boolean(current.featured),
        published: typeof ai.published === "boolean" ? ai.published : current.published !== false,
      };
      return new Response(JSON.stringify({ success: true, data: merged }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ------- SCRAPE MODE -------
    let url: string = (body?.url || "").trim();
    if (!url) {
      return new Response(JSON.stringify({ error: "Missing 'url'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const [ml, pageText] = await Promise.all([fetchMicrolink(url), fetchPageText(url)]);

    const system =
      "You are an expert web analyst. You extract STRICTLY factual portfolio data from real scraped website text and metadata. Never invent facts. Never guess technologies you cannot see evidence of. For `services_provided`, you MUST pick only from the provided MY_SERVICES catalog — these are the services the PORTFOLIO OWNER offers, not services listed on the analyzed website. If a MY_SERVICE clearly applies to the delivered project, include it; if none apply, return an empty array. Return ONLY valid JSON.";
    const prompt = `Analyze this website and extract portfolio project details.

URL: ${url}
META TITLE: ${ml.meta.title}
META DESCRIPTION: ${ml.meta.description}
PUBLISHER: ${ml.meta.publisher}
LANG: ${ml.meta.lang}

PAGE TEXT (scraped, truncated):
"""
${pageText || "(no text extracted)"}
"""

MY_SERVICES (the ONLY allowed values for services_provided — pick 2 to 6 that clearly apply to this project):
${catalogDetail || "(none configured — return services_provided as [])"}

Return a JSON object with EXACTLY these keys:
{
  "title": "concise real project/brand name from the site (2-6 words)",
  "short_description": "one-line factual pitch under 160 chars, based on the site text",
  "description": "3-5 factual paragraphs describing what the site/product actually does, its audience, and notable REAL features visible in the page text. Third person. No invented features.",
  "industry": "one precise industry label based on evidence — e.g. E-commerce, SaaS, Healthcare, Real Estate, Education, Finance, Marketing Agency, Portfolio, Media, Restaurant, Fitness, Travel, Non-profit",
  "country": "best-guess country of the business (full name) from address/phone/language clues, or empty string",
  "tech_stack": ["3 to 8 technologies with clear evidence in the HTML/text (frameworks, CMS, analytics, hosting, payment, fonts). No guesses."],
  "services_provided": ["EXACT titles copied from MY_SERVICES only — never invent"],
  "featured": false
}
Output ONLY JSON.`;

    const ai = await callOllama(system, prompt);

    const title = String(ai.title || ml.meta.title || "").trim();
    const result = {
      title,
      slug: slugify(title || new URL(url).hostname.replace(/^www\./, "")),
      short_description: String(ai.short_description || ml.meta.description || "").slice(0, 200),
      description: String(ai.description || ml.meta.description || ""),
      industry: String(ai.industry || ""),
      country: String(ai.country || ""),
      website_url: url,
      thumbnail_url: ml.screenshot || ml.meta.image || "",
      tech_stack: Array.isArray(ai.tech_stack) ? ai.tech_stack.slice(0, 12).map(String) : [],
      services_provided: constrainToCatalog(ai.services_provided, serviceCatalog),
      images: [] as string[],
      featured: Boolean(ai.featured),
      published: true,
      status: "active",
    };

    return new Response(JSON.stringify({ success: true, data: result, meta: ml.meta }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("auto-fill-project error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
