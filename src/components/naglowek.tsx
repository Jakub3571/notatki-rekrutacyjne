"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function Naglowek() {
  const sciezka = usePathname();
  const router = useRouter();

  if (sciezka === "/login") return null;

  async function wyloguj() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="font-bold">
          AI Notatki Rekrutacyjne
        </Link>
        <nav className="flex items-center gap-2">
          <Button
            variant={sciezka === "/" ? "default" : "outline"}
            size="sm"
            nativeButton={false}
            render={<Link href="/">Nowa rozmowa</Link>}
          />
          <Button
            variant={sciezka === "/biblioteka" ? "default" : "outline"}
            size="sm"
            nativeButton={false}
            render={<Link href="/biblioteka">Biblioteka</Link>}
          />
          <Button variant="ghost" size="sm" onClick={wyloguj}>
            Wyloguj
          </Button>
        </nav>
      </div>
    </header>
  );
}