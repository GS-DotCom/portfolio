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

export const projects: Project[] = [
  {
    title: "Gestionale per impianti sportivi",
    description:
      "Applicazione web sviluppata in team presso T.S.I Group per la gestione di impianti sportivi, in ambiente .NET.",
    tags: ["ASP.NET Core MVC", "C#", "Razor", "Bootstrap"],
  },
  {
    title: "Migrazione da Access a SQL Server",
    description:
      "Porting dei database del gestionale da Microsoft Access a SQL Server, con migrazione, normalizzazione e verifica dell'integrità dei dati.",
    tags: ["SQL Server", "Microsoft Access"],
  },
  {
    title: "Rete intranet aziendale",
    description:
      "Gestione della rete intranet di Romeo Ficacci S.r.l. e configurazione di firewall, switch e armadi server.",
    tags: ["Networking", "Firewall", "Hardware"],
  },
  {
    title: "Portfolio personale",
    description:
      "Questo sito: una pagina unica, responsive e con tema chiaro e scuro, per presentare il mio percorso.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];

export const experience = [
  {
    role: "Sistemista IT junior",
    company: "Romeo Ficacci S.r.l.",
    period: "2025",
    description:
      "Supporto tecnico ai reparti aziendali e gestione della rete intranet, con attività su firewall, switch e armadi server.",
  },
  {
    role: "Sviluppatore Web junior .NET",
    company: "T.S.I Group",
    period: "2024 — 2025",
    description:
      "Sviluppo di un gestionale per impianti sportivi e porting dei database da Microsoft Access a SQL Server.",
  },
  {
    role: "Help Desk e Customer Care",
    company: "Contaq",
    period: "2020 — 2021",
    description:
      "Assistenza ai clienti di una società di noleggio auto, con presa in carico e risoluzione rapida dei problemi.",
  },
];
