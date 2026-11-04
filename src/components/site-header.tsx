import { HeaderShell } from "@/components/header-shell";
import { MobileNav } from "@/components/mobile-nav";
import { navItems } from "@/lib/site";

// Il menu è centrato; su mobile resta solo il pulsante del pannello, a destra
export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="flex h-20 items-center justify-end px-4 transition-[height] duration-300 group-data-[scrolled=false]/header:lg:h-34 sm:px-11 lg:justify-center">
        <nav aria-label="Principale" className="hidden lg:block">
          <ol className="flex items-center gap-12">
            {navItems.map((item, index) => (
              <li key={item.href} className={item.children ? "group/sub relative" : undefined}>
                <a
                  href={item.href}
                  className="relative font-mono text-[0.95rem] font-semibold text-foreground transition-colors hover:text-cyan"
                >
                  {"// "}
                  {item.label}
                  <sup className="absolute -top-2.5 -right-2.5 text-[0.55rem] font-semibold">
                    {String(index + 1).padStart(2, "0")}
                  </sup>
                </a>
                {item.children && (
                  // Si apre al passaggio del mouse o quando il Tab arriva sulla voce; il pt-3
                  // tiene aperto il pannello mentre il mouse scende dalla voce al sottomenu.
                  // In apertura `visibility` scatta subito, così il Tab successivo entra nel sottomenu.
                  <div className="invisible absolute top-full left-0 pt-3 opacity-0 transition-[opacity,translate,visibility] duration-200 group-focus-within/sub:visible group-focus-within/sub:opacity-100 group-focus-within/sub:transition-[opacity,translate] group-hover/sub:visible group-hover/sub:opacity-100 group-hover/sub:transition-[opacity,translate] motion-safe:translate-y-1 motion-safe:group-focus-within/sub:translate-y-0 motion-safe:group-hover/sub:translate-y-0">
                    <ul className="rounded-md border border-white/10 bg-background/95 py-2 shadow-(--card-shadow) backdrop-blur">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={child.href}
                            className="block px-4 py-2 font-mono text-sm font-semibold whitespace-nowrap text-foreground transition-colors hover:text-cyan focus-visible:text-cyan"
                          >
                            {`// ${child.label}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <MobileNav />
      </div>
    </HeaderShell>
  );
}
