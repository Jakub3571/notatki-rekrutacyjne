import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { PROMPT_SYSTEM } from "@/lib/prompt";
import type { KartaKandydata } from "@/lib/types";

function wyciagnijJson(tekst: string): KartaKandydata {
  const oczyszczony = tekst.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = oczyszczony.indexOf("{");
  const koniec = oczyszczony.lastIndexOf("}");
  return JSON.parse(oczyszczony.slice(start, koniec + 1));
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { blad: "Brak klucza ANTHROPIC_API_KEY — uzupełnij plik .env.local" },
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

  const { transkrypcja } = await request.json();
  if (typeof transkrypcja !== "string" || transkrypcja.trim().length < 50) {
    return NextResponse.json(
      { blad: "Transkrypcja jest za krótka (minimum 50 znaków)" },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic();
  const odpowiedz = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
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

  try {
    const karta = wyciagnijJson(blok.text);
    return NextResponse.json({ karta });
  } catch {
    return NextResponse.json({ blad: "Nie udało się odczytać odpowiedzi AI" }, { status: 500 });
  }
}