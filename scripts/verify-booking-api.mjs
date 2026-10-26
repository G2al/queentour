import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const base = process.env.TEST_FRONTEND_URL || "http://localhost:3001";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Questa verifica crea pratiche di prova: è consentita soltanto in locale.");
const run = `FRONTEND-INTEGRATION-${Date.now()}`;
const created = [];
let cookie = "";
async function request(path, { body, agency = false, access, status = 200, method, retry = 0 } = {}) {
  const response = await fetch(`${base}${path}`, { method: method || (body ? "POST" : "GET"), headers: { Accept: "application/json", ...(body ? { "Content-Type": "application/json", Origin: base } : {}), ...(agency && cookie ? { Cookie: cookie } : {}), ...(access ? { "X-Booking-Token": access } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const payload = response.status === 204 ? null : await response.json();
  if (response.status === 429 && retry < 2) {
    let seconds = Math.min(70, Number(response.headers.get("retry-after")) || 60);
    while (seconds > 0) { console.log(`WAIT limite API: ${seconds}s`); const part = Math.min(10, seconds); await new Promise((resolve) => setTimeout(resolve, part * 1000)); seconds -= part; }
    return request(path, { body, agency, access, status, method, retry: retry + 1 });
  }
  if (path === "/api/travel/bookings" && response.ok && payload?.data?.notes === run && !created.includes(payload.data.code)) created.push(payload.data.code);
  assert.equal(response.status, status, `${path}: ${JSON.stringify(payload)}`);
  return { payload, response };
}
function pass(label) { console.log(`PASS ${label}`); }
try {
  const settings = (await request("/api/travel/settings")).payload.data;
  const product = (await request("/api/travel/packages/hurghada-all-inclusive")).payload.data;
  assert.ok(product.bookingModes.includes("hotel_only")); assert.ok(!("priceGross" in product)); assert.ok(!("priceType" in product)); assert.ok(!product.agencyFee); pass("contratto catalogo ospite");
  const roomId = product.hotel.roomTypes[0].id;
  const flight = product.flights.find((value) => value.seatsAvailable >= 2 && value.departureAirport === "NAP");
  assert.ok(flight, "Serve un volo demo disponibile per verificare il percorso volo + hotel.");
  const people = [{ birth_date: "1985-03-10" }, { birth_date: "1987-07-22" }, { birth_date: "2015-05-01" }, { birth_date: "2026-01-15" }];
  const insurances = (await request("/api/travel/insurances")).payload.data;
  const cart = { passengers: people, items: [{ package_id: product.id, mode: "hotel_only", check_in: flight.outboundDate, check_out: flight.returnDate, rooms: [{ room_type_id: roomId, passengers: [0, 1, 2, 3] }] }, { package_id: 2, mode: "excursion", date: flight.outboundDate, passengers: [0, 1, 2, 3] }, { package_id: 4, mode: "transfer", date: flight.outboundDate, passengers: [0, 1, 2, 3] }], insurance_ids: insurances.length ? [insurances[0].id] : [], price_lock: true };
  const quote = (await request("/api/travel/cart/quote", { body: cart })).payload.data;
  assert.equal(quote.items.length, 3); assert.equal(quote.passengers.length, 4); assert.equal(quote.available, true); assert.equal(quote.totals.feePercent, null); assert.equal(quote.passengers[3].ageCategory, "infant"); if (insurances.length) assert.equal(quote.insurances[0].quantity, 3); pass("carrello multiprodotto, adulti/bambino/infant, assicurazione e blocca prezzo");
  const invalid = (await request("/api/travel/cart/quote", { body: { ...cart, passengers: [{ birth_date: "2015-05-01" }], items: [{ ...cart.items[0], rooms: [{ room_type_id: roomId, passengers: [0] }] }] }, status: 422 })).payload;
  assert.ok(invalid.errors["items.0.rooms.0.passengers"]); pass("errore annidato: camera senza adulto");
  const contact = { first_name: "Frontend", last_name: "Test", email: "frontend-test@example.test", phone: "+390000000000" };
  const guest = (await request("/api/travel/bookings", { body: { ...cart, contact, action: "quote", terms_accepted: false, notes: run }, status: 201 })).payload.data;
  assert.equal(guest.status, "quote"); assert.ok(guest.accessToken); pass("creazione preventivo ospite");
  await request(`/api/travel/bookings/${guest.code}`, { status: 404 }); pass("accesso pratica protetto senza link personale");
  const pdfUrl = new URL(guest.documents.quotePdfUrl);
  assert.ok(["localhost", "127.0.0.1"].includes(pdfUrl.hostname));
  const pdf = await fetch(pdfUrl); assert.equal(pdf.status, 200); assert.match(pdf.headers.get("content-type"), /pdf/); pass("PDF preventivo");
  const fullPeople = people.map((person, i) => ({ ...person, first_name: `Test${i + 1}`, last_name: "Frontend", gender: i === 1 ? "F" : "M" }));
  const option = (await request(`/api/travel/bookings/${guest.code}/option`, { body: { terms_accepted: true, passengers: fullPeople }, access: guest.accessToken })).payload.data;
  assert.equal(option.status, "option"); assert.ok(Math.abs((new Date(option.optionExpiresAt).getTime() - Date.now()) / 3600000 - Number(settings.option_hours_guest)) < .1); pass("opzione ospite con durata da settings");
  const confirmed = (await request(`/api/travel/bookings/${guest.code}/confirm`, { body: { terms_accepted: true, passengers: fullPeople }, access: guest.accessToken })).payload.data;
  assert.equal(confirmed.status, "confirmed"); assert.equal(confirmed.actions.canConfirm, false); pass("preventivo → opzione → conferma ospite");
  const cancelled = (await request("/api/travel/bookings", { body: { ...cart, contact, action: "quote", terms_accepted: false, notes: run }, status: 201 })).payload.data;
  const cancellation = (await request(`/api/travel/bookings/${cancelled.code}/cancel`, { body: {}, access: cancelled.accessToken })).payload.data;
  assert.equal(cancellation.status, "cancelled"); pass("annullamento pratica");
  const expiring = (await request("/api/travel/bookings", { body: { ...cart, passengers: fullPeople, contact, action: "option", terms_accepted: true, notes: run }, status: 201 })).payload.data;
  execFileSync("php", ["artisan", "tinker", String.raw`--execute=App\Models\Booking::where('notes', '${run}')->where('code', '${expiring.code}')->update(['option_expires_at' => now()->subSecond()]);`], { cwd: process.env.TEST_BACKEND_PATH || "C:/Users/giomm/Desktop/project/tourflow", stdio: "pipe" });
  const expired = (await request(`/api/travel/bookings/${expiring.code}`, { access: expiring.accessToken })).payload.data;
  assert.equal(expired.status, "expired"); assert.equal(expired.actions.canConfirm, false); pass("opzione scaduta e conferma non più disponibile");
  const login = await request("/api/auth/login", { body: { email: "agenzia@tourflow.test", password: "password" } });
  cookie = login.response.headers.get("set-cookie").split(";")[0]; assert.match(login.response.headers.get("set-cookie"), /httponly/i); assert.ok(!login.payload.token); pass("token agenzia solo in cookie httpOnly");
  const agencyProduct = (await request("/api/travel/packages/hurghada-all-inclusive", { agency: true })).payload.data;
  assert.equal(agencyProduct.price, product.price); assert.ok(agencyProduct.agencyFee); pass("stesso prezzo pubblico e fee riservata agenzia");
  const flightCart = { passengers: fullPeople.slice(0, 2), items: [{ package_id: product.id, mode: "flight_hotel", flight_id: flight.id, rooms: [{ room_type_id: roomId, passengers: [0, 1] }] }], insurance_ids: [], price_lock: false };
  const flightQuote = (await request("/api/travel/cart/quote", { body: flightCart, agency: true })).payload.data;
  assert.ok(flightQuote.totals.feePercent != null); assert.equal(flightQuote.items[0].nights, flight.nights); pass("volo + hotel con tariffa e fee dal backend");
  const agencyBooking = (await request("/api/travel/bookings", { agency: true, body: { ...flightCart, contact, action: "confirm", terms_accepted: true, agency_reference: run, notes: run }, status: 201 })).payload.data;
  assert.equal(agencyBooking.status, "proforma_sent"); assert.ok(agencyBooking.documents.proformaUrl); pass("conferma agenzia → proforma inviata");
  const list = (await request("/api/travel/bookings?status=proforma_sent", { agency: true })).payload;
  assert.ok(list.data.some((booking) => booking.code === agencyBooking.code)); pass("elenco e filtro pratiche agenzia");
  const signedUrl = new URL(agencyBooking.documents.proformaUrl); assert.ok(["localhost", "127.0.0.1"].includes(signedUrl.hostname));
  const proforma = await fetch(signedUrl); assert.equal(proforma.status, 200); assert.match(proforma.headers.get("content-type"), /pdf/);
  const final = (await request(`/api/travel/bookings/${agencyBooking.code}`, { agency: true })).payload.data;
  assert.equal(final.status, "proforma_viewed"); pass("apertura proforma → prenotazione definitiva");
  await request("/api/auth/logout", { body: {}, agency: true, status: 204 }); cookie = "";
  const publicAgain = (await request("/api/travel/packages/hurghada-all-inclusive")).payload.data;
  assert.ok(!publicAgain.agencyFee); pass("logout e assenza fee nella risposta ospite");
} finally {
  if (cookie) await request("/api/auth/logout", { body: {}, agency: true, status: 204 }).catch(() => {});
  if (created.length) {
    const backend = process.env.TEST_BACKEND_PATH || "C:/Users/giomm/Desktop/project/tourflow";
    const codes = created.map((code) => `'${code.replaceAll("'", "")}'`).join(",");
    execFileSync("php", ["artisan", "tinker", String.raw`--execute=App\Models\Booking::where('notes', '${run}')->whereIn('code', [${codes}])->delete();`], { cwd: backend, stdio: "pipe" });
    console.log(`CLEANUP ${created.length} pratiche create esclusivamente per questa verifica locale.`);
  }
}
