# Sezione "Progetti" per app e web app

Data: 2026-10-20
Stato: approvato e implementato, con le proposte indicate in "Scelte aperte"

## Obiettivo

Preparare nel sito una sezione dedicata ai progetti che svilupperemo insieme: applicazioni, web app, strumenti. Per ora va creata solo la struttura, i progetti si aggiungeranno più avanti.

## Situazione attuale

Esiste già una sezione `#projects` ("02 — Progetti", titolo "Lavori selezionati") in `src/components/sections/projects.tsx`. Mostra quattro schede:

- tre attività di lavoro (gestionale per impianti sportivi, migrazione da Access a SQL Server, rete intranet), già descritte in dettaglio nella sezione Esperienza;
- il portfolio stesso.

Le prime tre ripetono contenuti della sezione Esperienza e non sono progetti propri.

## Proposta

Trasformare la sezione esistente nella sezione dei progetti personali, invece di aggiungerne una seconda accanto:

- le tre schede di lavoro escono dalla sezione (restano raccontate in Esperienza);
- resta il **Portfolio personale**, che è a tutti gli effetti la prima web app sviluppata insieme;
- in coda alla griglia compare una scheda segnaposto, con bordo tratteggiato, che dice che altri progetti sono in arrivo;
- se l'elenco è vuoto, la sezione mostra solo la scheda segnaposto, quindi non resta mai una griglia vuota.

L'`id` resta `#projects`, quindi `navItems`, l'header e la numerazione delle sezioni non cambiano.

## File da modificare

| File | Modifica |
| --- | --- |
| `src/lib/site.ts` | Toglie da `projects` le tre voci di lavoro. Aggiunge `projectsSection` con titolo, breve introduzione e testi della scheda segnaposto, più il flag `showComingSoon` per nasconderla quando non servirà più. |
| `src/components/sections/projects.tsx` | Legge i testi da `projectsSection`, mostra l'introduzione sotto il titolo e aggiunge la scheda segnaposto in fondo alla griglia. Resta un Server Component. |

Nessun file nuovo e nessuna nuova dipendenza.

## Approccio tecnico

- **Testi:** come da convenzione, tutti i testi vanno in `site.ts`. Proposta:
  - titolo: "App e progetti";
  - introduzione: "Applicazioni e web app che sviluppo, dall'idea al rilascio.";
  - segnaposto: "Nuovi progetti in arrivo" / "Sto lavorando alle prossime applicazioni: presto le trovi qui.".
- **Scheda segnaposto:** usa `Card` di shadcn con `border-dashed`, sfondo trasparente e un'icona di `lucide-react` (ad esempio `Hammer` o `Sparkles`). Non è cliccabile e ha la stessa altezza minima delle altre schede, così la griglia resta allineata.
- **Modello dati:** il tipo `Project` resta com'è (`title`, `description`, `tags`, `href` per la demo, `repo` per il codice). Aggiungere un nuovo progetto vorrà dire aggiungere un oggetto all'array.
- **Layout:** stessa griglia di oggi, una colonna su mobile e due da 640px.

### Verifiche

- `npm run lint` e `npm run build`.
- Controllo visivo a 1440 e 390px, in tema chiaro e scuro.
- Controllo che il link "Progetti" dell'header porti ancora alla sezione.

## Scelte aperte

1. **Sezione esistente o sezione nuova.** Le opzioni sono due:
   - trasformare la sezione "Progetti" attuale, come descritto sopra (**proposta**);
   - lasciare "Lavori selezionati" e aggiungere una nuova sezione separata (ad esempio `#apps`, "Le mie app"), con nuova voce nel menu e numerazione delle sezioni spostata di uno.
2. **Portfolio come primo progetto.** Proposta: tenerlo, con il link al repository GitHub quando lo renderemo pubblico (oggi è privato, quindi niente pulsante "Codice").
3. **Scheda segnaposto sempre visibile.** Proposta: mostrarla finché i progetti sono pochi e spegnerla con `showComingSoon: false` quando la sezione sarà piena.
4. **Testi.** Titolo, introduzione e segnaposto proposti sopra sono modificabili.

## Decisioni

Approvate tutte le proposte: sezione esistente trasformata, portfolio come primo progetto, scheda segnaposto visibile, testi come sopra. La sezione verrà rivista più avanti, quando arriveranno i nuovi progetti.

Dettagli emersi durante l'implementazione:

- **Introduzione:** il wrapper `Section` non ha un campo per il sottotitolo, quindi il paragrafo sta dentro `projects.tsx` invece di estendere il componente condiviso.
- **Icona del segnaposto:** `Hammer` di `lucide-react`.
