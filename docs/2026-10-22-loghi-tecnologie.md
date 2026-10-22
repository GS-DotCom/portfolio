# Loghi delle tecnologie nella hero

Data: 2026-10-22
Stato: approvato e implementato (loghi grigi; icone generiche per IBM e DB2)

## Obiettivo

Nella riga che scorre "Tecnologie che uso" della hero (`hero.technologies` in `src/lib/site.ts`), aggiungere accanto a ogni scritta il logo della tecnologia. Il logo è **alto quanto la lettera maiuscola** del testo: la sua base sta sulla linea di base della scritta e la sua cima all'altezza delle maiuscole.

Elenco attuale: C#, .NET, SQL Server, JavaScript, HTML, CSS, IBM, DB2, Git, React, Next.js, TypeScript, Tailwind CSS, Claude Code, GitHub.

## Da dove arrivano i loghi

Ho verificato la disponibilità nelle due librerie open source più usate:

| Tecnologia | Fonte | Licenza |
| --- | --- | --- |
| JavaScript, HTML, CSS, Git, React, Next.js, TypeScript, Tailwind CSS, GitHub | [Simple Icons](https://simpleicons.org) 16.35 | CC0 |
| .NET | Devicon, logo "dot-net" (l'onda): quello di Simple Icons è solo la scritta ".NET", che accanto al nome si ripeteva | MIT |
| Claude Code | Simple Icons, logo "Claude" | CC0 |
| C#, SQL Server | [Devicon](https://devicon.dev) 2.17 (Simple Icons li ha rimossi su richiesta di Microsoft) | MIT |
| IBM, DB2 | **Nessuna delle due** (IBM ha chiesto la rimozione dei suoi marchi) | — |

I tracciati SVG si copiano in un nuovo file `src/components/tech-logos.tsx`, come già fatto per GitHub e LinkedIn in `icons.tsx`. Così non si aggiunge nessuna dipendenza, e nel file si annotano la fonte e la licenza.

## Approccio tecnico

- **Contenuti:** `hero.technologies` in `site.ts` resta un elenco di nomi. In `tech-logos.tsx` una mappa associa il nome al logo: se c'è un logo compare, altrimenti resta solo la scritta. Per aggiungere una tecnologia basta il nome in `site.ts`, e il logo in `tech-logos.tsx` se lo si vuole.
- **Dimensione:** il logo ha altezza `1cap`, l'unità CSS che vale esattamente l'altezza delle maiuscole del font (Poppins). È supportata dai browser recenti (Chrome 118, Safari 17.2, Firefox 97); per i browser più vecchi c'è un ripiego a `0.7em`, che in Poppins è quasi la stessa cosa. Il logo sta in linea col testo, quindi la sua base cade da sola sulla linea di base. La larghezza segue le proporzioni del logo.
- **Spaziatura:** circa un terzo di em tra logo e scritta, mentre lo spazio tra una voce e l'altra resta quello attuale.
- **Scorrimento:** le voci si allargano ma il ciclo resta continuo, perché l'animazione sposta sempre la traccia di metà.
- **Accessibilità:** i loghi sono decorativi (`aria-hidden`), perché il nome è già scritto accanto.

## File

| File | Modifica |
| --- | --- |
| `src/components/tech-logos.tsx` | Nuovo: i loghi SVG e la mappa nome → logo |
| `src/components/sections/hero.tsx` | Ogni voce della riga mostra logo e scritta |
| `CLAUDE.md` | Dove stanno i loghi e come aggiungerne uno |
| `public/projects/portfolio-desktop.png`, `public/projects/portfolio/hero.png` | Da rifare, perché cambia la hero |

## Scelte aperte

1. **Colore dei loghi.** Proposta: **monocromatici**, dello stesso grigio delle scritte, come i loghi "As featured in" del riferimento. Sono discreti e uniformi. L'alternativa sono i **colori ufficiali** di ogni brand: più vivaci, ma la riga diventa molto colorata e alcuni loghi scuri (Next.js, GitHub) quasi spariscono sullo sfondo nero.
2. **IBM e DB2.** Non c'è un logo libero. Le opzioni:
   - (a) un'icona generica coerente, ad esempio un server per IBM e un database per DB2, presa da `lucide-react`, già nel progetto. **Consigliata.**
   - (b) mi fornisci tu i file SVG ufficiali, ad esempio dalla pagina dei marchi di IBM;
   - (c) le due voci restano senza logo.
3. **"IBM" accanto al logo IBM.** Se un giorno si usasse il logo ufficiale, che contiene già la scritta, il nome accanto sarebbe ripetuto. Con un'icona generica il problema non c'è.
