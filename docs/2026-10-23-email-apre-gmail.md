# L'email dei contatti apre la scrittura in Gmail

Data: 2026-10-23

## Obiettivo

Nei contatti, in fondo alla pagina, cliccando l'indirizzo email deve aprirsi **una nuova scheda con un'email da scrivere**, con l'indirizzo già nei destinatari e l'oggetto già compilato. Oggi il link è un `mailto:`: apre il programma di posta predefinito del sistema, e su molti PC (soprattutto Windows senza un client configurato) non succede niente, oppure si apre un'app che l'utente non usa.

## Il limite da sapere

Un sito **non può sapere quale servizio di posta usa chi lo visita**: il browser non lo dice, per motivi di privacy. Le strade sono due:

- **`mailto:`** apre il gestore predefinito del sistema. Funziona bene sui telefoni (app Gmail, Mail di iOS…) e sui PC con un client configurato, oppure con Gmail registrato come gestore dei link email in Chrome. Altrimenti non fa nulla.
- **Link di scrittura di un servizio web**, come Gmail o Outlook, in una nuova scheda: funziona sempre su PC, ma porta a quel servizio specifico. Se l'utente non ha fatto l'accesso, il servizio gli chiede di farlo e poi apre la bozza.

Gmail è il servizio di posta via web più diffuso, quindi la scelta più utile è usarlo come destinazione principale e lasciare il `mailto:` dove funziona meglio.

## Decisione

L'utente ha scelto **Gmail su tutti i dispositivi**: niente `mailto:` per i telefoni e niente link aggiuntivi. Il punto 2 qui sotto non è stato applicato e lo stesso vale per la scelta aperta. L'URL si costruisce direttamente in `contact.tsx`, perché `site.ts` resta solo per i contenuti.

## Cosa era previsto

Solo in `src/components/sections/contact.tsx` e `src/lib/site.ts`.

1. **Su PC (mouse o trackpad):** l'indirizzo diventa un link a
   `https://mail.google.com/mail/?view=cm&fs=1&to=<email>&su=<oggetto>`, con `target="_blank"` e `rel="noopener noreferrer"`. Si apre una nuova scheda con la finestra di scrittura di Gmail, il tuo indirizzo nei destinatari e l'oggetto «Proposta di lavoro» (`contact.emailSubject`).
2. **Su telefono e tablet (touch):** resta il `mailto:`, che apre l'app di posta del dispositivo, di solito Gmail su Android, già pronta. La pagina di scrittura di Gmail via web sui telefoni è scomoda e non apre l'app.
3. **Come si distinguono, senza JavaScript:** si disegnano due link con lo stesso aspetto, uno visibile solo con `pointer-fine` e l'altro solo con `pointer-coarse`. Sono le stesse varianti Tailwind già usate dal cursore personalizzato. Quello nascosto ha `display: none`, quindi non è raggiungibile con la tastiera né letto dai lettori di schermo. Il componente resta un Server Component.
4. **Indirizzo del link in `site.ts`:** una piccola funzione costruisce l'URL di Gmail a partire da `site.email` e `contact.emailSubject`, così chi cambia l'indirizzo modifica solo `site.email`.
5. **Accessibilità:** il link che apre una nuova scheda lo dice ai lettori di schermo, con un testo nascosto «(si apre Gmail in una nuova scheda)».

L'aspetto resta identico: stesso testo, stessa sottolineatura colorata, stessa posizione. «Copia indirizzo» resta com'è.

## Scelta aperta

- **Link aggiuntivo «Apri nell'app di posta» accanto a «Copia indirizzo»** (consigliato). Su PC dà un'alternativa a chi usa Outlook, Thunderbird o un altro client: è un `mailto:` con lo stesso stile di «Copia indirizzo». Senza, chi non usa Gmail ha comunque «Copia indirizzo». È un piccolo cambiamento visibile: se lo vuoi, prima preparo l'anteprima.
- In alternativa, un link «Outlook» (`outlook.live.com/mail/0/deeplink/compose?to=…&subject=…`). Lo sconsiglio: aggiunge un terzo servizio da mantenere, per pochi utenti.

## Verifica

1. Su PC (Playwright a 1440 px): il link punta a Gmail, si apre in una nuova scheda e l'URL contiene destinatario e oggetto codificati correttamente.
2. In emulazione touch (390 px): è visibile solo il link `mailto:`.
3. `npm run lint` e `npm run build`.
4. Aggiornamento del documento dello stack dopo il commit, che finisce sul branch `perf/hero-fluida` prima del push e della PR.
