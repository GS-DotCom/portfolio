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
              <li key={item.href}>
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
              </li>
            ))}
          </ol>
        </nav>
        <MobileNav />
      </div>
    </HeaderShell>
  );
}
