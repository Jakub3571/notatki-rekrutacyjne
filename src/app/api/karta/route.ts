import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { PROMPT_SYSTEM } from "@/lib/prompt";
import { LIMIT_GENEROWAN } from "@/lib/limit";
import type { KartaKandydata } from "@/lib/types";

function wyciagnijJson(tekst: string): KartaKandydata {
  const oczyszczony = tekst.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = oczyszczony.indexOf("{");
  const koniec = oczyszczony.lastIndexOf("}");
  return JSON.parse(oczyszczony.slice(start, koniec + 1));
}

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { blad: "Brak klucza ANTHROPIC_API_KEY — uzupełnij .env.local i zrestartuj serwer (Ctrl+C, npm run dev)" },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ blad: "Nie jesteś zalogowany" }, { status: 401 });
    }

    const { data: limitRow } = await supabase
      .from("limity")
      .select("liczba_generacji")
      .eq("user_id", user.id)
      .maybeSingle();
    const zuzyte = limitRow?.liczba_generacji ?? 0;
    if (zuzyte >= LIMIT_GENEROWAN) {
      return NextResponse.json(
        { blad: `Osiągnięto limit ${LIMIT_GENEROWAN} generowań. Skontaktuj się z administratorem, aby go podnieść.` },
        { status: 429 }
      );
    }

    const { transkrypcja } = await request.json();
    if (typeof transkrypcja !== "string" || transkrypcja.trim().length < 50) {
      return NextResponse.json(
        { blad: "Transkrypcja jest za krótka (minimum 50 znaków)" },
        { status: 400 }
      );
    }

    await supabase
      .from("limity")
      .upsert(
        { user_id: user.id, liczba_generacji: zuzyte + 1, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
    const anthropic = new Anthropic();
    const odpowiedz = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: PROMPT_SYSTEM,
      messages: [
        { role: "user", content: `Transkrypcja rozmowy rekrutacyjnej:\n\n${transkrypcja}` },
      ],
    });

    const blok = odpowiedz.content[0];
    if (blok.type !== "text") {
      return NextResponse.json({ blad: "AI zwróciło nieoczekiwany format" }, { status: 500 });
    }

    const karta = wyciagnijJson(blok.text);
    return NextResponse.json({ karta, pozostalo: Math.max(0, LIMIT_GENEROWAN - zuzyte - 1) });
  } catch (e) {
    const komunikat = e instanceof Error ? e.message : "Nieznany błąd";
    return NextResponse.json({ blad: `Błąd podczas generowania: ${komunikat}` }, { status: 500 });
  }
}