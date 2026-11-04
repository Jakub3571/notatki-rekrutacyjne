"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { KartaKandydataView } from "@/components/karta-kandydata";
import { przykladowaKarta } from "@/lib/przykladowa-karta";
import type { Decyzja, KartaKandydata } from "@/lib/types";

export default function StronaGlowna() {
  const [karta, setKarta] = useState<KartaKandydata | null>(null);

  function generujKarte(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setKarta({ ...przykladowaKarta, decyzja: "" });
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">AI Notatki Rekrutacyjne</h1>
        <p className="text-muted-foreground">
          Wklej transkrypcję rozmowy rekrutacyjnej — AI przygotuje kartę kandydata jako szkic do Twojego zatwierdzenia.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Nowa rozmowa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={generujKarte} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stanowisko">Stanowisko / kandydat</Label>
              <Input id="stanowisko" name="stanowisko" placeholder="np. Handlowiec B2B — Jan Kowalski" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transkrypcja">Transkrypcja rozmowy</Label>
              <Textarea
                id="transkrypcja"
                name="transkrypcja"
                rows={10}
                required
                placeholder="Wklej tutaj transkrypcję rozmowy (np. z Google Meet, Otter.ai)…"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Generuj kartę kandydata
            </Button>
          </form>
        </CardContent>
      </Card>

      {karta && (
        <KartaKandydataView
          karta={karta}
          onZmianaDecyzji={(decyzja: Decyzja) => setKarta({ ...karta, decyzja })}
        />
      )}
    </main>
  );
}