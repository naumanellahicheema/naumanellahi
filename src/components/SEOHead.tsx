import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/usePortfolioData";

const OG_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/og-image`;

type RouteMeta = { slug: string; eyebrow: string; title: string; description: string };

const STATIC_ROUTES: Record<string, RouteMeta> = {
  "/": {
    slug: "home",
    eyebrow: "Portfolio",
    title: "Nauman Ellahi — WordPress & Frontend Developer",
    description:
      "Senior WordPress & frontend developer building fast, conversion-focused websites for international clients.",
  },
  "/about": {
    slug: "about",
    eyebrow: "About",
    title: "About Nauman Ellahi",
    description:
      "The story, the craft and the process behind years of shipping WordPress and React websites that perform.",
  },
  "/portfolio": {
    slug: "portfolio",
    eyebrow: "Selected Work",
    title: "Portfolio — Websites That Convert",
    description:
      "A curated archive of WordPress, React and custom frontend builds delivered for clients worldwide.",
  },
  "/services": {
    slug: "services",
    eyebrow: "Services",
    title: "Services — Design, Build, Optimise",
    description:
      "WordPress development, frontend engineering, speed optimisation and ongoing care for growing brands.",
  },
  "/experience": {
    slug: "experience",
    eyebrow: "Experience",
    title: "Experience & Skills",
    description:
      "Roles, milestones and the technical stack behind years of professional web development work.",
  },
  "/testimonials": {
    slug: "testimonials",
    eyebrow: "Client Words",
    title: "Testimonials — What Clients Say",
    description:
      "Real feedback from founders and teams who trusted me with their websites and digital products.",
  },
  "/blog": {
    slug: "blog",
    eyebrow: "Journal",
    title: "Blog — Notes on Web Development",
    description:
      "Practical writing on WordPress, React, performance and building websites that earn their keep.",
  },
  "/contact": {
    slug: "contact",
    eyebrow: "Get in Touch",
    title: "Contact — Let's Build Something",
    description:
      "Tell me about your project and get a clear, honest reply with scope, timeline and next steps.",
  },
};

function useDynamicEntry(pathname: string) {
  const projectSlug = pathname.startsWith("/portfolio/") ? pathname.split("/")[2] : null;
  const postSlug = pathname.startsWith("/blog/") ? pathname.split("/")[2] : null;

  const project = useQuery({
    queryKey: ["seo-project", projectSlug],
    enabled: !!projectSlug,
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("title, short_description, description, thumbnail_url, industry")
        .eq("slug", projectSlug!)
        .maybeSingle();
      return data;
    },
  });

  const post = useQuery({
    queryKey: ["seo-post", postSlug],
    enabled: !!postSlug,
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("title, excerpt, seo_title, seo_description, cover_image")
        .eq("slug", postSlug!)
        .maybeSingle();
      return data;
    },
  });

  if (projectSlug && project.data) {
    return {
      eyebrow: project.data.industry || "Case Study",
      title: project.data.title,
      description: project.data.short_description || project.data.description || "",
      image: project.data.thumbnail_url || null,
      type: "article",
    };
  }
  if (postSlug && post.data) {
    return {
      eyebrow: "Journal",
      title: post.data.seo_title || post.data.title,
      description: post.data.seo_description || post.data.excerpt || "",
      image: post.data.cover_image || null,
      type: "article",
    };
  }
  return null;
}

export function SEOHead() {
  const { pathname } = useLocation();
  const { data: settings } = useSiteSettings();

  const route = STATIC_ROUTES[pathname];
  const { data: pageSeo } = useQuery({
    queryKey: ["seo-page", route?.slug],
    enabled: !!route,
    queryFn: async () => {
      const { data } = await supabase
        .from("page_seo")
        .select("seo_title, seo_description, seo_keywords, og_image")
        .eq("page_slug", route!.slug)
        .maybeSingle();
      return data;
    },
  });

  const dynamic = useDynamicEntry(pathname);

  // Resolve the live origin at runtime so every domain (preview, lovable.app,
  // or any custom domain) advertises itself — nothing is hardcoded.
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const siteName = settings?.site_name || "Nauman Ellahi";

  const meta = useMemo(() => {
    const title =
      dynamic?.title || pageSeo?.seo_title || route?.title || settings?.meta_title || siteName;
    const description =
      dynamic?.description ||
      pageSeo?.seo_description ||
      route?.description ||
      settings?.meta_description ||
      "";
    const eyebrow = dynamic?.eyebrow || route?.eyebrow || "Portfolio";
    const keywords = (pageSeo?.seo_keywords || []).join(", ");
    const explicitImage = dynamic?.image || pageSeo?.og_image || null;

    const generated = `${OG_ENDPOINT}?title=${encodeURIComponent(
      title,
    )}&description=${encodeURIComponent(description)}&eyebrow=${encodeURIComponent(
      eyebrow,
    )}&site=${encodeURIComponent(siteName)}`;

    return {
      title,
      description,
      keywords,
      image: explicitImage || generated,
      type: dynamic?.type || "website",
    };
  }, [dynamic, pageSeo, route, settings, siteName]);

  const canonical = origin ? `${origin}${pathname}` : pathname;

  return (
    <Helmet prioritizeSeoTags>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />
    </Helmet>
  );
}

export default SEOHead;
