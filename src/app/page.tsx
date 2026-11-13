"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KartaKandydataView } from "@/components/karta-kandydata";
import { przykladowaKarta } from "@/lib/przykladowa-karta";
import { createClient } from "@/lib/supabase/client";
import type { Decyzja, KartaKandydata } from "@/lib/types";

export default function StronaGlowna() {
  const [karta, setKarta] = useState<KartaKandydata | null>(null);
  const [stanowisko, setStanowisko] = useState("");
  const [kandydat, setKandydat] = useState("");
  const [transkrypcja, setTranskrypcja] = useState("");
  const [laduje, setLaduje] = useState(false);
  const [blad, setBlad] = useState("");
  const [zgoda, setZgoda] = useState(false);
  const router = useRouter();

  async function generujKarte(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLaduje(true);
    setBlad("");
    try {
      const odpowiedz = await fetch("/api/karta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transkrypcja }),
      });
      const tekst = await odpowiedz.text();
      let dane: { karta?: KartaKandydata; blad?: string } = {};
      try {
        dane = tekst ? JSON.parse(tekst) : {};
      } catch {
        dane = {};
      }
      if (!odpowiedz.ok) throw new Error(dane.blad ?? `Błąd serwera (HTTP ${odpowiedz.status})`);
      if (!dane.karta) throw new Error("Serwer nie zwrócił karty");
      setKarta({ ...dane.karta, decyzja: "" });
    } catch (e) {
      setBlad(e instanceof Error ? e.message : "Wystąpił nieoczekiwany błąd");
    } finally {
      setLaduje(false);
    }
  }

  function uzyjPrzykladu() {
    setKarta({ ...przykladowaKarta, decyzja: "" });
    setBlad("");
  }

  async function zapiszDoBiblioteki() {
    if (!karta) return;
    setLaduje(true);
    setBlad("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBlad("Sesja wygasła — zaloguj się ponownie");
      setLaduje(false);
      return;
    }
    const { error } = await supabase.from("karty").insert({
      user_id: user.id,
      stanowisko,
      kandydat,
      transkrypcja,
      karta,
      decyzja: karta.decyzja,
    });
    setLaduje(false);
    if (error) {
      setBlad(error.message);
      return;
    }
    router.push("/biblioteka");
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">Nowa rozmowa</h1>
        <p className="text-muted-foreground">
          Wklej transkrypcję rozmowy rekrutacyjnej — AI przygotuje kartę kandydata jako szkic do Twojego zatwierdzenia.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Dane rozmowy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generujKarte} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stanowisko">Stanowisko (kategoria)</Label>
                <Input
                  id="stanowisko"
                  value={stanowisko}
                  onChange={(e) => setStanowisko(e.target.value)}
                  placeholder="np. Handlowiec B2B"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kandydat">Kandydat</Label>
                <Input
                  id="kandydat"
                  value={kandydat}
                  onChange={(e) => setKandydat(e.target.value)}
                  placeholder="np. Jan Kowalski"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transkrypcja">Transkrypcja rozmowy</Label>
              <Textarea
                id="transkrypcja"
                rows={10}
                required
                value={transkrypcja}
                onChange={(e) => setTranskrypcja(e.target.value)}
                placeholder="Wklej tutaj transkrypcję rozmowy (np. z Google Meet, Otter.ai)…"
              />
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="zgoda"
                required
                checked={zgoda}
                onChange={(e) => setZgoda(e.target.checked)}
                className="mt-1 h-4 w-4"
              />
              <Label htmlFor="zgoda" className="font-normal leading-relaxed">
                Potwierdzam, że kandydat wyraził zgodę na nagrywanie i transkrypcję rozmowy rekrutacyjnej (art. 267 k.k.).
              </Label>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={laduje || !zgoda} className="w-full sm:w-auto">
                {laduje ? "Generowanie…" : "Generuj kartę kandydata"}
              </Button>
              <Button type="button" variant="outline" onClick={uzyjPrzykladu} disabled={laduje}>
                Wstaw przykład (test bez AI)
              </Button>
            </div>
            {blad && <p className="text-sm text-destructive">{blad}</p>}
          </form>
        </CardContent>
      </Card>

      {karta && (
        <KartaKandydataView
          karta={karta}
          onZmianaDecyzji={(decyzja: Decyzja) => setKarta({ ...karta, decyzja })}
          onZapisz={zapiszDoBiblioteki}
          zapisywanie={laduje}
        />
      )}
    </main>
  );
}