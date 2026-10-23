// Tutti i contenuti del portfolio. I link social vuoti nascondono i relativi link.

import { EMAIL_PATTERN, NAME_PATTERN, PHONE_PATTERN } from "@/lib/contact-rules";

export const site = {
  name: "Giuliano Simone",
  role: "Sviluppatore Web .NET e Sistemista IT",
  location: "Roma, Italia",
  available: true,
  email: "g.simone1927@gmail.com",
  // Foto rotonda della hero, da mettere in public/ (es. "/foto.jpg"). Vuota mostra le iniziali.
  photo: "/pesso.jpg",
  description:
    "Sviluppo applicazioni mobile/web fullstack, utilizzando TypeScript, React, Next.js e Tailwind CSS. Ho avuto esperienza di reti e sistemi intranet aziendali. A ottobre 2026 ho concluso il mio percorso formativo Formatemp come z/OS System Administrator." +
    " Sono sempre alla ricerca di un'opportunità stabile in cui crescere e contribuire a progetti concreti e coinvolgenti per la mia crescita professionale.",
  socials: {
    github: "https://github.com/GS-DotCom",
    linkedin: "https://www.linkedin.com/in/giuliano-simone-713196358/",
  },
};

// Il numero in apice (01, 02, …) segue l'ordine dell'elenco.
// La "/" iniziale fa funzionare il menu anche dalle pagine dei progetti.
export const navItems = [
  { label: "home", href: "/#home" },
  { label: "competenze", href: "/#expertise" },
  { label: "progetti", href: "/#projects" },
  { label: "AI", href: "/#ai" },
  { label: "esperienza", href: "/#experience" },
  { label: "contatti", href: "/#contact" },
];

export const hero = {
  subtitle: "Mobile/Web App developer & z/OS System Administrator.",
  // Al posto di "As featured in" del riferimento
  technologiesLabel: "Tecnologie che uso",
  technologies: ["C#", ".NET", "SQL Server", "JavaScript", "HTML", "CSS", "IBM", "DB2", "Git", "React", "Next.js", "TypeScript", "Tailwind CSS", "Claude Code", "GitHub"],
};

// Presentazione estesa: oggi non compare nel sito, la teniamo per usi futuri
export const about = {
  paragraphs: [
    "Sono uno sviluppatore web e sistemista IT di Roma. Dopo il corso da Analista Programmatore all'Istituto CEFI ho lavorato come sviluppatore .NET junior, contribuendo a un gestionale per impianti sportivi e alla migrazione dei suoi database da Microsoft Access a SQL Server.",
    "Come sistemista ho poi lavorato sull'infrastruttura: supporto tecnico ai reparti aziendali, gestione della rete intranet, configurazione di firewall e interventi su switch e armadi server. Oggi sto preparando la certificazione Cisco CCNA.",
    "Ho una formazione artistica, tra il diploma da grafico pubblicitario e i tre anni alla Scuola del Fumetto Comix, che mi porta a curare anche l'aspetto visivo di quello che realizzo. Lavoro bene sia in team sia in autonomia.",
  ],
};

export type ExpertiseItem = {
  icon: "web" | "database" | "network";
  // La prima riga del titolo è sottolineata con il colore indicato
  title: string;
  subtitle: string;
  color: "pink" | "blue" | "orange";
  description: string;
};

export const expertise = {
  title: "Le mie competenze",
  items: [
    {
      icon: "web",
      title: "Sviluppo Web",
      subtitle: ".NET, TypeScript, React e Next.js",
      color: "pink",
      description:
        "Applicazioni web multiservizi in ASP.NET, Razor e C#, implementando JavaScript/TypeScript, React e Next.js (Turbopack). Applicazioni legacy sviluppate in REXX, JCL e COBOL.",
    },
    {
      icon: "database",
      title: "Database",
      subtitle: "SQL Server/DB2",
      color: "blue",
      description:
        "Sviluppo e analisi dei dati, stored procedure e query su database relazionali quali SQL Server, MySQL, DB2 e Access."
    },
    {
      icon: "network",
      title: "Sistemi e reti",
      subtitle: "Firewall, CCNA, RACF",
      color: "orange",
      description:
        "Networking, firewall, configurazione di switch e armadi server. Conoscenza di z/OS RACF in ambiente mainframe.",
    },
  ] satisfies ExpertiseItem[],
};

export type ProjectCategory = "Web app" | "App";

export type ProjectImage = { src: string; alt: string; width: number; height: number };

// Sezione "In evidenza" della pagina del progetto: una funzionalità raccontata con schermata,
// regole, un frammento di codice e i punti di forza. Nel paragrafo, **testo** va in grassetto.
export type ProjectHighlight = {
  eyebrow: string;
  title: string;
  lead: string;
  image: ProjectImage & { caption: string };
  rulesTitle: string;
  rules: { name: string; optional?: boolean; text: string; pattern?: string }[];
  code: { title: string; text: string; file: string; snippet: string; label: string };
  pointsTitle: string;
  points: { title: string; text: string }[];
};

// Contenuti della pagina di dettaglio: solo i progetti che li hanno sono cliccabili
export type ProjectDetails = {
  description: string;
  client: string;
  technologies: string[];
  // Indirizzo del progetto pubblicato; vuoto nasconde il link "Apri il progetto"
  url?: string;
  highlight?: ProjectHighlight;
  gallery: ProjectImage[];
};

export type Project = {
  // Diventa anche l'indirizzo della pagina: /progetti/<id>
  id: string;
  title: string;
  category: ProjectCategory;
  // Le schede "large" occupano due colonne, come nel mosaico del riferimento
  size: "small" | "large";
  // Immagine in public/ oppure copertina astratta per i segnaposto
  image?: string;
  cover?: "browser" | "phone";
  placeholder?: boolean;
  details?: ProjectDetails;
};

export const projectsSection = {
  titleLines: ["I miei", "Progetti"],
  intro: site.description,
  filterLabel: "Filtra per",
  allLabel: "Tutti",
  categories: ["Web app", "App"] satisfies ProjectCategory[],
  // Sostituisce la categoria quando il mouse passa su una scheda cliccabile
  openLabel: "Apri progetto",
  // Schede "Progetto in arrivo": da spegnere quando arriveranno i progetti veri
  showPlaceholders: true,
};

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "Portfolio personale",
    category: "Web app",
    size: "small",
    image: "/projects/portfolio-desktop.png",
    details: {
      description:
        "Il mio portfolio personale: un sito a pagina unica che presenta competenze, progetti ed esperienze." +
        " È nato in vibe coding utilizzando Cursor con Claude Code, e ogni funzionalità parte da una reference e da un documento" +
        " di progetto approvato prima di scrivere il codice.",
      client: "Progetto personale",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Web3Forms API"],
      highlight: {
        eyebrow: "In evidenza",
        title: "Form di contatto con invio tramite API",
        lead:
          "Il form dei contatti manda il messaggio direttamente nella mia casella senza un server dedicato: il browser chiama l'**API REST di Web3Forms** con una richiesta POST in JSON, e il servizio recapita l'email con il mittente già impostato come «Rispondi a». Prima dell'invio ogni campo viene **controllato con regole precise**, con un messaggio di errore diverso per ogni problema.",
        image: {
          src: "/projects/portfolio/form-contatti.png",
          alt: "Il form di contatto compilato, con l'errore «L'indirizzo deve contenere una sola @» sotto il campo Email",
          caption: "Il controllo dell'email in azione: due @ nell'indirizzo bloccano l'invio.",
          width: 808,
          height: 1053,
        },
        rulesTitle: "Controlli sui campi",
        rules: [
          {
            name: "Nome e Cognome",
            text: "Solo lettere, anche accentate, spazi, apostrofo e trattino, da 2 a 50 caratteri. Niente numeri o simboli.",
            pattern: NAME_PATTERN.source,
          },
          {
            name: "Email",
            text: "Una sola @, dominio con estensione di almeno due lettere, nessuno spazio, niente punti doppi o ai bordi, fino a 254 caratteri.",
            pattern: EMAIL_PATTERN.source,
          },
          {
            name: "Telefono",
            optional: true,
            text: "Prefisso + facoltativo, poi cifre, spazi o trattini, da 6 a 15 caratteri.",
            pattern: PHONE_PATTERN.source,
          },
          {
            name: "Oggetto e messaggio",
            text: "Oggetto fino a 50 caratteri e messaggio fino a 50 righe, con i contatori che si aggiornano mentre scrivi.",
          },
          { name: "Consenso privacy", text: "Obbligatorio e mai spuntato in partenza, come chiede il GDPR." },
        ],
        code: {
          title: "Invio con l'API di Web3Forms",
          text: "Una sola richiesta dal browser: nessun backend da mantenere e nessuna password nel codice. La chiave dell'API sta in una variabile d'ambiente.",
          file: "contact-form.tsx",
          label: "Esempio della richiesta all'API di Web3Forms e della risposta",
          snippet: [
            'await fetch("https://api.web3forms.com/submit", {',
            '  method: "POST",',
            "  body: JSON.stringify({",
            "    access_key, subject, name, email,",
            "    Telefono, Oggetto, Messaggio,",
            "  }),",
            "});",
            '// → { "success": true }',
          ].join("\n"),
        },
        pointsTitle: "Esperienza d'uso e accessibilità",
        points: [
          {
            title: "Errori chiari:",
            text: "sotto ogni campo compare il motivo preciso, e il cursore va sul primo da correggere.",
          },
          {
            title: "Lettori di schermo:",
            text: "aria-invalid e aria-describedby collegano ogni errore al suo campo; conferma e avvisi vengono annunciati.",
          },
          {
            title: "Stati dell'invio:",
            text: "«Invio in corso…», poi la conferma oppure un avviso, senza perdere quello che hai scritto.",
          },
          { title: "Antispam:", text: "un campo trappola invisibile che compilano solo i bot." },
        ],
      },
      gallery: [
        { src: "/projects/portfolio/hero.png", alt: "La hero del portfolio con nome, foto e tecnologie", width: 1440, height: 900 },
        { src: "/projects/portfolio/progetti.png", alt: "La sezione dei progetti", width: 1440, height: 900 },
        { src: "/projects/portfolio/ai.png", alt: "La sezione sul vibe coding con Claude", width: 1440, height: 900 },
        { src: "/projects/portfolio/esperienza.png", alt: "La timeline delle esperienze", width: 1440, height: 900 },
      ],
    },
  },
  //{ id: "in-arrivo-1", title: "Progetto in arrivo", category: "App", size: "small", cover: "phone", placeholder: true },
  //{ id: "in-arrivo-2", title: "Progetto in arrivo", category: "Web app", size: "small", cover: "browser", placeholder: true },
  //{ id: "in-arrivo-3", title: "Progetto in arrivo", category: "Web app", size: "large", cover: "browser", placeholder: true },
  //{ id: "in-arrivo-4", title: "Progetto in arrivo", category: "App", size: "small", cover: "phone", placeholder: true },
  //{ id: "in-arrivo-5", title: "Progetto in arrivo", category: "Web app", size: "small", cover: "browser", placeholder: true },
];

// Testi fissi della pagina di dettaglio di un progetto (/progetti/<id>)
export const projectPage = {
  backLabel: "Torna ai progetti",
  breadcrumbLabel: "Percorso",
  breadcrumbHome: "Home",
  breadcrumbProjects: "Progetti",
  clientLabel: "Cliente",
  technologiesLabel: "Stack tecnologico",
  openLabel: "Apri il progetto",
  // Barra in fondo alla pagina: compare solo quando ci sono almeno due progetti con pagina
  adjacentLabel: "Altri progetti",
  nextLabel: "Progetto successivo",
  previousButtonLabel: "Progetto precedente:",
  nextButtonLabel: "Progetto successivo:",
  footerCredits: `© 2026 ${site.name}.`,
  footerRights: "Tutti i diritti riservati.",
};

// Sezione sul vibe coding: come nasce questo sito e con quali strumenti
export const aiSection = {
  titleLines: ["Vibe coding", "con Claude Code"],
  intro:
    "Implemento Claude Code di Anthropic in Cursor per sviluppare applicazioni e formarmi in autonomia sulle nuove tecnologie." +
    " Con l'AI ho libero accesso a tutte le risorse per apprendere, sviluppare, prototipare e testare le mie applicazioni, oltre che studiare i diversi modelli, le loro implementazioni e le loro limitazioni.",
  stepsTitle: "Workflow",
  steps: [
    {
      title: "Descrivo l'idea",
      text: "Spiego cosa voglio, spesso partendo da uno screenshot o da un sito di riferimento per poi personalizzare la mia idea.",
    },
    {
      title: "Prima il progetto",
      text: "Claude scrive un documento con obiettivo, file da toccare e scelte aperte. Ogni modifica viene effettuata dopo ogni mia conferma, lavorando sia un manuale che in automatizzazione.",
    },
    {
      title: "Codice e verifica",
      text: "Claude scrive il codice, io lo revisiono. Correggo e segnalo eventuali bug. Lancia il lint e la build, controllo dei tipi e verifica del risultato nel browser, su desktop e mobile.",
    },
    {
      title: "Code review",
      text: "Guardo l'anteprima sul server locale, chiedo ritocchi e approvo. Il codice resta mio: lo leggo, lo capisco e lo mantengo.Il tutto viene trascritto sotto forma di documento.",
    },
  ],
  // Finto terminale decorativo: "prompt" è la richiesta, "reply" la risposta, "ok" un controllo superato
  terminal: [
    { kind: "prompt", text: "claude" },
    { kind: "reply", text: "Scrivo prima il documento di progetto in docs/." },
    { kind: "reply", text: "Fatto. Mi confermi il piano?" },
    { kind: "prompt", text: "confermo" },
    { kind: "reply", text: "Creo sections/ai.tsx e aggiorno il menu…" },
    { kind: "ok", text: "lint e type-check superati" },
    { kind: "ok", text: "controllata nel browser a 1440 e 390 px" },
  ] satisfies { kind: "prompt" | "reply" | "ok"; text: string }[],
  stackTitle: "Tecnologie utilizzate per questo sito",
  stack: [
    { name: "Next.js 16", text: "App Router, Server Components e Turbopack" },
    { name: "React 19", text: "Interfaccia, componenti, stato" },
    { name: "TypeScript", text: "Tipizzazione su tutto il codice" },
    { name: "Tailwind CSS 4", text: "Stili e tema scuro" },
    { name: "shadcn/ui e Base UI", text: "Componenti accessibili" },
    { name: "WebGL", text: "Il nastro animato della hero, disegnato in un Web Worker" },
    { name: "Claude Code", text: "L'assistente che scrive il codice con me" },
    { name: "Cursor", text: "L'editor in cui lavoro" },
    { name: "Playwright", text: "Controllo del sito nel browser" },
    { name: "Git e GitHub", text: "Versioni e pull request" },
  ],
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
  tags?: string[];
};

export const experienceSection = {
  titleLines: ["Esperienza", "Professionale"],
  otherTitle: "Formazione e altre esperienze",
};

// Ruoli in ambito IT: barre della prima fisarmonica
export const experience: Experience[] = [
  {
    role: "Sistemista IT junior",
    company: "Romeo Ficacci S.r.l.",
    period: "2025",
    description:
      "Supporto tecnico ai reparti aziendali e gestione della rete intranet, sia lato back-end sia lato front-end. Ho sviluppato competenze in networking e configurazione dei firewall, con attività dirette sull'infrastruttura hardware: armadi server e switch.",
    tags: ["Networking", "Firewall", "Switch", "Armadi server", "Intranet", "Supporto tecnico", "Ticketing", "Help desk", "CISCO CCNA"],
  },
  {
    role: "Sviluppatore Web junior .NET",
    company: "T.S.I Group",
    period: "2024 — 2025",
    description:
      "Sviluppo in team di un gestionale per impianti sportivi in ambiente .NET. Responsabile del porting dei database da Microsoft Access a SQL Server, con migrazione, normalizzazione e verifica dell'integrità dei dati.",
    tags: [
      "ASP.NET",
      ".NET Core 6.0 MVC",
      "C#",
      "Razor",
      "JavaScript",
      "HTML",
      "CSS",
      "Bootstrap",
      "WPF",
      "SQL Server",
      "Access",
    ],
  },
  {
    role: "Help Desk e Customer Care",
    company: "Contaq",
    period: "2020 — 2021",
    description:
      "Centralino di assistenza per una società di noleggio auto: presa in carico delle segnalazioni dei clienti e risoluzione nel minor tempo possibile. Un'esperienza che mi ha dato una buona capacità di problem solving.",
    tags: ["Help desk", "Customer care", "Problem solving"],
  },
];

// Esperienze fuori dall'ambito IT
export const otherExperience: Experience[] = [
  {
    role: "Portalettere",
    company: "Poste Italiane",
    period: "2021 — 2022",
    description: "Recapito in linea business, con ogni tipo di prodotto gestito dal servizio postale.",
  },
];

export const education = [
  {
    course: "z/OS System Administrator",
    school: "Corso FORMATEMP",
    period: "2026",
    description:
      "Corso incentrato sulla figura di sistemista Mainframe IBM con particolare attenzione sul sistema operativo z/OS. Ho avuto modo di lavorare su dataset e librerie con ISPF e TSO, elaborazione di JOB batch in JCL e" +
      "gestendo i job con JES2 e SDSF. Ho approfondito l'utilizzo di DB2 e la sicurezza degli accessi con RACF, diagnostica di log e dump con IPCS e automazione con REXX e CLIST, con un'introduzione a CICS." +
      "Fine corso dedicato a COBOL con 3 giornate intensive di programmazione.",
    topics: ["z/OS", "Mainframe IBM", "ISPF", "TSO", "MVS", "JCL", "JES2", "SDSF", "DB2", "SQL", "RACF", "IPCS", "REXX", "COBOL", "CLIST", "CICS", "Protocolli di rete TCP/IP"],
  },
  {
    course: "Analista Programmatore",
    school: "Istituto Informatico CEFI",
    period: "2022 — 2023",
    description: "Corso di 500 ore. Buona conoscenza di programmazione in C, C++, Java, JavaScript, C# e SQL Server.",
    topics: ["C", "C++", "Java", "JavaScript", "C#", "SQL Server", "MySQL"],
  },
  {
    course: "Illustratore",
    school: "Scuola del Fumetto Comix",
    period: "2015 — 2017",
    description: "Corso triennale di illustrazione tradizionale e digitale, svolto nelle sedi di Roma Garbatella e Roma Colli Albani." +
    " Tecnologie utilizzate: Adobe Photoshop, Adobe Illustrator e Clip Studio Paint",
  }
];

export const contact = {
  title: "Disponibile per nuove opportunità",
  intro:
    "Stai cercando qualcuno per il tuo team o hai un progetto da propormi? Scrivimi, sarò felice di parlarne.",
  emailSubject: "Proposta di lavoro",
  // Form di contatto: i messaggi arrivano a site.email tramite Web3Forms (chiave in .env.local)
  form: {
    title: "Scrivimi un messaggio",
    intro: "Compila il modulo sottostante, verrai ricontattato alla mail indicata nel momento dell'invio.",
    fields: {
      firstName: { label: "Nome", placeholder: "Mario" },
      lastName: { label: "Cognome", placeholder: "Rossi" },
      company: { label: "Nome società", placeholder: "Acme S.r.l." },
      email: { label: "Email", placeholder: "mario.rossi@azienda.it" },
      phone: { label: "Telefono", placeholder: "+39 333 123 4567" },
      subject: { label: "Oggetto", placeholder: "Proposta di lavoro" },
      message: { label: "Messaggio", placeholder: "Ciao Giuliano, ti scrivo per…" },
    },
    errors: {
      firstNameEmpty: "Scrivi il tuo nome.",
      lastNameEmpty: "Scrivi il tuo cognome.",
      nameLength: "Deve avere da 2 a 50 caratteri.",
      nameChars: "Usa solo lettere, spazi, apostrofo e trattino.",
      emailEmpty: "Scrivi la tua email.",
      emailSpaces: "Togli gli spazi dall'indirizzo.",
      emailAt: "L'indirizzo deve contenere una sola @.",
      emailLength: "L'indirizzo è troppo lungo (massimo 254 caratteri).",
      emailDots: "Controlla i punti: non possono essere doppi, né all'inizio o alla fine.",
      emailDomain: "Dopo la @ serve un dominio con estensione, ad esempio azienda.it.",
      phone: "Usa solo cifre, spazi e trattini, con il + iniziale se serve (da 6 a 15 caratteri).",
      message: "Scrivi il messaggio.",
      privacy: "Per inviare il messaggio devi accettare l'informativa sulla privacy.",
    },
    optional: "(facoltativo)",
    maxLines: 50,
    linesLabel: "righe",
    subjectMaxLength: 50,
    consent: "Ho letto l'informativa qui sotto e acconsento al trattamento dei miei dati per ricevere una risposta.",
    privacyTitle: "Informativa sulla privacy.",
    privacyText: `Uso i dati che inserisci solo per risponderti: non li uso per altri scopi, non li cedo a terzi e non li pubblico. Il messaggio arriva soltanto nella mia casella email, recapitato dal servizio Web3Forms. Puoi chiedermi di cancellarlo in qualsiasi momento scrivendo a ${site.email}.`,
    send: "Invia",
    sending: "Invio in corso…",
    failedTitle: "Il messaggio non è partito.",
    failedText: "Controlla la connessione e premi di nuovo Invia, oppure scrivimi a",
    sentTitle: "Messaggio inviato",
    sentText: (name: string) => `Grazie ${name}, ho ricevuto il tuo messaggio. Ti rispondo presto a`,
    again: "Scrivi un altro messaggio",
    // Oggetto dell'email che ricevo: quello scritto nel form, se c'è
    subject: (name: string, subject: string) =>
      subject ? `Portfolio: ${subject} (${name})` : `Nuovo messaggio dal portfolio: ${name}`,
  },
};
