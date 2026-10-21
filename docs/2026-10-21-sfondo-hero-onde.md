# Sfondo della hero a nastro di linee

Data: 2026-10-21
Stato: approvato e implementato; manca solo lo screenshot del portfolio, da rifare con la foto

## Obiettivo

Sostituire la scena 3D della hero (cubi, cilindri e sfera arancione in `three`) con uno sfondo simile a `references/sfondo header.png`. Il riferimento è uno sfondo quasi nero attraversato da un nastro di molte linee sottili, che sale e scende da sinistra a destra. Le linee sfumano dal magenta al viola all'indaco.

Nella hero restano:

- il nome al centro, più piccolo di oggi;
- sotto il nome, il sottotitolo attuale ("Sviluppatore Web .NET e Sistemista IT."). L'utente lo correggerà più avanti in `src/lib/site.ts`;
- l'elenco "Tecnologie che uso" e l'indicatore di scorrimento, che oggi ci sono già.

Foto e icone social del riferimento non sono state richieste, quindi non si aggiungono.

## Approccio tecnico

Il riferimento usa un'immagine statica, che nell'HTML salvato non c'è. La ricreiamo come **canvas animato**, che prende il posto della scena 3D:

- Il nastro è fatto di circa 50 linee che seguono una stessa curva di base: una spline Catmull-Rom su punti di controllo espressi in frazioni di larghezza e altezza.
- Ogni linea si discosta dalla curva di base di uno scarto che varia lungo il percorso con una sinusoide. Dove lo scarto passa per zero le linee si stringono: è l'effetto "nastro che si avvita" del riferimento.
- La sinusoide scorre molto lentamente nel tempo, così il nastro ondeggia piano.
- Il colore è un gradiente orizzontale: magenta `#d10ce8`, viola `#8a1fd6`, indaco `#4a2fd0`.
- La curva passa in basso al centro della hero e sale in alto solo verso il bordo destro, per lasciare libera la zona del nome.

Come la scena 3D, il canvas:

- si ferma fuori schermo e quando la scheda è nascosta;
- con movimento ridotto disegna un solo fotogramma fermo;
- si adatta al ridimensionamento e alla densità dei pixel dello schermo.

Lo sfondo della hero passa dal blu notte attuale a un quasi nero, come nel riferimento, con la sfumatura verso il resto della pagina già presente. Si toglie la foschia arancione, che serviva alla sfera 3D.

Il nome resta in Poppins maiuscolo ma più piccolo: circa 3 rem su mobile e fino a 6 rem su schermi grandi, invece del 9–10 vw di oggi.

## File

| File | Modifica |
| --- | --- |
| `src/components/hero-waves.tsx` | **Nuovo.** Client Component con il canvas del nastro. |
| `src/components/sections/hero.tsx` | Usa `HeroWaves` al posto di `HeroSceneLoader`, nuovo sfondo, nome più piccolo. |
| `src/components/hero-scene.tsx`, `hero-scene-loader.tsx` | Restano finché la prova non è approvata. Se sì, si eliminano insieme alla dipendenza `three` e si aggiorna `CLAUDE.md`. |
| `public/projects/portfolio-desktop.png` | Da rifare dopo l'approvazione, perché ritrae la hero. |

## Decisioni

1. **Animazione:** il nastro ondeggia piano, approvato così.
2. **Nome:** solo iniziali maiuscole ("Giuliano Simone"), allineato a sinistra dentro il suo blocco.
3. **Foto e social:** sopra il nome, allineati alla prima lettera. La foto viene da `site.photo` in `src/lib/site.ts`; finché è vuota compare un cerchio con le iniziali. GitHub e LinkedIn usano le icone di `icons.tsx` e spariscono se il link in `site.socials` è vuoto.
