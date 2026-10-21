# Sezione "AI": vibe coding con Claude

Data: 2026-10-21
Stato: approvato e implementato, con le proposte indicate in "Scelte aperte"

## Obiettivo

Aggiungere al sito una nuova sezione, con la sua voce nel menu, che racconti:

- che mi sto avvicinando al **vibe coding**, cioè allo sviluppo guidato da un assistente AI a cui descrivo in linguaggio naturale quello che voglio ottenere;
- come uso **Claude di Anthropic**, tramite Claude Code dentro Cursor;
- le **tecnologie usate per costruire questo portfolio**, che è il primo progetto nato così.

## Posizione e menu

- **Nuovo `id`:** `#ai`.
- **Voce di menu:** `// ai`, in minuscolo come le altre voci.
- **Posizione:** subito dopo "progetti", perché racconta come è stato costruito il progetto mostrato lì.
- **Ordine risultante:** home 01, competenze 02, progetti 03, **ai 04**, esperienza 05, contatti 06.
- **Numerazione:** i numeri in apice seguono l'ordine di `navItems`, quindi si aggiornano da soli, anche nel menu mobile.

## Contenuto (bozza dei testi)

**Titolo** (`SectionTitle` su due righe, come le altre sezioni): "Vibe coding / con Claude"

**Introduzione:**

> Sto imparando a sviluppare in vibe coding: descrivo in italiano quello che voglio ottenere e lo costruisco insieme a un assistente AI. Uso Claude di Anthropic tramite Claude Code, dentro l'editor Cursor. Questo portfolio è il primo progetto nato così.

**Come lavoro**, in quattro passi numerati:

1. **Descrivo l'idea.** Spiego cosa voglio, spesso partendo da uno screenshot o da un sito di riferimento.
2. **Prima il progetto.** Claude scrive un documento con obiettivo, file da toccare e scelte aperte. Si parte solo dopo la mia conferma.
3. **Codice e verifica.** Claude scrive il codice, lancia lint e controllo dei tipi e verifica il risultato nel browser, su desktop e su mobile.
4. **Rivedo e decido.** Guardo l'anteprima, chiedo ritocchi e approvo. Il codice resta mio: lo leggo, lo capisco e lo mantengo.

**Con cosa è fatto questo sito**, una griglia di tecnologie, ognuna con una riga di spiegazione:

| Tecnologia | Riga |
| --- | --- |
| Next.js 16 | App Router, Server Components e Turbopack |
| React 19 | Interfaccia a componenti |
| TypeScript | Tipi su tutto il codice |
| Tailwind CSS 4 | Stili e tema scuro |
| shadcn/ui e Base UI | Componenti accessibili |
| Canvas 2D | Il nastro animato della hero |
| Claude Code | L'assistente che scrive il codice con me |
| Cursor | L'editor in cui lavoro |
| Playwright | Controllo del sito nel browser |
| Git e GitHub | Versioni e pull request |

## Layout

Lo stile è quello delle altre sezioni: titolo centrato, `Reveal` all'ingresso, contenitore `max-w-[1000px]`.

- **Introduzione:** centrata sotto il titolo, in Poppins, larga al massimo circa 640 px.
- **Due colonne da `lg`, una sotto l'altra su mobile:**
  - **a sinistra, finto terminale:** un riquadro decorativo (`aria-hidden`) in Roboto Mono. Mostra un breve scambio in stile Claude Code, per esempio `> aggiungi una sezione AI al menu`, poi "Scrivo prima il documento di progetto…" e un `✓ lint e type-check superati`. Riprende il frammento di codice decorativo della sezione Competenze;
  - **a destra, i quattro passi:** elenco ordinato con il numero in grande, nel viola del sito.
- **Griglia delle tecnologie:** cinque colonne su desktop (due righe da cinque), due su tablet, una su mobile. Ogni tecnologia sta in un riquadro col bordo chiaro, come le schede delle Competenze: nome in grassetto e riga di spiegazione in monospazio.

Non usiamo loghi di Anthropic, Claude o degli altri prodotti, che sono marchi registrati. Le icone vengono da `lucide-react`, per esempio `Sparkles` per l'AI e `Terminal` per il terminale.

## File

| File | Modifica |
| --- | --- |
| `src/lib/site.ts` | Aggiunge `{ label: "ai", href: "#ai" }` a `navItems` dopo "progetti". Aggiunge `aiSection` con titolo, introduzione, passi, righe del terminale e tecnologie. |
| `src/components/sections/ai.tsx` | **Nuovo.** Server Component della sezione, con `Section` e `SectionTitle`. |
| `src/app/page.tsx` | Inserisce `<Ai />` tra `<Projects />` e `<Experience />`. |
| `CLAUDE.md` | Aggiunge la sezione AI all'elenco delle sezioni e degli `id`. |

Nessuna nuova dipendenza.

## Scelte aperte

1. **Posizione nel menu.**
   - Proposta: dopo "progetti".
   - Alternativa: dopo "competenze", oppure in fondo prima di "contatti".
2. **Nome della voce.** Proposta: `// ai`. In alternativa `// vibe coding`, che però è lunga per il menu.
3. **Finto terminale.** Proposta: tenerlo, perché dà carattere e richiama lo stile "in codice" del sito. In alternativa la sezione ha solo testo e griglia.
4. **Testi.** Sono una bozza in prima persona, da correggere liberamente. Si può anche citare il modello usato (oggi Claude Opus 5.5). Proposta: non citarlo, perché cambia nel tempo.
