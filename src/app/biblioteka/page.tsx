"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KartaKandydataView } from "@/components/karta-kandydata";
import { createClient } from "@/lib/supabase/client";
import type { Decyzja, KartaKandydata, WierszKarty } from "@/lib/types";

const etykietyDecyzji: Record<string, string> = {
  kolejny_etap: "Kolejny etap",
  wstrzymany: "Wstrzymany",
  odrzucony: "Odrzucony",
  "": "Brak decyzji",
};

export default function BibliotekaPage() {
  const [karty, setKarty] = useState<WierszKarty[]>([]);
  const [wybrana, setWybrana] = useState<WierszKarty | null>(null);
  const [szukaj, setSzukaj] = useState("");
  const [kategoria, setKategoria] = useState("wszystkie");
  const [filtrDecyzji, setFiltrDecyzji] = useState("wszystkie");
  const [laduje, setLaduje] = useState(true);
  const [blad, setBlad] = useState("");

  useEffect(() => {
    async function pobierz() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("karty")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setBlad(error.message);
      else setKarty(data as WierszKarty[]);
      setLaduje(false);
    }
    pobierz();
  }, []);

  const kategorie = useMemo(() => {
    const unikalne = new Set(karty.map((k) => k.stanowisko).filter(Boolean));
    return ["wszystkie", ...Array.from(unikalne).sort()];
  }, [karty]);

  const przefiltrowane = karty.filter((k) => {
    if (kategoria !== "wszystkie" && k.stanowisko !== kategoria) return false;
    if (filtrDecyzji !== "wszystkie" && k.decyzja !== filtrDecyzji) return false;
    const fraza = szukaj.trim().toLowerCase();
    if (fraza) {
      return (
        k.stanowisko.toLowerCase().includes(fraza) ||
        k.kandydat.toLowerCase().includes(fraza) ||
        JSON.stringify(k.karta).toLowerCase().includes(fraza)
      );
    }
    return true;
  });

  async function zapiszZmianyKarty(wiersz: WierszKarty, nowa: KartaKandydata) {
    const supabase = createClient();
    const { error } = await supabase
      .from("karty")
      .update({ karta: nowa, decyzja: nowa.decyzja })
      .eq("id", wiersz.id);
    if (error) {
      setBlad(error.message);
      return;
    }
    setKarty(karty.map((k) => (k.id === wiersz.id ? { ...k, karta: nowa, decyzja: nowa.decyzja } : k)));
    if (wybrana?.id === wiersz.id) setWybrana({ ...wybrana, karta: nowa, decyzja: nowa.decyzja });
  }

  async function usunKarte(wiersz: WierszKarty) {
    if (!window.confirm("Na pewno usunąć tę kartę? Tej operacji nie można cofnąć.")) return;
    const supabase = createClient();
    const { error } = await supabase.from("karty").delete().eq("id", wiersz.id);
    if (error) {
      setBlad(error.message);
      return;
    }
    setKarty(karty.filter((k) => k.id !== wiersz.id));
    if (wybrana?.id === wiersz.id) setWybrana(null);
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Biblioteka kandydatów</h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="szukaj">Szukaj</Label>
          <Input
            id="szukaj"
            placeholder="nazwisko, stanowisko, słowo z karty…"
            value={szukaj}
            onChange={(e) => setSzukaj(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="kategoria">Kategoria (stanowisko)</Label>
          <select
            id="kategoria"
            value={kategoria}
            onChange={(e) => setKategoria(e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            {kategorie.map((k) => (
              <option key={k} value={k}>
                {k === "wszystkie" ? "Wszystkie" : k}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="filtr-decyzji">Decyzja</Label>
          <select
            id="filtr-decyzji"
            value={filtrDecyzji}
            onChange={(e) => setFiltrDecyzji(e.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="wszystkie">Wszystkie</option>
            <option value="kolejny_etap">Kolejny etap</option>
            <option value="wstrzymany">Wstrzymany</option>
            <option value="odrzucony">Odrzucony</option>
            <option value="">Brak decyzji</option>
          </select>
        </div>
      </div>

      {blad && <p className="text-sm text-destructive">{blad}</p>}
      {laduje && <p className="text-muted-foreground">Ładowanie…</p>}
      {!laduje && przefiltrowane.length === 0 && (
        <p className="text-muted-foreground">Brak kart spełniających kryteria.</p>
      )}

      <ul className="space-y-2">
        {przefiltrowane.map((k) => (
          <li key={k.id}>
            <button
              type="button"
              onClick={() => setWybrana(wybrana?.id === k.id ? null : k)}
              className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-left hover:bg-muted ${
                wybrana?.id === k.id ? "border-primary bg-muted" : ""
              }`}
            >
              <span>
                <span className="font-medium">{k.kandydat || "Bez nazwy"}</span>
                <span className="text-muted-foreground"> — {k.stanowisko || "bez stanowiska"}</span>
              </span>
              <span className="flex items-center gap-2">
                <Badge variant="outline">{new Date(k.created_at).toLocaleDateString("pl-PL")}</Badge>
                <Badge
                  variant={
                    k.decyzja === "kolejny_etap"
                      ? "default"
                      : k.decyzja === "odrzucony"
                        ? "destructive"
                        : k.decyzja === "wstrzymany"
                          ? "secondary"
                          : "outline"
                  }
                >
                  {etykietyDecyzji[k.decyzja] ?? "Brak decyzji"}
                </Badge>
              </span>
            </button>
                        {wybrana?.id === k.id && (
              <div className="mt-2">
                <KartaKandydataView
                  karta={k.karta}
                  onZmianaDecyzji={(d) => zmienDecyzje(k, d)}
                  onUsun={() => usunKarte(k)}
                  edytowalna
                  onZapiszZmiany={(nowa) => zapiszZmianyKarty(k, nowa)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}