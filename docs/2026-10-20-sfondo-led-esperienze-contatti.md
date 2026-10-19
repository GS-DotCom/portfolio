# Sfondo "LED di rete", esperienze complete e scheda contatti

Data: 2026-10-20
Stato: approvato e implementato, con le proposte indicate in "Scelte aperte"
Anteprima approvata: https://claude.ai/artifact/V3JAuS1pbLLNFN7iMDPrXG (link privato)

## Obiettivo

Tre interventi, già visti e approvati nell'anteprima:

1. **Sfondo animato della hero.** La griglia CSS statica di oggi diventa una matrice di punti disegnata su canvas, che lampeggia piano come le spie di uno switch. Alcuni rari punti si accendono di verde, lo stesso smeraldo del badge "Disponibile". Il riferimento è il componente [Flickering Grid](https://craftwork.design/components/magic-ui/flickering-grid) di Magic UI, trovato su Craftwork.
2. **Sezione Esperienza completa, come da curriculum.**
   - I tre ruoli IT (Romeo Ficacci, T.S.I Group, Contaq) diventano schede su una linea del tempo, con descrizione completa e tag di ambiti e tecnologie.
   - Le altre esperienze (Car Lovers, StanHome, Poste Italiane) vanno in un elenco compatto.
   - Si aggiunge un blocco "Formazione": Istituto CEFI, Scuola del Fumetto Comix, Liceo Artistico Tivoli.
3. **Scheda contatti con l'email in evidenza.**
   - L'indirizzo è scritto in grande, con l'etichetta "Email per proposte".
   - I pulsanti sono "Scrivimi" (un `mailto:` con oggetto già compilato), "Copia indirizzo", LinkedIn e GitHub.

## File da creare

| File | Contenuto |
| --- | --- |
| `src/components/network-leds-background.tsx` | Client Component (`"use client"`) con il canvas dello sfondo |
| `src/components/copy-email-button.tsx` | Client Component: pulsante che copia l'email negli appunti e mostra la conferma |

## File da modificare

| File | Modifica |
| --- | --- |
| `src/components/sections/hero.tsx` | Sostituisce il `div` della griglia CSS con `<NetworkLedsBackground />`. La hero resta un Server Component. |
| `src/app/globals.css` | Aggiunge i token dello sfondo in `:root` e `.dark`: colore dei punti, colore dei LED, opacità massima. |
| `src/lib/site.ts` | Estende `experience` con `tags` e un campo per distinguere i ruoli IT dagli altri; aggiunge `education` e il testo della scheda contatti. |
| `src/components/sections/experience.tsx` | Nuovo layout: linea del tempo con schede (`Card`) per i ruoli IT; sotto, due colonne "Altre esperienze" e "Formazione" che diventano una sola sotto i 768px. |
| `src/components/sections/contact.tsx` | Email in evidenza, `CopyEmailButton` accanto al pulsante `mailto:`, nota di disponibilità con il pallino verde. |

I testi restano tutti in `src/lib/site.ts`, come da convenzione del progetto. I componenti leggono solo i dati.

## Approccio tecnico

### Sfondo `NetworkLedsBackground`

- **Disegno:** un `<canvas>` in posizione assoluta (`inset-0 -z-10`, `aria-hidden`). Disegna punti da 3px con passo di 8px, a circa 30 fotogrammi al secondo tramite `requestAnimationFrame`.
  - Ogni punto cambia luminosità a caso, in media ogni 1,5 secondi.
  - Lo 0,5% dei punti diventa un LED verde.
  - I punti sono salvati in `Float32Array` e `Uint8Array`, così si evitano oggetti per ogni cella.
- **Responsive:**
  - Un `ResizeObserver` ricalcola righe e colonne. Il `devicePixelRatio` è limitato a 2.
  - La maschera radiale cambia con il breakpoint `md`: su mobile l'effetto scende dall'alto, da desktop si sposta a destra e lascia libera la colonna del testo.
- **Prestazioni:** l'animazione si ferma quando la hero esce dallo schermo (`IntersectionObserver`) e quando la scheda è nascosta (`visibilitychange`).
- **Accessibilità:** con `prefers-reduced-motion: reduce` viene disegnato un solo fotogramma statico. Il pulsante "Anima comunque" dell'anteprima non va sul sito.
- **Tema:** i colori arrivano dai token CSS. Al cambio tema (`resolvedTheme` di `next-themes`) il canvas li rilegge e ridisegna, senza aspettare il fotogramma successivo.
- **Fallback:** finché il canvas non è pronto, o senza JavaScript, la hero resta sullo sfondo pulito della pagina.

### Esperienza e contatti

- `experience.tsx` resta un Server Component e riusa `Card` e `Badge` di shadcn.
- Solo il pulsante di copia è client: usa `navigator.clipboard.writeText`. Se fallisce, seleziona il testo e chiede di premere Ctrl+C.

### Verifiche

- `npm run lint` e `npm run build` (la build fa anche il type-check).
- Controllo visivo a 1440 e 390px, in tema chiaro e scuro, senza scroll orizzontale.
- Controllo che l'animazione si fermi con movimento ridotto.

Prima di scrivere il codice vanno lette le guide pertinenti in `node_modules/next/dist/docs/`, come chiede `AGENTS.md`.

## Scelte aperte

1. **Codice dello sfondo.** Le opzioni sono due:
   - tenere la versione in JavaScript scritta per l'anteprima (gratuita, nessuna dipendenza);
   - scaricare il codice originale di Flickering Grid da Craftwork, che è a pagamento e consuma la quota del piano.

   Proposta: tenere la versione scritta in casa, che fa lo stesso effetto e non aggiunge dipendenze.
2. **Numero di telefono.** È presente nel CV ma non nell'anteprima. Proposta: lasciarlo fuori dal sito pubblico.
3. **Voto del diploma (78/100).** Proposta: non mostrarlo.
4. **Separatore dei periodi.** Il sito usa "2024 — 2025" con il trattino lungo. Proposta: lasciarlo com'è per coerenza, oppure passare al trattino semplice "2024-2025".

## Decisioni

Approvate tutte le proposte: sfondo scritto in casa, niente telefono, niente voto del diploma, periodi con "—".

Differenze rispetto al piano, emerse durante l'implementazione:

- **Dati:** in `site.ts` le esperienze fuori dall'IT sono in un array separato, `otherExperience`, invece che in un campo dentro `experience`. I componenti risultano più semplici.
- **Cambio tema:** il canvas osserva la classe di `<html>` con un `MutationObserver` invece di usare `resolvedTheme`. Così rilegge i colori dopo che `next-themes` ha applicato la classe.
- **Nota di disponibilità nei contatti:** dice solo "Disponibile per nuove opportunità.", senza indicazioni di zona che il CV non riporta.
