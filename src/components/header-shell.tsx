"use client";

import { useEffect, useState, type ReactNode } from "react";

// Header fisso: trasparente sopra la hero, con lo sfondo della pagina dopo qualche pixel di scorrimento
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group/header fixed inset-x-0 top-0 z-40 transition-colors duration-300 data-[scrolled=true]:bg-background/85 data-[scrolled=true]:backdrop-blur"
    >
      {children}
    </header>
  );
}
