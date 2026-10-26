"use client";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ValidationErrors } from "@/app/data/travelPackages";
import type { Booking, BookingAction, BookingRequest, Insurance, LegalPage, Settings } from "@/lib/booking-types";
import { cartRequest, compactCart, EMPTY_CART } from "@/lib/cart";
import { RequestError, travelRequest } from "@/lib/client-api";
import { italianDate, money } from "@/lib/format";
import { useCart } from "./CartProvider";
import { useCartQuote } from "./useCartQuote";
import { useResource } from "./useResources";
import { ErrorSummary, FieldErrors, PassengerFields } from "./BookingFields";
import PriceSummary from "./PriceSummary";
import LegalAcceptance from "./LegalAcceptance";
import CartItemEditor from "./CartItemEditor";
import styles from "./booking.module.css";

export default function CartPage({ startCheckout = false }: { startCheckout?: boolean }) {
  const router = useRouter();
  const { cart, setCart, ready, storageError, agency } = useCart();
  const settings = useResource<Settings>("settings");
  const insurances = useResource<Insurance[]>("insurances");
  const legal = useResource<LegalPage[]>("legal-pages");
  const [step, setStep] = useState(startCheckout ? 1 : 0);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [contact, setContact] = useState({ first_name: "", last_name: "", email: "", phone: "" });
  const [notes, setNotes] = useState("");
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [created, setCreated] = useState<Booking | null>(null);
  const submitLock = useRef(false);
  const payload = cart.entries.length ? cartRequest(cart) : null;
  const preview = useCartQuote(ready ? payload : null);
  const quote = preview.quote;
  const allErrors = { ...preview.error?.errors, ...errors };
  const termsAccepted = !!legal.data && legal.data.filter((page) => page.requiresAcceptance).every((page) => accepted.includes(`${page.id}:${page.updatedAt}`));
  const editEntry = cart.entries.find((entry) => entry.key === editKey);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitLock.current || created) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const action = (submitter?.value || "quote") as BookingAction;
    setMessage(""); setErrors({});
    if (!quote || preview.loading || preview.error || !payload || !settings.data) { setMessage("Attendi il preventivo aggiornato e verifica la connessione."); return; }
    const validation: ValidationErrors = {};
    for (const [key, value] of Object.entries(contact)) if (!value.trim()) validation[`contact.${key}`] = ["Compila questo campo."];
    if (action !== "quote") {
      if (!quote.available) validation.items = ["La disponibilità non è sufficiente. Puoi richiedere un preventivo."];
      if (!termsAccepted) validation.terms_accepted = ["Leggi e accetta tutte le condizioni richieste."];
      cart.passengers.forEach((person, index) => {
        if (!person.first_name?.trim()) validation[`passengers.${index}.first_name`] = ["Inserisci il nome."];
        if (!person.last_name?.trim()) validation[`passengers.${index}.last_name`] = ["Inserisci il cognome."];
        if (!person.gender) validation[`passengers.${index}.gender`] = ["Seleziona il sesso."];
      });
    }
    if (Object.keys(validation).length) { setErrors(validation); setMessage("Controlla i dati prima di proseguire."); return; }
    submitLock.current = true; setPending(true);
    const request: BookingRequest = { ...payload, action, contact, terms_accepted: termsAccepted, notes, ...(agency ? { agency_reference: reference } : {}) };
    try {
      const result = await travelRequest<{ data: Booking }>("bookings", { method: "POST", body: JSON.stringify(request) });
      setCreated(result.data);
      if (!result.data.isAgencyBooking && result.data.accessToken) {
        try { const saved = JSON.parse(localStorage.getItem("queentour-pratiche") || "[]"); localStorage.setItem("queentour-pratiche", JSON.stringify([...(Array.isArray(saved) ? saved : []), { code: result.data.code, accessToken: result.data.accessToken }])); }
        catch { /* Il link personale rimane nella pagina e nell'URL della pratica. */ }
      }
      setCart(EMPTY_CART);
      router.push(`/pratica/${encodeURIComponent(result.data.code)}${!result.data.isAgencyBooking && result.data.accessToken ? `?token=${encodeURIComponent(result.data.accessToken)}` : ""}`);
    } catch (error) {
      const failure = error as RequestError;
      setErrors(failure.errors ?? {}); setMessage(failure.message || "Non è stato possibile creare la pratica. Riprova.");
      submitLock.current = false;
    } finally { setPending(false); }
  };
  if (!ready) return <main className={styles.page}><p className={styles.loading}>Recupero del carrello…</p></main>;
  if (created) return <main className={styles.page}><div className={styles.success}>Pratica {created.code} creata. <Link href={`/pratica/${created.code}${!created.isAgencyBooking && created.accessToken ? `?token=${encodeURIComponent(created.accessToken)}` : ""}`}>Apri la tua pratica →</Link></div></main>;
  if (!cart.entries.length) return <main className={styles.page}><section className={styles.empty}><h1>Il tuo viaggio inizia qui.</h1><p>Non hai ancora aggiunto prodotti al carrello.</p>{storageError && <p className={styles.error}>{storageError}</p>}<Link href="/pacchetti" className={styles.primary}>Esplora le proposte</Link></section></main>;
  return <main className={styles.page}>
    <section className={styles.hero}><span className={styles.eyebrow}>Il tuo Egitto, insieme</span><h1>{step === 0 ? "Il tuo carrello" : "Completa la tua richiesta"}</h1><p>Un solo viaggio, più esperienze. Il carrello non blocca disponibilità e non prevede pagamenti online.</p></section>
    {storageError && <p className={styles.error}>{storageError}</p>}
    <nav className={styles.steps} aria-label="Procedura"><button type="button" onClick={() => setStep(0)} aria-current={step === 0 ? "step" : undefined}>1 · Servizi e opzioni</button><button type="button" onClick={() => setStep(1)} aria-current={step === 1 ? "step" : undefined}>2 · Dati e conferma</button></nav>
    <div className={styles.layout}><div className={styles.stack}>
      {step === 0 ? <>
        {editEntry && <CartItemEditor key={editEntry.key} entry={editEntry} onClose={() => { setEditKey(null); setErrors({}); }} />}
        {cart.entries.map((entry, itemIndex) => { const itemQuote = quote?.items.find((item) => item.index === itemIndex); const problems = Object.entries(quote?.availabilityProblems ?? {}).filter(([path]) => path.startsWith(`items.${itemIndex}.`) || path === `items.${itemIndex}`); return <article className={styles.panel} key={entry.key}><div className={styles.row}><div><span className={styles.eyebrow}>{entry.product.type}</span><h2>{entry.product.title}</h2></div><div className={styles.actions}><button type="button" className={styles.secondary} onClick={() => setEditKey(entry.key)}>Modifica</button><button type="button" className={styles.danger} onClick={() => { setCart(compactCart({ ...cart, entries: cart.entries.filter((item) => item.key !== entry.key) })); setErrors({}); }}>Rimuovi</button></div></div>
          <p className={styles.muted}>{entry.item.mode === "flight_hotel" ? "Volo + hotel" : entry.item.mode === "hotel_only" ? "Solo soggiorno" : entry.product.type} · {italianDate(itemQuote?.startDate ?? entry.item.check_in ?? entry.item.date)}{itemQuote?.nights ? ` – ${italianDate(itemQuote.endDate)} · ${itemQuote.nights} notti` : ""}</p>
          {itemQuote?.flight && <p className={styles.notice}>Volo {itemQuote.flight.departureAirportName} · {itemQuote.flight.carrier} · A/R {italianDate(itemQuote.flight.outboundDate)} – {italianDate(itemQuote.flight.returnDate)}</p>}
          {itemQuote?.rooms?.map((room) => <div className={styles.room} key={room.index}><strong>Camera {room.index + 1} · {room.roomType}</strong><p className={styles.muted}>{room.passengers.map((index) => cart.passengers[index]?.first_name || `Persona ${index + 1}`).join(", ")}</p><ul className={styles.lines}>{room.lines.map((line, index) => <li key={index}><span>{line.label}{line.passenger != null ? ` · persona ${line.passenger + 1}` : ""}</span><strong>{money(line.amount, quote!.currency)}</strong></li>)}</ul><div className={styles.row}><span>Totale camera</span><strong>{money(room.total, quote!.currency)}</strong></div><FieldErrors errors={allErrors} path={`items.${itemIndex}.rooms.${room.index}`} /><FieldErrors errors={allErrors} path={`items.${itemIndex}.rooms.${room.index}.passengers`} /></div>)}
          <ul className={styles.lines}>{itemQuote?.lines?.map((line, index) => <li key={index}><span>{line.label}{line.passenger != null ? ` · persona ${line.passenger + 1}` : ""}</span><strong>{money(line.amount, quote!.currency)}</strong></li>)}</ul>
          {itemQuote && <div className={styles.total}><span>Totale prodotto</span><strong>{money(itemQuote.total, quote!.currency)}</strong></div>}
          {problems.map(([path, problem]) => <p className={styles.error} key={path}>{problem}</p>)}{Object.entries(allErrors).filter(([path]) => path === `items.${itemIndex}` || path.startsWith(`items.${itemIndex}.`)).map(([path, messages]) => <p className={styles.error} key={path}>{messages.join(" ")}</p>)}
        </article>; })}
        <section className={styles.panel}><h2>Personalizza la pratica</h2><h3>Assicurazioni facoltative</h3>{insurances.error ? <p className={styles.error}>{insurances.error} <button type="button" onClick={insurances.retry} className={styles.secondary}>Riprova</button></p> : !insurances.data ? <p className={styles.muted}>Caricamento assicurazioni…</p> : !insurances.data.length ? <p className={styles.muted}>Non ci sono assicurazioni disponibili.</p> : insurances.data.map((insurance) => <label className={styles.check} key={insurance.id}><input type="checkbox" checked={cart.insurance_ids.includes(insurance.id)} onChange={(event) => setCart({ ...cart, insurance_ids: event.target.checked ? [...cart.insurance_ids, insurance.id] : cart.insurance_ids.filter((id) => id !== insurance.id) })} /><span><strong>{insurance.name} · {money(insurance.pricePerPerson)} a persona pagante</strong><br />{insurance.description}<br /><small>Infant esclusi. Totale calcolato nel riepilogo.</small></span></label>)}
        {settings.data && <label className={styles.check}><input type="checkbox" checked={cart.price_lock} onChange={(event) => setCart({ ...cart, price_lock: event.target.checked })} /><span><strong>Blocca prezzo · {money(settings.data.price_lock_amount)} a pratica</strong><br />Garantisce il prezzo anche se il listino cambia. Senza questa opzione, alla conferma il totale verrà ricalcolato.</span></label>}<FieldErrors errors={allErrors} path="insurance_ids" /><FieldErrors errors={allErrors} path="price_lock" /></section>
        <div className={styles.row}><Link href="/pacchetti" className={styles.secondary}>+ Aggiungi un’altra esperienza</Link><button type="button" className={styles.primary} onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "auto" }); }}>Continua con i dati →</button></div>
      </> : <form id="booking-checkout" className={styles.stack} onSubmit={submit}>
        <section className={styles.panel}><h2>Il referente della pratica</h2><div className={styles.grid}>{(["first_name", "last_name", "email", "phone"] as const).map((key) => <label className={styles.field} key={key}><span>{{ first_name: "Nome", last_name: "Cognome", email: "Email", phone: "Telefono" }[key]} *</span><input type={key === "email" ? "email" : key === "phone" ? "tel" : "text"} required value={contact[key]} onChange={(event) => setContact({ ...contact, [key]: event.target.value })} /><FieldErrors errors={errors} path={`contact.${key}`} /></label>)}</div></section>
        <section className={styles.panel}><h2>I viaggiatori</h2><p className={styles.muted}>Per un preventivo bastano le date di nascita. Per opzione e conferma occorrono anche nome, cognome e sesso. Il primo viaggiatore è il capogruppo.</p>{cart.passengers.map((person, index) => <div className={styles.room} key={index}><h3>{index === 0 ? "Capogruppo" : `Viaggiatore ${index + 1}`}</h3><PassengerFields passenger={person} index={index} errors={errors} onChange={(next) => setCart({ ...cart, passengers: cart.passengers.map((value, i) => i === index ? next : value) })} /></div>)}</section>
        <section className={styles.panel}>{agency && <label className={styles.field}><span>Riferimento pratica agenzia · facoltativo</span><input value={reference} onChange={(event) => setReference(event.target.value)} /><FieldErrors path="agency_reference" errors={errors} /></label>}<label className={styles.field}><span>Note · facoltative</span><textarea value={notes} maxLength={2000} onChange={(event) => setNotes(event.target.value)} /><FieldErrors errors={errors} path="notes" /></label></section>
        <section className={styles.panel}>{legal.error ? <div className={styles.error}>{legal.error}<button type="button" onClick={legal.retry} className={styles.secondary}>Riprova</button></div> : legal.data ? <LegalAcceptance pages={legal.data} accepted={accepted} onChange={setAccepted} /> : <p className={styles.muted}>Caricamento condizioni…</p>}<FieldErrors errors={errors} path="terms_accepted" /></section>
        {message && <div className={styles.error} role="alert">{message}</div>}<ErrorSummary errors={allErrors} />
        <section className={styles.panel}><h2>Come vuoi proseguire?</h2><p className={styles.muted}>Il preventivo non blocca nulla. L’opzione riserva camere e posti per il tempo indicato. La conferma crea una prenotazione; il pagamento sarà gestito da Queen Tour.</p><div className={styles.stack}>
          <button type="submit" name="action" value="quote" disabled={pending || !quote || !settings.data || !!preview.error} className={styles.secondary}>{pending ? "Invio in corso…" : "Richiedi preventivo"}</button>
          <button type="submit" name="action" value="option" disabled={pending || !quote?.available || !settings.data || agency == null || !legal.data || !!preview.error} className={styles.secondary}>Blocca in opzione{settings.data && agency != null ? ` per ${agency ? settings.data.option_hours_agency : settings.data.option_hours_guest} ore` : ""}</button>
          <button type="submit" name="action" value="confirm" disabled={pending || !quote?.available || !settings.data || !legal.data || !!preview.error} className={styles.primary}>Conferma prenotazione</button>
        </div></section>
      </form>}
    </div><aside className={`${styles.panel} ${styles.sidebar}`}><h2>Il riepilogo</h2>{settings.error && <div className={styles.error}>{settings.error}<button type="button" onClick={settings.retry} className={styles.secondary}>Riprova</button></div>}{preview.loading && <p className={styles.loading} role="status">Aggiornamento prezzo e disponibilità…</p>}{preview.error && <div className={styles.error}>{preview.error.message}<button type="button" onClick={preview.retry} className={styles.secondary}>Ricalcola</button><ErrorSummary errors={preview.error.errors} /></div>}{quote && <><PriceSummary totals={quote.totals} currency={quote.currency} insurances={quote.insurances} />{!quote.available && <div className={styles.error}>Disponibilità insufficiente. Puoi richiedere soltanto un preventivo.{Object.entries(quote.availabilityProblems).map(([key, value]) => <p key={key}>{value}</p>)}</div>}</>}</aside></div>
  </main>;
}
