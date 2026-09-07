import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getOpportunities() {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .order("opportunity_score", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch opportunities:",
      error,
    );

    throw new Error(
      "Failed to fetch opportunities.",
    );
  }

  return data ?? [];
}

export async function getOpportunityById(
  id: string,
) {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch opportunity:",
      error,
    );

    throw new Error(
      "Failed to fetch opportunity.",
    );
  }

  return data;
}

export async function createOpportunity(
  opportunity: Record<string, unknown>,
) {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("opportunities")
    .insert(opportunity)
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to create opportunity:",
      error,
    );

    throw new Error(
      "Failed to create opportunity.",
    );
  }

  return data;
}

export async function getInsights() {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .order("pain_intensity", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch insights:",
      error,
    );

    throw new Error(
      "Failed to fetch insights.",
    );
  }

  return data ?? [];
}

export async function getSignals() {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch signals:",
      error,
    );

    throw new Error(
      "Failed to fetch signals.",
    );
  }

  return data ?? [];
}