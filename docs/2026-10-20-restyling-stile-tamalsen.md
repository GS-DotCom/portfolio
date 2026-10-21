# Restyling del sito sul modello di tamalsen.dev

Data: 2026-10-20
Stato: approvato e implementato, con le proposte indicate in "Scelte aperte" (vedi "Decisioni")

## Obiettivo

Rifare stile e struttura del portfolio nel modo più fedele possibile al sito di riferimento [tamalsen.dev](https://tamalsen.dev/) (Tamal Sen, "Software Engineer, Front-end & App Developer"). Al posto dei contenuti di Tamal Sen vanno i dati e i testi attuali del sito (`src/lib/site.ts`). Dove non abbiamo un equivalente reale si usano contenuti segnaposto.

## Materiale di riferimento

- `references/FireShot Capture 001 - … [tamalsen.dev].pdf`: screenshot dell'intera pagina. Dal PDF ho estratto l'immagine originale (1920px di larghezza, in tre parti), su cui sono basate le misure di questo documento.
- `references/sito-reference`: **è un file vuoto (0 byte)**, non una cartella con HTML e immagini. Per questo ho letto anche l'HTML pubblico di tamalsen.dev, solo per ricavare dati tecnici:
  - è un sito WordPress (tema Ohio con Elementor);
  - i font sono **Poppins** (titoli e testi) e **Roboto Mono** (menu, sottotitoli, paragrafi in stile codice);
  - le animazioni all'ingresso sono di tipo **AOS `fade-up`**;
  - l'indicatore di scorrimento dell'hero è un'animazione Lottie;
  - il telefono del progetto in evidenza è un video `.webm`.

## Struttura della pagina di riferimento e corrispondenza con i nostri contenuti

Lo sfondo è scuro in tutta la pagina (antracite con una punta di viola, circa `#1c1b21`). Il contenitore è centrato e largo circa 1070px.

### 1. Header

- **Riferimento:** logo in monospace azzurro `TamalSen.` seguito da un trattino basso viola. Il menu è centrato, in monospace bianco, nella forma `// home`, con un numero piccolo `01`–`05` in alto a destra di ogni voce. L'header è trasparente sopra l'hero.
- **Nostro sito:** logo `GiulianoSimone._`. Voci del menu: `// home` (01), `// competenze` (02), `// progetti` (03), `// esperienza` (04), `// contatti` (05). Su mobile resta il menu a scomparsa (`Sheet`) già presente, con lo stesso stile.

### 2. Hero (`#home`)

- **Riferimento:** a tutto schermo, con una scena 3D di cubi e cilindri scuri, una sfera arancione luminosa e la luce calda che la riflette. Sopra c'è il nome enorme in Poppins bold maiuscolo bianco (circa 160px), poi il sottotitolo in Roboto Mono maiuscolo spaziato. Sotto ancora:
  - la riga grigia "AS FEATURED IN" con i loghi;
  - l'indicatore di scorrimento animato;
  - un piccolo cerchio azzurro, che è il cursore personalizzato.
- **Nostro sito:**
  - nome `GIULIANO SIMONE`;
  - sottotitolo `SVILUPPATORE WEB .NET E SISTEMISTA IT.`;
  - al posto di "AS FEATURED IN" (non abbiamo pubblicazioni) una riga **"TECNOLOGIE CHE USO"** con le tecnologie scritte in grigio, nello stesso stile dei loghi: C#, .NET, SQL Server, Cisco e altre;
  - scena 3D ricostruita (vedi "Approccio tecnico").

### 3. Competenze (`#expertise`) — "My Expertise"

- **Riferimento:**
  - titolo centrato in Poppins semibold (circa 56px);
  - tre colonne in un unico riquadro con bordo chiaro sottile e divisori verticali;
  - in ogni colonna un'icona al tratto e un titolo su due righe, con la prima riga sottolineata da una barra colorata (fucsia, blu, arancione);
  - un paragrafo monospace racchiuso tra `<h3>` e `</h3>` grigi, con una linea verticale a sinistra;
  - sotto il riquadro, in trasparenza, un frammento di codice HTML decorativo.
- **Nostro sito:** "Le mie competenze", con queste tre colonne, ricavate dai gruppi di competenze di oggi:
  1. **Sviluppo Web** / **.NET, C#**: ASP.NET Core MVC, Razor, JavaScript, Bootstrap, WPF.
  2. **Database** / **SQL Server, MySQL**: progettazione, migrazione da Access e verifica dell'integrità dei dati.
  3. **Sistemi e reti** / **Firewall, CCNA**: networking, switch, armadi server e supporto tecnico.

  Il codice decorativo avrà un testo nostro, in italiano.

### 4. Progetti (`#projects`) — "My Work"

- **Riferimento:**
  - a sinistra un titolo grandissimo su due righe ("My / Work", circa 110px) e un paragrafo monospace;
  - a destra un telefono inclinato, una freccia viola disegnata a mano, "Featured Project", il nome del progetto in monospace e il pulsante viola "View Project";
  - sotto, i filtri `Filter by All¹⁰ / Data Visualization⁰¹ / Web Development⁰⁸`, con i conteggi in apice;
  - una griglia a mosaico (masonry) su tre colonne, con schede larghe due colonne. Ogni scheda ha l'immagine sopra e, sotto, una fascia scura con titolo in Poppins semibold e categoria grigia.
- **Nostro sito:**
  - titolo "I miei / Progetti";
  - nel paragrafo la descrizione di oggi (`site.description`);
  - progetto in evidenza: **Portfolio personale**, con uno screenshot di questo sito dentro una cornice di telefono disegnata in CSS;
  - filtri: Tutti / Web app / App;
  - nella griglia il portfolio e alcune schede segnaposto "Progetto in arrivo" con copertine astratte (vedi "Scelte aperte").

### 5. Esperienza (`#experience`) — "Professional Experience"

- **Riferimento:** titolo centrato su due righe e una fisarmonica di barre viola scuro (circa `#3a1078`), larghe circa 650px. Ogni barra mostra "Ruolo @ Azienda" a sinistra, il periodo e un `+` a destra. Cliccando si apre la descrizione.
- **Nostro sito:** "Esperienza / Professionale".
  - Le barre dei tre ruoli IT, ad esempio "Sistemista IT junior @ Romeo Ficacci S.r.l. · 2025". Aprendole si vedono la descrizione e i tag.
  - Altre esperienze e formazione: vedi "Scelte aperte".

### 6. Contatti (`#contact`) — fascia finale

- **Riferimento:** fascia a tutta larghezza su sfondo quasi nero, divisa in due parti.
  - **A sinistra:** il titolo "Available for select freelance opportunities", un paragrafo monospace, l'email sottolineata da una barra viola e un elenco di link in monospace (Messenger, LinkedIn, Instagram, Github).
  - **A destra:** tre riquadri pieni (viola chiaro, blu, viola) con le virgolette grandi, la foto rotonda della persona, la testimonianza, il nome e il ruolo.
- **Nostro sito:**
  - a sinistra il titolo "Disponibile per nuove opportunità", il testo di `contact.intro`, l'email con la barra viola (resta il pulsante "Copia") e i link LinkedIn e GitHub;
  - a destra non abbiamo testimonianze: vedi "Scelte aperte".

## File da creare

| File | Contenuto |
| --- | --- |
| `src/components/hero-scene.tsx` | Client Component: scena 3D dell'hero (cubi, cilindri, sfera luminosa), caricata in differita. |
| `src/components/custom-cursor.tsx` | Client Component: cerchio azzurro che segue il mouse, solo con puntatore fine. |
| `src/components/reveal.tsx` | Client Component: dissolvenza dal basso all'ingresso nello schermo, come AOS `fade-up`. |
| `src/components/sections/expertise.tsx` | Sezione competenze a tre colonne. |
| `src/components/project-grid.tsx` | Client Component: filtri e griglia a mosaico dei progetti. |
| `src/components/experience-accordion.tsx` | Fisarmonica delle esperienze, con l'`Accordion` di shadcn (`npx shadcn add accordion`, basato su Base UI). |
| `public/projects/…` | Screenshot del portfolio per il progetto in evidenza e la sua scheda. |

## File da modificare o rimuovere

| File | Modifica |
| --- | --- |
| `src/app/layout.tsx` | Geist sostituito da Poppins e Roboto Mono (`next/font/google`). Tema solo scuro: niente più `ThemeProvider`. |
| `src/app/globals.css` | Nuova palette con i colori del riferimento (sfondo, viola, azzurro, fucsia, blu, arancione), font e utility per barre di sottolineatura e numeri in apice. Le variabili del tema chiaro vengono rimosse. |
| `src/lib/site.ts` | Nuovi campi: voci del menu con numero, tecnologie per l'hero, le tre colonne delle competenze, categorie e copertine dei progetti, progetto in evidenza, testi dei titoli. I dati del CV restano gli stessi. |
| `src/app/page.tsx` | Nuovo ordine: Hero, Competenze, Progetti, Esperienza, Contatti. Il footer è assorbito dalla fascia contatti. |
| `src/components/site-header.tsx`, `mobile-nav.tsx` | Nuovo stile del menu. |
| `src/components/sections/hero.tsx`, `projects.tsx`, `experience.tsx`, `contact.tsx` | Riscritti sul modello del riferimento. |
| `src/components/sections/about.tsx` | Rimosso: il contenuto confluisce in Competenze e Progetti. |
| `src/components/network-leds-background.tsx`, `mode-toggle.tsx`, `theme-provider.tsx`, `site-footer.tsx` | Rimossi, con la dipendenza `next-themes`. |
| `CLAUDE.md` | Aggiornati architettura, componenti client e tema. |

## Approccio tecnico

- **Scena 3D dell'hero.** Nel riferimento è un'immagine o un video di Tamal Sen, che non possiamo riusare. La ricostruisco con `three`: geometrie semplici con materiale scuro opaco, una sfera emissiva arancione con una luce puntiforme calda, rotazione lenta e una leggera parallasse col mouse.
  - Il componente è caricato con `next/dynamic` (`ssr: false`). Finché non è pronto, e senza JavaScript, si vede un gradiente blu-notte uguale al tono del riferimento.
  - L'animazione si ferma fuori schermo e con movimento ridotto, come oggi lo sfondo LED.
- **Griglia a mosaico.** CSS Grid con `grid-auto-flow: dense` e schede che occupano una o due colonne e righe di altezza diversa. Niente librerie masonry. I filtri sono pulsanti con `aria-pressed`. Su mobile si passa a una colonna.
- **Animazioni.**
  - **All'ingresso:** `Reveal` con `IntersectionObserver` (dissolvenza e spostamento di 30px, 600ms).
  - **Indicatore di scorrimento:** ricreato in SVG e CSS, senza Lottie.
  - **Movimento ridotto:** tutto si disattiva con `prefers-reduced-motion`.
- **Cursore personalizzato.** Si attiva solo con `(hover: hover) and (pointer: fine)`. Il cursore di sistema resta visibile, il cerchio lo segue con un leggero ritardo.
- **Server e client.** Le sezioni restano Server Components. Sono client solo la scena 3D, il cursore, `Reveal`, la griglia con i filtri, la fisarmonica, il menu mobile e il pulsante "Copia".
- **Responsive.** Il riferimento è solo desktop. Su mobile:
  - il nome dell'hero scala con `clamp()`;
  - le competenze vanno in colonna;
  - la sezione progetti mette il telefono sotto il testo;
  - nei contatti i riquadri vanno sotto il blocco di sinistra.
- **Dipendenze nuove:** `three` (e `@types/three`), più il componente `accordion` di shadcn.

### Verifiche

- `npm run lint` e `npm run build`.
- Confronto visivo affiancato con lo screenshot di riferimento a 1920px e controllo a 390px, senza scroll orizzontale.
- Movimento ridotto, navigazione da tastiera (menu, filtri, fisarmonica) e link del menu alle ancore.

Prima di scrivere il codice leggerò le guide pertinenti in `node_modules/next/dist/docs/` (font, `next/dynamic`, immagini), come chiede `AGENTS.md`, e la documentazione aggiornata di `three` tramite Context7.

## Nota sul riferimento

Riprendere struttura e stile va bene. Non riuseremo però i materiali di Tamal Sen: la scena 3D, i video, le immagini dei progetti, le foto, i loghi e le testimonianze. Il sito resterà comunque molto simile a uno esistente. Se un giorno andrà online, conviene personalizzarlo un po' (ad esempio i colori o la scena dell'hero).

## Scelte aperte

1. **Testimonianze nella fascia contatti.** Non ne abbiamo, e inventarle sarebbe scorretto: sembrerebbero referenze vere. Proposta: usare gli stessi tre riquadri colorati, con virgolette e cerchio (con un'icona al posto della foto), per tre punti di forza reali presi dal CV:
   - problem solving, dall'help desk;
   - lavoro in team e in autonomia;
   - cura visiva, dalla formazione artistica.

   Quando arriveranno referenze vere prenderanno il loro posto. In alternativa, tre riquadri "Referenza in arrivo".
2. **Progetti segnaposto.** Il riferimento ha dieci schede. Proposta: il portfolio più cinque schede "Progetto in arrivo" con copertine astratte in CSS, così il mosaico ha lo stesso ritmo. Si spengono con un flag in `site.ts`, come la scheda segnaposto di oggi.
3. **Altre esperienze e formazione.** Il riferimento ha solo la fisarmonica dei ruoli. Proposta: aggiungere sotto una seconda fisarmonica uguale, "Formazione e altre esperienze", con CEFI, Comix, Liceo e i tre lavori fuori dall'IT. In alternativa, tenere solo i ruoli IT.
4. **Tema chiaro, sfondo LED e schede fluttuanti.** Per essere identico al riferimento il sito diventa solo scuro: spariscono il pulsante del tema e lo sfondo LED dell'hero. Le schede fluttuanti non sono nel riferimento. Proposta: tenerle solo sulle schede dei progetti al passaggio del mouse, adattate al nuovo stile.
5. **Riga "As featured in".** Proposta: "Tecnologie che uso", con nomi di tecnologie in grigio. In alternativa, la si toglie.
6. **Testo "Chi sono".** Il riferimento non ha una sezione di presentazione. Proposta:
   - la descrizione breve va nel paragrafo dei progetti;
   - le competenze vanno nelle tre colonne;
   - i tre paragrafi lunghi di "Chi sono" non compaiono più. Restano però in `site.ts`, se un giorno vorremo recuperarli.
7. **Materiale di riferimento.** Se hai l'HTML salvato del sito e le immagini (la cartella `sito-reference` è vuota), mettili in `references/`: li userò per misure e colori più precisi. Altrimenti procedo dallo screenshot.

## Decisioni

Approvate tutte le proposte delle "Scelte aperte":

- punti di forza al posto delle testimonianze;
- portfolio più cinque schede segnaposto;
- seconda fisarmonica per formazione e altre esperienze;
- sito solo scuro, senza sfondo LED;
- riga "Tecnologie che uso";
- i paragrafi di "Chi sono" restano in `site.ts` ma non vengono mostrati.

Il lavoro è partito dallo screenshot, perché `sito-reference` è rimasto vuoto.

Dettagli e differenze rispetto al piano, emersi durante l'implementazione:

- **Colori:** campionati pixel per pixel dallo screenshot di riferimento:
  - sfondo `#1a191e`, hero `#15212f`, schede `#201f23`, fascia contatti `#0e0e0e`;
  - azzurro `#6ed5ee`, viola del pulsante `#9c37ff`, barre `#420d79`;
  - sottolineature `#ea0c97`, `#2749dd`, `#ff6c2a`;
  - riquadri `#bb60fb`, `#0067dd`, `#923fe5`.
- **Header:** è un Client Component a parte (`header-shell.tsx`). Si allunga a 136px in cima alla pagina, come nel riferimento, e prende lo sfondo dopo 24px di scorrimento.
- **Titoli:** `section.tsx` contiene ora `Section` (wrapper con `id` e `scroll-mt-20`) e `SectionTitle` (titolo centrato su una o più righe). L'eyebrow e il titolo automatico di prima sono stati rimossi.
- **Scena 3D:** in `hero-scene.tsx`, caricata da `hero-scene-loader.tsx` con `ssr: false`. Usa `performance.now()` al posto di `THREE.Clock`, che nella r186 è deprecato. Le geometrie si creano dentro l'effetto, così il doppio montaggio di React in sviluppo non le libera.
- **Fisarmonica:** usa `Accordion`, `AccordionItem` e `AccordionContent` di shadcn, ma il trigger è la primitiva di Base UI, per avere il `+` (che ruota in ×) al posto delle frecce.
- **Progetti:**
  - le copertine dei segnaposto sono mockup di browser e telefono disegnati in CSS;
  - il portfolio usa uno screenshot del sito dentro una finestra di browser: `public/projects/portfolio-desktop.png` e `portfolio-mobile.png`, da rifare quando cambia la hero;
  - la griglia è larga 1098px, con schede da 342px come nel riferimento.
- **Mobile:**
  - la sezione progetti ritaglia in orizzontale il telefono inclinato (`overflow-x-clip`);
  - le barre della fisarmonica mandano a capo il nome dell'azienda;
  - non c'è scroll orizzontale a 390px.
- **Virgolette dei riquadri:** sono `”` in font serif, per avere la forma piena "99" del riferimento.
- **Verifiche fatte sulla build di produzione:**
  - confronto con il riferimento a 1920px;
  - mobile a 390px e menu mobile con le ancore;
  - filtri (Tutti 6, Web app 4, App 2) e fisarmonica;
  - movimento ridotto: scena ferma, nessuna animazione.
