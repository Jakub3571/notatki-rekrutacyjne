import Link from "next/link";

export const metadata = { title: "Polityka prywatności — AI Notatki Rekrutacyjne" };

export default function PolitykaPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Polityka prywatności</h1>

      <section className="space-y-2">
        <h2 className="font-semibold">1. Administrator</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Administratorem danych osobowych jest Jakub Ciszewski, e-mail: jakub98.cisz@gmail.com.
          Nie wyznaczono inspektora ochrony danych.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">2. Jakie dane zbieramy</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>adres e-mail i nazwa konta Google (logowanie OAuth),</li>
          <li>dane kandydata i treść karty wprowadzone przez rekrutera,</li>
          <li>transkrypcja rozmowy rekrutacyjnej (tylko za zgodą kandydata),</li>
          <li>ciasteczko sesji logowania (niezbędne do działania aplikacji).</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">3. Cel i podstawa prawna</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Świadczenie usługi tworzenia notatek rekrutacyjnych (art. 6 ust. 1 lit. b RODO) oraz prawnie uzasadniony
          interes rekrutera w prowadzeniu procesu rekrutacji (art. 6 ust. 1 lit. f RODO).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold\">4. Okres przechowywania</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Karty kandydatów: automatycznie 30 dni od utworzenia. Sesja logowania: do wylogowania.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold\">5. Lokalizacja i odbiorcy</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Baza danych: Supabase, region UE (Irlandia). Hosting aplikacji: Vercel. Dane nie opuszczają UE w związku
          z przechowywaniem.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold\">6. Twoje prawa</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Dostęp, sprostowanie, usunięcie („prawo do bycia zapomnianym”), ograniczenie, przenoszenie, sprzeciw,
          skarga do Prezesa UODO. Kontakt: jakub98.cisz@gmail.com.
        </p>
      </section>

      <p className="text-sm">
        <Link href="/" className="underline">← Wróć do aplikacji</Link>
      </p>
    </main>
  );
}