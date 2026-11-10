"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Decyzja, KartaKandydata } from "@/lib/types";
import { formatujNotatke } from "@/lib/format-notatki";

const opcjeDecyzji: { wartosc: Decyzja; etykieta: string; wariant: "default" | "secondary" | "destructive" | "outline" }[] = [
  { wartosc: "kolejny_etap", etykieta: "Przechodzi do kolejnego etapu", wariant: "default" },
  { wartosc: "wstrzymany", etykieta: "Wstrzymany", wariant: "secondary" },
  { wartosc: "odrzucony", etykieta: "Odrzucony", wariant: "destructive" },
];

function Sekcja({ tytul, children }: { tytul: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{tytul}</h3>
      {children}
    </section>
  );
}

export function KartaKandydataView({
  karta,
  onZmianaDecyzji,
  onZapisz,
  onUsun,
  zapisywanie = false,
}: {
  karta: KartaKandydata;
  onZmianaDecyzji: (decyzja: Decyzja) => void;
  onZapisz?: () => void;
  onUsun?: () => void;
  zapisywanie?: boolean;
}) {
  const [skopiowano, setSkopiowano] = useState(false);

  async function kopiujNotatke() {
    await navigator.clipboard.writeText(formatujNotatke(karta));
    setSkopiowano(true);
    window.setTimeout(() => setSkopiowano(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-xl">Karta kandydata</CardTitle>
        <Badge variant="outline">Szkic AI — do zatwierdzenia</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <Sekcja tytul="Podsumowanie">
          <p className="leading-relaxed">{karta.podsumowanie}</p>
        </Sekcja>

        <Sekcja tytul="Doświadczenie i technologie">
          <ul className="list-disc space-y-1 pl-5">
            {karta.doswiadczenie.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </Sekcja>

        <Sekcja tytul="Mocne strony">
          <ul className="space-y-2">
            {karta.mocne_strony.map((m) => (
              <li key={m.opis}>
                <p>{m.opis}</p>
                <p className="text-sm italic text-muted-foreground">„{m.cytat}”</p>
              </li>
            ))}
          </ul>
        </Sekcja>

        {karta.sygnaly_ostrzegawcze.length > 0 && (
          <Sekcja tytul="Sygnały ostrzegawcze">
            <ul className="space-y-2">
              {karta.sygnaly_ostrzegawcze.map((s) => (
                <li key={s.opis}>
                  <p>{s.opis}</p>
                  <p className="text-sm italic text-muted-foreground">„{s.cytat}”</p>
                </li>
              ))}
            </ul>
          </Sekcja>
        )}

        <Sekcja tytul="Motywacja i oczekiwania">
          <ul className="list-disc space-y-1 pl-5">
            <li>Pensja: {karta.motywacja.pensja}</li>
            <li>Lokalizacja: {karta.motywacja.lokalizacja}</li>
            {karta.motywacja.uwagi && <li>Uwagi: {karta.motywacja.uwagi}</li>}
          </ul>
        </Sekcja>

        {karta.oceny.length > 0 && (
          <Sekcja tytul="Oceny per kompetencja (1–5)">
            <ul className="space-y-2">
              {karta.oceny.map((o) => (
                <li key={o.kompetencja}>
                  <p>
                    <span className="font-medium">{o.kompetencja}</span> — {o.ocena}/5
                  </p>
                  <p className="text-sm italic text-muted-foreground">„{o.cytat}”</p>
                </li>
              ))}
            </ul>
          </Sekcja>
        )}

        <Sekcja tytul="Pytania na kolejną rozmowę">
          <ul className="list-disc space-y-1 pl-5">
            {karta.pytania_followup.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Sekcja>

        <Separator />

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">Decyzja:</span>
          {opcjeDecyzji.map((o) => (
            <Badge
              key={o.wartosc}
              variant={karta.decyzja === o.wartosc ? o.wariant : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => onZmianaDecyzji(o.wartosc)}
            >
              {o.etykieta}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={kopiujNotatke} className="w-full sm:w-auto">
            {skopiowano ? "Skopiowano do schowka!" : "Kopiuj notatkę do ATS"}
          </Button>
          {onZapisz && (
            <Button onClick={onZapisz} disabled={zapisywanie} variant="secondary" className="w-full sm:w-auto">
              {zapisywanie ? "Zapisywanie…" : "Zapisz do biblioteki"}
            </Button>
          )}
          {onUsun && (
            <Button onClick={onUsun} variant="destructive" className="w-full sm:w-auto">
              Usuń kartę
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}