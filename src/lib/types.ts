export type MocnaStrona = {
  opis: string;
  cytat: string;
};

export type SygnalOstrzegawczy = {
  opis: string;
  cytat: string;
};

export type OcenaKompetencji = {
  kompetencja: string;
  ocena: number;
  cytat: string;
};

export type Motywacja = {
  pensja: string;
  lokalizacja: string;
  uwagi: string;
};

export type Decyzja = "kolejny_etap" | "odrzucony" | "wstrzymany" | "";

export type KartaKandydata = {
  podsumowanie: string;
  doswiadczenie: string[];
  mocne_strony: MocnaStrona[];
  sygnaly_ostrzegawcze: SygnalOstrzegawczy[];
  motywacja: Motywacja;
  oceny: OcenaKompetencji[];
  pytania_followup: string[];
  decyzja: Decyzja;
};