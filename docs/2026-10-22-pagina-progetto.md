# Pagina di dettaglio dei progetti

Data: 2026-10-22
Stato: implementato, in attesa della decisione dell'utente

## Obiettivo

Rendere consultabili i progetti della sezione "I miei Progetti":

- al passaggio del mouse su una scheda compare il **cursore a mano**;
- al clic si apre una **pagina dedicata al progetto**, nello stile di `references/Reference pagina progetto.pdf` (HTML in `references/Reference-pagina-progetti`, la pagina "Flight Local" di tamalsen.dev).

Le schede "Progetto in arrivo" sono già commentate in `site.ts` dall'utente: resta solo il portfolio. I segnaposto, se tornassero, non sono cliccabili.

L'utente ha chiesto di sviluppare subito e decidere guardando il risultato, quindi questo documento accompagna l'implementazione invece di precederla.

## Struttura della pagina (dal riferimento)

1. **Header** del sito, uguale alla home. I link del menu diventano `/#home`, `/#expertise`, … così funzionano anche fuori dalla home. Sulla home restano ancore della stessa pagina, quindi lo scorrimento morbido non cambia.
2. **Pulsante "indietro"** tondo con freccia a sinistra, che torna alla sezione progetti della home (`/#projects`).
3. **Intestazione**: categoria (es. "Web app") e titolo grande del progetto.
4. **Breadcrumb**: Home › Progetti › Titolo.
5. **Due colonne**: a sinistra la descrizione; a destra le voci "Cliente" e "Tecnologie" con una linea sopra, e sotto il link "Apri il progetto →". Il link compare solo se il progetto ha un indirizzo: il repository del portfolio è privato e il sito non è ancora pubblicato, quindi per ora è nascosto.
6. **Galleria**: screenshot a tutta larghezza del contenitore, uno sotto l'altro.
7. **Footer** semplice su una riga, come nel riferimento: "© 2026. Realizzato con passione da Giuliano Simone." a sinistra, "Tutti i diritti riservati." a destra.

La barra "Next Project" del riferimento si omette: c'è un solo progetto. Si potrà aggiungere quando ce ne saranno almeno due.

## Approccio tecnico

### Dati

In `src/lib/site.ts`:

- il tipo `Project` riceve un campo facoltativo `details` con `description`, `client`, `technologies`, `url` (facoltativo) e `gallery` (immagini con `src`, `alt`, `width`, `height`). Solo i progetti con `details` hanno una pagina e sono cliccabili;
- il campo `href`, oggi inutilizzato, si toglie: l'indirizzo della pagina si ricava dall'`id` (`/progetti/portfolio`);
- un nuovo oggetto `projectPage` raccoglie i testi fissi della pagina (etichette, breadcrumb, footer), come per le altre sezioni.

### Route

`src/app/progetti/[slug]/page.tsx`, Server Component:

- `generateStaticParams` restituisce i progetti con `details`, così le pagine si generano in fase di build. Con Cache Components serve almeno un parametro, e il portfolio c'è;
- `dynamicParams` non è compatibile con Cache Components: per uno slug sconosciuto la pagina chiama `notFound()`;
- `generateMetadata` imposta il titolo della scheda del browser ("Portfolio personale — Giuliano Simone").

### Scheda nella griglia

In `project-grid.tsx` il titolo dei progetti con pagina diventa un `Link` di `next/link`, con uno pseudo-elemento che copre tutta la scheda (lo schema `after:absolute after:inset-0` è già presente). Così tutta la scheda è cliccabile e mostra il cursore a mano; il cerchio azzurro del cursore personalizzato resta.

### Galleria del portfolio

Si catturano dal sito alcune schermate a 1440 × 900 (hero, progetti, AI, esperienze) in `public/projects/portfolio/`. Le immagini usano `next/image` con dimensioni esplicite.

## File

| File | Modifica |
| --- | --- |
| `src/lib/site.ts` | `details` nel tipo `Project` e contenuti del portfolio; testi `projectPage`; `navItems` con `/#…`; via `href` |
| `src/lib/projects.ts` | Nuovo: `projectHref` e `getProject` |
| `src/app/progetti/[slug]/page.tsx` | Nuova pagina di dettaglio |
| `src/components/project-grid.tsx` | Scheda cliccabile con `Link` |
| `public/projects/portfolio/*.png` | Nuove schermate per la galleria |
| `CLAUDE.md` | Menzione della nuova route e dei `navItems` con `/#` |

## Scelte aperte

1. **"Apri una nuova pagina"**: interpretato come una pagina del sito (stessa scheda del browser), come nel riferimento. In alternativa si può aprire in una nuova scheda.
2. **Link "Apri il progetto"**: nascosto finché il sito non ha un indirizzo pubblico. Si può puntare al repository GitHub se diventerà pubblico.
3. **Testi del portfolio** (descrizione, cliente, tecnologie): scritti da Claude, da rivedere.
