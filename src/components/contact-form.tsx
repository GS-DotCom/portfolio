"use client";

import { ArrowRight, Check, CircleAlert, LoaderCircle, Send } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type SubmitEvent } from "react";
import { flushSync } from "react-dom";

import { EMAIL_PATTERN, LETTER_PATTERN, NAME_PATTERN, PHONE_PATTERN } from "@/lib/contact-rules";
import { contact, site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Form dei contatti: i messaggi arrivano a site.email tramite Web3Forms.
// La chiave (pubblica: permette solo di inviare alla casella collegata) sta in .env.local.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const text = contact.form;
const errors = text.errors;

type Values = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacy: boolean;
};
type Status = "idle" | "sending" | "sent" | "failed";
type CheckedField = "firstName" | "lastName" | "email" | "phone" | "message" | "privacy";

const emptyValues: Values = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  privacy: false,
};

// L'apostrofo tipografico che i telefoni inseriscono da soli (’) vale come quello semplice
function normalizeName(value: string) {
  return value.trim().replace(/’/g, "'");
}

function nameError(value: string, empty: string) {
  const name = normalizeName(value);
  if (name === "") return empty;
  if (name.length < 2 || name.length > 50) return errors.nameLength;
  if (!NAME_PATTERN.test(name) || !LETTER_PATTERN.test(name)) return errors.nameChars;
  return null;
}

function emailError(value: string) {
  const email = value.trim();
  if (email === "") return errors.emailEmpty;
  if (/\s/.test(email)) return errors.emailSpaces;
  if (email.split("@").length !== 2) return errors.emailAt;
  if (email.length > 254) return errors.emailLength;
  if (email.includes("..") || /^\.|\.$|\.@|@\./.test(email)) return errors.emailDots;
  if (!EMAIL_PATTERN.test(email)) return errors.emailDomain;
  return null;
}

// Regole dei campi, nell'ordine in cui compaiono: il primo sbagliato riceve il focus.
// Ognuna restituisce il messaggio di errore, oppure null se il valore va bene.
const rules: [CheckedField, (values: Values) => string | null][] = [
  ["firstName", (values) => nameError(values.firstName, errors.firstNameEmpty)],
  ["lastName", (values) => nameError(values.lastName, errors.lastNameEmpty)],
  ["email", (values) => emailError(values.email)],
  ["phone", ({ phone }) => (phone.trim() === "" || PHONE_PATTERN.test(phone.trim()) ? null : errors.phone)],
  ["message", ({ message }) => (message.trim() === "" ? errors.message : null)],
  ["privacy", ({ privacy }) => (privacy ? null : errors.privacy)],
];

function findErrors(values: Values) {
  const found: Partial<Record<CheckedField, string>> = {};
  for (const [field, check] of rules) {
    const error = check(values);
    if (error) found[field] = error;
  }
  return found;
}

function lineCount(value: string) {
  return value === "" ? 0 : value.split("\n").length;
}

const inputClass =
  "w-full rounded-none border-2 border-white/16 bg-white/4 px-3.5 py-2.5 font-mono text-base font-medium text-white transition-colors placeholder:text-faint hover:border-white/32 focus-visible:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan aria-invalid:border-destructive";

function Field({
  id,
  label,
  optional,
  error,
  children,
  footer,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-w-0 content-start gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> {text.optional}</span>}
      </label>
      {children}
      {(error || footer) && (
        <div className="flex gap-3 font-mono text-[0.8rem] leading-snug">
          {error && (
            <span id={`${id}-error`} className="text-destructive">
              {error}
            </span>
          )}
          {footer}
        </div>
      )}
    </div>
  );
}

function Counter({ id, value, max, unit }: { id: string; value: number; max: number; unit?: string }) {
  return (
    <span
      id={id}
      className={cn(
        "ml-auto shrink-0 font-medium text-muted-foreground tabular-nums",
        value >= max && "font-semibold text-destructive"
      )}
    >
      {value} / {max}
      {unit && ` ${unit}`}
    </span>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [status, setStatus] = useState<Status>("idle");
  // Gli errori compaiono dopo il primo tentativo di invio e si aggiornano mentre si corregge
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const fieldErrors = attempted ? findErrors(values) : {};
  const lines = lineCount(values.message);

  // Dopo l'invio il focus va sulla conferma, così il lettore di schermo la annuncia
  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
    if (status === "failed") alertRef.current?.scrollIntoView({ block: "nearest" });
  }, [status]);

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  // Al massimo maxLines righe: quelle in più si tagliano mentre si scrive o si incolla
  function updateMessage(value: string) {
    const rows = value.split("\n");
    update("message", rows.length > text.maxLines ? rows.slice(0, text.maxLines).join("\n") : value);
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    const found = findErrors(values);
    const firstInvalid = rules.map(([field]) => field).find((field) => found[field]);
    if (firstInvalid) {
      (formRef.current?.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    if (!WEB3FORMS_KEY) {
      console.error("NEXT_PUBLIC_WEB3FORMS_KEY non è impostata in .env.local: il form non può inviare.");
      setStatus("failed");
      return;
    }

    setStatus("sending");
    const name = `${normalizeName(values.firstName)} ${normalizeName(values.lastName)}`;
    const subject = values.subject.trim();
    // Campo nascosto che compilano solo i bot: Web3Forms scarta i messaggi in cui è spuntato
    const botcheck = (formRef.current?.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked ?? false;
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: text.subject(name, subject),
          from_name: name,
          name,
          email: values.email.trim(),
          "Società": values.company.trim() || "—",
          "Telefono": values.phone.trim() || "—",
          "Oggetto": subject || "—",
          "Messaggio": values.message.trim(),
          "Consenso privacy": "sì",
          "Inviato il": new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" }),
          botcheck,
        }),
      });
      const result: { success?: boolean } = await response.json();
      setStatus(response.ok && result.success ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  function writeAnother() {
    flushSync(() => {
      setValues(emptyValues);
      setAttempted(false);
      setStatus("idle");
    });
    firstNameRef.current?.focus();
  }

  if (status === "sent") {
    return (
      <div ref={sentRef} tabIndex={-1} className="grid justify-items-start gap-5 outline-none">
        <span
          aria-hidden="true"
          className="flex size-[5.5rem] items-center justify-center rounded-full border-[3px] border-violet bg-violet/12 text-violet"
        >
          <Check strokeWidth={1.75} className="size-8" />
        </span>
        <h3 className="font-heading text-[1.6rem] leading-tight font-bold">{text.sentTitle}</h3>
        <p className="max-w-lg leading-relaxed text-muted-foreground">
          {text.sentText(normalizeName(values.firstName))}{" "}
          <span className="font-semibold text-foreground">{values.email.trim()}</span>.
        </p>
        <button
          type="button"
          onClick={writeAnother}
          className="font-mono text-[1.05rem] font-semibold underline underline-offset-4 transition-colors hover:text-cyan"
        >
          {text.again}
        </button>
      </div>
    );
  }

  const sending = status === "sending";
  const describedBy = (field: string, ...extra: string[]) =>
    [fieldErrors[field as CheckedField] ? `${field}-error` : "", ...extra].filter(Boolean).join(" ") || undefined;
  const checkedProps = (field: Exclude<CheckedField, "privacy">) => ({
    id: field,
    name: field,
    value: values[field],
    "aria-invalid": fieldErrors[field] ? true : undefined,
    "aria-describedby": describedBy(field),
  });

  return (
    <div>
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="font-heading text-[1.6rem] leading-tight font-bold">{text.title}</h3>
          <p className="mt-2 max-w-[30rem] text-[0.95rem] leading-relaxed text-muted-foreground">{text.intro}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex size-[4.75rem] shrink-0 items-center justify-center rounded-full border-[3px] border-violet bg-violet/12 text-violet"
        >
          <Send strokeWidth={1.5} className="size-8" />
        </span>
      </div>

      <form ref={formRef} onSubmit={submit} noValidate className="mt-8 grid gap-5">
        {status === "failed" && (
          <div
            ref={alertRef}
            role="alert"
            className="flex items-start gap-3 border-2 border-destructive bg-destructive/10 px-4 py-3.5 text-[0.92rem] leading-normal"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-destructive" />
            <p>
              <strong className="block">{text.failedTitle}</strong>
              {text.failedText} <span className="wrap-anywhere">{site.email}</span>.
            </p>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="firstName" label={text.fields.firstName.label} error={fieldErrors.firstName}>
            <input
              ref={firstNameRef}
              type="text"
              required
              autoComplete="given-name"
              maxLength={50}
              placeholder={text.fields.firstName.placeholder}
              onChange={(event) => update("firstName", event.target.value)}
              className={inputClass}
              {...checkedProps("firstName")}
            />
          </Field>
          <Field id="lastName" label={text.fields.lastName.label} error={fieldErrors.lastName}>
            <input
              type="text"
              required
              autoComplete="family-name"
              maxLength={50}
              placeholder={text.fields.lastName.placeholder}
              onChange={(event) => update("lastName", event.target.value)}
              className={inputClass}
              {...checkedProps("lastName")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="company" label={text.fields.company.label} optional>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              maxLength={100}
              placeholder={text.fields.company.placeholder}
              value={values.company}
              onChange={(event) => update("company", event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field id="email" label={text.fields.email.label} error={fieldErrors.email}>
            <input
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              placeholder={text.fields.email.placeholder}
              onChange={(event) => update("email", event.target.value)}
              className={inputClass}
              {...checkedProps("email")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="phone" label={text.fields.phone.label} optional error={fieldErrors.phone}>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={16}
              placeholder={text.fields.phone.placeholder}
              onChange={(event) => update("phone", event.target.value)}
              className={inputClass}
              {...checkedProps("phone")}
            />
          </Field>
          <Field
            id="subject"
            label={text.fields.subject.label}
            optional
            footer={<Counter id="subject-count" value={values.subject.length} max={text.subjectMaxLength} />}
          >
            <input
              id="subject"
              name="subject"
              type="text"
              maxLength={text.subjectMaxLength}
              placeholder={text.fields.subject.placeholder}
              value={values.subject}
              onChange={(event) => update("subject", event.target.value)}
              aria-describedby="subject-count"
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          id="message"
          label={text.fields.message.label}
          error={fieldErrors.message}
          footer={<Counter id="message-count" value={lines} max={text.maxLines} unit={text.linesLabel} />}
        >
          <textarea
            rows={8}
            required
            maxLength={4000}
            placeholder={text.fields.message.placeholder}
            onChange={(event) => updateMessage(event.target.value)}
            className={cn(inputClass, "max-h-[32rem] min-h-48 resize-y")}
            {...checkedProps("message")}
            aria-describedby={describedBy("message", "message-count")}
          />
        </Field>

        {/* Consenso privacy: mai spuntato in partenza, con l'informativa sempre visibile sotto */}
        <div className="grid gap-2">
          <div className="flex items-start gap-3">
            <span className="relative mt-px flex size-[22px] shrink-0">
              <input
                id="privacy"
                name="privacy"
                type="checkbox"
                required
                checked={values.privacy}
                onChange={(event) => update("privacy", event.target.checked)}
                aria-invalid={fieldErrors.privacy ? true : undefined}
                aria-describedby={describedBy("privacy", "privacy-note")}
                className="peer absolute inset-0 cursor-pointer appearance-none border-2 border-white/16 bg-white/4 transition-colors hover:border-white/32 checked:border-violet checked:bg-violet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan aria-invalid:border-destructive"
              />
              {/* Segno di spunta sopra la casella quando è selezionata */}
              <Check
                aria-hidden="true"
                strokeWidth={3}
                className="pointer-events-none absolute inset-0 m-auto size-4 text-white opacity-0 peer-checked:opacity-100"
              />
            </span>
            <label htmlFor="privacy" className="cursor-pointer text-[0.88rem] leading-normal text-muted-foreground">
              {text.consent}
            </label>
          </div>
          {fieldErrors.privacy && (
            <span id="privacy-error" className="font-mono text-[0.8rem] leading-snug text-destructive">
              {fieldErrors.privacy}
            </span>
          )}
          <p id="privacy-note" className="max-w-[40rem] pl-[34px] text-[0.8rem] leading-normal text-muted-foreground">
            <strong className="font-semibold text-foreground">{text.privacyTitle}</strong> {text.privacyText}
          </p>
        </div>

        {/* Trappola per i bot: invisibile e fuori dal tab */}
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div className="mt-1">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2.5 bg-violet px-7 py-[15px] font-heading text-base leading-none font-bold text-white transition-[translate,box-shadow] duration-300 ease-float hover:shadow-[0_10px_24px_-8px_rgb(0_0_0/55%)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan disabled:cursor-progress disabled:opacity-80 disabled:shadow-none enabled:motion-safe:hover:-translate-y-0.5"
          >
            {sending ? text.sending : text.send}
            {sending ? (
              <LoaderCircle aria-hidden="true" className="size-[18px] motion-safe:animate-spin" />
            ) : (
              <ArrowRight aria-hidden="true" className="size-[18px]" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
