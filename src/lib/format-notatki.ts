import type { KartaKandydata } from "./types";

const etykietyDecyzji: Record<string, string> = {
  kolejny_etap: "Przechodzi do kolejnego etapu",
  odrzucony: "Odrzucony",
  wstrzymany: "Wstrzymany",
  "": "Brak decyzji",
};

export function formatujNotatke(karta: KartaKandydata): string {
  const linie: string[] = [];

  linie.push("PODSUMOWANIE");
  linie.push(karta.podsumowanie);
  linie.push("");
  linie.push("DOŚWIADCZENIE I TECHNOLOGIE");
  karta.doswiadczenie.forEach((d) => linie.push(`- ${d}`));
  linie.push("");
  linie.push("MOCNE STRONY");
  karta.mocne_strony.forEach((m) => linie.push(`- ${m.opis} [„${m.cytat}"]`));

  if (karta.sygnaly_ostrzegawcze.length > 0) {
    linie.push("");
    linie.push("SYGNAŁY OSTRZEGAWCZE");
    karta.sygnaly_ostrzegawcze.forEach((s) => linie.push(`- ${s.opis} [„${s.cytat}"]`));
  }

  linie.push("");
  linie.push("MOTYWACJA I OCZEKIWANIA");
  linie.push(`- Pensja: ${karta.motywacja.pensja}`);
  linie.push(`- Lokalizacja: ${karta.motywacja.lokalizacja}`);
  if (karta.motywacja.uwagi) linie.push(`- Uwagi: ${karta.motywacja.uwagi}`);

  if (karta.oceny.length > 0) {
    linie.push("");
    linie.push("OCENY PER KOMPETENCJA (1-5)");
    karta.oceny.forEach((o) => linie.push(`- ${o.kompetencja}: ${o.ocena}/5 [„${o.cytat}"]`));
  }

  linie.push("");
  linie.push("PYTANIA NA KOLEJNĄ ROZMOWĘ");
  karta.pytania_followup.forEach((p) => linie.push(`- ${p}`));
  linie.push("");
  linie.push(`DECYZJA: ${etykietyDecyzji[karta.decyzja] ?? karta.decyzja}`);

  return linie.join("\n");
}