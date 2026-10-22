# Barra "Progetto successivo" nelle pagine dei progetti

Data: 2026-10-22
Stato: implementato (richiesto esplicitamente dall'utente insieme al commit); verificato con un progetto di prova temporaneo, poi rimosso

## Obiettivo

Nella pagina di dettaglio di un progetto (`/progetti/<id>`) aggiungere, come nel riferimento `references/Reference-pagina-progetti` (blocco `sticky-nav` di tamalsen.dev), una barra che porta al progetto successivo:

- la scritta "Progetto successivo";
- il titolo del progetto successivo, cliccabile, con la sua anteprima;
- due pulsanti tondi a freccia per il progetto precedente e quello successivo.

## Comportamento

- L'ordine è quello dell'elenco `projects` in `src/lib/site.ts`, contando solo i progetti con una pagina (quelli con `details`).
- Il giro è circolare: dopo l'ultimo si torna al primo, e prima del primo c'è l'ultimo.
- **Con un solo progetto la barra non compare**, perché porterebbe alla pagina stessa. Oggi c'è solo il portfolio, quindi la barra è pronta ma non si vede finché non si aggiunge un secondo progetto con `details`.

## Approccio tecnico

- `src/lib/projects.ts`: nuova funzione `getAdjacentProjects(id)`, che restituisce precedente e successivo, oppure `undefined` se i progetti con pagina sono meno di due.
- `src/app/progetti/[slug]/page.tsx`: la barra sta in fondo al contenuto, prima del footer. Dipende dallo slug, quindi resta dentro il `<Suspense>` di `ProjectContent`.
- Il riferimento usa un riquadro fisso in basso a destra. Qui diventa un blocco in fondo alla pagina, con una linea sopra, così funziona allo stesso modo su desktop e mobile senza coprire le schermate. A sinistra ci sono l'anteprima e il titolo, a destra i pulsanti tondi, nello stile del pulsante "Torna ai progetti".
- I testi ("Progetto successivo", le etichette dei pulsanti) stanno in `projectPage` di `site.ts`.
- Accessibilità: è un `<nav>` con un'etichetta, e i pulsanti a icona hanno un `aria-label` con il nome del progetto.

## Verifica

Con un solo progetto la barra non si vede. Per controllarla si aggiunge **temporaneamente** un secondo progetto con `details` in `site.ts`, si controlla nel browser su desktop e mobile, poi lo si toglie prima del commit.

## File

| File | Modifica |
| --- | --- |
| `src/lib/projects.ts` | `getAdjacentProjects` |
| `src/lib/site.ts` | Testi della barra in `projectPage` |
| `src/app/progetti/[slug]/page.tsx` | La barra in fondo alla pagina |
