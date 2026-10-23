# Form di contatto al posto dei punti di forza

Data: 2026-10-23

Anteprima approvata: https://claude.ai/artifact/JxrsL64FYHU4oRexbLmq8y (pannello scuro).

## Obiettivo

Nella fascia dei contatti, che fa anche da footer:

- **i tre riquadri con i punti di forza presi dal CV** si eliminano;
- al loro posto c'è un **form di contatto** che manda il messaggio alla casella del sito;
- **la colonna di sinistra resta com'è**: titolo «Disponibile per nuove opportunità», testo «Stai cercando qualcuno per il tuo team…», email con il link a Gmail e «Copia indirizzo»;
- **l'indirizzo del sito diventa g.simone1927@gmail.com**: è quello mostrato, copiato, usato dal link a Gmail e dal form.

## Il form

| Campo | Tipo | Obbligatorio | Limiti |
| --- | --- | --- | --- |
| Nome | testo, `autocomplete="given-name"` | sì | 60 caratteri |
| Cognome | testo, `autocomplete="family-name"` | sì | 60 caratteri |
| Nome società | testo, `autocomplete="organization"` | no, con «(facoltativo)» | 100 caratteri |
| Email | `type="email"`, `autocomplete="email"` | sì, con controllo del formato | 120 caratteri |
| Messaggio | area di testo di 8 righe visibili, allungabile in verticale | sì | **50 righe** e 4000 caratteri |

- **Limite delle 50 righe:** si contano gli «a capo». Le righe in più si tagliano mentre si scrive o si incolla, e sotto il campo il contatore «N / 50 righe» diventa evidenziato quando il limite è raggiunto. I 4000 caratteri evitano un unico blocco lunghissimo senza a capo.
- **Errori dei campi:** si controllano al clic su «Invia». Sotto ogni campo sbagliato compare un messaggio («Scrivi il tuo nome.», «Scrivi un indirizzo email valido, ad esempio nome@azienda.it.»), il bordo si colora e il cursore va sul primo campo sbagliato. I campi hanno `aria-invalid` e `aria-describedby`.
- **Invio:** al clic su «Invia» il tasto si disattiva e diventa «Invio in corso…», con una rotellina che si ferma con movimento ridotto.
  - **Se l'invio riesce:** il form lascia il posto alla conferma, con l'icona di spunta, il titolo «Messaggio inviato» e il testo «Grazie {nome}, ho ricevuto il tuo messaggio. Ti rispondo presto a {email}.». Il cursore va sulla conferma, così il lettore di schermo la annuncia. «Scrivi un altro messaggio» svuota il form e lo riporta.
  - **Se l'invio non riesce:** sopra i campi compare un avviso (`role="alert"`) con «Il messaggio non è partito.», l'invito a riprovare e l'indirizzo email. I dati scritti restano nei campi.

## Come arrivano i messaggi: Web3Forms

[Web3Forms](https://web3forms.com) riceve il form e inoltra il messaggio per email alla casella collegata alla chiave. È gratuito fino a 250 messaggi al mese. Non servono server, password né librerie nel progetto.

- **Richiesta:** una `fetch` dal browser verso `https://api.web3forms.com/submit` (`POST`, JSON) con `access_key`, `subject`, `from_name`, `name`, `email`, `company` e `message`. La risposta `{ success: true }` vale come invio riuscito; qualsiasi altra risposta, o un errore di rete, come invio non riuscito.
- **Oggetto dell'email ricevuta:** «Nuovo messaggio dal portfolio: {Nome} {Cognome}». Il campo `email` diventa il «Rispondi a», quindi basta premere Rispondi.
- **Chiave:** sta in `.env.local` come `NEXT_PUBLIC_WEB3FORMS_KEY`. Il file è già escluso da git (`.env*` in `.gitignore`), e la chiave va impostata anche nell'hosting al momento della pubblicazione. È una chiave pensata per stare nel browser: permette solo di mandare messaggi alla casella collegata, non di leggerli. Se manca, il form mostra l'errore di invio e la console spiega che la chiave non è impostata.
- **Antispam:** un campo nascosto `botcheck`, che i bot compilano e le persone no. Web3Forms scarta i messaggi in cui è pieno.
- **Cosa devi fare tu:** su web3forms.com inserisci g.simone1927@gmail.com, ricevi la chiave per email e me la passi, oppure la metti tu in `.env.local`. Senza la chiave posso costruire e provare tutto, ma l'invio vero si potrà verificare solo dopo.

## Aspetto (come l'anteprima, pannello scuro)

- **Desktop, da `lg`:** due colonne, `grid-cols-[1fr_808px]` dentro la stessa `max-w-[1420px]` di oggi. A sinistra la colonna dei testi, come ora. A destra il pannello del form, con sfondo `bg-card` e un bordo sinistro sottile.
- **Mobile:** il pannello va sotto i testi, a tutta larghezza. Nome e Cognome, Società ed Email stanno affiancati da `sm` e uno sotto l'altro sotto i 640 px.
- **Intestazione:** il titolo «Scrivimi un messaggio» in Poppins bold, una riga di spiegazione e il cerchio con l'icona `Send` di lucide, con bordo viola, nello stile delle icone dei riquadri eliminati.
- **Campi:** etichette in Poppins semibold, testo in Roboto Mono, bordo di 2 px senza arrotondamenti, focus con l'anello `cyan` del sito.
- **Tasto «Invia»:** sfondo `violet`, freccia `ArrowRight`, che al passaggio del mouse si alza leggermente (fermo con movimento ridotto). Accanto, la nota «Uso i tuoi dati solo per risponderti.».
- **Comparsa:** il pannello entra con `Reveal`, come la colonna di sinistra.

## File

- **`src/lib/site.ts`:**
  - `site.email` diventa `"g.simone1927@gmail.com"`;
  - in `contact` si tolgono `strengths` e il tipo `Strength`, e si aggiunge `form` con tutti i testi del form (etichette, segnaposto, errori, stati del tasto, conferma, avviso, nota sui dati);
  - nella sezione AI la scheda «Canvas 2D – Il nastro animato della hero» diventa «WebGL – Il nastro animato della hero, disegnato in un Web Worker», per allinearla all'ottimizzazione appena fatta.
- **`src/components/contact-form.tsx`** (nuovo, client): il form, con stato `idle | sending | sent | failed`, validazione, limite delle righe e chiamata a Web3Forms.
- **`src/components/sections/contact.tsx`:** si tolgono `StrengthCard`, le icone, i colori e la disposizione dei riquadri; la griglia passa a due colonne con `ContactForm` a destra.
- **`src/app/globals.css`:** i colori `--quote-lilac`, `--quote-blue` e `--quote-violet`, e le loro voci in `@theme`, servivano solo ai riquadri: si tolgono.
- **`.env.local`** (non versionato): `NEXT_PUBLIC_WEB3FORMS_KEY=...`.
- **`CLAUDE.md`:** aggiungo `contact-form` all'elenco dei componenti client e una riga sul form e sulla chiave.

## Verifica

1. Nel browser a 1440 e 390 px: aspetto come l'anteprima e nessuno scorrimento orizzontale.
2. Validazione, limite delle 50 righe, stato «Invio in corso…».
3. **Invio non riuscito:** provato senza chiave e con la rete bloccata.
4. **Invio riuscito:** con la tua chiave, un messaggio di prova che deve arrivare a g.simone1927@gmail.com. Senza chiave lo simulo intercettando la richiesta con Playwright.
5. `npm run lint` e `npm run build`.
6. Dopo il commit, aggiornamento del documento dello stack.

## Scelte aperte

- **Nome società facoltativo** (proposto), perché non tutti scrivono a nome di un'azienda. Se lo vuoi obbligatorio si cambia una riga.
- **Branch:** la PR #8, con l'ottimizzazione della hero e il link a Gmail, è ancora aperta. Propongo di aggiungere questa modifica alla stessa PR, così il sito arriva su `main` completo. In alternativa, una PR separata `feat/form-contatti`.
