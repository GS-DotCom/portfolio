# Tecnologie della hero su una riga a scorrimento

Data: 2026-10-22
Stato: approvato e implementato

## Obiettivo

Oggi l'elenco "Tecnologie che uso" della hero (`hero.technologies` in `src/lib/site.ts`) va a capo su più righe (`flex-wrap`). Lo vogliamo invece:

- su **una sola riga** che **scorre da sola verso sinistra**, in un ciclo continuo;
- con una **dissolvenza su entrambi i lati**, così le voci compaiono e spariscono gradualmente invece di essere tagliate di netto.

I contenuti restano in `site.ts` e non cambiano.

La prima proposta prevedeva lo scorrimento con la rotella del mouse; dopo la revisione è stata scartata a favore dello scorrimento automatico.

## Approccio tecnico

### Scorrimento automatico

È un "marquee" in solo CSS, quindi la hero resta un Server Component e non serve JavaScript:

- l'elenco è ripetuto due volte in fila dentro una traccia larga quanto il contenuto (`w-max`). La seconda copia ha `aria-hidden`, così i lettori di schermo leggono le tecnologie una volta sola;
- la traccia si sposta da `translateX(0)` a `translateX(-50%)`, cioè di esattamente una copia, con velocità costante e in ciclo infinito. Alla fine del ciclo la seconda copia si trova dove era la prima, quindi il salto non si vede;
- ogni copia ha in fondo uno spazio uguale a quello tra le voci, così anche il punto di giunzione ha la stessa spaziatura;
- l'animazione è definita in `globals.css` come `--animate-marquee`, accanto a quelle già presenti.

### Pausa

Al passaggio del mouse lo scorrimento si ferma, così si può leggere una voce. Un contenuto che si muove da solo per più di 5 secondi deve poter essere fermato (WCAG 2.2.2).

### Dissolvenza

Le utility `mask-x-from-*` di Tailwind v4 applicano al contenitore una maschera a gradiente che rende trasparenti le voci verso i due bordi. È una maschera e non un gradiente colorato sopra, quindi funziona con il nastro animato del canvas dietro.

### Movimento ridotto

Con `prefers-reduced-motion` l'animazione non parte, la seconda copia si nasconde e la riga diventa scorrevole a mano (touch, trackpad, Shift + rotella), con la barra nascosta.

### Mobile

La riga occupa tutta la larghezza disponibile, meno i margini della hero, e il testo è più piccolo (`text-xl` contro `text-[1.6rem]`). La dissolvenza è in percentuale, quindi si adatta alla larghezza. Verificato a 375 px: le voci restano leggibili, la riga non si sovrappone all'indicatore di scorrimento e la pagina non scorre in orizzontale.

## File

| File | Modifica |
| --- | --- |
| `src/components/sections/hero.tsx` | L'`<ul>` con `flex-wrap` diventa una riga che scorre, con l'elenco ripetuto due volte |
| `src/app/globals.css` | Nuova animazione `marquee` |
| `public/projects/portfolio-desktop.png` | Rifatto con la nuova riga delle tecnologie |

## Scelte aperte

1. **Larghezza della riga.** Partita da `max-w-3xl` (768 px) con dissolvenza sul 20% per lato; dopo averla vista, l'utente l'ha chiesta leggermente più ampia: ora `max-w-4xl` (896 px) con dissolvenza sul 15% per lato.
2. **Velocità.** Per ora un giro completo in 40 secondi; si regola in `--animate-marquee`.
