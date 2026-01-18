import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Create admin user
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: "naumancheema643@gmail.com",
      password: "N1auman2@@@8",
      email_confirm: true,
    });

    if (userError && !userError.message.includes("already been registered")) {
      throw userError;
    }

    // Get user ID - either from new user or find existing
    let userId = user?.user?.id;
    
    if (!userId) {
      // User might already exist, find them
      const { data: users } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = users?.users?.find(u => u.email === "naumancheema643@gmail.com");
      userId = existingUser?.id;
    }

    if (userId) {
      // Assign admin role
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

      if (roleError) throw roleError;
    }

    return new Response(JSON.stringify({ success: true, message: "Admin user created" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});