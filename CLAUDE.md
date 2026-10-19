# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Comandi

- `npm run dev` — server di sviluppo su http://localhost:3000
- `npm run build` — build di produzione (fa anche il type-check)
- `npm run lint` — ESLint (`eslint-config-next`)

Non ci sono test.

## Stack

Next.js 16 (App Router, Turbopack) con React 19, TypeScript, Tailwind CSS v4 e componenti shadcn (stile `base-nova`, basati su `@base-ui/react`, non su Radix). Next.js 16 ha API diverse dalle versioni precedenti: consultare `node_modules/next/dist/docs/` prima di scrivere codice (vedi `AGENTS.md`).

`next.config.ts` abilita `cacheComponents` e `partialPrefetching`; Tailwind passa dal loader `@tailwindcss/turbopack` invece che da PostCSS, e non esiste un `tailwind.config` (il tema è in `src/app/globals.css`).

## Architettura

È un sito a pagina unica. `src/app/page.tsx` compone header, le sezioni in `src/components/sections/` e footer.

- **Contenuti centralizzati:** tutti i testi (dati personali, navigazione, competenze, progetti, esperienze) stanno in `src/lib/site.ts`. Per cambiare un contenuto si modifica quel file, non i componenti. Un link social vuoto nasconde il relativo pulsante.
- **Navigazione ad ancore:** `navItems` punta agli `id` delle sezioni (`#about`, `#projects`, …). Ogni sezione usa il wrapper `src/components/section.tsx`, che imposta `id`, `aria-labelledby` e `scroll-mt-16` per compensare l'header fisso: un nuovo `id` va tenuto allineato con `navItems`.
- **Server e client:** le sezioni sono Server Components. Sono client solo `theme-provider`, `mode-toggle`, `mobile-nav` e alcuni componenti in `ui/`.
- **Tema:** `next-themes` con strategia a classe (`.dark`), impostato in `layout.tsx`. I colori sono variabili CSS in `globals.css`.
- **`cn`:** arriva dal pacchetto ufficiale `cn` di shadcn (sostituisce `clsx` + `tailwind-merge`). `src/lib/utils.ts` lo riesporta; i componenti in `src/components/ui/` lo importano direttamente da `"cn"`, come li genera la CLI di shadcn. Nuovi componenti UI si aggiungono con `npx shadcn add <nome>`.
- **Icone:** `lucide-react` non include più le icone dei brand, quindi GitHub e LinkedIn sono SVG in `src/components/icons.tsx`.

## Convenzioni

Il sito è in italiano (`lang="it"`): testi dell'interfaccia e commenti in italiano, nomi nel codice in inglese.
