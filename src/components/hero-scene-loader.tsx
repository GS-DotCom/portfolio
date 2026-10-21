"use client";

import dynamic from "next/dynamic";

// three.js arriva solo nel browser e dopo il resto della pagina; intanto resta il gradiente della hero
const HeroScene = dynamic(() => import("@/components/hero-scene"), { ssr: false });

export function HeroSceneLoader() {
  return <HeroScene />;
}
