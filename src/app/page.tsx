"use client";

import { useEffect, useState, type FormEvent } from "react";
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
  const [pozostalo, setPozostało] = useState<number | null>(null);
  const [limit, setLimit] = useState(10);
  const [komunikat, setKomunikat] = useState("");
  const [plik, setPlik] = useState<File | null>(null);
  const [transkrybuje, setTranskrybuje] = useState(false);
  const [zapisanaId, setZapisanaId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/limit")
      .then((r) => r.json())
      .then((d) => {
        setPozostało(typeof d.pozostalo === "number" ? d.pozostalo : null);
        setLimit(typeof d.limit === "number" ? d.limit : 10);
      })
      .catch(() => setPozostało(null));
  }, []);

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
      let dane: { karta?: KartaKandydata; blad?: string; pozostalo?: number } = {};
      try {
        dane = tekst ? JSON.parse(tekst) : {};
      } catch {
        dane = {};
      }
      if (!odpowiedz.ok) throw new Error(dane.blad ?? `Błąd serwera (HTTP ${odpowiedz.status})`);
      if (!dane.karta) throw new Error("Serwer nie zwrócił karty");
      const nowaKarta = { ...dane.karta, decyzja: "" as Decyzja };
      setKarta(nowaKarta);
      if (typeof dane.pozostalo === "number") setPozostało(dane.pozostalo);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: wiersz, error } = await supabase
          .from("karty")
          .insert({
            user_id: user.id,
            stanowisko,
            kandydat,
            transkrypcja,
            karta: nowaKarta,
            decyzja: "",
          })
          .select("id")
          .single();
        if (!error && wiersz) setZapisanaId(wiersz.id);
      }
      setStanowisko("");
      setKandydat("");
      setTranskrypcja("");
      setZgoda(false);
      setKomunikat("Karta wygenerowana i automatycznie zapisana w bibliotece — odświeżenie strony jej nie zgubi.");
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

  async function wgrajNagranie() {
    if (!plik) return;
    setTranskrybuje(true);
    setBlad("");
    setKomunikat("");
    try {
      const fd = new FormData();
      fd.append("plik", plik);
      const odpowiedz = await fetch("/api/transkrypcja", { method: "POST", body: fd });
      const tekst = await odpowiedz.text();
      let dane: { transkrypcja?: string; blad?: string } = {};
      try {
        dane = tekst ? JSON.parse(tekst) : {};
      } catch {
        dane = {};
      }
      if (!odpowiedz.ok) throw new Error(dane.blad ?? `Błąd transkrypcji (HTTP ${odpowiedz.status})`);
      if (!dane.transkrypcja) throw new Error("Pusta transkrypcja");
      setTranskrypcja(dane.transkrypcja);
      setKomunikat("Transkrypcja gotowa — sprawdź oznaczenia REKRUTER/KANDYDAT i kliknij „Generuj kartę”.");
    } catch (e) {
      setBlad(e instanceof Error ? e.message : "Błąd transkrypcji");
    } finally {
      setTranskrybuje(false);
    }
  }

  function zmianaDecyzji(decyzja: Decyzja) {
    setKarta((k) => {
      if (!k) return k;
      const nowa = { ...k, decyzja };
      if (zapisanaId) {
        const supabase = createClient();
        supabase.from("karty").update({ decyzja, karta: nowa }).eq("id", zapisanaId);
      }
      return nowa;
    });
  }

  function zapiszZmiany(nowa: KartaKandydata) {
    setKarta(nowa);
    if (zapisanaId) {
      const supabase = createClient();
      supabase.from("karty").update({ karta: nowa, decyzja: nowa.decyzja }).eq("id", zapisanaId);
    }
  }

  async function usunKarte() {
    if (!zapisanaId) return;
    if (!window.confirm("Usunąć tę kartę z biblioteki?")) return;
    const supabase = createClient();
    await supabase.from("karty").delete().eq("id", zapisanaId);
    setKarta(null);
    setZapisanaId(null);
    setKomunikat("Karta usunięta.");
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
            <div className="space-y-2">
              <Label>Albo wgraj nagranie (mp3, m4a, wav, mp4 — max 100 MB)</Label>
              <input
                id="plik"
                type="file"
                accept="audio/*,video/*"
                onChange={(e) => setPlik(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <label
                htmlFor="plik"
                className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:border-primary hover:bg-muted"
              >
                <span className="text-sm font-medium">
                  {plik ? plik.name : "Kliknij, aby wybrać nagranie"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {plik ? `${(plik.size / 1024 / 1024).toFixed(1)} MB` : "mp3, m4a, wav, mp4 — max 100 MB"}
                </span>
              </label>
              <div>
                <Button type="button" variant="outline" onClick={wgrajNagranie} disabled={!plik || transkrybuje}>
                  {transkrybuje ? "Transkrypcja…" : "Transkrybuj nagranie"}
                </Button>
              </div>
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
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={laduje || !zgoda || pozostalo === 0} className="w-full sm:w-auto">
                {laduje ? "Generowanie…" : "Generuj kartę kandydata"}
              </Button>
              {pozostalo !== null && (
                <span className={pozostalo === 0 ? "text-sm font-medium text-destructive" : "text-sm text-muted-foreground"}>
                  Pozostało generowań: {pozostalo}/{limit}
                </span>
              )}
              <Button type="button" variant="outline" onClick={uzyjPrzykladu} disabled={laduje}>
                Wstaw przykład (test bez AI)
              </Button>
            </div>
            {blad && <p className="text-sm text-destructive">{blad}</p>}
            {komunikat && <p className="text-sm font-medium text-green-600">{komunikat}</p>}
          </form>
        </CardContent>
      </Card>

      {karta && (
        <KartaKandydataView
          karta={karta}
          onZmianaDecyzji={zmianaDecyzji}
          onUsun={usunKarte}
          edytowalna
          onZapiszZmiany={zapiszZmiany}
        />
      )}
    </main>
  );
}