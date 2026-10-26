import assert from "node:assert/strict";
import { addDays, todayRome } from "../lib/format.ts";

const base = process.env.TEST_FRONTEND_URL || "http://localhost:3001";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw Error("Usare soltanto il frontend locale.");
async function get(path) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  return (await response.json()).data;
}
const products = await get("/api/packages?per_page=100");
const seen = new Set();
for (const summary of products) {
  if (seen.has(summary.typeKey)) continue;
  seen.add(summary.typeKey);
  const product = await get(`/api/travel/packages/${summary.slug}`);
  assert.ok(["hotel_only", "flight_hotel", "full_package", "transfer", "excursion"].includes(product.typeKey));
  assert.equal(typeof product.flightIncluded, "boolean");
  assert.equal(typeof product.flightOptional, "boolean");
  assert.equal(typeof product.transferIncluded, "boolean");
  const start = [addDays(todayRome(), 14), product.validFrom || ""].sort().at(-1);
  const modes = product.typeKey === "hotel_only" ? product.bookingModes : [product.bookingModes[0]];
  for (const mode of modes) {
    const flight = product.flights?.find(value => value.seatsAvailable >= 2 && value.outboundDate >= todayRome());
    if (mode === "flight_hotel") assert.ok(flight, `${product.slug}: nessuna partenza disponibile nei dati di prova`);
    const item = { package_id: product.id, ...(mode === "hotel_only"
      ? { mode, check_in: start, check_out: addDays(start, Math.max(3, product.minNights || 1)), rooms: [{ room_type_id: product.hotel.roomTypes[0].id, passengers: [0, 1] }] }
      : mode === "flight_hotel" ? { mode, flight_id: flight.id, rooms: [{ room_type_id: product.hotel.roomTypes[0].id, passengers: [0, 1] }] }
        : { date: start, passengers: [0, 1] }) };
    const response = await fetch(`${base}/api/travel/cart/quote`, { method: "POST", headers: { "Content-Type": "application/json", Origin: base }, body: JSON.stringify({ passengers: [{ birth_date: "1985-03-10" }, { birth_date: "1987-07-22" }], items: [item] }) });
    const payload = await response.json();
    assert.equal(response.status, 200, JSON.stringify(payload));
    assert.equal(payload.data.items[0].mode, mode);
    assert.equal(typeof payload.data.totals.total, "number");
    console.log(`PASS ${product.typeKey} / ${mode}: prezzo e disponibilità reali, nessuna pratica creata`);
  }
}
const filtered = await get("/api/packages?type=full_package&airport=NAP");
assert.ok(filtered.length > 0);
for (const product of filtered) {
  assert.equal(product.typeKey, "full_package");
  const detail = await get(`/api/travel/packages/${product.slug}`);
  assert.ok(detail.flights.some(flight => flight.departureAirport === "NAP"));
}
console.log("PASS filtro combinato offerta + aeroporto con voli abbinati");
for (const key of ["hotel_only", "flight_hotel", "full_package", "transfer", "excursion"]) if (!seen.has(key)) console.log(`INFO nessun prodotto locale ${key}: flusso verificato separatamente con fixture, senza modificare il backend`);
