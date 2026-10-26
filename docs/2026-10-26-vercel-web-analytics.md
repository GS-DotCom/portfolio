# Vercel Web Analytics

Data: 2026-10-26
Stato: approvato il 2026-10-26, con deployment tramite branch `feat/vercel-analytics` e PR; implementato

## Obiettivo

Contare le visite al sito con Vercel Web Analytics: pagine viste, visitatori, provenienza, dispositivi e paesi, consultabili nella scheda **Analytics** del progetto su Vercel. Non usa cookie e non chiede un banner di consenso.

## Situazione attuale

- Vercel CLI è già installato in globale, versione 65.2.0, cioè l'ultima pubblicata. Non serve reinstallarlo.
- La cartella `.vercel` non esiste, quindi la cartella locale non è ancora collegata a un progetto Vercel. È già esclusa in `.gitignore`.
- Il remote è `GS-DotCom/portfolio` su GitHub. Se su Vercel il progetto è collegato a questo repository, ogni merge in `main` parte già da solo come deployment di produzione.

## Passaggi

1. **Plugin Vercel per Claude Code:** `npx plugins add vercel/vercel-plugin`. Riguarda l'ambiente di lavoro e non tocca il codice del sito.
2. **Pacchetto:** `npm i @vercel/analytics`, ultima versione 2.0.1. Finisce in `dependencies`.
3. **Componente:** in `src/app/layout.tsx` si importa `Analytics` da `@vercel/analytics/next`, come indica la guida ufficiale per l'App Router. Lo si mette in `<body>`, dopo `{children}` e accanto a `<CustomCursor />`. È un Client Component che carica lo script `/_vercel/insights/script.js` e registra il cambio di pagina, anche passando dalla home a `/progetti/<id>`.
4. **Verifica locale:** `npm run lint` e `npm run build`. La build controlla anche che il componente non dia problemi con `cacheComponents` e `partialPrefetching`, per esempio con letture dinamiche fuori da `<Suspense>`. In sviluppo il componente lavora in modalità debug: scrive gli eventi nella console del browser e non invia niente.
5. **Abilitazione su Vercel:** nella dashboard, **Project → Analytics → Enable**. Senza questo passaggio lo script in produzione risponde 404 e non viene raccolto niente. Va fatto dall'utente nella dashboard, oppure dalla CLI se il plugin lo permette.
6. **Collegamento e deployment:** `vercel link` collega la cartella al progetto esistente. Se il login non è ancora fatto, prima serve `vercel login`, che è interattivo: va lanciato con `! vercel login`. Poi si esegue `vercel --prod`.
7. **Controllo dei dati:** si apre il sito in produzione e si controlla che la richiesta a `/_vercel/insights/view` parta e risponda 200, guardando la scheda Network con Playwright. Poi si verifica che la visita compaia nella scheda Analytics della dashboard. Possono servire alcuni minuti, e gli ad blocker possono bloccare lo script.

## File

| File | Modifica |
| --- | --- |
| `package.json`, `package-lock.json` | Dipendenza `@vercel/analytics` |
| `src/app/layout.tsx` | Componente `<Analytics />` nel `<body>` |
| `docs/Informazioni_progetto_stack/Informazioni_progetto_stack.md` | Tecnologia nuova, layout e riga nel registro, dopo il commit |
| `CLAUDE.md` | Una riga sull'analisi delle visite in "Architettura" |

## Scelte aperte

- **Come fare il deployment.** Il repository lavora con branch e PR, e il deployment di produzione può partire dal merge in `main`. `vercel --prod` invece pubblica la cartella locale così com'è, anche con modifiche non ancora committate. Proposta: lavorare sul branch `feat/vercel-analytics`, fare commit e PR, fare il merge, e solo dopo lanciare `vercel --prod` da `main` aggiornato, così produzione e repository restano allineati. Se il progetto è già collegato a GitHub, il merge basta e `vercel --prod` si può saltare.
- **Speed Insights**, cioè le metriche Core Web Vitals con `@vercel/speed-insights`. Non è stato chiesto e resta fuori, ma si aggiunge allo stesso modo se serve.
