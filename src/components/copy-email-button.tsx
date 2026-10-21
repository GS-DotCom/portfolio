"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "failed";

const labels: Record<CopyState, string> = {
  idle: "Copia indirizzo",
  copied: "Indirizzo copiato",
  failed: "Seleziona l'indirizzo e premi Ctrl+C",
};

export function CopyEmailButton({ email, className }: { email: string; className?: string }) {
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
    <button type="button" onClick={copy} aria-live="polite" className={cn(className)}>
      {labels[state]}
    </button>
  );
}
