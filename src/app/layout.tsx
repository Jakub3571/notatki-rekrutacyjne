import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Naglowek } from "@/components/naglowek";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Notatki Rekrutacyjne",
  description:
    "Karta kandydata z rozmowy rekrutacyjnej generowana przez AI — edytowalny szkic do zatwierdzenia przez rekrutera przed wklejeniem do ATS.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <Naglowek />
        <div className="flex-1">{children}</div>
        <footer className="border-t">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-4 px-4 py-4 text-sm text-muted-foreground">
            <Link href="/regulamin" className="hover:underline">
              Regulamin
            </Link>
            <Link href="/polityka-prywatnosci" className="hover:underline">
              Polityka prywatności
            </Link>
            <span className="ml-auto">Karty kandydatów przechowywane max 30 dni</span>
          </div>
        </footer>
      </body>
    </html>
  );
}