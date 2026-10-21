# Sezione Esperienza a linea del tempo verticale

Data: 2026-10-21
Stato: approvato e implementato, con le proposte indicate in "Scelte aperte"

## Obiettivo

Sostituire layout e design della sezione Esperienza (`#experience`) con quelli di `references/image.png`. Il markup di partenza è in `references/esperienze-reference` (blocco `#history`, "Career History").

Oggi la sezione è fatta di due fisarmoniche: barre viola "Ruolo @ Azienda · periodo +", che si aprono sulla descrizione. Il riferimento usa invece una **linea del tempo verticale a due colonne**.

## Com'è fatto il riferimento

Il sito di riferimento usa la libreria `react-vertical-timeline-component`. Il suo CSS è un file esterno e nell'HTML salvato c'è solo il markup, quindi le misure qui sotto sono ricavate dallo screenshot.

- **Linea centrale:** bianca, spessa circa 3–4 px, verticale al centro del contenitore.
- **Icona:** un cerchio di circa 60 px sulla linea, viola pieno (`rgb(80, 0, 202)`) con anello bianco di circa 4 px e una valigetta bianca al centro.
- **Scheda:**
  - fondo bianco, testo scuro (`#272822`), angoli appena arrotondati, ombra piatta grigia sul bordo inferiore;
  - ha una freccina triangolare bianca che punta verso l'icona;
  - le schede si alternano: la prima a sinistra, la seconda a destra e così via.
- **Contenuto della scheda:**
  - titolo del ruolo in grassetto (`h3`);
  - luogo in grassetto più piccolo (`h4`);
  - una riga di testo con gli ambiti di lavoro.
- **Date:** dal lato opposto alla scheda, all'altezza dell'icona, in carattere monospazio grigio chiaro (es. `2022 - present`).
- **Animazione:** le schede e le icone entrano con un effetto "bounce-in" quando arrivano a schermo.
- **Schermi stretti:** sotto i 1170 px la libreria passa a una sola colonna. Linea e icone si spostano a sinistra, le schede stanno tutte a destra e la data va sotto il testo della scheda.

## Proposta

Ricreare la timeline con un componente nostro, in Tailwind, **senza aggiungere la libreria**:

- così la sezione resta un Server Component, senza il CSS globale della libreria;
- le animazioni passano da `Reveal`, come nel resto del sito, e quindi rispettano già l'assenza di JavaScript e il movimento ridotto;
- si evitano problemi di compatibilità con React 19.

Struttura del componente `ExperienceTimeline`:

- un elenco `<ol>`: ogni esperienza è un `<li>`, con la linea disegnata da uno pseudo-elemento dell'elenco;
- da `lg` (1024 px) in su il layout è a due colonne alternate. Con una griglia `1fr auto 1fr`, scheda e data si scambiano di lato sulle righe pari;
- sotto `lg` la linea sta a sinistra, l'icona le sta sopra e la scheda occupa il resto della riga. La data va in cima alla scheda, così si legge subito;
- l'icona è `Briefcase` di `lucide-react` per il lavoro e `GraduationCap` per la formazione. Il cerchio è un `span` decorativo (`aria-hidden`);
- la freccina della scheda è un piccolo quadrato ruotato di 45° (oppure un triangolo fatto con i bordi), dello stesso colore della scheda;
- ogni elemento entra con `Reveal`, con un leggero ritardo tra icona e scheda. Non rifacciamo il "bounce-in" della libreria: la dissolvenza dal basso è già lo stile del sito.

Contenuto di ogni scheda, preso dai dati che già esistono in `src/lib/site.ts`:

| Nel riferimento | Da noi |
| --- | --- |
| Titolo (`h3`) | `role` / `course` |
| Sottotitolo (`h4`) | `company` / `school` |
| Riga di ambiti | `description` |
| — | `tags` / `topics`, come piccoli chip sotto la descrizione (vedi scelta aperta 2) |
| Data accanto all'icona | `period` |

Il titolo della sezione resta `SectionTitle` centrato ("Esperienza / Professionale"), coerente con le altre sezioni. Il riferimento ha "Career History" allineato a sinistra, ma copiarlo romperebbe l'uniformità con il resto della pagina.

## File da creare

| File | Contenuto |
| --- | --- |
| `src/components/experience-timeline.tsx` | Componente della linea del tempo. Riceve un elenco di voci `{ title, place, period, description, tags?, kind: "work" \| "education" }`. Server Component; usa `Reveal` (client) per le entrate. |

## File da modificare

| File | Modifica |
| --- | --- |
| `src/components/sections/experience.tsx` | Sostituisce le due `ExperienceAccordion` con `ExperienceTimeline`. Allarga il contenitore da `max-w-[660px]` a circa `max-w-5xl`, perché la timeline a due colonne ha bisogno di spazio. |
| `src/app/globals.css` | Solo se serve: variabili per il viola dell'icona e per la linea (es. `--timeline-icon`, `--timeline-line`), esposte a Tailwind come gli altri colori. |
| `CLAUDE.md` | Aggiorna l'elenco dei componenti client se cambia, e cita la timeline. |

## File da eliminare

| File | Motivo |
| --- | --- |
| `src/components/experience-accordion.tsx` | Non è più usato da nessuna parte. |
| `src/components/ui/accordion.tsx` | Da eliminare solo se non serve ad altro: oggi lo usa solo la fisarmonica delle esperienze. |

Nessuna nuova dipendenza: `Briefcase` e `GraduationCap` sono già in `lucide-react`.

## Accessibilità

- L'elenco ordinato comunica la sequenza cronologica.
- Il periodo è un `<time>` o un testo dentro la voce, letto insieme alla scheda e non come elemento separato.
- I titoli delle schede sono `h3`, sotto l'`h2` della sezione.
- Icone e linea sono decorative (`aria-hidden`).
- Su sfondo bianco il testo scuro ha un contrasto ampio. Le date grigio chiaro sullo sfondo scuro vanno verificate (almeno 4.5:1).

## Scelte aperte

1. **Colori della scheda.** Il riferimento usa schede bianche su sfondo scuro. Sono molto diverse dal resto del sito, che è tutto scuro.
   - Proposta: tenerle bianche come nel riferimento, perché è la scelta richiesta.
   - Alternativa: schede scure (`bg-card`) con testo chiaro, per restare in tema.
2. **Tag e tecnologie.** Il riferimento mostra solo una riga di testo; noi abbiamo anche i tag (es. ASP.NET, SQL Server…).
   - Proposta: mostrarli come piccoli chip sotto la descrizione.
   - Alternativa: un'unica riga di testo separata da virgole, identica al riferimento.
3. **Formazione e altre esperienze.** Oggi sono una seconda fisarmonica sotto un sottotitolo.
   - Proposta: una seconda timeline uguale sotto il sottotitolo "Formazione e altre esperienze", con l'icona del tocco per i corsi.
   - Alternativa: un'unica timeline con tutte le voci in ordine cronologico.
4. **Viola dell'icona.** Il riferimento usa `#5000ca`. Proposta: usare il viola del sito (`--violet`, `#9c37ff`, o `--bar`, `#420d79`) per restare in palette. In alternativa si copia `#5000ca` esatto.
5. **Descrizioni lunghe.** Le nostre descrizioni sono più lunghe di quelle del riferimento, quindi le schede verranno più alte. Proposta: mostrarle per intero. Non serve più l'apertura a fisarmonica.
