# Il form di contatto nella pagina del progetto Portfolio

Data: 2026-10-23

Anteprima: https://claude.ai/artifact/VeTQ9XNAxuyRD81BQftYhm

## Obiettivo

Mettere in risalto, nella pagina `/progetti/portfolio`, il form di contatto come competenza: l'invio tramite **API di Web3Forms** e i **controlli sui campi**. La pagina oggi mostra solo descrizione, cliente, stack e schermate.

## Cosa cambia nella pagina

1. **Stack tecnologico:** si aggiunge «Web3Forms API».
2. **Refuso nella descrizione:** «documentodi progetto» diventa «documento di progetto» (mancava uno spazio nella stringa in `site.ts`).
3. **Nuova sezione «In evidenza»,** tra la descrizione e la galleria, separata da una linea sottile come la barra «Progetto successivo».
   - **Intestazione:** l'etichetta «In evidenza» in Roboto Mono `text-cyan` (come la categoria «Web app»), il titolo «Form di contatto con invio tramite API» e un paragrafo che spiega l'API REST di Web3Forms: una richiesta POST in JSON dal browser, senza server dedicato, con il mittente come «Rispondi a».
   - **Due colonne da `lg`, una sotto l'altra su mobile:**
     - **a sinistra,** la schermata del form compilato con l'errore «L'indirizzo deve contenere una sola @», più una didascalia;
     - **a destra,** «Controlli sui campi»: Nome e Cognome, Email, Telefono, Oggetto e messaggio, Consenso privacy, ognuno con la regola in parole e, dove c'è, la regex in Roboto Mono.
   - **Sotto, altre due colonne:**
     - «Invio con l'API di Web3Forms»: una frase e un riquadro in stile terminale, come quello della sezione AI, con la `fetch` semplificata e la risposta `{ "success": true }`;
     - «Esperienza d'uso e accessibilità»: errori chiari con il focus sul primo campo da correggere, `aria-invalid` e `aria-describedby`, gli stati dell'invio e il campo trappola antispam.

La schermata è una cattura reale del sito, a 1440 px, salvata in `public/projects/portfolio/form-contatti.png` (808 × 1053). Quando cambia il form va rifatta, come le altre schermate.

## Struttura dei dati

Per non legare il componente a questo solo progetto, la sezione nasce da un campo facoltativo `details.highlight` di `ProjectDetails`, in `site.ts`. Così un progetto futuro può avere la sua sezione «In evidenza» senza toccare il codice della pagina.

```ts
highlight?: {
  eyebrow: string;                 // «In evidenza»
  title: string;
  lead: string;                    // paragrafo introduttivo
  image: { src: string; alt: string; caption: string; width: number; height: number };
  rulesTitle: string;
  rules: { name: string; optional?: boolean; text: string; pattern?: string }[];
  code: { title: string; text: string; file: string; snippet: string };
  pointsTitle: string;
  points: { title: string; text: string }[];
};
```

- Nel paragrafo introduttivo le parti in grassetto si segnano con `**…**`. Un piccolo helper le trasforma in `<strong>`, senza introdurre una libreria Markdown.
- Le regex mostrate sono le stesse del codice. Per non doverle tenere allineate a mano, i pattern passano in un modulo condiviso, `src/lib/contact-rules.ts`, usato sia da `contact-form.tsx` sia da `site.ts`. Non possono restare in `contact-form.tsx`: è un file `"use client"`, e un valore che esporta arriva al codice server come riferimento client, non come regex.
- Il riquadro del codice si colora con poche `<span>` (parole chiave in viola, stringhe in ciano, commento grigio), come nell'anteprima, senza librerie di evidenziazione. Lo snippet sta in `site.ts` come testo; la colorazione è nel componente.

## File

- `src/lib/site.ts`: il tipo `ProjectDetails` con `highlight`, i contenuti della sezione per il progetto `portfolio`, «Web3Forms API» nelle tecnologie e il refuso corretto.
- `src/components/project-highlight.tsx` (nuovo, Server Component): la sezione.
- `src/app/progetti/[slug]/page.tsx`: mostra `ProjectHighlight` tra la descrizione e la galleria, quando `details.highlight` c'è.
- `src/lib/contact-rules.ts` (nuovo): i pattern di Nome, Email e Telefono e la lettera obbligatoria.
- `src/components/contact-form.tsx`: usa i pattern di `contact-rules.ts` invece di definirli.
- `public/projects/portfolio/form-contatti.png`: la schermata.
- `CLAUDE.md` e il documento dello stack, dopo il commit.

## Verifica

1. La pagina a 1440 e 390 px, confrontata con l'anteprima, senza scorrimento orizzontale.
2. Le regex mostrate coincidono con quelle del form, perché sono gli stessi valori importati.
3. `npm run lint` e `npm run build`, che rigenera la pagina statica `/progetti/portfolio`.
4. Va tutto nella PR #9, insieme ai controlli del form, prima del merge.
