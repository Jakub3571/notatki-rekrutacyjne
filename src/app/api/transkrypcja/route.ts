import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function etykietaMowcy(speaker: number | null): string {
  return speaker === 0 ? "REKRUTER" : "KANDYDAT";
}

export async function POST(request: Request) {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json(
        { blad: "Brak klucza DEEPGRAM_API_KEY — uzupełnij .env.local i zrestartuj serwer" },
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

    const formData = await request.formData();
    const plik = formData.get("plik");
    if (!(plik instanceof File)) {
      return NextResponse.json({ blad: "Nie przesłano pliku audio" }, { status: 400 });
    }
    if (plik.size > 100 * 1024 * 1024) {
      return NextResponse.json({ blad: "Plik za duży (maksymalnie 100 MB)" }, { status: 400 });
    }

    const bufor = Buffer.from(await plik.arrayBuffer());
    const contentType = plik.type || "audio/mpeg";

    const odpowiedz = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-3&language=pl&diarize=true&smart_format=true&punctuate=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          "Content-Type": contentType,
        },
        body: bufor,
      }
    );

    if (!odpowiedz.ok) {
      const t = await odpowiedz.text();
      return NextResponse.json(
        { blad: `Błąd Deepgram (HTTP ${odpowiedz.status}): ${t.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const dane = await odpowiedz.json();
    const slowa: { word: string; speaker?: number }[] =
      dane?.results?.channels?.[0]?.alternatives?.[0]?.words ?? [];
    if (slowa.length === 0) {
      return NextResponse.json({ blad: "Nie udało się rozpoznać mowy w nagraniu" }, { status: 422 });
    }

    const linie: string[] = [];
    let aktualnyMowca: number | null = null;
    let buforTekstu = "";
    for (const s of slowa) {
      const mowca = s.speaker ?? 0;
      if (mowca !== aktualnyMowca) {
        if (buforTekstu.trim()) linie.push(`${etykietaMowcy(aktualnyMowca)}: ${buforTekstu.trim()}`);
        aktualnyMowca = mowca;
        buforTekstu = "";
      }
      buforTekstu += s.word + " ";
    }
    if (buforTekstu.trim()) linie.push(`${etykietaMowcy(aktualnyMowca)}: ${buforTekstu.trim()}`);

    return NextResponse.json({ transkrypcja: linie.join("\n") });
  } catch (e) {
    const komunikat = e instanceof Error ? e.message : "Nieznany błąd";
    return NextResponse.json({ blad: `Błąd transkrypcji: ${komunikat}` }, { status: 500 });
  }
}