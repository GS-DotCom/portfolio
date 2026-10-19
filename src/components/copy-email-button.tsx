"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "failed";

const labels: Record<CopyState, string> = {
  idle: "Copia indirizzo",
  copied: "Indirizzo copiato",
  failed: "Seleziona l'indirizzo e premi Ctrl+C",
};

export function CopyEmailButton({ email }: { email: string }) {
  const [state, setState] = useState<CopyState>("idle");

  // Dopo qualche secondo il pulsante torna allo stato iniziale
  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2500);
    return () => clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      // Gli appunti non sono disponibili (ad esempio fuori da HTTPS)
      setState("failed");
    }
  }

  return (
    <Button variant="outline" size="lg" onClick={copy} aria-live="polite">
      {state === "copied" ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
      {labels[state]}
    </Button>
  );
}
