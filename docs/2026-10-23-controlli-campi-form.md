# Controlli sui campi del form, telefono, oggetto e consenso privacy

Data: 2026-10-23

Anteprima: https://claude.ai/artifact/JxrsL64FYHU4oRexbLmq8y (versione 3).

## Obiettivo

Rendere più severi i controlli del form di contatto e aggiungere tre campi: Telefono, Oggetto e il consenso privacy (GDPR).

## Campi e regole

I valori si controllano dopo il `trim`. Gli errori compaiono al primo clic su «Invia» e poi si aggiornano mentre si corregge, come oggi.

| Campo | Obbligatorio | Regola | Messaggi di errore |
| --- | --- | --- | --- |
| **Nome**, **Cognome** | sì | `^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$`: lettere, anche accentate, spazio, apostrofo e trattino, da 2 a 50 caratteri. In più serve almeno una lettera, così «--» non passa. L'apostrofo tipografico `’`, che i telefoni inseriscono da soli («D’Angelo»), vale come `'` e nel messaggio inviato diventa `'`. | «Scrivi il tuo nome.» / «Scrivi il tuo cognome.» · «Deve avere da 2 a 50 caratteri.» · «Usa solo lettere, spazi, apostrofo e trattino.» |
| **Email** | sì | `^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$`, più: una sola `@`, nessuno spazio, niente `..`, nessun punto all'inizio o alla fine dell'indirizzo né subito prima o dopo la `@`, al massimo 254 caratteri | «Scrivi la tua email.» · «Togli gli spazi dall'indirizzo.» · «L'indirizzo deve contenere una sola @.» · «Controlla i punti: non possono essere doppi, né all'inizio o alla fine.» · «Dopo la @ serve un dominio con estensione, ad esempio azienda.it.» · «L'indirizzo è troppo lungo (massimo 254 caratteri).» |
| **Telefono** (nuovo) | no | se compilato, `^\+?[0-9\s-]{6,15}$`: `+` iniziale facoltativo, poi da 6 a 15 tra cifre, spazi e trattini. `type="tel"`, `autocomplete="tel"` | «Usa solo cifre, spazi e trattini, con il + iniziale se serve (da 6 a 15 caratteri).» |
| **Oggetto** (nuovo) | no | al massimo 50 caratteri (`maxLength`), con il contatore «N / 50» | — |
| Nome società | no | come oggi, 100 caratteri | — |
| Messaggio | sì | come oggi: 50 righe e 4000 caratteri | «Scrivi il messaggio.» |
| **Privacy** (nuovo) | sì | casella **non spuntata** all'apertura e dopo «Scrivi un altro messaggio» | «Per inviare il messaggio devi accettare l'informativa sulla privacy.» |

- `maxLength`: 50 per Nome e Cognome, 254 per Email, 16 per Telefono (15 più il `+`), 50 per Oggetto.
- Il focus va sul primo campo sbagliato, nell'ordine in cui compaiono; i campi hanno `aria-invalid` e `aria-describedby`.
- La nota «Uso i tuoi dati solo per risponderti.» accanto al tasto si toglie, perché la sostituisce il consenso.

## Disposizione (come l'anteprima)

Nome | Cognome · Società | Email · **Telefono | Oggetto** · Messaggio · **casella del consenso** · Invia. Su mobile i campi vanno uno sotto l'altro.

La casella del consenso è quadrata, con il bordo dei campi, e diventa viola con il segno di spunta. La frase è: «Ho letto l'**informativa sulla privacy** e acconsento al trattamento dei miei dati per ricevere una risposta.».

## Cosa arriva nell'email

- **Oggetto dell'email:** «Portfolio: {Oggetto} ({Nome} {Cognome})» se l'oggetto è compilato, altrimenti quello di oggi, «Nuovo messaggio dal portfolio: {Nome} {Cognome}».
- **Nel testo,** oltre a quello che arriva già: «Telefono» («—» se vuoto), «Oggetto» e «Consenso privacy: sì», con data e ora dell'invio.

## File

- `src/lib/site.ts`, in `contact.form`: le etichette e i segnaposto di Telefono e Oggetto, i nuovi messaggi di errore, la frase del consenso e il collegamento all'informativa. Si toglie `privacy`.
- `src/components/contact-form.tsx`:
  - le regole diventano funzioni che restituiscono il messaggio di errore oppure `null`;
  - i nuovi campi, il contatore dell'oggetto e la casella del consenso;
  - l'oggetto dell'email e i nuovi dati inviati.
- Documento dello stack: la chiave di Web3Forms è già scritta nella sezione Contatti e nella tabella delle modifiche comuni, come richiesto; dopo il commit vanno descritti i nuovi controlli.

## Informativa sulla privacy (decisa)

Niente pagina dedicata: l'utente ha chiesto una dichiarazione semplice. Sotto la casella c'è un breve testo sempre visibile, collegato alla casella con `aria-describedby`.

> **Informativa sulla privacy.** Uso i dati che inserisci solo per risponderti: non li uso per altri scopi, non li cedo a terzi e non li pubblico. Il messaggio arriva soltanto nella mia casella email, recapitato dal servizio Web3Forms. Puoi chiedermi di cancellarlo in qualsiasi momento scrivendo a g.simone1927@gmail.com.

La frase della casella diventa «Ho letto l'informativa qui sotto e acconsento al trattamento dei miei dati per ricevere una risposta.».

L'utente aveva proposto di dire che i dati si vedono «solo ed esclusivamente nella mail del destinatario». Il testo invece cita Web3Forms, perché il messaggio passa dal suo servizio prima di arrivare nella casella, e una dichiarazione che lo tace sarebbe inesatta. Il testo sta in `contact.form` di `site.ts` e si cambia lì. Resta una dichiarazione semplice, non un'informativa completa ai sensi dell'art. 13 del GDPR.

## Verifica

1. Le stesse prove fatte sull'anteprima, sul sito:
   - nomi: «M», «Mario2», «Ma$rio», «--» non passano; «D’Angelo», «Anna-Maria», «Élodie» passano;
   - email: senza estensione, con due @, con spazi, con punti doppi o ai bordi, con estensione di una lettera;
   - telefono: troppo corto, con parentesi, con lettere, con due `+`; vuoto va bene;
   - oggetto tagliato a 50 caratteri;
   - consenso mancante.
2. Invio simulato con Playwright, controllando i dati della richiesta, e poi un invio vero di prova.
3. A 1440 e 390 px, senza scorrimento orizzontale.
4. `npm run lint` e `npm run build`.

Il lavoro va sul branch `feat/controlli-form`, con una nuova PR verso `main`.
