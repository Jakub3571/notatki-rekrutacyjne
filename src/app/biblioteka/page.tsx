"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
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
  edytowalna = false,
  onZapiszZmiany,
}: {
  karta: KartaKandydata;
  onZmianaDecyzji: (decyzja: Decyzja) => void;
  onZapisz?: () => void;
  onUsun?: () => void;
  zapisywanie?: boolean;
  edytowalna?: boolean;
  onZapiszZmiany?: (karta: KartaKandydata) => void;
}) {
  const [skopiowano, setSkopiowano] = useState(false);
  const [edycja, setEdycja] = useState(false);
  const [draft, setDraft] = useState<KartaKandydata | null>(null);

  const wyswietlana = edycja && draft ? draft : karta;

  function startEdycja() {
    setDraft(karta);
    setEdycja(true);
  }

  function anulujEdycje() {
    setDraft(null);
    setEdycja(false);
  }

  function zapiszZmiany() {
    if (draft && onZapiszZmiany) onZapiszZmiany(draft);
    setDraft(null);
    setEdycja(false);
  }

  async function kopiujNotatke() {
    await navigator.clipboard.writeText(formatujNotatke(wyswietlana));
    setSkopiowano(true);
    window.setTimeout(() => setSkopiowano(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-xl">Karta kandydata</CardTitle>
        <div className="flex items-center gap-2">
          {edytowalna && !edycja && (
            <Button variant="outline" size="sm" onClick={startEdycja}>
              Edytuj kartę
            </Button>
          )}
          <Badge variant="outline">Szkic AI — do zatwierdzenia</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Sekcja tytul="Podsumowanie">
          {edycja ? (
            <Textarea
              rows={4}
              value={wyswietlana.podsumowanie}
              onChange={(e) => setDraft({ ...wyswietlana, podsumowanie: e.target.value })}
            />
          ) : (
            <p className="leading-relaxed">{wyswietlana.podsumowanie}</p>
          )}
        </Sekcja>

        <Sekcja tytul="Doświadczenie i technologie">
          {edycja ? (
            <Textarea
              rows={4}
              value={wyswietlana.doswiadczenie.join("\n")}
              onChange={(e) =>
                setDraft({
                  ...wyswietlana,
                  doswiadczenie: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="jedna pozycja na linię"
            />
          ) : (
            <ul className="list-disc space-y-1 pl-5">
              {wyswietlana.doswiadczenie.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </Sekcja>

        <Sekcja tytul="Mocne strony">
          <ul className="space-y-2">
            {wyswietlana.mocne_strony.map((m) => (
              <li key={m.opis}>
                <p>{m.opis}</p>
                <p className="text-sm italic text-muted-foreground">„{m.cytat}”</p>
              </li>
            ))}
          </ul>
        </Sekcja>

        {wyswietlana.sygnaly_ostrzegawcze.length > 0 && (
          <Sekcja tytul="Sygnały ostrzegawcze">
            <ul className="space-y-2">
              {wyswietlana.sygnaly_ostrzegawcze.map((s) => (
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
            <li>Pensja: {wyswietlana.motywacja.pensja}</li>
            <li>Lokalizacja: {wyswietlana.motywacja.lokalizacja}</li>
            {wyswietlana.motywacja.uwagi && <li>Uwagi: {wyswietlana.motywacja.uwagi}</li>}
          </ul>
        </Sekcja>

        {wyswietlana.oceny.length > 0 && (
          <Sekcja tytul="Oceny per kompetencja (1–5)">
            <ul className="space-y-2">
              {wyswietlana.oceny.map((o) => (
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
          {edycja ? (
            <Textarea
              rows={4}
              value={wyswietlana.pytania_followup.join("\n")}
              onChange={(e) =>
                setDraft({
                  ...wyswietlana,
                  pytania_followup: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="jedno pytanie na linię"
            />
          ) : (
            <ul className="list-disc space-y-1 pl-5">
              {wyswietlana.pytania_followup.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
        </Sekcja>

        <Separator />

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">Decyzja:</span>
          {opcjeDecyzji.map((o) => (
            <Badge
              key={o.wartosc}
              variant={wyswietlana.decyzja === o.wartosc ? o.wariant : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => onZmianaDecyzji(o.wartosc)}
            >
              {o.etykieta}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {edycja ? (
            <>
              <Button onClick={zapiszZmiany} className="w-full sm:w-auto">
                Zapisz zmiany
              </Button>
              <Button variant="outline" onClick={anulujEdycje} className="w-full sm:w-auto">
                Anuluj
              </Button>
            </>
          ) : (
            <Button onClick={kopiujNotatke} className="w-full sm:w-auto">
              {skopiowano ? "Skopiowano do schowka!" : "Kopiuj notatkę do ATS"}
            </Button>
          )}
          {onZapisz && !edycja && (
            <Button onClick={onZapisz} disabled={zapisywanie} variant="secondary" className="w-full sm:w-auto">
              {zapisywanie ? "Zapisywanie…" : "Zapisz do biblioteki"}
            </Button>
          )}
          {onUsun && !edycja && (
            <Button onClick={onUsun} variant="destructive" className="w-full sm:w-auto">
              Usuń kartę
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}