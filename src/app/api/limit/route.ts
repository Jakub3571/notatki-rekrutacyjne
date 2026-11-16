import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { LIMIT_GENEROWAN } from "@/lib/limit";
import { czyEmailDozwolony } from "@/lib/dostep";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ blad: "Nie jesteś zalogowany" }, { status: 401 });
  }
  if (!(await czyEmailDozwolony(supabase, user.email))) {
    return NextResponse.json({ blad: "Ten adres e-mail nie ma dostępu do aplikacji." }, { status: 403 });
  }

  const { data } = await supabase
    .from("limity")
    .select("liczba_generacji")
    .eq("user_id", user.id)
    .maybeSingle();
  const zuzyte = data?.liczba_generacji ?? 0;
  return NextResponse.json({
    limit: LIMIT_GENEROWAN,
    zuzyte,
    pozostalo: Math.max(0, LIMIT_GENEROWAN - zuzyte),
  });
}