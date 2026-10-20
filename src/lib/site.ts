// Tutti i contenuti del portfolio. I link social vuoti nascondono i relativi pulsanti.

export const site = {
  name: "Giuliano Simone",
  initials: "GS",
  role: "Sviluppatore Web .NET e Sistemista IT",
  location: "Roma, Italia",
  available: true,
  email: "tarquinioprisco96@gmail.com",
  year: 2026,
  description:
    "Sviluppo applicazioni web in ambiente .NET e mi occupo di reti e sistemi aziendali. Cerco un'opportunità stabile in cui crescere e contribuire a progetti concreti.",
  socials: {
    github: "https://github.com/GS-DotCom",
    linkedin: "https://www.linkedin.com/in/giuliano-simone-713196358/",
  },
};

export const navItems = [
  { label: "Chi sono", href: "#about" },
  { label: "Progetti", href: "#projects" },
  { label: "Esperienza", href: "#experience" },
  { label: "Contatti", href: "#contact" },
];

export const about = {
  paragraphs: [
    "Sono uno sviluppatore web e sistemista IT di Roma. Dopo il corso da Analista Programmatore all'Istituto CEFI ho lavorato come sviluppatore .NET junior, contribuendo a un gestionale per impianti sportivi e alla migrazione dei suoi database da Microsoft Access a SQL Server.",
    "Come sistemista ho poi lavorato sull'infrastruttura: supporto tecnico ai reparti aziendali, gestione della rete intranet, configurazione di firewall e interventi su switch e armadi server. Oggi sto preparando la certificazione Cisco CCNA.",
    "Ho una formazione artistica, tra il diploma da grafico pubblicitario e i tre anni alla Scuola del Fumetto Comix, che mi porta a curare anche l'aspetto visivo di quello che realizzo. Lavoro bene sia in team sia in autonomia.",
  ],
  skills: [
    {
      group: "Sviluppo",
      items: ["C#", "ASP.NET Core MVC", "Razor", "JavaScript", "HTML", "CSS", "Bootstrap", "WPF"],
    },
    {
      group: "Database",
      items: ["SQL Server", "MySQL", "Microsoft Access"],
    },
    {
      group: "Sistemi e reti",
      items: ["Networking", "Firewall", "Switch", "Supporto tecnico", "CCNA (in corso)"],
    },
    {
      group: "Lingue",
      items: ["Italiano (madrelingua)", "Inglese (B2)"],
    },
  ],
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  repo?: string;
};

export const projectsSection = {
  title: "App e progetti",
  intro: "Applicazioni e web app che sviluppo, dall'idea al rilascio.",
  // Scheda segnaposto in fondo alla griglia: da spegnere quando la sezione sarà piena
  showComingSoon: true,
  comingSoon: {
    title: "Nuovi progetti in arrivo",
    description: "Sto lavorando alle prossime applicazioni: presto le trovi qui.",
  },
};

// Progetti personali: le attività di lavoro sono nella sezione Esperienza
export const projects: Project[] = [
  {
    title: "Portfolio personale",
    description:
      "Questo sito: una pagina unica, responsive e con tema chiaro e scuro, per presentare il mio percorso.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
  tags?: string[];
};

// Ruoli in ambito IT: schede sulla linea del tempo
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

// Esperienze fuori dall'ambito IT: elenco compatto
export const otherExperience: Experience[] = [
  {
    role: "Preparatore auto",
    company: "Car Lovers Renault Tiburtina",
    period: "2024",
    description:
      "Due mesi di preparazione dei veicoli alla consegna, a contatto con officina, carrozzeria e area lavaggio, con il controllo finale prima della consegna al cliente.",
  },
  {
    role: "Picker e confezionamento",
    company: "StanHome",
    period: "2023 — 2024",
    description: "Picking e confezionamento di prodotti per la cura della persona e della casa.",
  },
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
  },
  {
    course: "Grafico pubblicitario",
    school: "Liceo Artistico Tivoli",
    period: "2010 — 2015",
    description: "Diploma di scuola secondaria di secondo grado.",
  },
];

export const contact = {
  intro:
    "Stai cercando qualcuno per il tuo team o hai un progetto da propormi? Scrivimi, sarò felice di parlarne.",
  emailLabel: "Email per proposte",
  emailSubject: "Proposta di lavoro",
};
