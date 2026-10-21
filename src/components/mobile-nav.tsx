"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems, site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon-lg" className="lg:hidden" />}
      >
        <Menu />
        <span className="sr-only">Apri menu</span>
      </SheetTrigger>
      <SheetContent side="right" className="bg-background">
        <SheetHeader>
          <SheetTitle className="font-mono text-cyan">
            {site.logo}.<span className="text-lilac">_</span>
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Principale" className="px-4">
          <ol className="flex flex-col">
            {navItems.map((item, index) => (
              <li key={item.href} className="border-b last:border-b-0">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4 font-mono text-base font-semibold transition-colors hover:text-cyan"
                >
                  {`// ${item.label}`}
                  <span className="text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
