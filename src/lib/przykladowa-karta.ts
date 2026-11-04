import type { KartaKandydata } from "./types";

export const przykladowaKarta: KartaKandydata = {
  podsumowanie:
    "Kandydat z 5-letnim doświadczeniem w sprzedaży B2B w branży IT. Mocno zmotywowany, komunikatywny i samodzielny. Dobrze wypadł w rozmowie o oczekiwaniach finansowych.",
  doswiadczenie: [
    "5 lat sprzedaży B2B (SaaS)",
    "zarządzanie portfelem 40 klientów",
    "wdrożenia CRM",
  ],
  mocne_strony: [
    {
      opis: "Bardzo dobra znajomość procesu sprzedaży B2B",
      cytat: "Od trzech lat prowadzę pełny cykl sprzedaży, od cold calla po podpisanie umowy.",
    },
    {
      opis: "Samodzielność i organizacja pracy",
      cytat: "Sam układam sobie plan tygodnia i trzymam się KPI.",
    },
  ],
  sygnaly_ostrzegawcze: [
    {
      opis: "Krótkie okresy pracy w poprzednich firmach",
      cytat: "W ostatniej firmie byłem rok, wcześniej półtora roku.",
    },
  ],
  motywacja: {
    pensja: "12 000–15 000 zł netto na B2B",
    lokalizacja: "Warszawa, hybryda 2 dni w biurze",
    uwagi: "Chce rozwijać się w kierunku account managementu.",
  },
  oceny: [
    {
      kompetencja: "Komunikacja",
      ocena: 5,
      cytat: "Kandydat mówił konkretnie i na temat przez całą rozmowę.",
    },
    {
      kompetencja: "Znajomość branży IT",
      ocena: 4,
      cytat: "Zna produkty konkurencji i rozumie cykl decyzyjny klienta.",
    },
  ],
  pytania_followup: [
    "Jak wyglądał proces odejścia z ostatniej firmy?",
    "Jakie KPI osiągnął Pan/Pani w ostatnim kwartale?",
    "Dlaczego akurat nasza branża?",
  ],
  decyzja: "",
};