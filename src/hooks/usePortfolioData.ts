import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Profile data
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

// Site settings
export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

// Projects
export function useProjects(options?: { featured?: boolean; limit?: number }) {
  return useQuery({
    queryKey: ["projects", options],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      
      if (options?.featured) {
        query = query.eq("featured", true);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Services
export function useServices(options?: { limit?: number }) {
  return useQuery({
    queryKey: ["services", options],
    queryFn: async () => {
      let query = supabase
        .from("services")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Experiences
export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// Skills
export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

// Testimonials
export function useTestimonials(options?: { limit?: number }) {
  return useQuery({
    queryKey: ["testimonials", options],
    queryFn: async () => {
      let query = supabase
        .from("testimonials")
        .select("*")
        .eq("published", true)
        .order("display_order", { ascending: true });
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Blog posts
export function usePosts(options?: { limit?: number }) {
  return useQuery({
    queryKey: ["posts", options],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

// Page SEO
export function usePageSeo(pageSlug: string) {
  return useQuery({
    queryKey: ["page-seo", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_seo")
        .select("*")
        .eq("page_slug", pageSlug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}