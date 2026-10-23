import { ContactForm } from "@/components/contact-form";
import { CopyEmailButton } from "@/components/copy-email-button";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { contact, site } from "@/lib/site";

const linkClass = "w-fit font-mono text-[1.05rem] font-semibold transition-colors hover:text-cyan";

// Finestra di scrittura di Gmail in una nuova scheda, con destinatario e oggetto già compilati.
// Un sito non può sapere quale servizio di posta usa chi lo visita, e mailto: su molti PC non apre nulla.
const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent(contact.emailSubject)}`;

// Fascia dei contatti, che fa anche da footer: testi ed email a sinistra, form a destra
export function Contact() {
  return (
    <Section id="contact" className="bg-contact">
      <div className="mx-auto grid max-w-[1420px] lg:grid-cols-[minmax(0,1fr)_minmax(0,808px)]">
        <Reveal className="px-4 py-14 sm:px-6 lg:py-12 lg:pr-10 lg:pl-0">
          <h2 id="contact-title" className="max-w-[21rem] font-heading text-[2.1rem] leading-[1.3] font-bold">
            {contact.title}
          </h2>
          <p className="mt-10 max-w-[22rem] font-mono text-[1.05rem] leading-[1.4] font-semibold">
            {contact.intro}
          </p>

          <p className="mt-16 lg:mt-28">
            <a
              href={composeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="marker-underline font-mono text-lg font-medium wrap-anywhere [--marker:#8d47de] sm:text-[1.4rem]"
            >
              {site.email}
              <span className="sr-only"> (si apre Gmail in una nuova scheda)</span>
            </a>
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <CopyEmailButton email={site.email} className={linkClass} />
            </li>
          </ul>
        </Reveal>

        <Reveal className="min-w-0 border-white/8 bg-card px-4 pt-12 pb-14 sm:px-10 lg:border-l lg:px-14">
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
