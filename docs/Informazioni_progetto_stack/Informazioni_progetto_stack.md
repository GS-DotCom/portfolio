# Informazioni sul progetto e sullo stack

Documento di riferimento del portfolio: le tecnologie usate, come funziona ogni componente e quali file toccare per ogni modifica.

**Va aggiornato dopo ogni commit** (regola in `CLAUDE.md`): si aggiornano le sezioni che cambiano e si aggiunge una riga al [registro delle modifiche](#registro-delle-modifiche).

Ultimo aggiornamento: 2026-10-22, dopo il commit `342d8f9`.

---

## 1. Panoramica

È un portfolio personale: un sito a pagina unica con le sezioni Hero, Competenze, Progetti, AI, Esperienza e Contatti, più una pagina di dettaglio per ogni progetto (`/progetti/<id>`). Stile e struttura riprendono [tamalsen.dev](https://tamalsen.dev/); il materiale di riferimento è in `references/`, che resta solo in locale perché escluso da git.

- Il sito è **solo in tema scuro** e **in italiano** (`lang="it"`). Testi e commenti sono in italiano, i nomi nel codice in inglese.
- **Tutti i testi** stanno in un solo file, `src/lib/site.ts`. Per cambiare un contenuto si modifica quel file, non i componenti.
- Il codice è sviluppato in *vibe coding* con Claude Code dentro Cursor. Ogni nuova funzionalità parte da un documento in `docs/`, approvato prima di scrivere il codice.

---

## 2. Lo stack

| Tecnologia | Versione | A cosa serve |
| --- | --- | --- |
| **Next.js** | 16.4.2 | Framework React: routing a file (App Router), rendering sul server, build e ottimizzazione delle immagini. Usa **Turbopack** come bundler. |
| **React** / React DOM | 19.3.0 | Libreria dell'interfaccia: componenti, stato (`useState`), effetti (`useEffect`). |
| **TypeScript** | 5.9.3 | JavaScript con i tipi: segnala gli errori prima di eseguire il codice. Configurazione in `tsconfig.json`; l'alias `@/` punta a `src/`. |
| **Tailwind CSS** | 4.3.3 | Stili scritti come classi direttamente nell'HTML (`text-cyan`, `mt-4`, `sm:text-7xl`…). Nella v4 il tema sta in `src/app/globals.css`, senza un `tailwind.config`. |
| **@tailwindcss/turbopack** | 4.3.3 | Collega Tailwind a Turbopack al posto di PostCSS (regola `turbopack.rules` in `next.config.ts`). |
| **tw-animate-css** | 1.4.0 | Animazioni pronte per Tailwind, usate dai componenti shadcn (apertura e chiusura del menu mobile). |
| **shadcn** (CLI) | 4.22.1 | Genera i componenti in `src/components/ui/` con lo stile `base-nova` (configurazione in `components.json`). I componenti si aggiungono con `npx shadcn add <nome>` e restano codice nostro, modificabile. |
| **@base-ui/react** | 1.9.0 | Base dei componenti shadcn di questo progetto (al posto di Radix). Fornisce comportamento e accessibilità, ad esempio il pannello del menu mobile. |
| **class-variance-authority** | 0.7.1 | Definisce le varianti dei componenti UI, come `variant` e `size` del pulsante. |
| **cn** | 0.5.0 | Unisce le classi Tailwind risolvendo i conflitti. Sostituisce `clsx` + `tailwind-merge`; si importa da `@/lib/utils`. |
| **lucide-react** | 1.59.0 | Icone (frecce, menu, valigetta…). Non ha più le icone dei brand, quindi quelle sono SVG nostri. |
| **next/font** (Google Fonts) | incluso in Next | Carica **Poppins** (titoli e testi) e **Roboto Mono** (menu e testi "in codice") senza richieste esterne a runtime. |
| **ESLint** + eslint-config-next | 9.39.5 / 16.4.2 | Controllo statico del codice (`npm run lint`), con le regole di Next per Core Web Vitals e TypeScript. |

Loghi delle tecnologie (copiati come tracciati SVG, nessuna dipendenza): **Simple Icons** 16.35 (licenza CC0) e **Devicon** 2.17 (licenza MIT).

### Opzioni di Next.js attive (`next.config.ts`)

- **`cacheComponents: true`**: il nuovo modello di cache di Next 16. Le pagine sono statiche per impostazione predefinita e i dati legati alla richiesta vanno dichiarati. Conseguenze pratiche:
  - niente `new Date()` nei Server Components, infatti l'anno del footer è scritto a mano;
  - nelle route dinamiche `dynamicParams` non esiste e si usa `notFound()`.
- **`partialPrefetching: true`**: i `<Link>` precaricano solo la "App Shell" della pagina di destinazione, la parte comune a tutti gli URL di quella route. Per questo nella pagina di un progetto la lettura di `params` sta dentro `<Suspense>`.
- **`allowedDevOrigins: ["192.168.1.210"]`**: permette di aprire il server di sviluppo dal telefono, all'IP del PC in rete locale. Se dopo un cambio di branch o un merge il sito sul telefono mostra solo le scritte, va riavviato `npm run dev`.

---

## 3. Struttura dei file

```
src/
├─ app/                          ← routing: ogni cartella è un URL
│  ├─ layout.tsx                 ← guscio HTML comune: font, tema scuro, cursore personalizzato
│  ├─ page.tsx                   ← home "/": header + sezioni in ordine
│  ├─ globals.css                ← tema (colori, font, animazioni) e utility Tailwind personalizzate
│  ├─ favicon.ico
│  └─ progetti/[slug]/page.tsx   ← pagina di dettaglio "/progetti/<id>"
├─ components/
│  ├─ sections/                  ← una sezione della home per file (Server Components)
│  │  ├─ hero.tsx · expertise.tsx · projects.tsx · ai.tsx · experience.tsx · contact.tsx
│  ├─ ui/                        ← componenti shadcn (button, sheet, badge, card, separator)
│  ├─ site-header.tsx · header-shell.tsx · mobile-nav.tsx   ← header e menu
│  ├─ section.tsx                ← contenitore comune delle sezioni e titolo
│  ├─ reveal.tsx                 ← dissolvenza all'ingresso nello schermo
│  ├─ hero-waves.tsx             ← nastro animato su canvas della hero
│  ├─ tech-logos.tsx             ← loghi delle tecnologie della hero
│  ├─ project-grid.tsx · project-cover.tsx                  ← griglia e copertine dei progetti
│  ├─ experience-timeline.tsx    ← linea del tempo delle esperienze
│  ├─ copy-email-button.tsx      ← pulsante "copia email"
│  ├─ custom-cursor.tsx          ← cerchio azzurro che segue il mouse
│  └─ icons.tsx                  ← SVG di GitHub e LinkedIn
└─ lib/
   ├─ site.ts                    ← TUTTI i contenuti del sito
   ├─ projects.ts                ← funzioni sui progetti (indirizzi, precedente/successivo)
   └─ utils.ts                   ← riesporta cn

public/                          ← file serviti così come sono
├─ pesso.jpg                     ← foto della hero
├─ projects/portfolio-desktop.png, portfolio-mobile.png   ← copertine della scheda progetto
├─ projects/portfolio/*.png      ← galleria della pagina del portfolio
└─ socials/*.png                 ← loghi social (oggi non usati)

docs/                            ← documenti di progetto (uno per funzionalità)
└─ Informazioni_progetto_stack/  ← questo documento
references/                      ← materiale di riferimento, solo in locale
next.config.ts · tsconfig.json · eslint.config.mjs · components.json · package.json
CLAUDE.md · AGENTS.md            ← istruzioni per Claude Code
```

---

## 4. Come funziona il rendering

Next.js con l'App Router distingue due tipi di componenti:

- **Server Components** (predefiniti): sono eseguiti in fase di build o sul server e producono HTML. Non mandano JavaScript al browser. Sono tutte le sezioni, la pagina del progetto, `section.tsx`, `project-cover.tsx`, `experience-timeline.tsx`, `tech-logos.tsx` e `icons.tsx`.
- **Client Components** (file che iniziano con `"use client"`): sono anche eseguiti nel browser, dove servono stato, effetti o eventi. Sono:
  - `header-shell`: sfondo dell'header dopo lo scorrimento;
  - `mobile-nav`: apertura del menu;
  - `hero-waves`: animazione del canvas;
  - `custom-cursor`: segue il mouse;
  - `reveal`: osserva quando un elemento entra nello schermo;
  - `project-grid`: filtri;
  - `copy-email-button`: appunti.

All'avvio React "idrata" la pagina: collega il JavaScript all'HTML già pronto. Finché non idrata, le animazioni, il menu e le sezioni con `Reveal` non partono. Senza JavaScript, `Reveal` lascia comunque il contenuto visibile.

**Build:** `npm run build` genera in anticipo la home e `/progetti/portfolio` come pagine statiche, grazie a `generateStaticParams`.

---

## 5. Le pagine

### Home: `src/app/page.tsx`
Mostra `SiteHeader` e, in ordine, `Hero`, `Expertise`, `Projects`, `Ai`, `Experience` e `Contact`. Ogni sezione usa `Section`, che imposta l'`id` per le ancore del menu (`#home`, `#expertise`, …), `aria-labelledby` e `scroll-mt-20` per non finire sotto l'header fisso. La sezione Contatti fa anche da footer.

### Pagina del progetto: `src/app/progetti/[slug]/page.tsx`
`[slug]` è un segmento dinamico: `/progetti/portfolio` passa `slug = "portfolio"`.

- **`generateStaticParams`** genera una pagina per ogni progetto con `details`.
- **`generateMetadata`** imposta il titolo della scheda del browser.
- **Struttura:** header, «← Torna ai progetti», categoria e titolo, percorso (Home › Progetti › titolo), descrizione con «Cliente» e «Stack tecnologico», link «Apri il progetto» (solo se c'è `url`), galleria di schermate, barra «Progetto successivo» (solo con almeno due progetti) e footer.
- **App Shell e Suspense:** header, pulsante indietro e footer non dipendono dal progetto. Tutto il resto sta in `ProjectContent`, dentro `<Suspense>`, come richiede il Partial Prefetching.
- **Slug sconosciuto:** porta alla pagina 404 con `notFound()`.

---

## 6. I componenti, uno per uno

### Layout e navigazione

- **`app/layout.tsx`**: il guscio comune a tutte le pagine.
  - Imposta `<html lang="it" class="dark">` e i font Poppins e Roboto Mono come variabili CSS.
  - `scroll-smooth` dà lo scorrimento morbido verso le ancore; `data-scroll-behavior="smooth"` lo disattiva nei cambi di pagina.
  - Mostra `CustomCursor` su tutte le pagine.
- **`site-header.tsx`**: il menu desktop, centrato, con «// home», «// competenze»… e il numero in apice, generati da `navItems` di `site.ts`. Su mobile mostra solo `MobileNav`.
- **`header-shell.tsx`** (client): l'header fisso. È trasparente sopra la hero e, dopo 24 px di scorrimento, prende lo sfondo della pagina con sfocatura (`data-scrolled`).
- **`mobile-nav.tsx`** (client): il pulsante «Apri menu» apre un pannello laterale (`ui/sheet`, basato su Base UI). Cliccando un link il pannello si chiude.
- **`section.tsx`**: `Section`, il contenitore di ogni sezione, e `SectionTitle`, il titolo centrato.
- **`custom-cursor.tsx`** (client): il cerchio azzurro che segue il mouse con un leggero ritardo. Usa `requestAnimationFrame`, compare solo con mouse o trackpad e senza ritardo se è attivo il movimento ridotto.
- **`reveal.tsx`** (client): dissolvenza dal basso quando l'elemento entra nello schermo. Usa `IntersectionObserver` e imposta `data-reveal="shown"`; gli stili sono in `globals.css`.

### Hero: `sections/hero.tsx`

- Lo sfondo sfuma verso il resto della pagina. Al centro ci sono foto (`site.photo`, con le iniziali se manca), icone di GitHub e LinkedIn, nome e sottotitolo.
- **`hero-waves.tsx`** (client): un nastro di circa 50 linee su `<canvas>` 2D.
  - Ogni linea segue una curva Catmull-Rom definita da `CONTROL_POINTS`, con uno scarto sinusoidale che crea l'effetto "nastro che si avvita".
  - Il colore sfuma dal magenta al viola all'indaco.
  - Si ferma fuori schermo, con la scheda nascosta e con movimento ridotto, e si adatta alla densità dei pixel.
- **Riga "Tecnologie che uso":** scorre da sola verso sinistra, solo con CSS.
  - L'elenco è ripetuto due volte e l'animazione `marquee` sposta la traccia di metà, così il ciclo non ha salti.
  - Sfuma ai lati con `mask-x-from-85%` e si ferma al passaggio del mouse.
  - Con movimento ridotto resta ferma e si scorre a mano.
  - La larghezza massima è `max-w-4xl`.
- **`tech-logos.tsx`:** il componente `TechLogo` mostra il logo accanto a ogni nome.
  - Lo cerca per nome tra i tracciati SVG di Simple Icons e Devicon, oppure tra le icone generiche di lucide per IBM e DB2.
  - Il logo è grigio come il testo (`fill="currentColor"`) e alto quanto le maiuscole (`h-[1cap]`, con ripiego `0.7em`).
- **Indicatore di scorrimento:** il mouse stilizzato in basso, che porta a `#expertise`.

### Competenze: `sections/expertise.tsx`
Le tre aree di competenza (Sviluppo Web, Database, Sistemi e reti), con le icone lucide `Monitor`, `Database` e `Network`, e un frammento di codice decorativo. I dati stanno in `expertise` di `site.ts`.

### Progetti: `sections/projects.tsx`, `project-grid.tsx`, `project-cover.tsx`

- **`projects.tsx`:** il titolo «I miei Progetti» e l'introduzione. Toglie i segnaposto se `projectsSection.showPlaceholders` è falso.
- **`project-grid.tsx`** (client):
  - i filtri «Tutti / Web app / App», con il conteggio in apice;
  - una griglia a mosaico, in cui le schede `large` occupano due colonne.
  - Le schede con pagina sono cliccabili per intero: un `Link` con uno pseudo-elemento copre la scheda e mostra la mano. Al passaggio del mouse la categoria sfuma e compare «Apri progetto →».
- **`project-cover.tsx`:** la copertina della scheda. Lo screenshot vero sta in una finestra di browser stilizzata; i segnaposto hanno un browser o un telefono astratti.
- **`lib/projects.ts`:**
  - `hasDetails` e `projectsWithDetails`: i progetti che hanno una pagina;
  - `projectPath` e `projectHref`: l'indirizzo `/progetti/<id>`;
  - `getProject`: un progetto a partire dall'id;
  - `getAdjacentProjects`: il precedente e il successivo, a giro.

### AI: `sections/ai.tsx`
Racconta il vibe coding con Claude: un finto terminale con richieste e risposte, i quattro passi del metodo di lavoro e le tecnologie del sito. I testi sono in `aiSection` di `site.ts`.

### Esperienza: `sections/experience.tsx`, `experience-timeline.tsx`
Due linee del tempo verticali, con linea bianca, cerchi viola e schede bianche: una per le esperienze di lavoro e una per formazione e altre esperienze. Da `lg` le schede si alternano ai due lati, con la data di fronte; su mobile formano una colonna con la linea a sinistra. I dati sono `experience`, `education` e `otherExperience` di `site.ts`.

### Contatti: `sections/contact.tsx`, `copy-email-button.tsx`
Il titolo, l'email con il pulsante «copia» e tre riquadri colorati a forma di citazione con i punti di forza (`contact.strengths`). **`copy-email-button.tsx`** (client) copia l'indirizzo negli appunti (`navigator.clipboard`) e dopo 2,5 secondi torna allo stato iniziale.

### Componenti UI (`components/ui/`, generati da shadcn)
`button` e `sheet` sono usati dal menu mobile. `badge`, `card` e `separator` sono presenti ma oggi non usati. Importano `cn` direttamente da `"cn"`, come li genera la CLI.

---

## 7. I contenuti: `src/lib/site.ts`

| Oggetto | Contenuto |
| --- | --- |
| `site` | Nome, ruolo, città, email, foto, descrizione, link social (un link vuoto nasconde l'icona) |
| `navItems` | Voci del menu: etichetta e ancora `/#id` |
| `hero` | Sottotitolo, etichetta ed elenco delle tecnologie della riga che scorre |
| `about` | Presentazione estesa, oggi non mostrata |
| `expertise` | Le tre aree di competenza |
| `projectsSection` | Titolo, introduzione, filtri, «Apri progetto», `showPlaceholders` |
| `projects` | Elenco dei progetti: `id`, titolo, categoria, dimensione, immagine e `details` (descrizione, cliente, tecnologie, `url`, galleria) |
| `projectPage` | Testi fissi della pagina del progetto e della barra «Progetto successivo» |
| `aiSection` | Testi della sezione AI e del finto terminale |
| `experienceSection`, `experience`, `education`, `otherExperience` | Linee del tempo |
| `contact` | Testi dei contatti e punti di forza |

---

## 8. Stile e tema: `src/app/globals.css`

- **Import:** `tailwindcss`, `tw-animate-css` e `shadcn/tailwind.css`.
- **Colori:** sono variabili in `:root`, campionate dal riferimento, ad esempio `--background: #1a191e`, `--cyan`, `--violet` e `--quote-blue`. Il blocco `@theme inline` le espone a Tailwind come classi: `bg-background`, `text-cyan`, `bg-quote-blue`…
- **Font:** `font-sans` e `font-heading` usano Poppins, `font-mono` usa Roboto Mono.
- **Animazioni**, nel blocco `@theme`:
  - `card-breathe`: il "respiro" delle schede;
  - `scroll-hint`: l'indicatore di scorrimento;
  - `marquee`: la riga delle tecnologie, 40 s per un giro;
  - `--ease-float`: la curva di movimento delle schede.
- **Utility personalizzate** (`@utility`): `card-float`, cioè l'ombra e il sollevamento delle schede al passaggio del mouse, e `marker-underline`, la sottolineatura colorata.
- **Reveal:** gli stili `[data-reveal]` valgono solo con JavaScript attivo e senza movimento ridotto.

---

## 9. Comandi e flusso di lavoro

| Comando | Effetto |
| --- | --- |
| `npm run dev` | Server di sviluppo su http://localhost:3000 (e http://192.168.1.210:3000 dalla rete locale) |
| `npm run build` | Build di produzione, con anche il controllo dei tipi |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Solo il controllo dei tipi |

Non ci sono test automatici: le verifiche si fanno con lint, tipi e controllo nel browser a 1440 e 375–390 px.

**Flusso di una modifica:**
1. per una nuova funzionalità, documento in `docs/AAAA-MM-GG-nome.md` e conferma dell'utente;
2. codice;
3. lint, tipi e controllo nel browser;
4. commit su un branch `feat/…`, un commit per funzionalità;
5. aggiornamento di questo documento;
6. PR verso `main` e merge.

**Problemi noti in sviluppo:**
- Se Tailwind non vede una nuova animazione o utility in `globals.css`, si ferma il server, si cancella `.next` e si riavvia.
- Dopo un cambio di branch o un merge che tocca `next.config.ts`, conviene riavviare `npm run dev`, altrimenti l'accesso dal telefono può essere bloccato.

---

## 10. Come fare le modifiche più comuni

| Voglio… | File | Come |
| --- | --- | --- |
| Cambiare un testo qualsiasi | `src/lib/site.ts` | Modificare la stringa nell'oggetto della sezione |
| Aggiungere una tecnologia alla hero | `site.ts` → `hero.technologies` | Aggiungere il nome; per il logo vedi la riga sotto |
| Aggiungere il logo di una tecnologia | `src/components/tech-logos.tsx` | Copiare il `d="…"` del `<path>` da simpleicons.org o devicon.dev in `brandLogos`, con la chiave uguale al nome; se il disegno ha margini, ritagliare il `viewBox` |
| Cambiare velocità della riga che scorre | `globals.css` → `--animate-marquee` | Cambiare `40s` |
| Cambiare larghezza o sfumatura della riga | `sections/hero.tsx` | `max-w-4xl` e `mask-x-from-85%` |
| Aggiungere un progetto | `site.ts` → `projects` | Aggiungere un oggetto. Con `details` ha una pagina `/progetti/<id>`, compare nella barra «Progetto successivo» e va rigenerato con `npm run build`. Le schermate vanno in `public/projects/<id>/` |
| Cambiare la scritta al passaggio sulla scheda | `site.ts` → `projectsSection.openLabel`; effetto in `project-grid.tsx` | Testo in `site.ts`; colore e dissolvenza nelle classi `group-hover:` |
| Cambiare i colori del sito | `globals.css` → `:root` | Modificare le variabili |
| Cambiare la forma del nastro della hero | `src/components/hero-waves.tsx` | Modificare `CONTROL_POINTS` |
| Aggiungere una voce al menu | `site.ts` → `navItems` e una sezione con lo stesso `id` | L'ancora deve corrispondere all'`id` di `Section` |
| Aggiungere un componente UI | Terminale | `npx shadcn add <nome>` |

Quando cambia la hero vanno rifatti gli screenshot `public/projects/portfolio-desktop.png` e `public/projects/portfolio/hero.png`, a 1440 × 900.

---

## Registro delle modifiche

Una riga per commit, dal più recente. Per i dettagli di ogni funzionalità c'è il documento di progetto indicato. I commit che aggiornano solo questo documento non hanno una riga propria.

| Data | Commit | Modifica | Documento |
| --- | --- | --- | --- |
| 2026-10-22 | — | Creato questo documento e la regola in `CLAUDE.md` per aggiornarlo dopo ogni commit | — |
| 2026-10-22 | `342d8f9` | Barra «Progetto successivo» in fondo alle pagine dei progetti | `2026-10-22-progetto-successivo.md` |
| 2026-10-22 | `b3f368f` | Tolti `Image` e `socialClass` inutilizzati da `contact.tsx` (avvisi del lint) | — |
| 2026-10-22 | `1b909a2` | Social tolti dai contatti, formazione ampliata, `allowedDevOrigins` | — |
| 2026-10-22 | `90daea8` | Loghi delle tecnologie nella hero | `2026-10-22-loghi-tecnologie.md` |
| 2026-10-22 | `da292ec` | Pagina di dettaglio dei progetti e schede cliccabili | `2026-10-22-pagina-progetto.md` |
| 2026-10-22 | `92e158b` | Tecnologie della hero su una riga che scorre | `2026-10-22-tecnologie-a-scorrimento.md` |
| 2026-10-21 | `ddf1d79` | Nuova hero con nastro su canvas, timeline delle esperienze, sezione AI | `2026-10-21-sfondo-hero-onde.md`, `2026-10-21-timeline-esperienze.md`, `2026-10-21-sezione-ai.md` |
| 2026-10-21 | `b91c14f` | Restyling sul modello di tamalsen.dev | `2026-10-20-restyling-stile-tamalsen.md` |
| 2026-10-20 | `4bf17aa` | Schede fluttuanti di esperienze e progetti | `2026-10-20-card-esperienze-fluttuanti.md` |
| 2026-10-20 | `e30ebba` | Sezione Progetti come vetrina di app e web app | `2026-10-20-sezione-progetti.md` |
| 2026-10-20 | `9c2a331` | Sfondo LED di rete, esperienze complete, scheda contatti | `2026-10-20-sfondo-led-esperienze-contatti.md` |
| 2026-10-19 | `5de1bce` … `25c21b4` | Primo commit, `CLAUDE.md` e regola del documento di progetto | — |
