"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [blad, setBlad] = useState("");

  async function zalogujPrzezGoogle() {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setBlad(error.message);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">AI Notatki Rekrutacyjne</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Zaloguj się, aby tworzyć karty kandydatów i przeglądać bibliotekę.
          </p>
          <Button onClick={zalogujPrzezGoogle} className="w-full">
            Zaloguj się przez Google
          </Button>
          {blad && <p className="text-sm text-destructive">{blad}</p>}
        </CardContent>
      </Card>
    </main>
  );
}