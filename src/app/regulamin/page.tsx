import Link from "next/link";

export const metadata = { title: "Regulamin — AI Notatki Rekrutacyjne" };

export default function RegulaminPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Regulamin aplikacji AI Notatki Rekrutacyjne</h1>

      <section className="space-y-2">
        <h2 className="font-semibold">1. Administrator danych</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Administratorem danych osobowych jest: Jakub Ciszewski, e-mail: jakub98.cisz@gmail.com.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">2. Cel i zakres</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Aplikacja służy rekruterom do tworzenia ustrukturyzowanych notatek (kart kandydatów) z rozmów
          rekrutacyjnych. Przetwarzane są: adres e-mail użytkownika (z logowania Google), dane kandydata
          wpisane przez rekrutera oraz transkrypcja rozmowy.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">3. Podstawa prawna</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Dane użytkownika: art. 6 ust. 1 lit. b RODO (umowa — świadczenie usługi). Dane kandydatów: art. 6 ust. 1
          lit. f RODO (prawnie uzasadniony interes rekrutera prowadzącego proces rekrutacji). Nagrywanie rozmowy
          wymaga zgody kandydata (art. 267 Kodeksu karnego) — rekruter potwierdza ją zaznaczając checkbox w aplikacji.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">4. Rola AI</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          AI generuje wyłącznie szkic notatki. Rekruter każdorazowo zatwierdza i może edytować treść przed użyciem.
          Aplikacja nigdy nie wysyła danych automatycznie do systemów zewnętrznych (ATS).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold\">5. Okres przechowywania</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Karty kandydatów są automatycznie usuwane po 30 dniach od utworzenia. Użytkownik może usunąć kartę
          w każdej chwili ręcznie.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold\">6. Odbiorcy danych i lokalizacja</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Dane przechowywane są w Unii Europejskiej (Supabase — Irlandia). Aplikacja działa na infrastrukturze
          Vercel. Nie stosujemy podmiotów trzecich do marketingu.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">7. Twoje prawa</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia,
          sprzeciwu oraz wniesienia skargi do Prezesa UODO (uodo.gov.pl).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold\">8. Kontakt</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">W sprawach danych osobowych: jakub98.cisz@gmail.com.</p>
      </section>

      <p className="text-sm">
        <Link href="/" className="underline">← Wróć do aplikacji</Link>
      </p>
    </main>
  );
}