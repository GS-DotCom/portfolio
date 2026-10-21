import Image from "next/image";

import type { Project } from "@/lib/site";
import { cn } from "@/lib/utils";

// Sfondi chiari come i mockup del riferimento, a rotazione tra i segnaposto
const palettes = [
  { background: "bg-[linear-gradient(135deg,#eef1f8,#dde5f6)]", accent: "bg-violet" },
  { background: "bg-[linear-gradient(135deg,#f3f1ec,#e6e2d8)]", accent: "bg-orange" },
  { background: "bg-[linear-gradient(135deg,#e9f3f6,#d6e9ef)]", accent: "bg-blue" },
  { background: "bg-[linear-gradient(135deg,#f4eef8,#e7dcf1)]", accent: "bg-pink" },
  { background: "bg-[linear-gradient(135deg,#eceef1,#dcdfe5)]", accent: "bg-[#1a191e]" },
];

function Skeleton({ className }: { className?: string }) {
  return <span className={cn("block rounded-full bg-[#1a191e]/12", className)} />;
}

// Finestra di browser stilizzata per le web app in arrivo
function BrowserMockup({ accent }: { accent: string }) {
  return (
    <div className="w-[68%] max-w-80 overflow-hidden rounded-lg bg-white shadow-[0_24px_50px_-18px_rgb(26_25_30/0.45)] transition-transform duration-700 ease-float group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
      <div className="flex gap-1.5 border-b border-black/5 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff6159]" />
        <span className="size-2 rounded-full bg-[#ffbd2e]" />
        <span className="size-2 rounded-full bg-[#28c941]" />
      </div>
      <div className={cn("px-4 py-5", accent)}>
        <Skeleton className="h-2 w-2/3 bg-white/80" />
        <Skeleton className="mt-2 h-2 w-1/2 bg-white/50" />
      </div>
      <div className="grid grid-cols-3 gap-2 p-4">
        <span className="aspect-square rounded bg-[#1a191e]/8" />
        <span className="aspect-square rounded bg-[#1a191e]/8" />
        <span className="aspect-square rounded bg-[#1a191e]/8" />
        <Skeleton className="col-span-2 h-1.5" />
        <Skeleton className="col-span-3 h-1.5 w-3/4" />
      </div>
    </div>
  );
}

// Telefono stilizzato per le app in arrivo
function PhoneMockup({ accent }: { accent: string }) {
  return (
    <div className="h-[78%] max-h-80 overflow-hidden rounded-[1.6rem] border-[5px] border-[#1a191e] bg-white shadow-[0_24px_50px_-18px_rgb(26_25_30/0.5)] transition-transform duration-700 ease-float [aspect-ratio:9/19] group-hover:-translate-y-1 group-hover:rotate-2">
      <div className={cn("px-3 pt-6 pb-4", accent)}>
        <Skeleton className="h-1.5 w-2/3 bg-white/80" />
        <Skeleton className="mt-1.5 h-1.5 w-1/3 bg-white/50" />
      </div>
      <div className="space-y-2 p-3">
        <span className="block h-10 rounded bg-[#1a191e]/8" />
        <Skeleton className="h-1.5" />
        <Skeleton className="h-1.5 w-3/4" />
        <span className="block h-10 rounded bg-[#1a191e]/8" />
        <Skeleton className="h-1.5 w-1/2" />
      </div>
    </div>
  );
}

// Screenshot vero dentro una finestra di browser, così si vede intero come nei mockup del riferimento
function ScreenshotMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-[82%] max-w-xl overflow-hidden rounded-lg bg-white shadow-[0_24px_50px_-18px_rgb(26_25_30/0.45)] transition-transform duration-700 ease-float group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
      <div className="flex gap-1.5 border-b border-black/5 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff6159]" />
        <span className="size-2 rounded-full bg-[#ffbd2e]" />
        <span className="size-2 rounded-full bg-[#28c941]" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 45vw, 85vw"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}

export function ProjectCover({ project, index }: { project: Project; index: number }) {
  const palette = palettes[index % palettes.length];

  if (project.image) {
    return (
      <div className={cn("flex size-full items-center justify-center", palette.background)}>
        <ScreenshotMockup src={project.image} alt={`Anteprima di ${project.title}`} />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn("flex size-full items-center justify-center", palette.background)}>
      {project.cover === "phone" ? (
        <PhoneMockup accent={palette.accent} />
      ) : (
        <BrowserMockup accent={palette.accent} />
      )}
    </div>
  );
}
