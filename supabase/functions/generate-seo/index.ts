import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { type, id } = await req.json();
    // type can be: "page", "project", "service", "post", "all"

    let contentToOptimize: any[] = [];

    if (type === "all" || type === "page") {
      const { data: pages } = await supabase.from("page_seo").select("*");
      if (pages) contentToOptimize.push(...pages.map((p: any) => ({ ...p, _type: "page_seo" })));
    }
    if (type === "all" || type === "project") {
      const query = id ? supabase.from("projects").select("*").eq("id", id) : supabase.from("projects").select("*");
      const { data: projects } = await query;
      if (projects) contentToOptimize.push(...projects.map((p: any) => ({ ...p, _type: "projects" })));
    }
    if (type === "all" || type === "service") {
      const query = id ? supabase.from("services").select("*").eq("id", id) : supabase.from("services").select("*");
      const { data: services } = await query;
      if (services) contentToOptimize.push(...services.map((s: any) => ({ ...s, _type: "services" })));
    }
    if (type === "all" || type === "post") {
      const query = id ? supabase.from("posts").select("*").eq("id", id) : supabase.from("posts").select("*");
      const { data: posts } = await query;
      if (posts) contentToOptimize.push(...posts.map((p: any) => ({ ...p, _type: "posts" })));
    }

    const { data: profile } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
    const { data: settings } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();

    const results: any[] = [];

    for (const item of contentToOptimize) {
      const itemType = item._type;
      const name = item.title || item.page_name || item.name || "Untitled";
      const description = item.description || item.short_description || item.content || item.seo_description || "";

      const prompt = `Generate SEO metadata for a ${itemType === "page_seo" ? "page" : itemType.slice(0, -1)} called "${name}".
Context: This is for ${profile?.name || "Nauman Ellahi"}'s portfolio website (${settings?.site_name || "Developer Portfolio"}).
Content: ${description.slice(0, 500)}

Return a JSON object with:
- seo_title: Under 60 chars, include main keyword and brand
- seo_description: Under 160 chars, compelling and action-oriented
- seo_keywords: Array of 5-8 relevant keywords

Only return valid JSON, no markdown.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are an SEO expert. Return only valid JSON objects." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!aiResponse.ok) {
        console.error(`AI error for ${name}:`, aiResponse.status);
        continue;
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content || "";
      
      try {
        const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
        const seoData = JSON.parse(cleaned);

        // Update the record
        if (itemType === "page_seo") {
          await supabase.from("page_seo").update({
            seo_title: seoData.seo_title,
            seo_description: seoData.seo_description,
            seo_keywords: seoData.seo_keywords,
          }).eq("id", item.id);
        } else {
          // Projects, services, posts all have seo_title, seo_description, seo_keywords
          // But services don't have seo fields - we'll skip or handle
          if (itemType === "posts") {
            await supabase.from("posts").update({
              seo_title: seoData.seo_title,
              seo_description: seoData.seo_description,
              seo_keywords: seoData.seo_keywords,
            }).eq("id", item.id);
          }
          // For page_seo entries related to projects/services, update or create
        }

        results.push({ id: item.id, type: itemType, name, ...seoData });
      } catch (parseErr) {
        console.error(`Parse error for ${name}:`, parseErr, content);
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-seo error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
