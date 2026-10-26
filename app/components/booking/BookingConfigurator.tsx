"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import type { BookingMode, TravelPackage, ValidationErrors } from "@/app/data/travelPackages";
import type { CartItem, CartRequest, Passenger, Settings, StoredItem } from "@/lib/booking-types";
import { addDays, ageAt, italianDate, money, todayRome } from "@/lib/format";
import { saveConfiguredItem } from "@/lib/cart";
import { useCart } from "./CartProvider";
import { useCartQuote } from "./useCartQuote";
import { useResource } from "./useResources";
import { ErrorSummary, FieldErrors } from "./BookingFields";
import styles from "./booking.module.css";
import CustomSelect from "../CustomSelect";

type PersonDraft = { uid: string; data: Passenger; existing: number | null };
type RoomDraft = { uid: string; type: number; people: PersonDraft[] };
const newPerson = (): PersonDraft => ({ uid: crypto.randomUUID(), data: { birth_date: "" }, existing: null });
const modeNames: Record<BookingMode, string> = { hotel_only: "Solo soggiorno", flight_hotel: "Volo + hotel", excursion: "Escursione", transfer: "Transfer" };

export default function BookingConfigurator({ product, editing, onSaved }: { product: TravelPackage; editing?: StoredItem; onSaved?: () => void }) {
  const { cart, setCart, ready } = useCart();
  const settings = useResource<Settings>("settings");
  const modes = product.bookingModes ?? [];
  const [mode, setMode] = useState<BookingMode>(editing?.item.mode ?? modes[0]);
  const [checkIn, setCheckIn] = useState(editing?.item.check_in ?? "");
  const [checkOut, setCheckOut] = useState(editing?.item.check_out ?? "");
  const [date, setDate] = useState(editing?.item.date ?? "");
  const [flightId, setFlightId] = useState(editing?.item.flight_id ? String(editing.item.flight_id) : "");
  const initialFlight = product.flights?.find((flight) => flight.id === editing?.item.flight_id);
  const [airport, setAirport] = useState(initialFlight?.departureAirport ?? "");
  const [rooms, setRooms] = useState<RoomDraft[]>(() => editing?.item.rooms?.map((room, index) => ({ uid: `room-${index}`, type: room.room_type_id, people: room.passengers.map((position) => ({ uid: `person-${position}`, data: cart.passengers[position], existing: position })) })) ?? []);
  const [people, setPeople] = useState<PersonDraft[]>(() => editing?.item.passengers?.map((position) => ({ uid: `person-${position}`, data: cart.passengers[position], existing: position })) ?? []);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const isStay = product.type === "Soggiorno";
  const types = product.hotel?.roomTypes ?? [];
  const flights = product.flights ?? [];
  const flight = flights.find((item) => String(item.id) === flightId);
  const serviceDate = isStay ? mode === "flight_hotel" ? flight?.outboundDate ?? "" : checkIn : date;
  const minDate = [addDays(todayRome(), 1), product.validFrom ?? ""].sort().at(-1)!;
  const maxDate = product.validTo?.slice(0, 10);
  const minNights = product.minNights ?? 1;
  const allPeople = isStay ? rooms.flatMap((room) => room.people) : people;
  const localPeople = allPeople.map((person) => person.data);
  let offset = 0;
  const draftItem: CartItem = {
    package_id: product.id, mode,
    ...(isStay ? {
      ...(mode === "hotel_only" ? { check_in: checkIn, check_out: checkOut } : { flight_id: Number(flightId) }),
      rooms: rooms.map((room) => { const indexes = room.people.map(() => offset++); return { room_type_id: room.type, passengers: indexes }; }),
    } : { date, passengers: people.map((_, index) => index) }),
  };
  const localErrors: ValidationErrors = {};
  if (isStay && mode === "hotel_only") {
    if (!checkIn || checkIn < minDate || (maxDate && checkIn > maxDate)) localErrors["items.0.check_in"] = ["Scegli un check-in da domani, entro la validità della proposta."];
    if (!checkOut || !checkIn || checkOut < addDays(checkIn, minNights) || (maxDate && checkOut > maxDate)) localErrors["items.0.check_out"] = [`Sono richieste almeno ${minNights} notti, entro la validità della proposta.`];
  } else if (isStay && (!flight || flight.seatsAvailable <= 0 || flight.outboundDate < minDate)) localErrors["items.0.flight_id"] = ["Seleziona un volo disponibile."];
  else if (!isStay && (!date || date < minDate || (maxDate && date > maxDate))) localErrors["items.0.date"] = ["Scegli una data valida da domani in poi."];
  if (isStay && (!rooms.length || rooms.length > 4)) localErrors["items.0.rooms"] = ["Aggiungi da 1 a 4 camere."];
  if (!allPeople.length) localErrors.passengers = ["Aggiungi i viaggiatori."];
  const seen = new Set<number>();
  allPeople.forEach((person, index) => {
    if (!person.data.birth_date || person.data.birth_date > todayRome() || ageAt(person.data.birth_date, serviceDate) < 0) localErrors[`passengers.${index}.birth_date`] = ["Inserisci una data di nascita valida."];
    if (person.existing != null) { if (seen.has(person.existing)) localErrors[`passengers.${index}.birth_date`] = ["Questa persona è già assegnata al prodotto."]; seen.add(person.existing); }
  });
  rooms.forEach((room, index) => {
    const type = types.find((item) => item.id === room.type);
    if (!type) localErrors[`items.0.rooms.${index}.room_type_id`] = ["Seleziona una tipologia di camera."];
    if (!room.people.length || room.people.length > Math.min(4, type?.maxOccupancy ?? 4)) localErrors[`items.0.rooms.${index}.passengers`] = ["Controlla il numero di occupanti della camera."];
    if (settings.data && !room.people.some((person) => ageAt(person.data.birth_date, serviceDate) > settings.data!.child_max_age)) localErrors[`items.0.rooms.${index}.passengers`] = ["Ogni camera richiede almeno un adulto alla data di partenza."];
  });
  const valid = modes.includes(mode) && !Object.keys(localErrors).length && !!settings.data;
  const payload: CartRequest | null = valid ? { passengers: localPeople, items: [draftItem] } : null;
  const preview = useCartQuote(payload);
  const hasInput = !!(checkIn || checkOut || date || flightId || allPeople.some((person) => person.data.birth_date));
  const errors = { ...(hasInput ? localErrors : {}), ...preview.error?.errors };
  const updatePerson = (roomIndex: number | null, personIndex: number, person: PersonDraft) => {
    setSaved(false); setMessage("");
    if (roomIndex === null) setPeople((current) => current.map((value, index) => index === personIndex ? person : value));
    else setRooms((current) => current.map((room, index) => index === roomIndex ? { ...room, people: room.people.map((value, i) => i === personIndex ? person : value) } : room));
  };
  const personFields = (person: PersonDraft, index: number, roomIndex: number | null, globalIndex: number) => <div className={styles.passenger} key={person.uid}>
    <div className={styles.row}><strong>Persona {index + 1}</strong><button className={styles.danger} type="button" onClick={() => { setSaved(false); if (roomIndex === null) setPeople((current) => current.filter((_, i) => i !== index)); else setRooms((current) => current.map((room, i) => i === roomIndex ? { ...room, people: room.people.filter((_, p) => p !== index) } : room)); }}>Rimuovi</button></div>
    {cart.passengers.length > 0 && <label className={styles.field}><span>È un viaggiatore già nel carrello?</span><CustomSelect label="Viaggiatore" value={String(person.existing ?? "new")} onChange={(value) => { const existing = value === "new" ? null : Number(value); updatePerson(roomIndex, index, { ...person, existing, data: existing == null ? { birth_date: "" } : cart.passengers[existing] }); }} options={[{ value: "new", label: "Nuovo viaggiatore" }, ...cart.passengers.map((value, i) => ({ value: String(i), label: `${value.first_name || `Viaggiatore ${i + 1}`} · ${italianDate(value.birth_date)}` }))]} /></label>}
    <label className={styles.field}><span>Data di nascita *</span><input type="date" max={todayRome()} required readOnly={person.existing != null} value={person.data.birth_date} onChange={(event) => updatePerson(roomIndex, index, { ...person, data: { ...person.data, birth_date: event.target.value } })} /><FieldErrors errors={errors} path={`passengers.${globalIndex}.birth_date`} /></label>
  </div>;
  const save = (event: FormEvent) => {
    event.preventDefault(); setMessage("");
    if (!payload || !preview.quote || preview.error || preview.loading) { setMessage(Object.values(localErrors).flat()[0] ?? "Attendi il calcolo aggiornato prima di aggiungere il prodotto."); return; }
    try { setCart(saveConfiguredItem(cart, product, payload, allPeople.map((person) => person.existing), editing?.key ?? crypto.randomUUID())); setSaved(true); onSaved?.(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Impossibile salvare il prodotto."); }
  };
  if (!ready) return <div className={styles.loading}>Caricamento configuratore…</div>;
  if (!modes.length) return <div className={styles.notice}>Questa proposta non ha modalità prenotabili. Contattaci per informazioni.</div>;
  return <form className={styles.stack} onSubmit={save}>
    <div><span className={styles.eyebrow}>Il tuo viaggio</span><h2>Configura la proposta</h2><p className={styles.muted}>Il carrello non blocca camere o voli. La disponibilità è verificata dal preventivo.</p></div>
    {settings.error && <div className={styles.error}>{settings.error}<button type="button" className={styles.secondary} onClick={settings.retry}>Riprova</button></div>}
    {isStay && <label className={styles.field}><span>Come vuoi partire?</span><CustomSelect label="Modalità" value={mode} onChange={(value) => { setMode(value as BookingMode); setSaved(false); }} options={modes.map((value) => ({ value, label: modeNames[value] }))} /></label>}
    {isStay && mode === "hotel_only" && <div className={styles.grid}><label className={styles.field}><span>Check-in *</span><input type="date" required min={minDate} max={maxDate} value={checkIn} onChange={(event) => { setCheckIn(event.target.value); setSaved(false); }} /><FieldErrors errors={errors} path="items.0.check_in" /></label><label className={styles.field}><span>Check-out · min. {minNights} notti *</span><input type="date" required min={checkIn ? addDays(checkIn, minNights) : minDate} max={maxDate} value={checkOut} onChange={(event) => { setCheckOut(event.target.value); setSaved(false); }} /><FieldErrors errors={errors} path="items.0.check_out" /></label></div>}
    {isStay && mode === "flight_hotel" && <><label className={styles.field}><span>Aeroporto di partenza</span><CustomSelect label="Aeroporto" value={airport} onChange={(value) => { setAirport(value); setFlightId(""); setSaved(false); }} options={[{ value: "", label: "Seleziona aeroporto" }, ...[...new Set(flights.map((value) => value.departureAirport))].map((code) => ({ value: code, label: flights.find((value) => value.departureAirport === code)?.departureAirportName || code }))]} /></label><label className={styles.field}><span>Volo andata e ritorno</span><CustomSelect label="Volo andata e ritorno" value={flightId} onChange={(value) => { setFlightId(value); setSaved(false); }} options={[{ value: "", label: "Scegli il volo" }, ...flights.filter((value) => value.departureAirport === airport && value.seatsAvailable > 0 && value.outboundDate >= minDate).map((value) => ({ value: String(value.id), label: `${italianDate(value.outboundDate)} – ${italianDate(value.returnDate)} · ${value.nights} notti · adulto ${money(value.adultPrice)} · ${value.seatsAvailable} posti` }))]} /><FieldErrors errors={errors} path="items.0.flight_id" /></label>{flight && <div className={styles.notice}>{flight.carrier} · {flight.outboundDetails} {flight.returnDetails}<br />Bambino: {flight.childPrice == null ? "quota da verificare nel preventivo" : money(flight.childPrice)} · Infant: {flight.infantPrice == null ? "quota da verificare nel preventivo" : money(flight.infantPrice)}</div>}{!flights.length && <p className={styles.notice}>Non ci sono voli disponibili per questa proposta.</p>}</>}
    {!isStay && <label className={styles.field}><span>Data del servizio *</span><input type="date" required min={minDate} max={maxDate} value={date} onChange={(event) => { setDate(event.target.value); setSaved(false); }} /><FieldErrors errors={errors} path="items.0.date" /></label>}
    {isStay ? <><FieldErrors errors={errors} path="items.0.rooms" />{!types.length && <p className={styles.error}>Non sono state configurate tipologie camera per questo soggiorno.</p>}{rooms.map((room, roomIndex) => <div className={styles.room} key={room.uid}><div className={styles.row}><h3>Camera {roomIndex + 1}</h3><button type="button" className={styles.danger} onClick={() => { setRooms((current) => current.filter((_, index) => index !== roomIndex)); setSaved(false); }}>Rimuovi camera</button></div><label className={styles.field}><span>Tipologia</span><CustomSelect label="Tipologia camera" value={String(room.type)} onChange={(value) => { setRooms((current) => current.map((item, index) => index === roomIndex ? { ...item, type: Number(value) } : item)); setSaved(false); }} options={types.map((type) => ({ value: String(type.id), label: `${type.name} · max ${type.maxOccupancy} persone · supplemento ${money(type.supplementPerNight)} / persona / notte` }))} /><FieldErrors errors={errors} path={`items.0.rooms.${roomIndex}.room_type_id`} /><FieldErrors errors={errors} path={`items.0.rooms.${roomIndex}.passengers`} /><FieldErrors errors={errors} path={`items.0.rooms.${roomIndex}`} /></label>{room.people.map((person, index) => personFields(person, index, roomIndex, rooms.slice(0, roomIndex).reduce((sum, value) => sum + value.people.length, 0) + index))}<button type="button" className={styles.secondary} disabled={room.people.length >= Math.min(4, types.find((type) => type.id === room.type)?.maxOccupancy ?? 4)} onClick={() => { setRooms((current) => current.map((value, index) => index === roomIndex ? { ...value, people: [...value.people, newPerson()] } : value)); setSaved(false); }}>+ Persona</button></div>)}<button type="button" className={styles.secondary} disabled={rooms.length >= 4 || !types.length} onClick={() => { setRooms((current) => [...current, { uid: crypto.randomUUID(), type: types[0].id, people: [newPerson()] }]); setSaved(false); }}>+ Aggiungi camera ({rooms.length}/4)</button></> : <>{product.priceUnit === "per_service" && <p className={styles.notice}>Il prezzo del transfer è unico per il gruppo.</p>}{people.map((person, index) => personFields(person, index, null, index))}<button type="button" className={styles.secondary} disabled={people.length >= 16} onClick={() => { setPeople((current) => [...current, newPerson()]); setSaved(false); }}>+ Aggiungi persona</button></>}
    <p className={styles.muted}>{settings.data && `Età alla data del servizio: infant fino a ${settings.data.infant_max_age} anni, bambini fino a ${settings.data.child_max_age} anni. Ogni camera richiede almeno un adulto.`}</p>
    {message && <div className={styles.error} role="alert">{message}</div>}{preview.error && <><div className={styles.error}>{preview.error.message}<button type="button" className={styles.secondary} onClick={preview.retry}>Ricalcola</button></div><ErrorSummary errors={errors} /></>}
    {preview.loading && <div className={styles.loading} role="status">Verifica prezzo e disponibilità…</div>}
    {preview.quote && <div className={styles.notice}><div className={styles.total}><span>Totale indicativo</span><strong>{money(preview.quote.totals.total, preview.quote.currency)}</strong></div>{!preview.quote.available && <p className={styles.error}>Disponibilità insufficiente: puoi aggiungere il prodotto per richiedere soltanto un preventivo.</p>}{Object.values(preview.quote.availabilityProblems).map((problem) => <p key={problem}>{problem}</p>)}</div>}
    {saved ? <div className={styles.success}>Prodotto {editing ? "aggiornato" : "aggiunto"}. <Link href="/carrello" className={styles.link}>Vai al carrello →</Link></div> : <button className={`${styles.primary} ${styles.wide}`} type="submit" disabled={!payload || !preview.quote || preview.loading || !!preview.error}>{editing ? "Salva le modifiche" : "Aggiungi al carrello"}</button>}
  </form>;
}
