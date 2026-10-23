# Ottimizzazione della hero per PC poco potenti

Data: 2026-10-23

## Obiettivo

Rendere fluida la sezione Home (`#home`) anche su PC modesti (il riferimento è quello di sviluppo: i5 con grafica integrata Intel Iris Plus, 8 GB di RAM), **senza cambiare nulla di ciò che si vede**: stesso nastro di linee, stessi colori, stessa velocità, stessa riga delle tecnologie. Le altre sezioni sono già fluide e non vanno toccate.

## Misure di partenza

Misure prese con Playwright (Chromium) sulla home a 1920×1080, DPR 1, con il server di sviluppo:

| Scenario | fps del thread principale | JavaScript per fotogramma |
| --- | --- | --- |
| Tutto attivo | 60 | 4,0 ms |
| Riga delle tecnologie ferma | 60 | 4,0 ms |
| Canvas nascosto (ma il disegno continua) | 60 | 3,0–3,2 ms |

Prova del solo disegno del nastro su un canvas 1905×1080, 120 fotogrammi:

| Variante | JavaScript per fotogramma |
| --- | --- |
| Attuale (40 campioni per tratto, 40 linee) | 3,9 ms |
| 20 campioni per tratto | 2,2 ms |
| 12 campioni per tratto | 1,4 ms |
| Una sola chiamata `stroke()` | 3,7 ms |
| Contesto `desynchronized` | 3,5 ms |

Cosa ne ricavo:

- **Il costo è quasi tutto nel canvas di `hero-waves.tsx`.** A ogni fotogramma ricalcola circa 11.000 punti, con un `Math.sin` per ciascuno, e ridisegna 40 tracciati sfumati su un'area Full HD. Così si mangia un quarto del budget di un fotogramma (16,7 ms) sul thread principale, e in più la GPU integrata deve rasterizzare l'intero canvas 60 volte al secondo. Quando il PC è sotto carico (altre schede aperte, risparmio energetico, server di sviluppo acceso) è questo che fa scattare lo scorrimento e il cursore.
- La riga delle tecnologie che scorre (animazione CSS su `transform`, gestita dal compositore) costa poco o niente: non serve toccarla.
- Unire le linee in un solo `stroke()` non conviene: fa risparmiare pochissimo e cambia l'aspetto, perché le linee non si sommerebbero più nei punti in cui si incrociano.

## Interventi proposti

Tutti in `src/components/hero-waves.tsx`; nessun altro file del sito cambia.

1. **Ridisegno a 30 fotogrammi al secondo.** Il nastro si muove molto lentamente (la fase avanza di 0,22 radianti al secondo, cioè circa 0,007 tra un fotogramma e l'altro a 30 fps): a 30 fps il movimento è identico a occhio, e il lavoro di CPU e GPU si dimezza. Il ciclo `requestAnimationFrame` resta, ma salta il disegno se dall'ultimo sono passati meno di ~33 ms. Il tempo dell'animazione continua a dipendere da `performance.now()`, quindi la velocità non cambia.
2. **Seni precalcolati.** Il termine `sin(A − b)`, dove `A` dipende solo dal punto e dalla linea e `b = time * 0.22` solo dal tempo, si scompone in `sin A · cos b − cos A · sin b`. Le tabelle `sin A` e `cos A` (Float32Array, 40 × punti) si calcolano una volta in `resize()`, e a ogni fotogramma restano un `cos` e un `sin` in tutto, più moltiplicazioni e somme. Si precalcolano anche `offset · spread · nx` e `offset · spread · ny`. Il risultato è lo stesso a meno di arrotondamenti nell'ordine di 1e-6 px.
3. **Meno campioni per tratto, solo se invisibile.** Si passa da `SAMPLES_PER_SEGMENT = 40` a 24 (circa un punto ogni 11 px alla larghezza di 1920 px). Il valore si conferma confrontando due screenshot del canvas (prima e dopo, con il tempo bloccato a 0) e controllando che la differenza in pixel sia trascurabile. Se si vede anche una minima spezzatura nelle curve si resta a 40: i punti 1 e 2 bastano comunque.
4. **Contesto 2D con `desynchronized: true`.** È un suggerimento al browser per mostrare il canvas con meno passaggi: costa una riga, l'aspetto non cambia e i browser che non lo supportano lo ignorano.

Restano come sono: pausa fuori schermo, con la scheda nascosta e con movimento ridotto, dissolvenza d'ingresso (`opacity-0` → visibile) e limite del DPR a 2.

Stima: il JavaScript per fotogramma passa da ~4 ms a 60 fps a meno di 1 ms a 30 fps, e la rasterizzazione su GPU si dimezza.

## Esito

- **Punti 1 e 2 applicati** come descritti.
- **Punto 3 applicato** (24 campioni). Nella parte visibile, la spezzata si scosta dalla curva ideale al massimo di 0,4–0,5 px; con 40 campioni lo scarto era 0,16 px. È uno spostamento sotto il pixel, non una spezzatura. Il confronto ingrandito di 4 volte nella zona più curva non mostra differenze.
- **Punto 4 non applicato.** Nella prova `desynchronized` faceva risparmiare 0,4 ms, una differenza confrontabile con il rumore della misura. In cambio è un'opzione che su alcuni sistemi può dare tearing o problemi con i canvas trasparenti, che qui non si possono provare. Per quel poco guadagno non vale il rischio.

Misure dopo la modifica (stesse condizioni, 1920×1080, server di sviluppo):

| | Prima | Dopo |
| --- | --- | --- |
| JavaScript per fotogramma | 4,0 ms | 0,46 ms |
| Disegni del canvas al secondo | 60 | 30 |
| JavaScript per disegno | 3,9 ms | 0,9 ms |

`npm run lint` e `npm run build` passano.

## Secondo passaggio: WebGL e Web Worker

Sul PC dell'utente la home restava pesante anche con la build di produzione. Le tracce del browser (Chromium, 1920×1080) mostravano che il costo non stava più nel JavaScript:

- **la rasterizzazione delle 40 linee del canvas 2D** teneva occupato il thread principale della GPU per ~142 ms al secondo, contro ~3 senza canvas;
- **il ciclo di aggiornamento della pagina** (`BeginMainFrame`: stili, layout, prepaint, commit) girava 61 volte al secondo e costava ~127 ms al secondo sul thread principale. Le cause erano due: `requestAnimationFrame` chiedeva un fotogramma della pagina a ogni refresh, e `classList.remove("opacity-0")` a ogni disegno riscriveva l'attributo `class`, anche quando la classe era già stata tolta, forzando il ricalcolo degli stili.

Interventi:

1. **Disegno in WebGL** (`src/lib/hero-waves.ts`). Lo spostamento di ogni punto e lo spessore delle linee li calcola il vertex shader. La copertura sul bordo, che imita l'antialiasing del canvas 2D, e la sfumatura a tre colori le calcola il fragment shader. A ogni fotogramma cambiano solo seno e coseno del tempo, e tutte le 40 linee si disegnano con una sola `drawElements`. Il canvas 2D resta come ripiego.
2. **Disegno in un Web Worker** (`src/components/hero-waves.worker.ts`). `hero-waves.tsx` cede il canvas con `transferControlToOffscreen` e poi manda al worker solo dimensioni e stato (visibile o no, movimento ridotto). I fotogrammi del canvas vanno direttamente al compositore, senza passare dal thread principale. Se il browser non ha `OffscreenCanvas`, o se il worker non parte, il disegno torna sulla pagina con lo stesso codice.
3. **Il canvas lo crea l'effetto,** non il JSX, perché un canvas ceduto al worker non si può riusare, né per il ripiego né al secondo montaggio dell'effetto in sviluppo (StrictMode). La dissolvenza d'ingresso passa al contenitore e scatta una volta sola, dopo il primo disegno.

Verifiche:

- **Confronto a pixel con il canvas 2D, a tempo bloccato (0 e 5 s, 1600×900).** Su 1,44 milioni di pixel ne cambiano circa 5.300 di più di 4 livelli su 255 e nessuno di più di 48; la luminosità complessiva coincide al 99,9%. Ingrandite di 4 volte, le due versioni non si distinguono.
- **Prova funzionale.** Con il worker e con il ripiego sul thread principale, con e senza movimento ridotto: il nastro compare, si muove (o resta fermo con movimento ridotto), c'è un solo canvas e la console non riporta errori.
- `npm run lint` e `npm run build` passano.

Misure (ms di lavoro per secondo, build di produzione):

| Thread | Canvas 2D a 60 fps (all'inizio) | WebGL e Web Worker |
| --- | --- | --- |
| Thread principale della pagina | 102 | 9 |
| Thread principale della GPU | 142 | 95 |
| Worker del nastro | — | 40 |

Il lavoro che resta sulla GPU è quello di ricomporre una schermata intera 30 volte al secondo. Per ridurlo ancora bisognerebbe cambiare ciò che si vede (un canvas più piccolo o a risoluzione più bassa).

## Verifica

1. Le stesse misure di partenza (fps, JavaScript per fotogramma), prima e dopo.
2. Confronto visivo: screenshot della hero prima e dopo con il tempo fermo, più un controllo a occhio dell'animazione.
3. `npm run lint` e `npm run build`.
4. Prova sul PC dell'utente, anche con la build di produzione (`npm run build` e `npm start`): il server di sviluppo aggiunge un carico che il sito pubblicato non ha.

## Scelte aperte

- **Disegno in un Web Worker (`OffscreenCanvas`).** Sposterebbe tutto il disegno fuori dal thread principale. Con i punti 1–3 il costo che resta è già sotto 1 ms ogni due fotogrammi, quindi non lo propongo adesso: aggiunge un file, la gestione dei messaggi e una soluzione di ripiego per i browser senza supporto. Se dopo le modifiche la home non è ancora fluida sul tuo PC, è il passo successivo.
- **Pausa del nastro durante lo scorrimento.** Libererebbe risorse proprio quando servono, ma il nastro si fermerebbe per un istante mentre si scorre: è un piccolo cambiamento visibile, quindi lo escludo, a meno che tu non lo voglia.
- **Screenshot del portfolio** (`public/projects/portfolio-desktop.png`): la hero resta identica, quindi non va rifatto.
