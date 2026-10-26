"use client";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import type { ValidationErrors } from "@/app/data/travelPackages";
import type { Booking, LegalPage, Passenger, Settings } from "@/lib/booking-types";
import { RequestError, travelRequest } from "@/lib/client-api";
import { italianDate, money } from "@/lib/format";
import { ErrorSummary, FieldErrors, PassengerFields } from "./BookingFields";
import PriceSummary from "./PriceSummary";
import LegalAcceptance from "./LegalAcceptance";
import { useResource } from "./useResources";
import styles from "./booking.module.css";

function passengerData(booking: Booking): Passenger[] { return booking.passengers.map((person) => ({ birth_date: person.birthDate, first_name: person.firstName ?? "", last_name: person.lastName ?? "", gender: person.gender ?? "", tax_code: person.taxCode ?? "", nationality: person.nationality ?? "", document_type: (person.documentType ?? "") as Passenger["document_type"], document_number: person.documentNumber ?? "", document_expiry: person.documentExpiry ?? "" })); }

export default function BookingView({ initialBooking, accessToken }: { initialBooking: Booking; accessToken?: string }) {
  const [booking, setBooking] = useState(initialBooking);
  const [people, setPeople] = useState(() => passengerData(initialBooking));
  const [accepted, setAccepted] = useState<string[]>([]);
  const [action, setAction] = useState<"option" | "confirm" | "cancel" | null>(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [pending, setPending] = useState(false);
  const [clock, setClock] = useState<number | null>(null);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const expiredRef = useRef("");
  const requestLock = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const legal = useResource<LegalPage[]>("legal-pages");
  const settings = useResource<Settings>("settings");
  const bookingToken = accessToken || booking.accessToken;
  const refresh = useCallback(async () => {
    try { const result = await travelRequest<{ data: Booking }>(`bookings/${encodeURIComponent(initialBooking.code)}`, {}, bookingToken); setBooking(result.data); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Non è stato possibile aggiornare lo stato della pratica."); }
  }, [initialBooking.code, bookingToken]);
  useEffect(() => {
    setOrigin(window.location.origin);
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);
  useEffect(() => {
    if (booking.status !== "option" || !booking.optionExpiresAt) return;
    const update = () => {
      const now = Date.now(); setClock(now);
      if (new Date(booking.optionExpiresAt!).getTime() <= now && expiredRef.current !== booking.optionExpiresAt) {
        expiredRef.current = booking.optionExpiresAt!; void refresh();
      }
    };
    update(); const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [booking.status, booking.optionExpiresAt, refresh]);
  useEffect(() => {
    if (!action) return;
    formRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
    formRef.current?.focus({ preventScroll: true });
  }, [action]);
  const remaining = clock != null && booking.optionExpiresAt ? Math.max(0, new Date(booking.optionExpiresAt).getTime() - clock) : null;
  const expired = booking.status === "option" && remaining === 0;
  const countdown = remaining == null ? "—" : `${String(Math.floor(remaining / 3600000)).padStart(2, "0")}:${String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0")}:${String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0")}`;
  const actionAvailable = !action || (action === "option" ? booking.actions.canOption : action === "confirm" ? booking.actions.canConfirm : booking.actions.canCancel);
  const termsAccepted = !!legal.data && legal.data.filter((page) => page.requiresAcceptance).every((page) => accepted.includes(`${page.id}:${page.updatedAt}`));
  const personalLink = `${origin}/pratica/${encodeURIComponent(booking.code)}${bookingToken ? `?token=${encodeURIComponent(bookingToken)}` : ""}`;
  const advance = async (event: FormEvent) => {
    event.preventDefault();
    if (!action || requestLock.current) return;
    if (!actionAvailable) { setMessage("Questa azione non è più disponibile per lo stato attuale della pratica."); return; }
    setErrors({}); setMessage("");
    if (action !== "cancel" && (!termsAccepted || expired)) { setMessage(expired ? "L’opzione è scaduta. Aggiorna lo stato della pratica." : "Accetta le condizioni per proseguire."); return; }
    requestLock.current = true; setPending(true);
    try {
      const result = await travelRequest<{ data: Booking }>(`bookings/${encodeURIComponent(booking.code)}/${action}`, { method: "POST", body: JSON.stringify(action === "cancel" ? {} : { terms_accepted: true, passengers: people }) }, bookingToken);
      setBooking(result.data); setPeople(passengerData(result.data)); setAction(null); setAccepted([]);
    } catch (error) { const failure = error as RequestError; setMessage(failure.message || "Operazione non riuscita."); setErrors(failure.errors ?? {}); }
    finally { requestLock.current = false; setPending(false); }
  };
  return <main className={styles.page}>
    <section className={styles.hero}><div className={styles.row}><div><span className={styles.eyebrow}>La tua pratica</span><h1>{booking.code}</h1><p>Creata il {italianDate(booking.createdAt, true)}</p></div><span className={styles.pill} data-status={booking.status}>{booking.statusLabel}</span></div></section>
    {message && <div className={styles.error} role="alert">{message}<button type="button" className={styles.secondary} onClick={refresh}>Aggiorna stato</button></div>}
    {!booking.isAgencyBooking && <section className={styles.panel}><h2>Conserva il tuo link personale</h2><p className={styles.muted}>Ti permette di ritrovare la pratica senza account. Condividilo soltanto con chi viaggia con te.</p><input className={styles.personalLink} value={personalLink} readOnly aria-label="Link personale della pratica" onFocus={(event) => event.target.select()} /><button type="button" className={styles.secondary} onClick={async () => { try { await navigator.clipboard.writeText(personalLink); setCopied(true); } catch { setMessage("Seleziona e copia il link dal campo qui sopra."); } }}>{copied ? "Link copiato" : "Copia link"}</button></section>}
    <div className={styles.layout} style={{ marginTop: 24 }}><div className={styles.stack}>
      {booking.status === "quote" && <div className={styles.notice}>Preventivo valido fino al {italianDate(booking.quoteValidUntil)}. Non blocca camere o voli.{booking.documents.quotePdfUrl && <p><a href={booking.documents.quotePdfUrl} className={styles.primary} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Scarica il preventivo PDF</a></p>}</div>}
      {booking.status === "option" && <section className={styles.panel}><h2>{expired ? "Opzione in scadenza" : "Disponibilità riservata fino al"}</h2><p>{italianDate(booking.optionExpiresAt, true)}</p><div className={styles.countdown} aria-label="Tempo rimanente">{countdown}</div>{expired && <p className={styles.error}>Tempo scaduto. Aggiorniamo lo stato della pratica.</p>}</section>}
      {!booking.isAgencyBooking && booking.status === "confirmed" && <div className={styles.success}>Prenotazione confermata, sarai contattato da Queen Tour per il pagamento.</div>}
      {booking.isAgencyBooking && ["proforma_sent", "proforma_viewed"].includes(booking.status) && <section className={styles.panel}><h2>La proforma della tua agenzia</h2><p className={styles.notice}>{booking.status === "proforma_sent" ? "Aprendo la proforma confermi definitivamente la prenotazione." : "La proforma è stata aperta: la prenotazione è definitiva."}</p>{booking.documents.proformaUrl ? <a href={booking.documents.proformaUrl} className={styles.primary} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Apri proforma</a> : <p className={styles.muted}>Il documento non è disponibile. Contatta Queen Tour.</p>}</section>}
      {booking.items.map((item) => <article className={styles.panel} key={item.id}><span className={styles.eyebrow}>{item.modeLabel}</span><h2>{item.title}</h2><p>{italianDate(item.startDate)} – {italianDate(item.endDate)}{item.nights ? ` · ${item.nights} notti` : ""}</p>{item.hotel && <p className={styles.muted}>{item.hotel.name}</p>}{item.flight && <p className={styles.notice}>Volo A/R da {item.flight.departureAirportName} · {item.flight.carrier}<br />{item.flight.outboundDetails} · {item.flight.returnDetails}</p>}{item.rooms.map((room, index) => <div className={styles.room} key={index}><div className={styles.row}><strong>Camera {index + 1} · {room.roomType}</strong><strong>{money(room.total, booking.currency)}</strong></div><p className={styles.muted}>{room.passengers.map((position) => { const person = booking.passengers.find((value) => value.position === position); return person?.firstName ? `${person.firstName} ${person.lastName ?? ""}` : `Viaggiatore ${position + 1}`; }).join(", ")}</p><ul className={styles.lines}>{item.breakdown?.rooms?.[index]?.lines?.map((line, i) => <li key={i}><span>{line.label}</span><strong>{money(line.amount, booking.currency)}</strong></li>)}</ul></div>)}<ul className={styles.lines}>{item.breakdown?.lines?.map((line, index) => <li key={index}><span>{line.label}</span><strong>{money(line.amount, booking.currency)}</strong></li>)}</ul><div className={styles.total}><span>Totale prodotto</span><strong>{money(item.total, booking.currency)}</strong></div></article>)}
      <section className={styles.panel}><h2>Referente e viaggiatori</h2><p><strong>{booking.contact.firstName} {booking.contact.lastName}</strong><br />{booking.contact.email} · {booking.contact.phone}</p>{booking.passengers.map((person) => <div className={styles.room} key={person.position}><strong>{person.isLead ? "Capogruppo" : `Viaggiatore ${person.position + 1}`} · {person.firstName || "Dati da completare"} {person.lastName}</strong><p className={styles.muted}>{italianDate(person.birthDate)}{person.gender ? ` · ${person.gender}` : ""}</p>{(person.documentNumber || person.taxCode || person.nationality) && <p className={styles.muted}>{person.nationality} {person.taxCode} {person.documentType} {person.documentNumber} {person.documentExpiry ? `· scadenza ${italianDate(person.documentExpiry)}` : ""}</p>}</div>)}{booking.agencyReference && <p>Riferimento agenzia: {booking.agencyReference}</p>}{booking.notes && <p className={styles.notice}>{booking.notes}</p>}</section>
      {(booking.actions.canOption || booking.actions.canConfirm || booking.actions.canCancel) && <section className={styles.panel}><h2>Gestisci la pratica</h2><div className={styles.actions}>{booking.actions.canOption && <button type="button" disabled={!settings.data} onClick={() => { setAction("option"); setMessage(""); }} className={styles.secondary}>Blocca in opzione{settings.data ? ` per ${booking.isAgencyBooking ? settings.data.option_hours_agency : settings.data.option_hours_guest} ore` : ""}</button>}{booking.actions.canConfirm && <button type="button" disabled={expired} onClick={() => { setAction("confirm"); setMessage(""); }} className={styles.primary}>Conferma prenotazione</button>}{booking.actions.canCancel && <button type="button" onClick={() => setAction("cancel")} className={styles.danger}>Annulla pratica</button>}</div>{settings.error && <p className={styles.error}>{settings.error}<button type="button" className={styles.secondary} onClick={settings.retry}>Riprova</button></p>}</section>}
      {action && <form ref={formRef} tabIndex={-1} onSubmit={advance} className={styles.panel} style={{ scrollMarginTop: 120 }}><h2>{action === "cancel" ? "Vuoi annullare questa pratica?" : action === "option" ? "Completa i dati per l’opzione" : "Completa i dati per la conferma"}</h2>{action === "cancel" ? <p>L’annullamento libera le disponibilità riservate. Questa operazione non può essere annullata.</p> : <><p className={styles.notice}>{booking.priceLock.selected ? "Il blocca prezzo conserva il totale iniziale." : "Senza blocca prezzo, alla conferma il totale viene ricalcolato con il listino del momento."}</p>{people.map((person, index) => <div className={styles.room} key={index}><h3>Viaggiatore {index + 1}</h3><PassengerFields passenger={person} index={index} required birthReadOnly errors={errors} onChange={(next) => setPeople((current) => current.map((value, i) => i === index ? next : value))} /></div>)}{legal.data ? <LegalAcceptance pages={legal.data} accepted={accepted} onChange={setAccepted} /> : legal.error ? <p className={styles.error}>{legal.error}<button className={styles.secondary} onClick={legal.retry} type="button">Riprova</button></p> : <p>Caricamento condizioni…</p>}<FieldErrors errors={errors} path="terms_accepted" /></>}<ErrorSummary errors={errors} /><div className={styles.actions}><button type="button" disabled={pending} onClick={() => setAction(null)} className={styles.secondary}>Indietro</button><button type="submit" disabled={pending || !actionAvailable || (action !== "cancel" && (!termsAccepted || expired))} className={action === "cancel" ? styles.danger : styles.primary}>{pending ? "Operazione in corso…" : action === "cancel" ? "Sì, annulla la pratica" : action === "option" ? "Blocca in opzione" : "Conferma prenotazione"}</button></div></form>}
    </div><aside className={`${styles.panel} ${styles.sidebar}`}><h2>Riepilogo economico</h2><PriceSummary totals={booking.totals} currency={booking.currency} insurances={booking.insurances} />{booking.priceLock.selected && <p className={styles.muted}>Blocca prezzo attivo.</p>}<div className={styles.actions}><button type="button" className={styles.secondary} onClick={refresh}>Aggiorna stato</button><Link href={booking.isAgencyBooking ? "/area-agenzie/pratiche" : "/pacchetti"} className={styles.link}>{booking.isAgencyBooking ? "Le mie pratiche" : "Torna alle proposte"}</Link></div></aside></div>
  </main>;
}
