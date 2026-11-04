import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Notatki Rekrutacyjne",
  description:
    "Karta kandydata z rozmowy rekrutacyjnej generowana przez AI — edytowalny szkic do zatwierdzenia przez rekrutera przed wklejeniem do ATS.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}