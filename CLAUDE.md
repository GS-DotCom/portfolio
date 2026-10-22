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

È un sito a pagina unica (più una pagina di dettaglio per ogni progetto), con stile e struttura ripresi da [tamalsen.dev](https://tamalsen.dev/) (vedi `docs/2026-10-20-restyling-stile-tamalsen.md`; il materiale di riferimento è in `references/`, solo in locale perché escluso da git). `src/app/page.tsx` compone l'header e le sezioni in `src/components/sections/`: Hero, Competenze, Progetti, AI (vibe coding con Claude, `#ai`), Esperienza, Contatti. La fascia dei contatti fa anche da footer.

- **Contenuti centralizzati:** tutti i testi (dati personali, navigazione, hero, competenze, progetti, AI, esperienze, contatti) stanno in `src/lib/site.ts`. Per cambiare un contenuto si modifica quel file, non i componenti. Un link social vuoto nasconde il relativo link. Per aggiungere un progetto si aggiunge un oggetto a `projects`; le schede "Progetto in arrivo" si spengono con `projectsSection.showPlaceholders`.
- **Pagine dei progetti:** i progetti con `details` in `site.ts` hanno una pagina `/progetti/<id>` (`src/app/progetti/[slug]/page.tsx`, sul modello di `references/Reference pagina progetto.pdf`) e la loro scheda nella griglia è cliccabile. Le schermate della galleria stanno in `public/projects/<id>/`. Con Cache Components e Partial Prefetching la lettura di `params` deve stare dentro `<Suspense>`, e al posto di `dynamicParams` si usa `notFound()`. Helper in `src/lib/projects.ts`.
- **Navigazione ad ancore:** `navItems` punta agli `id` delle sezioni con la "/" davanti (`/#home`, `/#expertise`, `/#projects`, …), così il menu funziona anche dalle pagine dei progetti; e il numero in apice segue l'ordine dell'elenco. Ogni sezione usa `Section` di `src/components/section.tsx`, che imposta `id`, `aria-labelledby` (`${id}-title`) e `scroll-mt-20` per compensare l'header fisso. Il titolo lo disegna la sezione, di solito con `SectionTitle`. Un nuovo `id` va tenuto allineato con `navItems`.
- **Server e client:** le sezioni sono Server Components. Sono client solo `header-shell`, `mobile-nav`, `hero-waves`, `custom-cursor`, `reveal`, `project-grid`, `copy-email-button` e alcuni componenti in `ui/`.
- **Tema:** il sito è solo scuro (classe `dark` fissa su `<html>`, nessun `next-themes`). I colori, campionati dal riferimento, sono variabili CSS in `:root` di `globals.css` ed esposti a Tailwind come `bg-bar`, `text-cyan`, `bg-quote-blue` e simili.
- **Font:** Poppins (titoli e testi) e Roboto Mono (menu e testi "in codice"), da `next/font/google` in `layout.tsx`.
- **Sfondo dell'hero:** un nastro di linee su canvas 2D in `hero-waves.tsx` (forma regolata da `CONTROL_POINTS`), sopra il quale stanno foto, social e nome. La foto si imposta con `site.photo`; vuota, mostra le iniziali. Il canvas si ferma fuori schermo, con la scheda nascosta e con movimento ridotto. Le animazioni all'ingresso usano `Reveal` (stili `[data-reveal]` in `globals.css`), che senza JavaScript o con movimento ridotto lascia il contenuto visibile.
- **Screenshot del portfolio:** `public/projects/portfolio-desktop.png` è una cattura del sito stesso, usata dalla scheda del portfolio. Va rifatta quando cambia la hero.
- **`cn`:** arriva dal pacchetto ufficiale `cn` di shadcn (sostituisce `clsx` + `tailwind-merge`). `src/lib/utils.ts` lo riesporta; i componenti in `src/components/ui/` lo importano direttamente da `"cn"`, come li genera la CLI di shadcn. Nuovi componenti UI si aggiungono con `npx shadcn add <nome>`.
- **Icone:** `lucide-react` non include più le icone dei brand, quindi GitHub e LinkedIn sono SVG in `src/components/icons.tsx`.

## Convenzioni

Il sito è in italiano (`lang="it"`): testi dell'interfaccia e commenti in italiano, nomi nel codice in inglese.

## Documento di progetto prima di ogni nuova funzionalità

Quando viene chiesto di sviluppare una nuova funzionalità o implementazione, **non scrivere codice subito**:

1. Verifica la data e l'ora correnti con un comando di sistema (ad esempio `Get-Date` in PowerShell o `date` in Bash), senza basarti su date presunte.
2. Scrivi un documento di progetto in `docs/`, nominato `YYYY-MM-DD-nome-funzione.md` (data corrente, nome della funzionalità in kebab-case). Il documento descrive cosa verrà fatto e sviluppato: obiettivo, file da creare o modificare, approccio tecnico ed eventuali scelte aperte.
3. Fermati e attendi una conferma esplicita dell'utente prima di procedere con l'implementazione.
