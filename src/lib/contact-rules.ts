// Pattern dei campi del form di contatto. Stanno qui, e non in contact-form.tsx, perché servono anche
// alla pagina del progetto (site.ts), che li mostra: un valore esportato da un file "use client"
// arriverebbe al codice server come riferimento client, non come regex.

// Nome e Cognome: lettere anche accentate, spazio, apostrofo e trattino, da 2 a 50 caratteri
export const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
// In più serve almeno una lettera, così «--» non passa
export const LETTER_PATTERN = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
// Email: una sola @ e un dominio con estensione di almeno due lettere (gli altri vincoli sono nel form)
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
// Telefono: + iniziale facoltativo, poi da 6 a 15 tra cifre, spazi e trattini
export const PHONE_PATTERN = /^\+?[0-9\s-]{6,15}$/;
