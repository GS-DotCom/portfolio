// Tutti i contenuti del portfolio. I link social vuoti nascondono i relativi link.

export const site = {
  name: "Giuliano Simone",
  // Logo in stile codice dell'header: "GiulianoSimone._"
  logo: "GiulianoSimone",
  role: "Sviluppatore Web .NET e Sistemista IT",
  location: "Roma, Italia",
  available: true,
  email: "tarquinioprisco96@gmail.com",
  description:
    "Sviluppo applicazioni web in ambiente .NET e mi occupo di reti e sistemi aziendali. Cerco un'opportunità stabile in cui crescere e contribuire a progetti concreti.",
  socials: {
    github: "https://github.com/GS-DotCom",
    linkedin: "https://www.linkedin.com/in/giuliano-simone-713196358/",
  },
};

// Il numero in apice (01, 02, …) segue l'ordine dell'elenco
export const navItems = [
  { label: "home", href: "#home" },
  { label: "competenze", href: "#expertise" },
  { label: "progetti", href: "#projects" },
  { label: "esperienza", href: "#experience" },
  { label: "contatti", href: "#contact" },
];

export const hero = {
  subtitle: "Sviluppatore Web .NET e Sistemista IT.",
  // Al posto di "As featured in" del riferimento
  technologiesLabel: "Tecnologie che uso",
  technologies: ["C#", ".NET", "SQL Server", "JavaScript", "Cisco"],
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

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  // Le schede "large" occupano due colonne, come nel mosaico del riferimento
  size: "small" | "large";
  // Immagine in public/ oppure copertina astratta per i segnaposto
  image?: string;
  cover?: "browser" | "phone";
  placeholder?: boolean;
  href?: string;
};

export const projectsSection = {
  titleLines: ["I miei", "Progetti"],
  intro: site.description,
  filterLabel: "Filtra per",
  allLabel: "Tutti",
  categories: ["Web app", "App"] satisfies ProjectCategory[],
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
  },
  { id: "in-arrivo-1", title: "Progetto in arrivo", category: "App", size: "small", cover: "phone", placeholder: true },
  { id: "in-arrivo-2", title: "Progetto in arrivo", category: "Web app", size: "small", cover: "browser", placeholder: true },
  { id: "in-arrivo-3", title: "Progetto in arrivo", category: "Web app", size: "large", cover: "browser", placeholder: true },
  { id: "in-arrivo-4", title: "Progetto in arrivo", category: "App", size: "small", cover: "phone", placeholder: true },
  { id: "in-arrivo-5", title: "Progetto in arrivo", category: "Web app", size: "small", cover: "browser", placeholder: true },
];

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
    course: "Analista Programmatore",
    school: "Istituto CEFI",
    period: "2022 — 2023",
    description: "Corso di 500 ore.",
    topics: ["C", "C++", "Java", "JavaScript", "C#", "SQL Server", "MySQL"],
  },
  {
    course: "Illustratore",
    school: "Scuola del Fumetto Comix",
    period: "2015 — 2017",
    description: "Corso triennale nelle sedi di Roma Garbatella e Roma Colli Albani.",
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
