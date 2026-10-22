// Tutti i contenuti del portfolio. I link social vuoti nascondono i relativi link.

export const site = {
  name: "Giuliano Simone",
  role: "Sviluppatore Web .NET e Sistemista IT",
  location: "Roma, Italia",
  available: true,
  email: "tarquinioprisco96@gmail.com",
  // Foto rotonda della hero, da mettere in public/ (es. "/foto.jpg"). Vuota mostra le iniziali.
  photo: "/pesso.jpg",
  description:
    "Sviluppo applicazioni web in ambiente .NET e mi occupo di reti e sistemi aziendali. Cerco un'opportunità stabile in cui crescere e contribuire a progetti concreti.",
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
  subtitle: "Sviluppatore Web .NET e Sistemista z/OS.",
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
      subtitle: ".NET e C#",
      color: "pink",
      description:
        "Applicazioni web in ASP.NET Core MVC, Razor e C#, con JavaScript, Bootstrap e WPF per il desktop.",
    },
    {
      icon: "database",
      title: "Database",
      subtitle: "SQL Server",
      color: "blue",
      description:
        "Database relazionali su SQL Server e MySQL. Ho migrato un gestionale da Access a SQL Server.",
    },
    {
      icon: "network",
      title: "Sistemi e reti",
      subtitle: "Firewall, CCNA",
      color: "orange",
      description:
        "Networking, firewall, switch e armadi server. Sto preparando la certificazione Cisco CCNA.",
    },
  ] satisfies ExpertiseItem[],
};

export type ProjectCategory = "Web app" | "App";

export type ProjectImage = { src: string; alt: string; width: number; height: number };

// Contenuti della pagina di dettaglio: solo i progetti che li hanno sono cliccabili
export type ProjectDetails = {
  description: string;
  client: string;
  technologies: string[];
  // Indirizzo del progetto pubblicato; vuoto nasconde il link "Apri il progetto"
  url?: string;
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
        "di progetto approvato prima di scrivere il codice.",
      client: "Progetto personale",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"],
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
  footerCredits: `© 2026 ${site.name}.`,
  footerRights: "Tutti i diritti riservati.",
};

// Sezione sul vibe coding: come nasce questo sito e con quali strumenti
export const aiSection = {
  titleLines: ["Vibe coding", "con Claude"],
  intro:
    "Sto imparando a sviluppare in vibe coding: descrivo in italiano quello che voglio ottenere e lo costruisco insieme a un assistente AI. Uso Claude di Anthropic tramite Claude Code, dentro l'editor Cursor. Questo portfolio è il primo progetto nato così.",
  stepsTitle: "Workflow",
  steps: [
    {
      title: "Descrivo l'idea",
      text: "Spiego cosa voglio, spesso partendo da uno screenshot o da un sito di riferimento.",
    },
    {
      title: "Prima il progetto",
      text: "Claude scrive un documento con obiettivo, file da toccare e scelte aperte. Si parte solo dopo la mia conferma.",
    },
    {
      title: "Codice e verifica",
      text: "Claude scrive il codice, lancia lint e controllo dei tipi e verifica il risultato nel browser, su desktop e su mobile.",
    },
    {
      title: "Rivedo e decido",
      text: "Guardo l'anteprima, chiedo ritocchi e approvo. Il codice resta mio: lo leggo, lo capisco e lo mantengo.",
    },
  ],
  // Finto terminale decorativo: "prompt" è la richiesta, "reply" la risposta, "ok" un controllo superato
  terminal: [
    { kind: "prompt", text: "aggiungi una sezione AI al menu" },
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
    { name: "React 19", text: "Interfaccia a componenti" },
    { name: "TypeScript", text: "Tipi su tutto il codice" },
    { name: "Tailwind CSS 4", text: "Stili e tema scuro" },
    { name: "shadcn/ui e Base UI", text: "Componenti accessibili" },
    { name: "Canvas 2D", text: "Il nastro animato della hero" },
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
    tags: ["Networking", "Firewall", "Switch", "Armadi server", "Intranet", "Supporto tecnico"],
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

export type Strength = {
  icon: "problem-solving" | "team" | "design";
  color: "lilac" | "blue" | "violet";
  text: string;
  title: string;
  source: string;
};

export const contact = {
  title: "Disponibile per nuove opportunità",
  intro:
    "Stai cercando qualcuno per il tuo team o hai un progetto da propormi? Scrivimi, sarò felice di parlarne.",
  emailSubject: "Proposta di lavoro",
  // Al posto delle testimonianze del riferimento: punti di forza presi dal CV
  strengths: [
    {
      icon: "problem-solving",
      color: "lilac",
      text: "Al centralino di assistenza ho imparato a prendere in carico un problema e a risolverlo nel minor tempo possibile. È lo stesso approccio che porto nello sviluppo e nella gestione dei sistemi: capire cosa non va, trovare la causa e sistemarla senza lasciare nulla a metà.",
      title: "Problem solving",
      source: "Help desk e customer care, Contaq",
    },
    {
      icon: "team",
      color: "blue",
      text: "Ho sviluppato in team un gestionale per impianti sportivi e, in autonomia, il porting dei suoi database da Access a SQL Server.",
      title: "In team e in autonomia",
      source: "Sviluppatore .NET, T.S.I Group",
    },
    {
      icon: "design",
      color: "violet",
      text: "Il diploma da grafico pubblicitario e i tre anni alla Scuola del Fumetto Comix mi portano a curare anche l'aspetto visivo di quello che realizzo.",
      title: "Cura visiva",
      source: "Formazione artistica",
    },
  ] satisfies Strength[],
};
