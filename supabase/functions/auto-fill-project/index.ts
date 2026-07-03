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

async function fetchMicrolink(url: string) {
  // waitUntil=networkidle + waitFor delay ensures hero video/image loads before capture.
  // viewport matches a standard desktop; clip to top 900px = header + hero only.
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
    waitUntil: "networkidle0",
    waitFor: "4500",
    device: "macbook pro 15",
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
    return stripHtml(html).slice(0, 15000);
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
      options: { temperature: 0.3 },
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

    const body = await req.json().catch(() => ({}));
    const mode: "scrape" | "refine" = body?.mode === "refine" ? "refine" : "scrape";

    // ------- REFINE MODE: user gives instructions, AI edits current fields -------
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
        "You are an expert portfolio editor. You receive the CURRENT project fields as JSON and a user's natural-language instructions (may include grammar/spelling fixes, tone changes, factual corrections, additions). Return the FULL updated JSON with the same keys, applying every requested change and fixing any obvious grammar/spelling/casing/formatting errors. Preserve keys and types. Return ONLY valid JSON.";
      const user = `CURRENT FIELDS:
${JSON.stringify(current, null, 2)}

USER INSTRUCTIONS:
"""
${instructions}
"""

Return the SAME JSON object with all requested edits applied. Keys to preserve:
title, slug, short_description, description, industry, country, website_url, thumbnail_url, tech_stack (array), services_provided (array), featured (boolean), published (boolean), status.`;
      const ai = await callOllama(system, user);
      const merged = {
        ...current,
        ...ai,
        tech_stack: Array.isArray(ai.tech_stack) ? ai.tech_stack.slice(0, 12).map(String) : current.tech_stack || [],
        services_provided: Array.isArray(ai.services_provided) ? ai.services_provided.slice(0, 10).map(String) : current.services_provided || [],
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
      "You are an expert web analyst. Given a website's scraped text and metadata, produce a strict JSON object describing the project for a portfolio. Return ONLY valid JSON — no prose, no markdown.";
    const prompt = `Analyze this website and extract portfolio project details.

URL: ${url}
META TITLE: ${ml.meta.title}
META DESCRIPTION: ${ml.meta.description}
PUBLISHER: ${ml.meta.publisher}
LANG: ${ml.meta.lang}

PAGE TEXT (truncated):
"""
${pageText || "(no text extracted)"}
"""

Return a JSON object with EXACTLY these keys:
{
  "title": "concise project/brand name (2-6 words)",
  "short_description": "one-line pitch under 160 chars",
  "description": "3-5 paragraph rich description of what the site/product does, its audience, and notable features. Written in third person.",
  "industry": "single industry label e.g. E-commerce, SaaS, Healthcare, Real Estate, Education, Finance, Agency, Portfolio, Media",
  "country": "best-guess country of the business (full name) or empty string",
  "tech_stack": ["3 to 8 detected technologies"],
  "services_provided": ["3 to 6 likely services"],
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
      services_provided: Array.isArray(ai.services_provided) ? ai.services_provided.slice(0, 10).map(String) : [],
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
