import Image from "next/image";

import { CometCard } from "@/components/ui/comet-card";
import { certificationsSection, type Certification } from "@/lib/site";

// Un badge Credly dentro la Comet Card: l'intera scheda apre la pagina pubblica del badge
export function CertificationCard({ certification }: { certification: Certification }) {
  const { name, issuer, date, image, url } = certification;

  return (
    <CometCard foil className="w-72 max-w-full">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={certificationsSection.linkLabel(name)}
        className="flex flex-col rounded-2xl bg-card p-3 outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <Image
          src={image}
          alt=""
          width={1080}
          height={1080}
          sizes="288px"
          className="aspect-square w-full rounded-xl object-cover"
        />
        <div className="flex flex-col gap-1 px-2 pt-4 pb-2 font-mono text-xs">
          <span className="font-semibold text-foreground">{name}</span>
          <span className="text-muted-foreground">
            {issuer} · {date}
          </span>
        </div>
      </a>
    </CometCard>
  );
}
