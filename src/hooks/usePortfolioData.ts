import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// Real-time subscription hook
export function useRealtimeSubscription(table: string, queryKey: (string | object | undefined)[]) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes-${JSON.stringify(queryKey)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        queryClient.invalidateQueries({ queryKey });
      })
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, [table, queryClient, JSON.stringify(queryKey)]);
}

// Profile
export function useProfile() {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("profiles", ["profile"]);
  return query;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: any) => {
      const { data: existing } = await supabase.from("profiles").select("id").limit(1).maybeSingle();
      if (existing) {
        const { error } = await supabase.from("profiles").update(updates).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("profiles").insert(updates);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
}

// Site Settings
export function useSiteSettings() {
  const query = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("site_settings", ["site-settings"]);
  return query;
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: any) => {
      const { data: existing } = await supabase.from("site_settings").select("id").limit(1).maybeSingle();
      if (existing) {
        const { error } = await supabase.from("site_settings").update(updates).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert(updates);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["site-settings"] }),
  });
}

// Projects
export function useProjects(options?: { featured?: boolean; limit?: number }) {
  const query = useQuery({
    queryKey: ["projects", options?.featured, options?.limit],
    queryFn: async () => {
      let q = supabase.from("projects").select("*").eq("published", true).order("display_order", { ascending: true });
      if (options?.featured) q = q.eq("featured", true);
      if (options?.limit) q = q.limit(options.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("projects", ["projects", options?.featured?.toString(), options?.limit?.toString()]);
  return query;
}

export function useAllProjects() {
  const query = useQuery({
    queryKey: ["all-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("projects", ["all-projects"]);
  return query;
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: any) => {
      const { error } = await supabase.from("projects").insert(project);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-projects"] }),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from("projects").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-projects"] }),
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-projects"] }),
  });
}

// Services
export function useServices(options?: { limit?: number }) {
  const query = useQuery({
    queryKey: ["services", options?.limit],
    queryFn: async () => {
      let q = supabase.from("services").select("*").eq("published", true).order("display_order", { ascending: true });
      if (options?.limit) q = q.limit(options.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("services", ["services", options?.limit?.toString()]);
  return query;
}

export function useAllServices() {
  const query = useQuery({
    queryKey: ["all-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("services", ["all-services"]);
  return query;
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (service: any) => {
      const { error } = await supabase.from("services").insert(service);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-services"] }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from("services").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-services"] }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-services"] }),
  });
}

// Experiences
export function useExperiences() {
  const query = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experiences").select("*").eq("published", true).order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("experiences", ["experiences"]);
  return query;
}

export function useAllExperiences() {
  const query = useQuery({
    queryKey: ["all-experiences"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experiences").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("experiences", ["all-experiences"]);
  return query;
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exp: any) => {
      const { error } = await supabase.from("experiences").insert(exp);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-experiences"] }),
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from("experiences").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-experiences"] }),
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-experiences"] }),
  });
}

// Skills
export function useSkills() {
  const query = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").eq("published", true).order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("skills", ["skills"]);
  return query;
}

export function useAllSkills() {
  const query = useQuery({
    queryKey: ["all-skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("skills", ["all-skills"]);
  return query;
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (skill: any) => {
      const { error } = await supabase.from("skills").insert(skill);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-skills"] }),
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from("skills").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-skills"] }),
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-skills"] }),
  });
}

// Testimonials
export function useTestimonials(options?: { limit?: number }) {
  const query = useQuery({
    queryKey: ["testimonials", options?.limit],
    queryFn: async () => {
      let q = supabase.from("testimonials").select("*").eq("published", true).order("display_order", { ascending: true });
      if (options?.limit) q = q.limit(options.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("testimonials", ["testimonials", options?.limit?.toString()]);
  return query;
}

export function useAllTestimonials() {
  const query = useQuery({
    queryKey: ["all-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("testimonials", ["all-testimonials"]);
  return query;
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (t: any) => {
      const { error } = await supabase.from("testimonials").insert(t);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-testimonials"] }),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from("testimonials").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-testimonials"] }),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-testimonials"] }),
  });
}

// Posts
export function usePosts(options?: { limit?: number }) {
  const query = useQuery({
    queryKey: ["posts", options?.limit],
    queryFn: async () => {
      let q = supabase.from("posts").select("*").eq("published", true).order("published_at", { ascending: false });
      if (options?.limit) q = q.limit(options.limit);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("posts", ["posts", options?.limit?.toString()]);
  return query;
}

export function useAllPosts() {
  const query = useQuery({
    queryKey: ["all-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("posts", ["all-posts"]);
  return query;
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: any) => {
      const { error } = await supabase.from("posts").insert(post);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-posts"] }),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from("posts").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-posts"] }),
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-posts"] }),
  });
}

// Contact Messages
export function useContactMessages() {
  const query = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("received_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("contact_messages", ["contact-messages"]);
  return query;
}

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: async (message: { name: string; email: string; subject?: string; message: string }) => {
      const { error } = await supabase.from("contact_messages").insert(message);
      if (error) throw error;
    },
  });
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from("contact_messages").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact-messages"] }),
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact-messages"] }),
  });
}

// Page SEO
export function usePageSeo(pageSlug: string) {
  return useQuery({
    queryKey: ["page-seo", pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase.from("page_seo").select("*").eq("page_slug", pageSlug).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useAllPageSeo() {
  const query = useQuery({
    queryKey: ["all-page-seo"],
    queryFn: async () => {
      const { data, error } = await supabase.from("page_seo").select("*").order("page_name", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("page_seo", ["all-page-seo"]);
  return query;
}

export function useUpdatePageSeo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { error } = await supabase.from("page_seo").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-page-seo"] }),
  });
}

// Media Library
export function useMediaLibrary() {
  const query = useQuery({
    queryKey: ["media-library"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  useRealtimeSubscription("media_library", ["media-library"]);
  return query;
}

export function useCreateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (media: any) => {
      const { error } = await supabase.from("media_library").insert(media);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media-library"] }),
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("media_library").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["media-library"] }),
  });
}