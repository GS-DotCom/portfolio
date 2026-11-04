# Istruzioni inserimento Credenziali

Come aggiungere un nuovo badge Credly alla sottocategoria «Certificazioni» della sezione Competenze (`/#certifications`).

Servono solo **due file**: l'immagine del badge e `src/lib/site.ts`. Componenti, menu e impaginazione si aggiornano da soli.

## In breve

1. Scarica l'immagine del badge e copiala in `public/certifications/`.
2. Copia il link pubblico del badge da Credly.
3. Aggiungi un oggetto all'elenco `certifications` in `src/lib/site.ts`.
4. Controlla il risultato con `npm run dev`, poi lancia `npm run lint` e `npm run build`.
5. Fai il commit e pubblica.

## 1. L'immagine del badge

1. Accedi a [Credly](https://www.credly.com) e apri il badge.
2. Scarica l'immagine con **Download Image**: è un PNG quadrato, di solito 1080 × 1080 px.
3. Rinomina il file in minuscolo, con i trattini al posto degli spazi e senza accenti. Per esempio `ibm-z-xplore-concepts.png` oppure `cisco-ccna.png`.
4. Copialo nella cartella del progetto:

   ```
   public/certifications/<nome-del-badge>.png
   ```

Il badge va bene se:

- è **quadrato**: la scheda lo mostra in un riquadro quadrato, e un'immagine rettangolare verrebbe tagliata ai bordi;
- è largo **almeno 600 px**, così resta nitido anche sugli schermi ad alta densità;
- è in **PNG**. Vanno bene anche JPG e WebP: Next.js lo ottimizza da solo.

## 2. Il link pubblico

1. Nella pagina del badge su Credly premi **Share**.
2. Copia il link pubblico, del tipo:

   ```
   https://www.credly.com/badges/<codice-del-badge>/public_url
   ```

3. Aprilo in una finestra anonima e controlla che la pagina si veda anche senza aver fatto l'accesso.

## 3. L'oggetto in `src/lib/site.ts`

In cima al file c'è l'elenco `certifications`. Aggiungi un oggetto con questi cinque campi:

| Campo | Cosa contiene | Esempio |
| --- | --- | --- |
| `name` | Nome del badge, come su Credly | `"IBM Z Xplore - Concepts"` |
| `issuer` | Ente che lo rilascia | `"IBM"` |
| `date` | Data di rilascio, scritta per esteso | `"3 novembre 2026"` |
| `image` | Percorso dell'immagine, senza `public` | `"/certifications/ibm-z-xplore-concepts.png"` |
| `url` | Link pubblico Credly | `"https://www.credly.com/badges/…/public_url"` |

Esempio con due badge:

```ts
export const certifications: Certification[] = [
  {
    name: "IBM Z Xplore - Concepts",
    issuer: "IBM",
    date: "3 novembre 2026",
    image: "/certifications/ibm-z-xplore-concepts.png",
    url: "https://www.credly.com/badges/f4aea1d0-bdf9-4790-86a3-9e95697bf26b/public_url",
  },
  {
    name: "Nome del nuovo badge",
    issuer: "Ente",
    date: "12 gennaio 2027",
    image: "/certifications/nome-del-nuovo-badge.png",
    url: "https://www.credly.com/badges/<codice-del-badge>/public_url",
  },
];
```

Attenzione a:

- la **virgola** dopo la `}` di ogni oggetto;
- un `url` **diverso per ogni badge**: fa da chiave all'elenco, e due badge con lo stesso link danno un avviso di React;
- l'**ordine**: i badge compaiono sul sito nello stesso ordine dell'elenco. Puoi mettere il più recente in cima o in fondo, a piacere, ma tieni sempre lo stesso criterio.

## Come vengono mostrati

- Su desktop stanno **tre badge per riga**. Dal quarto in poi si va a capo, e una riga incompleta resta centrata:

  ```
  [ 1 ] [ 2 ] [ 3 ]
     [ 4 ] [ 5 ]
  ```

- Su tablet ne stanno due per riga, su telefono uno.
- Ogni scheda mostra l'immagine, il nome, l'ente e la data. Il clic apre la pagina Credly in una nuova scheda.
- Al passaggio del mouse la scheda si inclina e compare il riflesso foil. Con il movimento ridotto attivo nel sistema la scheda resta ferma.
- Se l'elenco è vuoto spariscono sia la sottocategoria sia la voce `// certificazioni` del menu.

Non serve toccare i componenti. Per riferimento:

| File | Cosa fa |
| --- | --- |
| `src/lib/site.ts` | Elenco `certifications` (i badge) e `certificationsSection` (titolo e testo introduttivo) |
| `public/certifications/` | Le immagini dei badge |
| `src/components/sections/expertise.tsx` | Sottocategoria «Certificazioni» e righe da tre |
| `src/components/certification-card.tsx` | Contenuto della scheda: immagine, testi, link |
| `src/components/ui/comet-card.tsx` | Animazioni della scheda: inclinazione, riflesso bianco e foil |

## 4. Controllo

1. `npm run dev` e apri http://localhost:3000/#certifications.
2. Controlla che l'immagine si veda, che nome, ente e data siano giusti e che il clic apra la pagina Credly giusta.
3. Riduci la finestra a una larghezza da telefono e controlla che i badge vadano uno sotto l'altro.
4. `npm run lint` e `npm run build` devono finire senza errori.

## 5. Pubblicazione

1. Crea un branch, per esempio `content/badge-<nome>`.
2. Fai il commit dell'immagine e di `src/lib/site.ts`, per esempio con il messaggio «Aggiunge il badge <nome>».
3. Push, PR e merge in `main`: Vercel pubblica da solo in produzione.
4. Come per ogni commit, aggiorna il registro di `docs/Informazioni_progetto_stack/Informazioni_progetto_stack.md`.
