import type { SupabaseClient } from "@supabase/supabase-js";

export async function czyEmailDozwolony(
  supabase: SupabaseClient,
  email: string | undefined | null
): Promise<boolean> {
  if (!email) return false;
  const { data } = await supabase
    .from("dozwolone")
    .select("email")
    .eq("email", email)
    .eq("aktywny", true)
    .maybeSingle();
  return !!data;
}