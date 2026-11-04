# Certificazioni con la Comet Card

Data: 2026-11-04
Stato: approvato il 2026-11-04 e implementato sul branch `feat/certificazioni`. Le scelte aperte sono state risolte così (vedi "Decisioni" in fondo).

## Obiettivo

Aggiungere alla sezione «Competenze» (`#expertise`) una sottocategoria «Certificazioni» che mostri i badge Credly ottenuti con i corsi di certificazione. Ogni badge è una [Comet Card di Aceternity UI](https://ui.aceternity.com/components/comet-card): una scheda che si inclina in 3D seguendo il mouse, con un riflesso di luce che si sposta e un leggero ingrandimento al passaggio. Il clic sulla scheda apre la pagina pubblica del badge su Credly.

Materiale di riferimento in `references/Certificazioni-reference/`:

- `AceternityUI_component`: il link al componente;
- `ibm-z-xplore-concepts.png`: il primo badge, PNG quadrato 1080 × 1080 (60 KB);
- `Link Creedly IBM ZXplore Concepts`: https://www.credly.com/badges/f4aea1d0-bdf9-4790-86a3-9e95697bf26b/public_url

## Il componente

Il registro di Aceternity (`https://ui.aceternity.com/registry/comet-card.json`) fornisce un solo file, `components/ui/comet-card.tsx`. È un Client Component con props `rotateDepth` (17.5), `translateDepth` (20), `className` e `children`, e usa `motion/react` (`useMotionValue`, `useSpring`, `useTransform`, `useMotionTemplate`). Il registro non elenca dipendenze, ma `motion` serve e nel progetto non c'è: va installato a parte (ultima versione 14.9.1).

### Installazione

1. In `components.json` si aggiunge il registro: `"registries": { "@aceternity": "https://ui.aceternity.com/registry/{name}.json" }`.
2. `npx shadcn@latest add @aceternity/comet-card` crea `src/components/ui/comet-card.tsx`.
3. `npm i motion`.

### Ritocchi al file generato

- `cn` arriva da `"cn"`, come negli altri componenti in `ui/`, invece che da `@/lib/utils`.
- **Movimento ridotto:** con `useReducedMotion()` di Motion, se l'utente ha chiesto meno animazioni, la scheda resta ferma: niente inclinazione, niente ingrandimento, niente riflesso.
- **Touch:** il componente reagisce solo a `onMouseMove`, quindi su telefono la scheda resta ferma e il tocco apre il link. Non serve altro.
- **Tastiera:** la scheda è un link, quindi riceve il focus. Le si dà un anello di focus visibile (`focus-visible:ring` in ciano) e, al focus, lo stesso ingrandimento del passaggio del mouse.

## Come appare

Sotto il riquadro delle tre competenze e il frammento di codice decorativo compare:

- un sottotitolo «Certificazioni», più piccolo del titolo della sezione (un `<h3>` con il tratto colorato `marker-underline`, come i titoli delle competenze), con `id="certifications"` e `scroll-mt-20` per farci arrivare direttamente con un link;
- una riga di testo: «I badge che ho ottenuto con i corsi di certificazione, verificabili su Credly.»;
- le schede, centrate e affiancate in un `flex flex-wrap justify-center gap-10`, ognuna larga `w-72` (288 px). Con un solo badge la scheda resta al centro, e se ne arrivano altri vanno a capo da sole.

Ogni scheda riprende la demo di Aceternity, adattata al sito:

- sfondo scuro arrotondato (`rounded-2xl`, colore vicino a quello delle schede dei progetti), padding interno;
- l'immagine del badge, quadrata, con `next/image` (`sizes="288px"`) e angoli arrotondati. A differenza della demo i colori restano pieni, senza `saturate-0`;
- sotto, in Roboto Mono, il nome del badge a sinistra e l'ente con la data a destra, attenuati, come «Comet Invitation / #F7RA» della demo;
- l'intera scheda è un `<a href={url} target="_blank" rel="noopener noreferrer">`, con un `aria-label` del tipo «IBM Z Xplore - Concepts, badge Credly (si apre in una nuova scheda)».

Il sottotitolo e le schede entrano con `Reveal`, come il resto della sezione.

## Dati (`src/lib/site.ts`)

```ts
export type Certification = {
  name: string;
  issuer: string;
  date: string;   // testo libero, es. "Novembre 2026"
  image: string;  // in public/certifications/
  url: string;    // pagina pubblica del badge su Credly
};

export const certificationsSection = {
  title: "Certificazioni",
  intro: "I badge che ho ottenuto con i corsi di certificazione, verificabili su Credly.",
  newTabLabel: "si apre in una nuova scheda",
};

export const certifications: Certification[] = [
  {
    name: "IBM Z Xplore - Concepts",
    issuer: "IBM",
    date: "…", // da confermare, vedi scelte aperte
    image: "/certifications/ibm-z-xplore-concepts.png",
    url: "https://www.credly.com/badges/f4aea1d0-bdf9-4790-86a3-9e95697bf26b/public_url",
  },
];
```

Con l'elenco vuoto la sottocategoria non viene mostrata. Per aggiungere un badge si copia il PNG in `public/certifications/` e si aggiunge un oggetto all'elenco.

## File

| File | Modifica |
| --- | --- |
| `components.json` | Registro `@aceternity` |
| `package.json`, `package-lock.json` | Dipendenza `motion` |
| `src/components/ui/comet-card.tsx` | Nuovo, dal registro, con i ritocchi indicati sopra |
| `src/components/certification-card.tsx` | Nuovo: il contenuto della scheda (immagine, testi, link) dentro `CometCard` |
| `src/components/sections/expertise.tsx` | Sottocategoria «Certificazioni» sotto il riquadro delle competenze |
| `src/lib/site.ts` | `Certification`, `certificationsSection`, `certifications` |
| `public/certifications/ibm-z-xplore-concepts.png` | Il badge, copiato dalla reference |
| `CLAUDE.md` | Certificazioni, Comet Card e `motion` in "Architettura"; `comet-card` tra i componenti client |
| `docs/Informazioni_progetto_stack/Informazioni_progetto_stack.md` | Tecnologia nuova (`motion`), componente, ricetta "aggiungere un badge" e registro, dopo il commit |

`expertise.tsx` resta un Server Component: solo `CometCard` è client.

## Verifica

`npm run lint` e `npm run build`. Poi controllo nel browser a 1440 e 390 px: inclinazione e riflesso con il mouse, focus con il Tab, link a Credly in una nuova scheda, scheda ferma con movimento ridotto. Va controllato anche che il cursore personalizzato (`custom-cursor`) si veda bene sopra la scheda inclinata.

## Scelte aperte

1. **Data del badge.** La pagina Credly si carica con JavaScript, quindi da qui non riesco a leggere i dettagli. Serve la data di rilascio, e la scadenza se c'è. L'ente l'ho preso dall'immagine (IBM).
2. **Voce nel menu.** La prima richiesta era un sottomenu «certificazioni» sotto `// competenze`. Proposta: aggiungerlo, puntando a `/#certifications`. Su desktop si apre al passaggio del mouse o con il Tab; su mobile compare come voce rientrata sotto «competenze», senza un numero proprio. In alternativa lo si lascia fuori e le certificazioni si raggiungono solo scorrendo la sezione.
3. **Colori del badge.** Proposta: colori pieni. La demo invece usa il bianco e nero (`saturate-0`): si potrebbe tenere così e mostrare i colori solo al passaggio del mouse.
4. **Frammento di codice decorativo.** Proposta: le certificazioni vanno sotto il frammento. In alternativa vanno subito sotto il riquadro e il frammento resta in fondo alla sezione.

## Decisioni (2026-11-04)

1. **Data:** rilascio il 3 novembre 2026, ente IBM.
2. **Menu:** sottomenu «certificazioni» sotto «competenze», senza numero proprio. `navItems` ha ora il tipo `NavItem` con `children`. Su desktop il pannello si apre solo con CSS (`group-hover` e `group-focus-within`): in apertura la `visibility` scatta subito, altrimenti il Tab successivo saltava il sottomenu. Su mobile la voce compare rientrata sotto «competenze». `certifications` si è spostato in cima a `site.ts`, perché da quell'elenco dipende anche la voce del menu.
3. **Colori:** pieni. Al passaggio del mouse, oltre al riflesso bianco originale, c'è un riflesso cromatico «foil» (prop `foil` della `CometCard`): fasce iridescenti in `repeating-linear-gradient` con `mix-blend-color-dodge`, che scorrono in senso opposto al cursore dentro una maschera radiale centrata sul punto di luce. Entrambi i riflessi compaiono solo al passaggio del mouse, quindi a riposo il badge ha i suoi colori.
4. **Posizione:** le certificazioni stanno sotto il riquadro delle competenze. Prima il frammento di codice decorativo era sullo sfondo, dietro alle schede, poi l'ho tolto: senza, la sezione è più pulita. Ora è il componente `CodeFragment` e compare, sotto il riquadro come prima, solo con l'elenco dei badge vuoto.
5. **Impaginazione:** al massimo tre badge per riga, con `flex-wrap` centrato in un contenitore largo `59rem` (3 schede da `18rem` più 2 spazi da `2.5rem`). Dal quarto badge si va a capo e la riga incompleta resta centrata; su tablet stanno due per riga, su telefono uno. Il ritardo di `Reveal` riparte a ogni riga (`index % 3`).
6. **Istruzioni:** i passaggi per aggiungere altri badge sono in `docs/Istruzioni inserimento Credenziali.md`.

**Movimento ridotto:** la scheda non ha un ramo statico a parte, perché `useReducedMotion()` vale `null` sul server e il ramo diverso causava un errore di idratazione. La struttura resta la stessa e con movimento ridotto i gestori del mouse e `whileHover` non fanno nulla.
