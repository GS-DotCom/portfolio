"use client";

import { ArrowRight, Check, CircleAlert, LoaderCircle, Send } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type SubmitEvent } from "react";
import { flushSync } from "react-dom";

import { contact, site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Form dei contatti: i messaggi arrivano a site.email tramite Web3Forms.
// La chiave (pubblica: permette solo di inviare alla casella collegata) sta in .env.local.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const text = contact.form;

type Values = { firstName: string; lastName: string; company: string; email: string; message: string };
type Status = "idle" | "sending" | "sent" | "failed";
type RequiredField = "firstName" | "lastName" | "email" | "message";

const emptyValues: Values = { firstName: "", lastName: "", company: "", email: "", message: "" };

// Regole dei campi obbligatori, nell'ordine in cui compaiono: il primo sbagliato riceve il focus
const rules: [RequiredField, (value: string) => boolean][] = [
  ["firstName", (value) => value.trim() !== ""],
  ["lastName", (value) => value.trim() !== ""],
  ["email", (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())],
  ["message", (value) => value.trim() !== ""],
];

function invalidFields(values: Values): RequiredField[] {
  return rules.filter(([field, isValid]) => !isValid(values[field])).map(([field]) => field);
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

export function ContactForm() {
  const [values, setValues] = useState<Values>(emptyValues);
  const [status, setStatus] = useState<Status>("idle");
  // Gli errori compaiono dopo il primo tentativo di invio e si aggiornano mentre si corregge
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  const invalid = attempted ? invalidFields(values) : [];
  const lines = lineCount(values.message);

  // Dopo l'invio il focus va sulla conferma, così il lettore di schermo la annuncia
  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
    if (status === "failed") alertRef.current?.scrollIntoView({ block: "nearest" });
  }, [status]);

  function update(field: keyof Values, value: string) {
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
    const [firstInvalid] = invalidFields(values);
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
    const name = `${values.firstName.trim()} ${values.lastName.trim()}`;
    // Campo nascosto che compilano solo i bot: Web3Forms scarta i messaggi in cui è spuntato
    const botcheck = (formRef.current?.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked ?? false;
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: text.subject(name),
          from_name: name,
          name,
          email: values.email.trim(),
          "Società": values.company.trim() || "—",
          "Messaggio": values.message.trim(),
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
          {text.sentText(values.firstName.trim())}{" "}
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
  const describedBy = (field: RequiredField, extra?: string) =>
    [invalid.includes(field) ? `${field}-error` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;
  const fieldProps = (field: RequiredField) => ({
    id: field,
    name: field,
    required: true,
    value: values[field],
    "aria-invalid": invalid.includes(field) || undefined,
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
          <Field id="firstName" label={text.fields.firstName.label} error={invalid.includes("firstName") ? text.fields.firstName.error : undefined}>
            <input
              ref={firstNameRef}
              type="text"
              autoComplete="given-name"
              maxLength={60}
              placeholder={text.fields.firstName.placeholder}
              onChange={(event) => update("firstName", event.target.value)}
              className={inputClass}
              {...fieldProps("firstName")}
            />
          </Field>
          <Field id="lastName" label={text.fields.lastName.label} error={invalid.includes("lastName") ? text.fields.lastName.error : undefined}>
            <input
              type="text"
              autoComplete="family-name"
              maxLength={60}
              placeholder={text.fields.lastName.placeholder}
              onChange={(event) => update("lastName", event.target.value)}
              className={inputClass}
              {...fieldProps("lastName")}
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
          <Field id="email" label={text.fields.email.label} error={invalid.includes("email") ? text.fields.email.error : undefined}>
            <input
              type="email"
              autoComplete="email"
              maxLength={120}
              placeholder={text.fields.email.placeholder}
              onChange={(event) => update("email", event.target.value)}
              className={inputClass}
              {...fieldProps("email")}
            />
          </Field>
        </div>

        <Field
          id="message"
          label={text.fields.message.label}
          error={invalid.includes("message") ? text.fields.message.error : undefined}
          footer={
            <span
              id="message-count"
              aria-live="polite"
              className={cn(
                "ml-auto shrink-0 font-medium text-muted-foreground tabular-nums",
                lines >= text.maxLines && "font-semibold text-destructive"
              )}
            >
              {lines} / {text.maxLines} {text.linesLabel}
            </span>
          }
        >
          <textarea
            rows={8}
            maxLength={4000}
            placeholder={text.fields.message.placeholder}
            onChange={(event) => updateMessage(event.target.value)}
            className={cn(inputClass, "max-h-[32rem] min-h-48 resize-y")}
            {...fieldProps("message")}
            aria-describedby={describedBy("message", "message-count")}
          />
        </Field>

        {/* Trappola per i bot: invisibile e fuori dal tab */}
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3.5">
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
          <p className="max-w-[26rem] text-[0.8rem] leading-snug text-muted-foreground">{text.privacy}</p>
        </div>
      </form>
    </div>
  );
}
