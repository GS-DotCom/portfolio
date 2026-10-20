# Schede delle esperienze che fluttuano al passaggio del mouse

Data: 2026-10-20
Stato: approvato e implementato, con una richiesta aggiuntiva (vedi "Decisioni")

## Obiettivo

Le schede dei ruoli IT nella sezione Esperienza (`src/components/sections/experience.tsx:24`) oggi al passaggio del mouse mostrano solo un'ombra più marcata (`hover:shadow-md`). L'obiettivo è dar loro un effetto di profondità gradevole e rilassante: la scheda si stacca piano dalla pagina e resta sospesa, come se galleggiasse.

## Effetto proposto

1. **Sollevamento lento.** Al passaggio del mouse la scheda sale di circa 6px in 500ms, con un'accelerazione morbida in uscita (`cubic-bezier(0.22, 1, 0.36, 1)`): parte decisa e rallenta dolcemente, senza rimbalzi. Al rilascio torna giù con lo stesso ritmo.
2. **Ombra a due strati.** Mentre sale, l'ombra si allarga e si sfuma: uno strato vicino e netto, uno lontano e diffuso. È la combinazione che dà la sensazione di distanza dalla pagina, invece di una semplice ombra più scura.
3. **Respiro sospeso.** Una volta sollevata, la scheda oscilla di 2–3px su e giù con un ciclo lento di circa 4 secondi (`ease-in-out`), come se galleggiasse. Parte dopo il sollevamento, così i due movimenti non si sovrappongono.
4. **Bordo.** L'anello sottile della scheda (`ring-foreground/10`) si schiarisce appena, per staccarla meglio dallo sfondo.

## File da modificare

| File | Modifica |
| --- | --- |
| `src/app/globals.css` | Aggiunge il token dell'ombra sollevata in `:root` e `.dark` (nel tema scuro l'ombra nera si vede poco, quindi è più intensa e accompagnata dal bordo più chiaro), i `@keyframes` del respiro e un'utility `card-float` che raccoglie l'effetto. |
| `src/components/sections/experience.tsx` | Sostituisce `transition-shadow hover:shadow-md` con `card-float` sulla `Card`. |

Nessun file nuovo, nessuna dipendenza, nessun JavaScript: la sezione resta un Server Component.

## Approccio tecnico

- **Solo CSS.** Il sollevamento usa la proprietà `translate`, il respiro usa `transform` in un'animazione: sono proprietà separate, quindi si sommano senza annullarsi.
- **Prestazioni.** Si animano solo `translate`, `transform` e `box-shadow`, senza toccare il layout. Nessun elemento intorno si sposta.
- **Dispositivi touch.** In Tailwind v4 la variante `hover:` vale solo con `@media (hover: hover)`, quindi su telefono la scheda non resta "incastrata" sollevata dopo un tocco.
- **Movimento ridotto.** Con `prefers-reduced-motion: reduce` niente spostamenti né oscillazione: resta solo il cambio d'ombra.
- **Linea del tempo.** Il pallino a sinistra della scheda resta fermo, così la linea del tempo non si muove.

### Verifiche

- `npm run lint` e `npm run build`.
- Prova nel browser in tema chiaro e scuro, e con movimento ridotto attivo.

## Scelte aperte

1. **Respiro sospeso (punto 3).** Proposta: includerlo, è quello che rende l'effetto "fluttuante". L'alternativa è il solo sollevamento, più sobrio. Nota: quando il mouse esce a metà oscillazione, la scheda può fare un piccolo scatto di 1–2px prima di scendere, perché le animazioni CSS non hanno una transizione d'uscita. È poco visibile, ma se dà fastidio si toglie il respiro.
2. **Estendere l'effetto alle schede dei progetti.** Proposta: sì, per coerenza tra le sezioni. L'utility `card-float` si applica con una sola classe.
3. **Intensità.** Sollevamento di 6px e respiro di 2–3px. Si possono regolare dopo averli visti.

## Decisioni

Approvato l'effetto al passaggio del mouse così com'è: sollevamento, ombra a due strati, respiro sospeso e bordo più chiaro.

Richiesta aggiuntiva: **anche a riposo** le schede devono essere staccate dalla pagina, con un'ombra in profondità. Quindi le ombre sono due, entrambe a due strati:

- `--card-shadow`, a riposo: leggera, già dà profondità;
- `--card-shadow-raised`, al passaggio del mouse: più ampia e diffusa.

Dettagli dell'implementazione:

- L'utility `card-float` in `globals.css` usa `@apply` con le classi di Tailwind (`shadow-(--card-shadow)`, `motion-safe:hover:…`). In questo modo l'ombra si somma all'anello della `Card` (`ring-1`) invece di sostituirlo.
- La curva (`--ease-float`) e l'animazione (`--animate-card-breathe`, ritardata di 500ms per partire dopo il sollevamento) sono token in `@theme`.
- Come proposto, l'effetto vale anche per le schede dei progetti. La scheda segnaposto "Nuovi progetti in arrivo" resta piatta, perché non è cliccabile.
- Verificato sulla build di produzione: ombra a riposo, sollevamento di 6px, oscillazione, bordo più chiaro. Con movimento ridotto cambia solo l'ombra. Nel tema scuro l'ombra si vede meno: la profondità arriva soprattutto dal bordo e dal contrasto tra scheda e sfondo.
- **Alone chiaro nel tema scuro** (aggiunto su richiesta): alle due ombre del tema scuro si aggiunge un terzo strato bianco e diffuso, all'8% a riposo e al 16% con la scheda sollevata. Il tema chiaro non cambia.
